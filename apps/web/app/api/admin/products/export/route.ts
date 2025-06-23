import { withSecurity } from '@/middleware/security';
import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';

export const dynamic = 'force-dynamic';

interface ExportProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  product_type: 'new' | 'refurbished';
  condition_grade?: string;
  category?: string;
  sku?: string;
  inventory_quantity?: number;
  created_at?: string;
  updated_at?: string;
}

// Mock products for development
const mockProducts: ExportProduct[] = [
  {
    id: '1',
    title: 'Eco Trail Runner',
    description: 'Sustainable running shoes made from recycled materials',
    price: 17900,
    product_type: 'new',
    category: 'Running Shoes',
    sku: 'ECO-TR-001',
    inventory_quantity: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Urban Sneaker',
    description: 'City-ready sneakers with organic cotton lining',
    price: 13900,
    product_type: 'new',
    category: 'Casual Shoes',
    sku: 'URB-SN-002',
    inventory_quantity: 18,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Refurbished Hiking Boot',
    description: 'Premium hiking boot expertly restored',
    price: 8900,
    product_type: 'refurbished',
    condition_grade: 'excellent',
    category: 'Hiking Boots',
    sku: 'REF-HB-003',
    inventory_quantity: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const selectedIds = searchParams.get('ids')?.split(',') || [];
    
    // Get products (in production, fetch from database)
    let productsToExport = mockProducts;
    
    // Filter by selected IDs if provided
    if (selectedIds.length > 0 && selectedIds[0] !== '') {
      productsToExport = mockProducts.filter(product => 
        selectedIds.includes(product.id)
      );
    }

    if (productsToExport.length === 0) {
      return NextResponse.json(
        { error: 'No products found to export' },
        { status: 404 }
      );
    }

    // Prepare data for export (convert price from cents to currency)
    const exportData = productsToExport.map(product => ({
      ID: product.id,
      Title: product.title,
      Description: product.description,
      Price: (product.price / 100).toFixed(2), // Convert cents to currency
      'Product Type': product.product_type,
      'Condition Grade': product.condition_grade || '',
      Category: product.category || '',
      SKU: product.sku || '',
      'Inventory Quantity': product.inventory_quantity || 0,
      'Created At': product.created_at || '',
      'Updated At': product.updated_at || '',
    }));

    if (format === 'json') {
      // Return JSON format
      return NextResponse.json(
        { 
          products: exportData,
          count: exportData.length,
          exported_at: new Date().toISOString()
        },
        {
          headers: {
            'Content-Disposition': `attachment; filename="products-export-${new Date().toISOString().split('T')[0]}.json"`,
          }
        }
      );
    }

    // Generate CSV
    const csv = Papa.unparse(exportData, {
      header: true,
      quotes: true,
      delimiter: ',',
    });

    const filename = `products-export-${new Date().toISOString().split('T')[0]}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error('Error exporting products:', error);
    return NextResponse.json(
      { error: 'Failed to export products' },
      { status: 500 }
    );
  }
}

export const GET = withSecurity(handleGET, {
  rateLimitRequests: 50, // Reasonable limit for exports
  rateLimitWindow: 60,
  enableCSRF: false, // GET requests don't need CSRF
  enableAuditLog: true,
}); 