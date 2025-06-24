'use client';

import { getAuthHeaders, handleApiError } from '@/lib/admin-utils';
import { AlertCircle, CheckCircle, Download, FileText, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface Product {
  id?: string;
  title: string;
  description: string;
  price: number;
  product_type: 'new' | 'refurbished';
  condition_grade?: string;
  status?: 'active' | 'draft';
}

interface BulkImportExportProps {
  products: Product[];
  onImportComplete: (importedProducts: Product[]) => void;
  onClose: () => void;
}

export function BulkImportExport({ products, onImportComplete, onClose }: BulkImportExportProps) {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: string[];
    imported: Product[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export products to CSV
  const handleExport = async () => {
    try {
      setExporting(true);
      
      // Create CSV content
      const headers = ['Title', 'Description', 'Price (CHF)', 'Type', 'Condition Grade', 'Status'];
      const csvRows = [
        headers.join(','),
        ...products.map(product => [
          `"${product.title.replace(/"/g, '""')}"`,
          `"${product.description.replace(/"/g, '""')}"`,
          (product.price / 100).toFixed(2),
          product.product_type,
          product.condition_grade || '',
          product.status || 'active'
        ].join(','))
      ];
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Download file
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `fitfoot-products-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export products. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Parse CSV content
  const parseCSV = (csvText: string): Product[] => {
    const lines = csvText.trim().split('\n');
    const products: Product[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        
        const product: Product = {
          title: values[0] || '',
          description: values[1] || '',
          price: Math.round((parseFloat(values[2]) || 0) * 100), // Convert to cents
          product_type: (values[3] as 'new' | 'refurbished') || 'new',
          condition_grade: values[4] || undefined,
          status: (values[5] as 'active' | 'draft') || 'active'
        };
        
        // Validate required fields
        if (product.title && product.description && product.price > 0) {
          products.push(product);
        }
      } catch (error) {
        console.error(`Error parsing row ${i + 1}:`, error);
      }
    }
    
    return products;
  };

  // Import products from CSV
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setImporting(true);
      setImportResults(null);
      
      // Read file
      const text = await file.text();
      const parsedProducts = parseCSV(text);
      
      if (parsedProducts.length === 0) {
        setImportResults({
          success: 0,
          errors: ['No valid products found in CSV file'],
          imported: []
        });
        return;
      }
      
      // Import products via API
      const importedProducts: Product[] = [];
      const errors: string[] = [];
      
      for (const product of parsedProducts) {
        try {
          const response = await fetch('/api/admin/products', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(product)
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            errors.push(`${product.title}: ${errorData.error || 'Failed to import'}`);
            continue;
          }
          
          const result = await response.json();
          importedProducts.push(result.product);
        } catch (error) {
          errors.push(`${product.title}: ${handleApiError(error)}`);
        }
      }
      
      setImportResults({
        success: importedProducts.length,
        errors,
        imported: importedProducts
      });
      
      if (importedProducts.length > 0) {
        onImportComplete(importedProducts);
      }
      
    } catch (error) {
      setImportResults({
        success: 0,
        errors: [handleApiError(error)],
        imported: []
      });
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Download sample CSV template
  const downloadTemplate = () => {
    const headers = ['Title', 'Description', 'Price (CHF)', 'Type', 'Condition Grade', 'Status'];
    const sampleData = [
      '"Sample Running Shoe"',
      '"High-quality athletic shoe perfect for daily runs"',
      '149.99',
      'new',
      '',
      'active'
    ];
    
    const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'fitfoot-products-template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Bulk Import & Export</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Export Section */}
          <div className="mb-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Export Products</h4>
            <p className="text-gray-600 mb-4">
              Download all {products.length} products as a CSV file for backup or editing.
            </p>
            <button
              onClick={handleExport}
              disabled={exporting || products.length === 0}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              {exporting ? 'Exporting...' : `Export ${products.length} Products`}
            </button>
          </div>

          {/* Import Section */}
          <div className="mb-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Import Products</h4>
            <p className="text-gray-600 mb-4">
              Upload a CSV file to bulk import products. Make sure your CSV follows the correct format.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleImport}
                  disabled={importing}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={importing}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {importing ? 'Importing...' : 'Choose CSV File'}
                </button>
                
                <button
                  onClick={downloadTemplate}
                  className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download Template
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                <p><strong>CSV Format:</strong> Title, Description, Price (CHF), Type, Condition Grade, Status</p>
                <p>Type: "new" or "refurbished" | Status: "active" or "draft"</p>
              </div>
            </div>
          </div>

          {/* Import Results */}
          {importResults && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Import Results</h4>
              
              {importResults.success > 0 && (
                <div className="flex items-center text-green-700 mb-2">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Successfully imported {importResults.success} products</span>
                </div>
              )}
              
              {importResults.errors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center text-red-700">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span>{importResults.errors.length} errors occurred</span>
                  </div>
                  <div className="max-h-32 overflow-y-auto bg-red-50 p-2 rounded text-sm">
                    {importResults.errors.map((error, index) => (
                      <div key={index} className="text-red-700">{error}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 