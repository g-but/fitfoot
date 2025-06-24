import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    
    // In production, fetch from database
    const response = await fetch(`http://localhost:9000/admin/orders/${orderId}`);
    
    if (!response.ok) {
      throw new Error('Order not found');
    }
    
    const order = await response.json();
    return NextResponse.json(order);
    
  } catch (error) {
    console.error('Get order error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const updateData = await request.json();
    
    // Validate update data
    const allowedUpdates = [
      'status',
      'tracking_number',
      'tracking_url',
      'fulfillment_status',
      'notes',
      'estimated_delivery_date'
    ];
    
    const updates = Object.keys(updateData).reduce((acc, key) => {
      if (allowedUpdates.includes(key)) {
        acc[key] = updateData[key];
      }
      return acc;
    }, {} as Record<string, any>);
    
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 }
      );
    }
    
    // Add updated timestamp
    updates.updated_at = new Date().toISOString();
    
    // Handle status transitions
    if (updates.status) {
      switch (updates.status) {
        case 'confirmed':
          updates.fulfillment_status = 'awaiting_fulfillment';
          break;
        case 'processing':
          updates.fulfillment_status = 'processing';
          break;
        case 'shipped':
          updates.fulfillment_status = 'shipped';
          // Auto-calculate delivery date if not provided
          if (!updates.estimated_delivery_date) {
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 3); // 3 days default
            updates.estimated_delivery_date = deliveryDate.toISOString();
          }
          break;
        case 'delivered':
          updates.fulfillment_status = 'fulfilled';
          break;
        case 'cancelled':
          updates.fulfillment_status = 'cancelled';
          break;
      }
    }
    
    // Update order in backend
    const response = await fetch(`http://localhost:9000/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update order');
    }
    
    const updatedOrder = await response.json();
    
    // Send notifications based on status change
    if (updates.status) {
      await sendStatusUpdateNotification(updatedOrder, updates.status);
    }
    
    return NextResponse.json(updatedOrder);
    
  } catch (error) {
    console.error('Update order error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to update order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    
    // In production, you might not allow deleting orders, just cancelling them
    const response = await fetch(`http://localhost:9000/admin/orders/${orderId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete order');
    }
    
    return NextResponse.json({ message: 'Order deleted successfully' });
    
  } catch (error) {
    console.error('Delete order error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to delete order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to send status update notifications
async function sendStatusUpdateNotification(order: any, newStatus: string) {
  console.log(`📧 Sending status update notification for order ${order.order_number}`);
  
  const statusMessages = {
    confirmed: 'Your order has been confirmed and is being prepared.',
    processing: 'Your order is currently being processed.',
    shipped: 'Great news! Your order has been shipped.',
    delivered: 'Your order has been delivered. Thank you for your purchase!',
    cancelled: 'Your order has been cancelled. If you have questions, please contact us.',
  };
  
  const emailData = {
    to: order.customer_email || 'customer@example.com',
    subject: `Order Update - ${order.order_number}`,
    template: 'order_status_update',
    data: {
      order_number: order.order_number,
      customer_name: `${order.shipping_address.first_name} ${order.shipping_address.last_name}`,
      status: newStatus,
      status_message: statusMessages[newStatus as keyof typeof statusMessages] || 'Your order status has been updated.',
      tracking_number: order.tracking_number,
      tracking_url: order.tracking_url,
      estimated_delivery: order.estimated_delivery_date,
    }
  };
  
  // Simulate email sending
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`✅ Status update email sent for order ${order.order_number}`);
      resolve(true);
    }, 500);
  });
} 