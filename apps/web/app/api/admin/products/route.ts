import { withSecurity } from '@/middleware/security';
import { NextRequest, NextResponse } from 'next/server';

const MEDUSA_BASE_URL = process.env.MEDUSA_BASE_URL || 'http://localhost:9000';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  product_type: 'new' | 'refurbished';
  condition_grade?: string;
  created_at?: string;
  updated_at?: string;
}

// Mock products database (in production, use real database)
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Eco Trail Runner',
    description: 'Sustainable running shoes made from recycled materials',
    price: 17900,
    product_type: 'new',
    created_at: new Date().toISOString(),
  },
  {
    id: '2', 
    title: 'Refurbished Hiking Boot',
    description: 'Premium hiking boot expertly restored',
    price: 8900,
    product_type: 'refurbished',
    condition_grade: 'excellent',
    created_at: new Date().toISOString(),
  },
];

async function handleGET(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // In production, verify JWT token and admin permissions
    const token = authHeader.substring(7);
    
    // For demo, just check if token exists
    if (!token) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Return products with proper headers
    return NextResponse.json(
      { 
        products: mockProducts,
        total: mockProducts.length,
        message: 'Products retrieved successfully'
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handlePOST(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.price || !body.product_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new product
    const newProduct = {
      id: `prod_${Date.now()}`,
      title: body.title,
      description: body.description,
      price: body.price,
      product_type: body.product_type,
      condition_grade: body.condition_grade,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // In production, save to database
    mockProducts.push(newProduct);

    return NextResponse.json(
      { 
        product: newProduct,
        message: 'Product created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handlePUT(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Find and update product
    const productIndex = mockProducts.findIndex(p => p.id === body.id);
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const updatedProduct = {
      ...mockProducts[productIndex],
      ...body,
      updated_at: new Date().toISOString(),
    };

    mockProducts[productIndex] = updatedProduct;

    return NextResponse.json(
      { 
        product: updatedProduct,
        message: 'Product updated successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleDELETE(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Find and remove product
    const productIndex = mockProducts.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const deletedProduct = mockProducts.splice(productIndex, 1)[0];

    return NextResponse.json(
      { 
        product: deletedProduct,
        message: 'Product deleted successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply security middleware with admin-specific configuration
export const GET = withSecurity(handleGET, {
  rateLimitRequests: 200, // Higher limit for admin users
  rateLimitWindow: 60,
  enableCSRF: false, // GET requests don't need CSRF
  enableAuditLog: true,
});

export const POST = withSecurity(handlePOST, {
  rateLimitRequests: 50, // Lower limit for write operations
  rateLimitWindow: 60,
  enableCSRF: true,
  enableAuditLog: true,
});

export const PUT = withSecurity(handlePUT, {
  rateLimitRequests: 50,
  rateLimitWindow: 60, 
  enableCSRF: true,
  enableAuditLog: true,
});

export const DELETE = withSecurity(handleDELETE, {
  rateLimitRequests: 30, // Strictest limit for delete operations
  rateLimitWindow: 60,
  enableCSRF: true,
  enableAuditLog: true,
}); 