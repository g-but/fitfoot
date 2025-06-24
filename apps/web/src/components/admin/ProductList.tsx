'use client';

import * as Sentry from '@sentry/nextjs';
import React, { useMemo, useState } from 'react';
import { ProductFormData } from './ProductEditor';

interface ProductListProps {
  products: ProductFormData[];
  onEdit: (product: ProductFormData) => void;
  onDelete: (productIds: string[]) => Promise<void>;
  onBulkUpdate: (productIds: string[], updates: Partial<ProductFormData>) => Promise<void>;
  onExport: (format: 'csv' | 'json', filters?: ProductFilters) => Promise<void>;
  isLoading?: boolean;
}

interface ProductFilters {
  search: string;
  category: string;
  status: string;
  condition: string;
  priceRange: [number, number];
  sustainabilityFeatures: string[];
  inStock: boolean | null;
}

const INITIAL_FILTERS: ProductFilters = {
  search: '',
  category: 'all',
  status: 'all',
  condition: 'all',
  priceRange: [0, 1000],
  sustainabilityFeatures: [],
  inStock: null
};

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onEdit,
  onDelete,
  onBulkUpdate,
  onExport,
  isLoading = false
}) => {
  const [filters, setFilters] = useState<ProductFilters>(INITIAL_FILTERS);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<keyof ProductFormData>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          product.title.toLowerCase().includes(searchLower) ||
          product.brand.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && product.status !== filters.status) {
        return false;
      }

      // Condition filter (check variants)
      if (filters.condition !== 'all') {
        const hasCondition = product.variants.some(variant => variant.condition === filters.condition);
        if (!hasCondition) return false;
      }

      // Price range filter
      const prices = product.variants.map(v => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice > filters.priceRange[1] || maxPrice < filters.priceRange[0]) {
        return false;
      }

      // Sustainability features filter
      if (filters.sustainabilityFeatures.length > 0) {
        const hasFeatures = filters.sustainabilityFeatures.every(feature =>
          product.sustainabilityFeatures.includes(feature)
        );
        if (!hasFeatures) return false;
      }

      // In stock filter
      if (filters.inStock !== null) {
        const totalInventory = product.variants.reduce((sum, v) => sum + v.inventory, 0);
        const inStock = totalInventory > 0;
        if (filters.inStock !== inStock) return false;
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      // Handle special sorting cases
      if (sortBy === 'variants') {
        aValue = a.variants.length;
        bValue = b.variants.length;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [products, filters, sortBy, sortOrder]);

  // Handle selection
  const toggleProductSelection = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const selectAllProducts = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id!)));
    }
  };

  // Bulk operations
  const handleBulkStatusUpdate = async (status: 'active' | 'draft' | 'archived') => {
    try {
      await onBulkUpdate(Array.from(selectedProducts), { status });
      setSelectedProducts(new Set());
      Sentry.addBreadcrumb({
        message: 'Bulk status update completed',
        category: 'admin',
        data: { count: selectedProducts.size, status }
      });
    } catch (error) {
      Sentry.captureException(error, {
        tags: { section: 'product-list', operation: 'bulk-update' },
        extra: { selectedProducts: Array.from(selectedProducts), status }
      });
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.size} products?`)) {
      try {
        await onDelete(Array.from(selectedProducts));
        setSelectedProducts(new Set());
      } catch (error) {
        Sentry.captureException(error, {
          tags: { section: 'product-list', operation: 'bulk-delete' },
          extra: { selectedProducts: Array.from(selectedProducts) }
        });
      }
    }
  };

  // Export functionality
  const handleExport = async (format: 'csv' | 'json') => {
    try {
      await onExport(format, filters);
      Sentry.addBreadcrumb({
        message: 'Product export completed',
        category: 'admin',
        data: { format, productCount: filteredProducts.length }
      });
    } catch (error) {
      Sentry.captureException(error, {
        tags: { section: 'product-list', operation: 'export' },
        extra: { format, filters }
      });
    }
  };

  const getStockStatus = (product: ProductFormData) => {
    const totalInventory = product.variants.reduce((sum, v) => sum + v.inventory, 0);
    if (totalInventory === 0) return { status: 'out-of-stock', label: 'Out of Stock', color: 'red' };
    if (totalInventory <= 5) return { status: 'low-stock', label: 'Low Stock', color: 'yellow' };
    return { status: 'in-stock', label: 'In Stock', color: 'green' };
  };

  const getPriceRange = (product: ProductFormData) => {
    if (product.variants.length === 0) return { min: 0, max: 0 };
    const prices = product.variants.map(v => v.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">
            {filteredProducts.length} of {products.length} products
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Export CSV
          </button>
          <button
            onClick={() => handleExport('json')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Export JSON
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            {viewMode === 'grid' ? 'Table View' : 'Grid View'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Products
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search by title, brand, description, or tags..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Categories</option>
              <option value="shoes">Shoes</option>
              <option value="hats">Hats</option>
              <option value="bags">Bags</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <select
                value={filters.condition}
                onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Conditions</option>
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Status
              </label>
              <select
                value={filters.inStock === null ? 'all' : filters.inStock ? 'in-stock' : 'out-of-stock'}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilters(prev => ({
                    ...prev,
                    inStock: value === 'all' ? null : value === 'in-stock'
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Stock Levels</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>

            <div>
              <button
                onClick={() => setFilters(INITIAL_FILTERS)}
                className="mt-6 px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {selectedProducts.size} products selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkStatusUpdate('active')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('draft')}
                className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
              >
                Draft
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('archived')}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                Archive
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product List */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                    onChange={selectAllProducts}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const priceRange = getPriceRange(product);
                const stockStatus = getStockStatus(product);
                
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id!)}
                        onChange={() => toggleProductSelection(product.id!)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.brand}
                        </div>
                        {product.sustainabilityFeatures.length > 0 && (
                          <div className="flex mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              🌱 Sustainable
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${priceRange.min === priceRange.max ? 
                        priceRange.min.toFixed(2) : 
                        `${priceRange.min.toFixed(2)} - ${priceRange.max.toFixed(2)}`
                      }
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.variants.length} variants
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        stockStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                        stockStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {stockStatus.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' :
                        product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <button
                        onClick={() => onEdit(product)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete([product.id!])}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found matching your filters.</p>
            </div>
          )}
        </div>
      ) : (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const priceRange = getPriceRange(product);
            const stockStatus = getStockStatus(product);
            
            return (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="aspect-square bg-gray-200 relative">
                  {product.variants[0]?.images[0] ? (
                    <img
                      src={product.variants[0].images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  
                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.id!)}
                      onChange={() => toggleProductSelection(product.id!)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </div>
                  
                  {product.sustainabilityFeatures.length > 0 && (
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        🌱
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
                  <p className="text-sm text-gray-500">{product.brand}</p>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      ${priceRange.min === priceRange.max ? 
                        priceRange.min.toFixed(2) : 
                        `${priceRange.min.toFixed(2)}+`
                      }
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      stockStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                      stockStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {stockStatus.label}
                    </span>
                  </div>
                  
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete([product.id!])}
                      className="px-3 py-2 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}; 