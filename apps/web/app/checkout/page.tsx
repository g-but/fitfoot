'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, CheckCircle, Loader2, MapPin, Package } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  postal_code: string;
  country_code: string;
  phone?: string;
}

interface CheckoutData {
  shipping_address: ShippingAddress;
  billing_same_as_shipping: boolean;
  billing_address?: ShippingAddress;
  shipping_method: string;
  notes?: string;
}

export default function CheckoutPage() {
  const { user, isLoggedIn } = useAuth();
  const { cart, getItemCount, getCartTotal, clearCart } = useCart();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    shipping_address: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      address_1: '',
      city: '',
      postal_code: '',
      country_code: 'CH',
    },
    billing_same_as_shipping: true,
    shipping_method: 'standard',
  });

  const [calculatedTotals, setCalculatedTotals] = useState({
    subtotal: 0,
    shipping_total: 0,
    tax_total: 0,
    total: 0,
  });

  const itemCount = getItemCount();
  const cartTotal = getCartTotal();

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart || itemCount === 0) {
      router.push('/cart');
    }
  }, [cart, itemCount, router]);

  // Calculate totals when cart or shipping method changes
  useEffect(() => {
    calculateTotals();
  }, [cart, checkoutData.shipping_method]);

  const calculateTotals = () => {
    if (!cart) return;

    const subtotal = cart.subtotal;
    
    // Calculate shipping based on method and location
    let shipping_total = 0;
    if (checkoutData.shipping_method === 'standard') {
      shipping_total = subtotal >= 10000 ? 0 : 500; // Free shipping over CHF 100
    } else if (checkoutData.shipping_method === 'express') {
      shipping_total = 1500; // CHF 15 for express
    }

    // Calculate Swiss VAT (7.7%)
    const tax_total = Math.round((subtotal + shipping_total) * 0.077);

    const total = subtotal + shipping_total + tax_total;

    setCalculatedTotals({
      subtotal,
      shipping_total,
      tax_total,
      total,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
    }).format(price / 100);
  };

  const handleInputChange = (field: string, value: string, addressType: 'shipping' | 'billing' = 'shipping') => {
    setCheckoutData(prev => ({
      ...prev,
      [`${addressType}_address`]: {
        ...(prev[`${addressType}_address` as keyof CheckoutData] as object || {}),
        [field]: value,
      },
    }));
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      const addr = checkoutData.shipping_address;
      return !!(addr.first_name && addr.last_name && addr.address_1 && addr.city && addr.postal_code);
    }
    return true;
  };

  const handleStepComplete = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setError(null);
    } else {
      setError('Please fill in all required fields');
    }
  };

  const createOrder = async () => {
    if (!cart || !isLoggedIn) return;

    setLoading(true);
    setError(null);

    try {
      const orderData = {
        customer_id: user?.id,
        items: cart.items.map(item => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
        shipping_address: checkoutData.shipping_address,
        billing_address: checkoutData.billing_same_as_shipping 
          ? checkoutData.shipping_address 
          : checkoutData.billing_address,
        shipping_method: checkoutData.shipping_method,
        currency_code: 'CHF',
        totals: calculatedTotals,
        notes: checkoutData.notes,
        status: 'pending_payment', // Will be updated when payment is added
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();

      // Clear cart
      await clearCart();

      // Redirect to order confirmation
      router.push(`/orders/${order.id}/confirmation`);

    } catch (error) {
      console.error('Order creation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || itemCount === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/cart" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="mt-6 flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                  currentStep >= step 
                    ? 'bg-black border-black text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{step}</span>
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step === 1 && 'Shipping'}
                  {step === 2 && 'Review'}
                  {step === 3 && 'Complete'}
                </span>
                {step < 3 && <div className="ml-4 w-8 h-px bg-gray-300" />}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <MapPin className="h-5 w-5 text-gray-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">Shipping Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={checkoutData.shipping_address.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={checkoutData.shipping_address.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={checkoutData.shipping_address.address_1}
                    onChange={(e) => handleInputChange('address_1', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Bahnhofstrasse 123"
                    required
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apartment, suite, etc. (optional)
                  </label>
                  <input
                    type="text"
                    value={checkoutData.shipping_address.address_2 || ''}
                    onChange={(e) => handleInputChange('address_2', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Apartment 4B"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={checkoutData.shipping_address.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Zurich"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      value={checkoutData.shipping_address.postal_code}
                      onChange={(e) => handleInputChange('postal_code', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="8001"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      value={checkoutData.shipping_address.country_code}
                      onChange={(e) => handleInputChange('country_code', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="CH">Switzerland</option>
                      <option value="DE">Germany</option>
                      <option value="AT">Austria</option>
                      <option value="FR">France</option>
                      <option value="IT">Italy</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number (optional)
                  </label>
                  <input
                    type="tel"
                    value={checkoutData.shipping_address.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="+41 79 123 45 67"
                  />
                </div>

                {/* Shipping Method */}
                <div className="mt-8">
                  <h3 className="text-md font-semibold text-gray-900 mb-4">Shipping Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shipping_method"
                        value="standard"
                        checked={checkoutData.shipping_method === 'standard'}
                        onChange={(e) => setCheckoutData(prev => ({ ...prev, shipping_method: e.target.value }))}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">Standard Shipping</span>
                          <span className="font-medium text-gray-900">
                            {cartTotal >= 10000 ? 'Free' : formatPrice(500)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">5-7 business days</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shipping_method"
                        value="express"
                        checked={checkoutData.shipping_method === 'express'}
                        onChange={(e) => setCheckoutData(prev => ({ ...prev, shipping_method: e.target.value }))}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">Express Shipping</span>
                          <span className="font-medium text-gray-900">{formatPrice(1500)}</span>
                        </div>
                        <p className="text-sm text-gray-600">1-2 business days</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mt-8">
                  <Button 
                    onClick={handleStepComplete}
                    className="w-full bg-black text-white hover:bg-gray-800"
                    size="lg"
                  >
                    Continue to Review
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Review Order */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Order Items */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-6">
                    <Package className="h-5 w-5 text-gray-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">Order Review</h2>
                  </div>

                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                          {item.variant_title && item.variant_title !== 'Default' && (
                            <p className="text-sm text-gray-500">{item.variant_title}</p>
                          )}
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatPrice(item.total)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-4">Shipping Address</h3>
                  <div className="text-sm text-gray-600">
                    <p>{checkoutData.shipping_address.first_name} {checkoutData.shipping_address.last_name}</p>
                    <p>{checkoutData.shipping_address.address_1}</p>
                    {checkoutData.shipping_address.address_2 && <p>{checkoutData.shipping_address.address_2}</p>}
                    <p>{checkoutData.shipping_address.postal_code} {checkoutData.shipping_address.city}</p>
                    <p>{checkoutData.shipping_address.country_code === 'CH' ? 'Switzerland' : checkoutData.shipping_address.country_code}</p>
                    {checkoutData.shipping_address.phone && <p>{checkoutData.shipping_address.phone}</p>}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentStep(1)}
                    className="mt-4"
                  >
                    Edit Address
                  </Button>
                </div>

                {/* Order Notes */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-4">Order Notes (Optional)</h3>
                  <textarea
                    value={checkoutData.notes || ''}
                    onChange={(e) => setCheckoutData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    rows={3}
                    placeholder="Special delivery instructions, gift message, etc."
                  />
                </div>

                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    Back to Shipping
                  </Button>
                  <Button 
                    onClick={createOrder}
                    disabled={loading}
                    className="flex-1 bg-black text-white hover:bg-gray-800"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4" />
                        Creating Order...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                  <span className="text-gray-900">{formatPrice(calculatedTotals.subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {calculatedTotals.shipping_total === 0 ? 'Free' : formatPrice(calculatedTotals.shipping_total)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (VAT 7.7%)</span>
                  <span className="text-gray-900">{formatPrice(calculatedTotals.tax_total)}</span>
                </div>
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-base font-semibold text-gray-900">
                    {formatPrice(calculatedTotals.total)}
                  </span>
                </div>
              </div>

              {calculatedTotals.shipping_total === 0 && cartTotal < 10000 && (
                <div className="p-4 bg-green-50 border-t border-green-200">
                  <p className="text-sm text-green-700">
                    🎉 You qualify for free shipping!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 