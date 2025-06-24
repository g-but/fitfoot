import { NextRequest, NextResponse } from 'next/server';

// In-memory cart storage (in production, this would be in a database)
const _carts: Record<string, any> = {}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (body.action === 'create') {
      // Create new cart
      const response = await fetch('http://localhost:9000/store/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currency_code: 'CHF' })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const cartData = await response.json();
      
      return NextResponse.json({
        cart: {
          id: cartData.id,
          items: [],
          total: 0,
          currency: 'CHF',
          sustainability_score: 0,
          total_environmental_impact: cartData.total_environmental_impact
        }
      });
    }
    
    if (body.action === 'add' && body.cartId) {
      // Add item to cart
      const response = await fetch(`http://localhost:9000/store/carts/${body.cartId}/line-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variant_id: body.variantId,
          quantity: body.quantity || 1,
          product_type: 'new' // Default, could be enhanced later
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get updated cart
      const cartResponse = await fetch(`http://localhost:9000/store/carts/${body.cartId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!cartResponse.ok) {
        throw new Error(`HTTP error! status: ${cartResponse.status}`);
      }

      const cartData = await cartResponse.json();
      
      return NextResponse.json({
        cart: {
          id: cartData.id,
          items: cartData.items || [],
          total: cartData.total || 0,
          currency: cartData.currency_code || 'CHF',
          sustainability_score: cartData.sustainability_score || 0,
          total_environmental_impact: cartData.total_environmental_impact
        }
      });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    
  } catch (error) {
    console.error('Error processing cart request:', error);
    return NextResponse.json(
      { error: 'Failed to process cart request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const cartId = url.searchParams.get('cartId');
    
    if (!cartId) {
      return NextResponse.json({ error: 'Cart ID required' }, { status: 400 });
    }
    
    const response = await fetch(`http://localhost:9000/store/carts/${cartId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const cartData = await response.json();
    
    return NextResponse.json({
      cart: {
        id: cartData.id,
        items: cartData.items || [],
        total: cartData.total || 0,
        currency: cartData.currency_code || 'CHF',
        sustainability_score: cartData.sustainability_score || 0,
        total_environmental_impact: cartData.total_environmental_impact
      }
    });
    
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 