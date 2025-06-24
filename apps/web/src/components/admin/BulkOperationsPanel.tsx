'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, CheckCircle, Loader2, X } from 'lucide-react';
import { useState } from 'react';

interface BulkOperationsPanelProps {
  selectedProductIds: string[];
  selectedProducts: any[];
  onOperationComplete: () => void;
  onClose: () => void;
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

export default function BulkOperationsPanel({ 
  selectedProductIds, 
  selectedProducts,
  onOperationComplete, 
  onClose 
}: BulkOperationsPanelProps) {
  const { getAdminToken } = useAuth();
  
  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  const [operationResult, setOperationResult] = useState<BulkResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Bulk update form state
  const [bulkUpdateData, setBulkUpdateData] = useState({
    product_type: '',
    condition_grade: '',
    category: '',
    price_adjustment: {
      type: 'percentage' as 'percentage' | 'fixed',
      value: 0
    }
  });

  const executeBulkOperation = async (action: string, updateData?: any) => {
    setProcessing(true);
    setOperationResult(null);

    try {
      const token = getAdminToken();
      const response = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          action,
          productIds: selectedProductIds,
          updateData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Bulk operation failed');
      }

      const result: BulkResult = await response.json();
      setOperationResult(result);
      setShowResult(true);
      onOperationComplete();

    } catch (error) {
      console.error('Bulk operation error:', error);
      alert(error instanceof Error ? error.message : 'Bulk operation failed');
    } finally {
      setProcessing(false);
      setActiveOperation(null);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedProductIds.length} products? This action cannot be undone.`)) {
      executeBulkOperation('delete');
    }
  };

  const handleBulkArchive = () => {
    if (confirm(`Archive ${selectedProductIds.length} products? They will be hidden from the store but kept in records.`)) {
      executeBulkOperation('archive');
    }
  };

  const handleBulkUnarchive = () => {
    if (confirm(`Unarchive ${selectedProductIds.length} products? They will be visible in the store again.`)) {
      executeBulkOperation('unarchive');
    }
  };

  const handleBulkUpdate = () => {
    const updateData: any = {};
    
    if (bulkUpdateData.product_type) {
      updateData.product_type = bulkUpdateData.product_type;
    }
    
    if (bulkUpdateData.condition_grade) {
      updateData.condition_grade = bulkUpdateData.condition_grade;
    }
    
    if (bulkUpdateData.category) {
      updateData.category = bulkUpdateData.category;
    }
    
    if (bulkUpdateData.price_adjustment.value !== 0) {
      updateData.price_adjustment = bulkUpdateData.price_adjustment;
    }

    if (Object.keys(updateData).length === 0) {
      alert('Please select at least one field to update');
      return;
    }

    if (confirm(`Update ${selectedProductIds.length} products with the selected changes?`)) {
      executeBulkOperation('update', updateData);
    }
  };

  const getProductTitles = () => {
    return selectedProducts.slice(0, 3).map(p => p.title).join(', ') + 
           (selectedProducts.length > 3 ? ` and ${selectedProducts.length - 3} more` : '');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Bulk Operations ({selectedProductIds.length} products)
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Selected Products Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Selected Products</h3>
              <p className="text-sm text-gray-600">{getProductTitles()}</p>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={handleBulkDelete}
                  disabled={processing}
                  className="p-3 border border-red-300 rounded-lg hover:bg-red-50 text-sm font-medium text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {processing && activeOperation === 'delete' ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    'Delete All'
                  )}
                </button>
                
                <button
                  onClick={handleBulkArchive}
                  disabled={processing}
                  className="p-3 border border-yellow-300 rounded-lg hover:bg-yellow-50 text-sm font-medium text-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {processing && activeOperation === 'archive' ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    'Archive All'
                  )}
                </button>
                
                <button
                  onClick={handleBulkUnarchive}
                  disabled={processing}
                  className="p-3 border border-green-300 rounded-lg hover:bg-green-50 text-sm font-medium text-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {processing && activeOperation === 'unarchive' ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    'Unarchive All'
                  )}
                </button>
              </div>
            </div>

            {/* Bulk Update Form */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Bulk Update</h3>
              <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                {/* Product Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Type
                  </label>
                  <select
                    value={bulkUpdateData.product_type}
                    onChange={(e) => setBulkUpdateData({
                      ...bulkUpdateData,
                      product_type: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">No Change</option>
                    <option value="new">New</option>
                    <option value="refurbished">Refurbished</option>
                  </select>
                </div>

                {/* Condition Grade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition Grade
                  </label>
                  <select
                    value={bulkUpdateData.condition_grade}
                    onChange={(e) => setBulkUpdateData({
                      ...bulkUpdateData,
                      condition_grade: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">No Change</option>
                    <option value="excellent">Excellent</option>
                    <option value="very_good">Very Good</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={bulkUpdateData.category}
                    onChange={(e) => setBulkUpdateData({
                      ...bulkUpdateData,
                      category: e.target.value
                    })}
                    placeholder="Enter category"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Price Adjustment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Adjustment
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={bulkUpdateData.price_adjustment.type}
                      onChange={(e) => setBulkUpdateData({
                        ...bulkUpdateData,
                        price_adjustment: {
                          ...bulkUpdateData.price_adjustment,
                          type: e.target.value as 'percentage' | 'fixed'
                        }
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                    <input
                      type="number"
                      value={bulkUpdateData.price_adjustment.value}
                      onChange={(e) => setBulkUpdateData({
                        ...bulkUpdateData,
                        price_adjustment: {
                          ...bulkUpdateData.price_adjustment,
                          value: parseFloat(e.target.value) || 0
                        }
                      })}
                      placeholder={bulkUpdateData.price_adjustment.type === 'percentage' ? '10' : '50.00'}
                      step={bulkUpdateData.price_adjustment.type === 'percentage' ? '1' : '0.01'}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="px-3 py-2 text-gray-500">
                      {bulkUpdateData.price_adjustment.type === 'percentage' ? '%' : 'CHF'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleBulkUpdate}
                  disabled={processing}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {processing ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {processing ? 'Updating...' : 'Apply Updates'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operation Results Modal */}
      {showResult && operationResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[70vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Operation Results</h3>
                <button
                  onClick={() => setShowResult(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Success/Error Summary */}
              <div className={`p-4 rounded-lg mb-4 ${
                operationResult.success ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className="flex items-center">
                  {operationResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                  )}
                  <div>
                    <p className="font-medium">
                      {operationResult.success ? 'Operation Completed Successfully' : 'Operation Completed with Errors'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {operationResult.successfulOperations} of {operationResult.totalProcessed} products processed successfully
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Details */}
              {operationResult.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">Errors ({operationResult.errors.length})</h4>
                  <div className="max-h-40 overflow-y-auto">
                    {operationResult.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-700 mb-1">
                        <span className="font-medium">Product {error.productId}:</span> {error.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowResult(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 