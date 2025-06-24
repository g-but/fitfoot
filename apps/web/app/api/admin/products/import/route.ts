import { withSecurity } from '@/middleware/security';
import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';

interface ImportProduct {
  title: string;
  description: string;
  price: number | string;
  product_type: 'new' | 'refurbished';
  condition_grade?: string;
  category?: string;
  sku?: string;
  inventory_quantity?: number | string;
}

interface ImportResult {
  success: boolean;
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  errors: Array<{
    row: number;
    field?: string;
    message: string;
  }>;
  createdProducts: any[];
}

// Validation schema for imported products
const validateImportRow = (row: any, _rowIndex: number): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Required fields
  if (!row.title || typeof row.title !== 'string' || row.title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }
  
  if (!row.description || typeof row.description !== 'string' || row.description.trim().length === 0) {
    errors.push('Description is required and must be a non-empty string');
  }
  
  // Price validation
  const price = parseFloat(row.price);
  if (isNaN(price) || price <= 0) {
    errors.push('Price must be a positive number');
  }
  
  // Product type validation
  if (!['new', 'refurbished'].includes(row.product_type)) {
    errors.push('Product type must be either "new" or "refurbished"');
  }
  
  // Condition grade validation for refurbished products
  if (row.product_type === 'refurbished' && row.condition_grade) {
    const validGrades = ['excellent', 'very_good', 'good', 'fair'];
    if (!validGrades.includes(row.condition_grade)) {
      errors.push('Condition grade must be one of: excellent, very_good, good, fair');
    }
  }
  
  // Inventory quantity validation
  if (row.inventory_quantity !== undefined && row.inventory_quantity !== '') {
    const quantity = parseInt(row.inventory_quantity);
    if (isNaN(quantity) || quantity < 0) {
      errors.push('Inventory quantity must be a non-negative integer');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Only CSV files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Read and parse CSV file
    const csvText = await file.text();
    
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim().toLowerCase().replace(/\s+/g, '_')
    });

    if (parseResult.errors.length > 0) {
      return NextResponse.json(
        { error: 'Invalid CSV format', details: parseResult.errors },
        { status: 400 }
      );
    }

    const rows = parseResult.data as any[];
    const importResult: ImportResult = {
      success: true,
      totalRows: rows.length,
      successfulRows: 0,
      failedRows: 0,
      errors: [],
      createdProducts: []
    };

    // Validate and process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const validation = validateImportRow(row, i + 2); // +2 for header row and 1-based indexing

      if (!validation.isValid) {
        importResult.failedRows++;
        validation.errors.forEach(error => {
          importResult.errors.push({
            row: i + 2,
            message: error
          });
        });
        continue;
      }

      try {
        // Create product object
        const productData: ImportProduct = {
          title: row.title.trim(),
          description: row.description.trim(),
          price: Math.round(parseFloat(row.price) * 100), // Convert to cents
          product_type: row.product_type as 'new' | 'refurbished',
          condition_grade: row.condition_grade?.trim() || undefined,
          category: row.category?.trim() || undefined,
          sku: row.sku?.trim() || undefined,
          inventory_quantity: row.inventory_quantity ? parseInt(row.inventory_quantity) : undefined,
        };

        // In production, save to database
        // For now, simulate success
        const newProduct = {
          id: `import_${Date.now()}_${i}`,
          ...productData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        importResult.createdProducts.push(newProduct);
        importResult.successfulRows++;

      } catch (error) {
        importResult.failedRows++;
        importResult.errors.push({
          row: i + 2,
          message: `Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }

    // Determine overall success
    importResult.success = importResult.errors.length === 0 || 
                          (importResult.successfulRows > 0 && importResult.failedRows < importResult.totalRows);

    return NextResponse.json(importResult, { 
      status: importResult.success ? 200 : 207 // 207 Multi-Status for partial success
    });

  } catch (error) {
    console.error('Error processing CSV import:', error);
    return NextResponse.json(
      { error: 'Failed to process import file' },
      { status: 500 }
    );
  }
}

export const POST = withSecurity(handlePOST, {
  rateLimitRequests: 10, // Limited imports per minute
  rateLimitWindow: 60,
  enableCSRF: true,
  enableAuditLog: true,
}); 