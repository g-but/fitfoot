'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, Loader2, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  const { 
    cart, 
    loading, 
    error, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getCartTotal,
    getItemCount
  } = useCart();

  const [loadingItems, setLoadingItems] = useState<string[]>([]);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    setLoadingItems(prev => [...prev, itemId]);
    try {
      await updateQuantity(itemId, newQuantity);
    } finally {
      setLoadingItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setLoadingItems(prev => [...prev, itemId]);
    try {
      await removeFromCart(itemId);
    } finally {
      setLoadingItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
    }).format(price / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-600" />
            <p className="mt-2 text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  const itemCount = getItemCount();
  const total = getCartTotal();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/shop" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
              <p className="text-gray-600 mt-1">
                {itemCount === 0 
                  ? 'Your cart is empty' 
                  : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart`
                }
              </p>
            </div>
            
            {itemCount > 0 && (
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Clear Cart
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {!cart || itemCount === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">
              Discover our collection of sustainable Swiss-designed footwear
            </p>
            <Link href="/shop">
              <Button className="bg-black text-white hover:bg-gray-800">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Items</h2>
                </div>
                
                <div className="p-6 space-y-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-base font-medium text-gray-900 truncate">
                              {item.title}
                            </h3>
                            {item.variant_title && item.variant_title !== 'Default' && (
                              <p className="text-sm text-gray-500 mt-1">
                                {item.variant_title}
                              </p>
                            )}
                            {item.description && (
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={loadingItems.includes(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-4"
                          >
                            {loadingItems.includes(item.id) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        {/* Quantity Controls and Price */}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || loadingItems.includes(item.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="text-sm font-medium text-gray-900 w-8 text-center">
                              {item.quantity}
                            </span>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={loadingItems.includes(item.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <div className="text-base font-semibold text-gray-900">
                              {formatPrice(item.total)}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-sm text-gray-500">
                                {formatPrice(item.unit_price)} each
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                    <span className="text-gray-900">{formatPrice(cart.subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">
                      {cart.shipping_total > 0 ? formatPrice(cart.shipping_total) : 'Calculated at checkout'}
                    </span>
                  </div>
                  
                  {cart.tax_total > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">{formatPrice(cart.tax_total)}</span>
                    </div>
                  )}
                  
                  <hr className="border-gray-200" />
                  
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-900">Total</span>
                    <span className="text-base font-semibold text-gray-900">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200">
                  <Link href="/checkout">
                    <Button 
                      className="w-full bg-black text-white hover:bg-gray-800 mb-3"
                      size="lg"
                    >
                      Proceed to Checkout
                    </Button>
                  </Link>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Secure checkout with SSL encryption
                  </p>
                </div>
              </div>

              {/* Sustainability Info */}
              <div className="mt-6 bg-green-50 rounded-lg shadow-sm border border-green-200 p-4">
                <h3 className="text-sm font-semibold text-green-800 mb-2">
                  🌱 Sustainability Impact
                </h3>
                <p className="text-sm text-green-700">
                  By choosing FitFoot, you're supporting sustainable practices and reducing environmental impact.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 