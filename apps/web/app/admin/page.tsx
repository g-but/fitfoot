'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { getProducts } from '@/lib/medusa.client';
import { AlertCircle, BarChart3, DollarSign, Package, Plus, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  title: string;
  description?: string | null;
  handle: string;
  status: string;
  images?: Array<{
    id: string;
    url: string;
  }> | null;
  variants?: Array<{
    id: string;
    title: string;
    prices: Array<{
      amount: number;
      currency_code: string;
    }>;
  }> | null;
  created_at?: string;
  updated_at?: string;
}

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalValue: number;
  recentProducts: number;
}

function formatPrice(cents: number): string {
  return `CHF ${(cents / 100).toFixed(2)}`;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate dashboard statistics
  const stats: DashboardStats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status === 'published').length,
    totalValue: products.reduce((sum, p) => {
      const price = p.variants?.[0]?.prices?.[0]?.amount || 0;
      return sum + price;
    }, 0),
    recentProducts: products.filter(p => {
      if (!p.created_at) return false;
      const createdDate = new Date(p.created_at);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return createdDate > weekAgo;
    }).length
  };

  // Load products from Medusa API
  const loadProducts = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);

      // Fetch products from Medusa
      const medusaProducts = await getProducts({ limit: 100 });
      setProducts(medusaProducts as any);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products from Medusa';
      setError(errorMessage);
      console.error('Error loading products from Medusa:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  if (loading && products.length === 0) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products from Medusa...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Medusa Connection Error</h2>
            <p className="text-gray-600 mb-2">Failed to connect to Medusa backend.</p>
            <p className="text-sm text-gray-500 mb-6">{error}</p>
            <div className="space-y-3">
              <button 
                onClick={() => loadProducts()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <p className="text-xs text-gray-500">
                Make sure Medusa is running on localhost:9000
              </p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-2">
            Welcome to FitFoot Admin!
          </h1>
          <p className="text-blue-100">
            Manage your FitFoot products with Medusa integration. {products.length} products loaded from Medusa.
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-wrap gap-3">
            <a
              href="/admin/products"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </a>
            <a
              href="/admin/products"
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Package className="w-4 h-4 mr-2" />
              Manage Products
            </a>
            <a
              href="/admin/analytics"
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </a>
            <button
              onClick={() => loadProducts(false)}
              disabled={loading}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh from Medusa
            </button>
          </div>
        </div>

        {/* Dashboard Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProducts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-amber-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Inventory Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalValue)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentProducts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Products Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Products from Medusa</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.slice(0, 10).map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            {product.images && product.images.length > 0 ? (
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={product.images[0].url}
                                alt={product.title}
                              />
                            ) : (
                              <Package className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.title}</div>
                          <div className="text-sm text-gray-500">{product.handle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.variants && product.variants.length > 0 && product.variants[0].prices.length > 0
                        ? formatPrice(product.variants[0].prices[0].amount)
                        : 'No price'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.created_at 
                        ? new Date(product.created_at).toLocaleDateString()
                        : 'Unknown'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No products found in Medusa</p>
              <p className="text-sm text-gray-400 mt-2">
                Add products to your Medusa backend to see them here
              </p>
            </div>
          )}
        </div>

        {/* Connection Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Connected to Medusa backend • {products.length} products loaded
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 