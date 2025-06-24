'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface CartItem {
  id: string;
  product_id: string;
  variant_id: string;
  title: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total: number;
  thumbnail?: string;
  variant_title?: string;
  product_handle?: string;
}

interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  currency_code: string;
  item_count: number;
  created_at: string;
  updated_at: string;
}

interface CartContextType {
  // Cart state
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  
  // Cart actions
  addToCart: (productId: string, variantId?: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Cart utilities
  getCartTotal: () => number;
  getItemCount: () => number;
  isInCart: (productId: string, variantId?: string) => boolean;
  
  // Error handling
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'fitfoot_cart';
const API_BASE = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize cart on mount
  useEffect(() => {
    initializeCart();
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (cart) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  const initializeCart = async () => {
    try {
      setLoading(true);
      
      // Try to load cart from localStorage first
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } else {
        // Create new cart
        await createNewCart();
      }
    } catch (error) {
      console.error('Error initializing cart:', error);
      setError('Failed to initialize cart');
    } finally {
      setLoading(false);
    }
  };

  const createNewCart = async () => {
    try {
      const response = await fetch(`${API_BASE}/store/carts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currency_code: 'CHF',
          region_id: 'switzerland', // You may need to adjust this based on your Medusa setup
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create cart');
      }

      const data = await response.json();
      const newCart: Cart = {
        id: data.cart?.id || generateLocalCartId(),
        items: [],
        total: 0,
        subtotal: 0,
        tax_total: 0,
        shipping_total: 0,
        currency_code: 'CHF',
        item_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setCart(newCart);
      return newCart;
    } catch (error) {
      console.error('Error creating cart:', error);
      // Fallback to local cart
      const localCart: Cart = {
        id: generateLocalCartId(),
        items: [],
        total: 0,
        subtotal: 0,
        tax_total: 0,
        shipping_total: 0,
        currency_code: 'CHF',
        item_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setCart(localCart);
      return localCart;
    }
  };

  const generateLocalCartId = () => {
    return `local_cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addToCart = useCallback(async (productId: string, variantId?: string, quantity: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      if (!cart) {
        await createNewCart();
        return;
      }

      // Check if item already exists in cart
      const existingItem = cart.items.find(item => 
        item.product_id === productId && 
        (!variantId || item.variant_id === variantId)
      );

      if (existingItem) {
        // Update quantity if item exists
        await updateQuantity(existingItem.id, existingItem.quantity + quantity);
        return;
      }

      // Fetch product details
      const productResponse = await fetch(`${API_BASE}/store/products/${productId}`);
      if (!productResponse.ok) {
        throw new Error('Product not found');
      }

      const productData = await productResponse.json();
      const product = productData.product;

      // Use first variant if none specified
      const variant = variantId 
        ? product.variants?.find((v: any) => v.id === variantId)
        : product.variants?.[0];

      if (!variant) {
        throw new Error('Product variant not found');
      }

      // Get price from variant
      const price = variant.prices?.[0]?.amount || 0;

      // Create new cart item
      const newItem: CartItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        product_id: productId,
        variant_id: variant.id,
        title: product.title,
        description: product.description,
        quantity,
        unit_price: price,
        total: price * quantity,
        thumbnail: product.thumbnail,
        variant_title: variant.title,
        product_handle: product.handle,
      };

      // Update cart
      const updatedCart: Cart = {
        ...cart,
        items: [...cart.items, newItem],
        updated_at: new Date().toISOString(),
      };

      // Recalculate totals
      updatedCart.subtotal = updatedCart.items.reduce((sum, item) => sum + item.total, 0);
      updatedCart.total = updatedCart.subtotal; // Add tax/shipping later
      updatedCart.item_count = updatedCart.items.reduce((sum, item) => sum + item.quantity, 0);

      setCart(updatedCart);

      // Try to sync with backend (optional, fallback to local if fails)
      try {
        await syncCartWithBackend(updatedCart);
      } catch (syncError) {
        console.warn('Failed to sync cart with backend:', syncError);
        // Continue with local cart
      }

    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(error instanceof Error ? error.message : 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const removeFromCart = useCallback(async (itemId: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!cart) return;

      const updatedCart: Cart = {
        ...cart,
        items: cart.items.filter(item => item.id !== itemId),
        updated_at: new Date().toISOString(),
      };

      // Recalculate totals
      updatedCart.subtotal = updatedCart.items.reduce((sum, item) => sum + item.total, 0);
      updatedCart.total = updatedCart.subtotal;
      updatedCart.item_count = updatedCart.items.reduce((sum, item) => sum + item.quantity, 0);

      setCart(updatedCart);

      // Try to sync with backend
      try {
        await syncCartWithBackend(updatedCart);
      } catch (syncError) {
        console.warn('Failed to sync cart with backend:', syncError);
      }

    } catch (error) {
      console.error('Error removing from cart:', error);
      setError('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);

      if (!cart || quantity < 0) return;

      if (quantity === 0) {
        await removeFromCart(itemId);
        return;
      }

      const updatedCart: Cart = {
        ...cart,
        items: cart.items.map(item => 
          item.id === itemId 
            ? { ...item, quantity, total: item.unit_price * quantity }
            : item
        ),
        updated_at: new Date().toISOString(),
      };

      // Recalculate totals
      updatedCart.subtotal = updatedCart.items.reduce((sum, item) => sum + item.total, 0);
      updatedCart.total = updatedCart.subtotal;
      updatedCart.item_count = updatedCart.items.reduce((sum, item) => sum + item.quantity, 0);

      setCart(updatedCart);

      // Try to sync with backend
      try {
        await syncCartWithBackend(updatedCart);
      } catch (syncError) {
        console.warn('Failed to sync cart with backend:', syncError);
      }

    } catch (error) {
      console.error('Error updating quantity:', error);
      setError('Failed to update item quantity');
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const clearCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const clearedCart: Cart = {
        ...cart!,
        items: [],
        total: 0,
        subtotal: 0,
        tax_total: 0,
        shipping_total: 0,
        item_count: 0,
        updated_at: new Date().toISOString(),
      };

      setCart(clearedCart);
      localStorage.removeItem(CART_STORAGE_KEY);

      // Try to sync with backend
      try {
        await syncCartWithBackend(clearedCart);
      } catch (syncError) {
        console.warn('Failed to sync cart with backend:', syncError);
      }

    } catch (error) {
      console.error('Error clearing cart:', error);
      setError('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const syncCartWithBackend = async (cartData: Cart) => {
    if (!cartData.id.startsWith('local_cart_')) {
      // Real Medusa cart - sync with backend
      const response = await fetch(`${API_BASE}/store/carts/${cartData.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartData.items.map(item => ({
            variant_id: item.variant_id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync cart with backend');
      }
    }
  };

  const getCartTotal = useCallback(() => {
    return cart?.total || 0;
  }, [cart]);

  const getItemCount = useCallback(() => {
    return cart?.item_count || 0;
  }, [cart]);

  const isInCart = useCallback((productId: string, variantId?: string) => {
    if (!cart) return false;
    return cart.items.some(item => 
      item.product_id === productId && 
      (!variantId || item.variant_id === variantId)
    );
  }, [cart]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: CartContextType = {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
    isInCart,
    clearError,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 