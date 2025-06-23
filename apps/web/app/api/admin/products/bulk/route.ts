import { withSecurity } from '@/middleware/security';
import { NextRequest, NextResponse } from 'next/server';

interface BulkOperation {
  action: 'delete' | 'update' | 'archive' | 'unarchive';
  productIds: string[];
  updateData?: {
    product_type?: 'new' | 'refurbished';
    condition_grade?: string;
    category?: string;
    price_adjustment?: {
      type: 'percentage' | 'fixed';
      value: number;
    };
  };
}

interface BulkResult {
  success: boolean;
  totalProcessed: number;
  successfulOperations: number;
  failedOperations: number;
  errors: Array<{
    productId: string;
    message: string;
  }>;
  results: Array<{
    productId: string;
    status: 'success' | 'error';
    message?: string;
  }>;
}

// Mock products database (in production, use real database)
const mockProducts = new Map([
  ['1', {
    id: '1',
    title: 'Eco Trail Runner',
    description: 'Sustainable running shoes made from recycled materials',
    price: 17900,
    product_type: 'new',
    archived: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }],
  ['2', {
    id: '2',
    title: 'Urban Sneaker',
    description: 'City-ready sneakers with organic cotton lining',
    price: 13900,
    product_type: 'new',
    archived: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }],
  ['3', {
    id: '3',
    title: 'Refurbished Hiking Boot',
    description: 'Premium hiking boot expertly restored',
    price: 8900,
    product_type: 'refurbished',
    condition_grade: 'excellent',
    archived: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }],
]);

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

    const body = await request.json() as BulkOperation;
    
    // Validate request
    if (!body.action || !Array.isArray(body.productIds) || body.productIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid bulk operation request' },
        { status: 400 }
      );
    }

    if (body.productIds.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 products can be processed in a single bulk operation' },
        { status: 400 }
      );
    }

    const bulkResult: BulkResult = {
      success: true,
      totalProcessed: body.productIds.length,
      successfulOperations: 0,
      failedOperations: 0,
      errors: [],
      results: []
    };

    // Process each product
    for (const productId of body.productIds) {
      try {
        const product = mockProducts.get(productId);
        
        if (!product) {
          bulkResult.failedOperations++;
          bulkResult.errors.push({
            productId,
            message: 'Product not found'
          });
          bulkResult.results.push({
            productId,
            status: 'error',
            message: 'Product not found'
          });
          continue;
        }

        let operationResult: { success: boolean; message?: string } = { success: true };

        switch (body.action) {
          case 'delete':
            mockProducts.delete(productId);
            operationResult.message = 'Product deleted successfully';
            break;

          case 'archive':
            product.archived = true;
            (product as any).updated_at = new Date().toISOString();
            mockProducts.set(productId, product);
            operationResult.message = 'Product archived successfully';
            break;

          case 'unarchive':
            product.archived = false;
            (product as any).updated_at = new Date().toISOString();
            mockProducts.set(productId, product);
            operationResult.message = 'Product unarchived successfully';
            break;

          case 'update':
            if (!body.updateData) {
              operationResult = { success: false, message: 'Update data required for update operation' };
              break;
            }

            // Apply updates
            if (body.updateData.product_type) {
              product.product_type = body.updateData.product_type;
            }
            
            if (body.updateData.condition_grade) {
              product.condition_grade = body.updateData.condition_grade;
            }
            
            if (body.updateData.category) {
              (product as any).category = body.updateData.category;
            }

            // Handle price adjustments
            if (body.updateData.price_adjustment) {
              const { type, value } = body.updateData.price_adjustment;
              if (type === 'percentage') {
                product.price = Math.round(product.price * (1 + value / 100));
              } else if (type === 'fixed') {
                product.price = Math.round(product.price + (value * 100)); // Convert to cents
              }
            }

            (product as any).updated_at = new Date().toISOString();
            mockProducts.set(productId, product);
            operationResult.message = 'Product updated successfully';
            break;

          default:
            operationResult = { success: false, message: 'Invalid operation' };
        }

        if (operationResult.success) {
          bulkResult.successfulOperations++;
          bulkResult.results.push({
            productId,
            status: 'success',
            message: operationResult.message
          });
        } else {
          bulkResult.failedOperations++;
          bulkResult.errors.push({
            productId,
            message: operationResult.message || 'Operation failed'
          });
          bulkResult.results.push({
            productId,
            status: 'error',
            message: operationResult.message
          });
        }

      } catch (error) {
        bulkResult.failedOperations++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        bulkResult.errors.push({
          productId,
          message: errorMessage
        });
        bulkResult.results.push({
          productId,
          status: 'error',
          message: errorMessage
        });
      }
    }

    // Determine overall success
    bulkResult.success = bulkResult.failedOperations === 0;

    return NextResponse.json(bulkResult, { 
      status: bulkResult.success ? 200 : 207 // 207 Multi-Status for partial success
    });

  } catch (error) {
    console.error('Error processing bulk operation:', error);
    return NextResponse.json(
      { error: 'Failed to process bulk operation' },
      { status: 500 }
    );
  }
}

export const POST = withSecurity(handlePOST, {
  rateLimitRequests: 20, // Lower limit for bulk operations
  rateLimitWindow: 60,
  enableCSRF: true,
  enableAuditLog: true,
}); 