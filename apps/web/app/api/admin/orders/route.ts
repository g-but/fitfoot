import { NextRequest, NextResponse } from 'next/server';

// Mock data for demonstration - in production, this would come from database
const mockOrders = [
  {
    id: 'order_1',
    order_number: 'FF-2024-001',
    status: 'delivered',
    total: 29999,
    currency_code: 'CHF',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T14:30:00Z',
    estimated_delivery_date: '2024-01-20T00:00:00Z',
    
    customer: {
      id: 'customer_1',
      first_name: 'Anna',
      last_name: 'Mueller',
      email: 'anna.mueller@example.com',
      phone: '+41 79 123 45 67',
    },
    
    items: [
      {
        id: 'item_1',
        product_id: 'prod_1',
        variant_id: 'var_1',
        title: 'Eco Trail Runner',
        variant_title: 'Forest Green, Size 42',
        quantity: 1,
        unit_price: 17999,
        total: 17999,
      },
      {
        id: 'item_2',
        product_id: 'prod_2',
        variant_id: 'var_2',
        title: 'Sustainable Socks (3-pack)',
        variant_title: 'Mixed Colors',
        quantity: 1,
        unit_price: 2999,
        total: 2999,
      },
    ],
    
    shipping_address: {
      first_name: 'Anna',
      last_name: 'Mueller',
      address_1: 'Bahnhofstrasse 123',
      address_2: 'Apt 4B',
      city: 'Zurich',
      postal_code: '8001',
      country_code: 'CH',
      phone: '+41 79 123 45 67',
    },
    
    shipping_method: 'standard',
    notes: 'Please ring the doorbell twice',
    payment_status: 'paid',
    fulfillment_status: 'shipped',
    tracking_number: 'CH-POST-123456789',
    tracking_url: 'https://www.post.ch/track/123456789',
  },
  {
    id: 'order_2',
    order_number: 'FF-2024-002',
    status: 'shipped',
    total: 15999,
    currency_code: 'CHF',
    created_at: '2024-01-20T09:15:00Z',
    updated_at: '2024-01-22T11:45:00Z',
    estimated_delivery_date: '2024-01-25T00:00:00Z',
    
    customer: {
      id: 'customer_2',
      first_name: 'Marco',
      last_name: 'Rossi',
      email: 'marco.rossi@example.com',
      phone: '+41 76 987 65 43',
    },
    
    items: [
      {
        id: 'item_3',
        product_id: 'prod_3',
        variant_id: 'var_3',
        title: 'Refurbished Urban Sneaker',
        variant_title: 'Ocean Blue, Size 43',
        quantity: 1,
        unit_price: 13999,
        total: 13999,
      },
    ],
    
    shipping_address: {
      first_name: 'Marco',
      last_name: 'Rossi',
      address_1: 'Via Roma 45',
      city: 'Lugano',
      postal_code: '6900',
      country_code: 'CH',
      phone: '+41 76 987 65 43',
    },
    
    shipping_method: 'express',
    payment_status: 'paid',
    fulfillment_status: 'shipped',
    tracking_number: 'CH-POST-987654321',
    tracking_url: 'https://www.post.ch/track/987654321',
  },
  {
    id: 'order_3',
    order_number: 'FF-2024-003',
    status: 'pending_payment',
    total: 8999,
    currency_code: 'CHF',
    created_at: '2024-01-25T16:30:00Z',
    updated_at: '2024-01-25T16:30:00Z',
    estimated_delivery_date: '2024-01-30T00:00:00Z',
    
    customer: {
      id: 'customer_3',
      first_name: 'Sophie',
      last_name: 'Weber',
      email: 'sophie.weber@example.com',
    },
    
    items: [
      {
        id: 'item_4',
        product_id: 'prod_4',
        variant_id: 'var_4',
        title: 'Eco Casual Loafer',
        variant_title: 'Natural Brown, Size 39',
        quantity: 1,
        unit_price: 8999,
        total: 8999,
      },
    ],
    
    shipping_address: {
      first_name: 'Sophie',
      last_name: 'Weber',
      address_1: 'Mühlegasse 12',
      city: 'Bern',
      postal_code: '3011',
      country_code: 'CH',
    },
    
    shipping_method: 'standard',
    notes: 'Leave package at door if not home',
    payment_status: 'pending',
    fulfillment_status: 'not_fulfilled',
  },
  {
    id: 'order_4',
    order_number: 'FF-2024-004',
    status: 'processing',
    total: 12499,
    currency_code: 'CHF',
    created_at: '2024-01-26T14:20:00Z',
    updated_at: '2024-01-27T09:00:00Z',
    estimated_delivery_date: '2024-02-02T00:00:00Z',
    
    customer: {
      id: 'customer_4',
      first_name: 'Thomas',
      last_name: 'Schneider',
      email: 'thomas.schneider@example.com',
      phone: '+41 78 555 12 34',
    },
    
    items: [
      {
        id: 'item_5',
        product_id: 'prod_5',
        variant_id: 'var_5',
        title: 'Sustainable Hiking Boot',
        variant_title: 'Mountain Grey, Size 44',
        quantity: 1,
        unit_price: 12499,
        total: 12499,
      },
    ],
    
    shipping_address: {
      first_name: 'Thomas',
      last_name: 'Schneider',
      address_1: 'Industriestrasse 88',
      city: 'Basel',
      postal_code: '4056',
      country_code: 'CH',
      phone: '+41 78 555 12 34',
    },
    
    shipping_method: 'standard',
    payment_status: 'paid',
    fulfillment_status: 'awaiting_shipment',
  },
];

export async function GET(request: NextRequest) {
  try {
    // In production, verify admin authentication here
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const customerId = searchParams.get('customer_id');
    
    let filteredOrders = [...mockOrders]; // Create copy to avoid mutations
    
    if (status && status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    
    if (customerId) {
      filteredOrders = filteredOrders.filter(order => order.customer.id === customerId);
    }
    
    // Sort by created date (newest first)
    filteredOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    console.log(`📊 Admin fetched ${filteredOrders.length} orders`);
    
    return NextResponse.json(filteredOrders);
    
  } catch (error) {
    console.error('Admin orders fetch error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // In production, verify admin authentication here
    const orderData = await request.json();
    
    // Create new order (for admin-created orders)
    const newOrder = {
      ...orderData,
      id: `order_${Date.now()}`,
      order_number: `FF-${new Date().getFullYear()}-${String(mockOrders.length + 1).padStart(3, '0')}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // In production, save to database
    mockOrders.push(newOrder);
    
    return NextResponse.json(newOrder, { status: 201 });
    
  } catch (error) {
    console.error('Admin order creation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 