import { NextRequest, NextResponse } from 'next/server';

interface OrderItem {
  product_id: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
}

interface CreateOrderRequest {
  customer_id: string;
  items: OrderItem[];
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
  billing_address: {
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
  currency_code: string;
  totals: {
    subtotal: number;
    shipping_total: number;
    tax_total: number;
    total: number;
  };
  notes?: string;
  status: string;
}

export async function POST(request: NextRequest) {
  try {
    const orderData: CreateOrderRequest = await request.json();

    // Generate order number
    const orderNumber = `FF-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    
    // Create order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calculate estimated delivery date
    const deliveryDate = new Date();
    if (orderData.shipping_method === 'express') {
      deliveryDate.setDate(deliveryDate.getDate() + 2);
    } else {
      deliveryDate.setDate(deliveryDate.getDate() + 7);
    }

    // Create order object
    const order = {
      id: orderId,
      order_number: orderNumber,
      customer_id: orderData.customer_id,
      status: 'pending_payment', // Will be updated when payment is processed
      currency_code: orderData.currency_code,
      
      // Items
      items: orderData.items.map(item => ({
        ...item,
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        total: item.unit_price * item.quantity,
      })),
      
      // Addresses
      shipping_address: orderData.shipping_address,
      billing_address: orderData.billing_address,
      
      // Shipping
      shipping_method: orderData.shipping_method,
      estimated_delivery_date: deliveryDate.toISOString(),
      
      // Totals
      subtotal: orderData.totals.subtotal,
      shipping_total: orderData.totals.shipping_total,
      tax_total: orderData.totals.tax_total,
      total: orderData.totals.total,
      
      // Metadata
      notes: orderData.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      
      // Payment status (for when payment is added)
      payment_status: 'pending',
      fulfillment_status: 'not_fulfilled',
      
      // Tracking
      tracking_number: null,
      tracking_url: null,
    };

    // For demo purposes, simulate saving to backend
    // In production, you would save to your database here
    // Order created successfully
    
    const savedOrder = order;

    // Send order confirmation email (placeholder)
    try {
      await sendOrderConfirmationEmail(savedOrder);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    // Reserve inventory (placeholder)
    try {
      await reserveInventory(orderData.items);
    } catch (inventoryError) {
      console.error('Failed to reserve inventory:', inventoryError);
      // Handle inventory issues
    }

    return NextResponse.json({
      id: savedOrder.id,
      order_number: savedOrder.order_number,
      status: savedOrder.status,
      total: savedOrder.total,
      estimated_delivery_date: savedOrder.estimated_delivery_date,
    }, { status: 201 });

  } catch (error) {
    console.error('Order creation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Mock orders data for development
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
];

// Get orders for a customer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customer_id');
    const orderId = searchParams.get('order_id');

    if (orderId) {
      // Get specific order
      const order = mockOrders.find(o => o.id === orderId);
      
      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(order);
      
    } else if (customerId) {
      // For demo purposes, return all orders (in production, filter by customer)
      // Filter orders by customer ID would be: mockOrders.filter(o => o.customer.id === customerId)
      const customerOrders = mockOrders;
      
      return NextResponse.json(customerOrders);
      
    } else {
      return NextResponse.json(
        { error: 'customer_id or order_id parameter required' },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('Get orders error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to send order confirmation email
async function sendOrderConfirmationEmail(order: any) {
  // Placeholder for email service integration
  // In production, you would integrate with:
  // - SendGrid
  // - Resend
  // - Amazon SES
  // - Postmark
  
      // Sending order confirmation email
  
  const _emailData = {
    to: order.customer_email || 'customer@example.com',
    subject: `Order Confirmation - ${order.order_number}`,
    template: 'order_confirmation',
    data: {
      order_number: order.order_number,
      customer_name: `${order.shipping_address.first_name} ${order.shipping_address.last_name}`,
      total: order.total,
      items: order.items,
      shipping_address: order.shipping_address,
      estimated_delivery: order.estimated_delivery_date,
    }
  };
  
  // Simulate email sending
  return new Promise((resolve) => {
    setTimeout(() => {
      // Order confirmation email sent successfully
      resolve(true);
    }, 1000);
  });
}

// Helper function to reserve inventory
async function reserveInventory(items: OrderItem[]) {
      // Reserving inventory for items
  
  // In production, you would:
  // 1. Check inventory levels
  // 2. Reserve items for the order
  // 3. Update available quantities
  // 4. Handle out-of-stock scenarios
  
  for (const item of items) {
    const response = await fetch(`http://localhost:9000/admin/inventory/reserve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
      }),
    });
    
    if (!response.ok) {
      console.warn(`Failed to reserve inventory for ${item.product_id}`);
    }
  }
  
      // Inventory reservation completed
} 