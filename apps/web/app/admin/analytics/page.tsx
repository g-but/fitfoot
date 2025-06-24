'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { AdminProtectedRoute, useAuth } from '@/contexts/AuthContext';
import { getAuthHeaders, handleApiError } from '@/lib/admin-utils';
import { AlertCircle, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  product_type: 'new' | 'refurbished';
  condition_grade?: string;
  status: 'active' | 'draft';
  created_at: string;
  updated_at: string;
}

function AnalyticsContent() {
  const { adminUser } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products data
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/products', {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to load analytics data: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error loading analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Analytics">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Analytics</h2>
            <p className="text-gray-600">Analyzing your data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Analytics">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Analytics</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={loadData}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
              Analytics & Insights
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive analysis of your FitFoot product catalog and performance
            </p>
          </div>
          <button
            onClick={loadData}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
          >
            Refresh Data
          </button>
        </div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard 
          data={{
            products,
            orders: [], // TODO: Add orders data when available
            customers: [] // TODO: Add customers data when available
          }}
        />

        {/* Additional Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Business Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Inventory Health</h4>
              <p className="text-blue-700">
                {products.filter(p => p.status === 'active').length} products are live and ready for sale.
                {products.filter(p => p.status === 'draft').length > 0 && 
                  ` ${products.filter(p => p.status === 'draft').length} products need activation.`
                }
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Pricing Strategy</h4>
              <p className="text-blue-700">
                Your average product price is competitive for the sustainable footwear market.
                Consider highlighting your eco-friendly value proposition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function AnalyticsPage() {
  return (
    <AdminProtectedRoute>
      <AnalyticsContent />
    </AdminProtectedRoute>
  );
} 