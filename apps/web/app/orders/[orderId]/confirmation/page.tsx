'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, CheckCircle, Clock, MapPin, Package, Truck } from 'lucide-react';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  subtotal: number;
  shipping_total: number;
  tax_total: number;
  currency_code: string;
  created_at: string;
  estimated_delivery_date: string;
  
  items: Array<{
    id: string;
    product_id: string;
    variant_id: string;
    title: string;
    variant_title?: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
  
  shipping_address: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    postal_code: string;
    country_code: string;
    phone?: string;
  };
  
  shipping_method: string;
  notes?: string;
  payment_status: string;
  fulfillment_status: string;
  tracking_number?: string;
  tracking_url?: string;
}

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const { user, isLoggedIn } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders?order_id=${orderId}`);
      
      if (!response.ok) {
        throw new Error('Order not found');
      }
      
      const orderData = await response.json();
      setOrder(orderData);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      setError(error instanceof Error ? error.message : 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
    }).format(price / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-CH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return 'text-yellow-600 bg-yellow-50';
      case 'confirmed':
        return 'text-green-600 bg-green-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'shipped':
        return 'text-purple-600 bg-purple-50';
      case 'delivered':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return 'Pending Payment';
      case 'confirmed':
        return 'Order Confirmed';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <Package className="h-12 w-12 text-gray-400 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || "We couldn't find the order you're looking for."}
          </p>
          <Link href="/orders">
            <Button>View All Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">
            Your order <span className="font-semibold">{order.order_number}</span> has been received and is being processed.
          </p>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Order Placed</p>
                <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)
                    ? 'bg-blue-100'
                    : 'bg-gray-100'
                }`}>
                  <Package className={`h-4 w-4 ${
                    ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)
                      ? 'text-blue-600'
                      : 'text-gray-400'
                  }`} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Processing</p>
                <p className="text-xs text-gray-500">
                  {order.status === 'pending_payment' ? 'Awaiting payment' : 'In progress'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  ['shipped', 'delivered'].includes(order.status)
                    ? 'bg-purple-100'
                    : 'bg-gray-100'
                }`}>
                  <Truck className={`h-4 w-4 ${
                    ['shipped', 'delivered'].includes(order.status)
                      ? 'text-purple-600'
                      : 'text-gray-400'
                  }`} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Shipped</p>
                <p className="text-xs text-gray-500">
                  Est. {formatDate(order.estimated_delivery_date)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        {order.status === 'pending_payment' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-semibold text-yellow-800 mb-1">Next Steps</h3>
                <p className="text-sm text-yellow-700 mb-3">
                  Your order is confirmed and ready for payment processing. Once payment integration is complete, 
                  you'll be able to complete your purchase.
                </p>
                <p className="text-sm text-yellow-700">
                  We'll send you an email notification when payment options are available.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 py-3 border-b border-gray-200 last:border-b-0">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-400" />
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

          {/* Shipping & Billing */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 text-gray-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">
                  {order.shipping_address.first_name} {order.shipping_address.last_name}
                </p>
                <p>{order.shipping_address.address_1}</p>
                {order.shipping_address.address_2 && <p>{order.shipping_address.address_2}</p>}
                <p>{order.shipping_address.postal_code} {order.shipping_address.city}</p>
                <p>{order.shipping_address.country_code === 'CH' ? 'Switzerland' : order.shipping_address.country_code}</p>
                {order.shipping_address.phone && <p>{order.shipping_address.phone}</p>}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {order.shipping_total === 0 ? 'Free' : formatPrice(order.shipping_total)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (VAT 7.7%)</span>
                  <span className="text-gray-900">{formatPrice(order.tax_total)}</span>
                </div>
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-base font-semibold text-gray-900">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Notes */}
        {order.notes && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Order Notes</h2>
            <p className="text-gray-600">{order.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/orders">
            <Button variant="outline" className="w-full sm:w-auto">
              View All Orders
            </Button>
          </Link>
          
          <Link href="/shop">
            <Button className="w-full sm:w-auto bg-black text-white hover:bg-gray-800">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Sustainability Message */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
            <Package className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">Thank You for Choosing Sustainable!</h3>
          <p className="text-green-700">
            By choosing FitFoot, you're supporting sustainable fashion and helping reduce environmental impact. 
            Your order will be carefully packaged using eco-friendly materials.
          </p>
        </div>
      </div>
    </div>
  );
} 