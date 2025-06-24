'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export function MiniCart() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    cart, 
    getItemCount, 
    getCartTotal, 
    updateQuantity, 
    removeFromCart 
  } = useCart();
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const itemCount = getItemCount();
  const total = getCartTotal();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && 
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
    }).format(price / 100);
  };

  const hasItems = itemCount > 0;

  return (
    <div className="relative">
      {/* Cart Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        aria-label={`Shopping cart ${hasItems ? `with ${itemCount} items` : '(empty)'}`}
      >
        <ShoppingBag className="h-5 w-5" />
        {hasItems && (
          <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {itemCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 shadow-xl rounded-lg z-50"
        >
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Shopping Cart</h3>
            <p className="text-sm text-gray-600">
              {hasItems ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'}` : 'Cart is empty'}
            </p>
          </div>

          {!hasItems ? (
            /* Empty State */
            <div className="p-6 text-center">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <Link href="/shop" onClick={() => setIsOpen(false)}>
                <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="max-h-60 overflow-y-auto p-4 space-y-4">
                {cart?.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <ShoppingBag className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </h4>
                      {item.variant_title && item.variant_title !== 'Default' && (
                        <p className="text-xs text-gray-500">{item.variant_title}</p>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Price and Remove */}
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {formatPrice(item.total)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Show more items indicator */}
                {cart && cart.items.length > 3 && (
                  <div className="text-center py-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      +{cart.items.length - 3} more {cart.items.length - 3 === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="font-bold text-lg text-gray-900">
                    {formatPrice(total)}
                  </span>
                </div>

                <div className="space-y-2">
                  <Link href="/cart" onClick={() => setIsOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="w-full"
                    >
                      View Cart
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  
                  <Button 
                    className="w-full bg-black text-white hover:bg-gray-800"
                    onClick={() => setIsOpen(false)}
                  >
                    Checkout
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-2">
                  Free shipping on orders over CHF 100
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
} 