'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import * as Sentry from '@sentry/nextjs';
import React, { useEffect, useState } from 'react';

// Product types
interface ProductVariant {
  id: string;
  size: string;
  sizeSystem: 'US' | 'EU' | 'UK' | 'CM';
  color: string;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  price: number;
  compareAtPrice?: number;
  inventory: number;
  sku: string;
  images: string[];
}

interface ProductFormData {
  id?: string;
  title: string;
  description: string;
  category: 'shoes' | 'hats' | 'bags';
  brand: string;
  gender: 'men' | 'women' | 'unisex' | 'kids';
  material: string;
  sustainabilityFeatures: string[];
  careInstructions: string;
  variants: ProductVariant[];
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  status: 'draft' | 'active' | 'archived';
  createdAt?: string;
  updatedAt?: string;
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

// Mock data for development
const MOCK_PRODUCTS: ProductFormData[] = [
  {
    id: '1',
    title: 'Eco Runner Sneakers',
    description: 'Comfortable running shoes made from recycled materials',
    category: 'shoes',
    brand: 'EcoFoot',
    gender: 'unisex',
    material: 'Recycled polyester, organic cotton',
    sustainabilityFeatures: ['Recycled components', 'Carbon neutral shipping'],
    careInstructions: 'Machine wash cold, air dry',
    variants: [
      {
        id: 'v1',
        size: '9',
        sizeSystem: 'US',
        color: 'Forest Green',
        condition: 'new',
        price: 129.99,
        inventory: 15,
        sku: 'ECO-RUN-GRN-9',
        images: ['https://via.placeholder.com/400x400/22c55e/ffffff?text=Eco+Runner']
      },
      {
        id: 'v2',
        size: '10',
        sizeSystem: 'US',
        color: 'Ocean Blue',
        condition: 'new',
        price: 129.99,
        inventory: 8,
        sku: 'ECO-RUN-BLU-10',
        images: ['https://via.placeholder.com/400x400/3b82f6/ffffff?text=Eco+Runner']
      }
    ],
    tags: ['running', 'eco-friendly', 'unisex'],
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: '2',
    title: 'Vintage Leather Boots',
    description: 'Restored vintage leather boots with modern comfort',
    category: 'shoes',
    brand: 'Heritage',
    gender: 'men',
    material: 'Genuine leather, rubber sole',
    sustainabilityFeatures: ['Refurbished/Restored', 'Locally sourced'],
    careInstructions: 'Polish regularly, condition leather monthly',
    variants: [
      {
        id: 'v3',
        size: '11',
        sizeSystem: 'US',
        color: 'Brown',
        condition: 'good',
        price: 89.99,
        compareAtPrice: 150.00,
        inventory: 3,
        sku: 'VLB-BRN-11',
        images: ['https://via.placeholder.com/400x400/a3581c/ffffff?text=Vintage+Boots']
      }
    ],
    tags: ['vintage', 'boots', 'men'],
    status: 'active',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z'
  }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductFormData[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductFormData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: 'all',
    status: 'all',
    condition: 'all',
    priceRange: [0, 1000],
    sustainabilityFeatures: [],
    inStock: null
  });

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      
      // Fetch products from Mock Medusa API
      const response = await fetch('http://localhost:9000/admin/products');
      
      if (!response.ok) {
        throw new Error(`Failed to load products: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Convert Medusa format to admin format
      const adminProducts = data.products.map((product: any) => ({
        id: product.id,
        title: product.title,
        description: product.description || '',
        category: (product.category || 'shoes') as 'shoes' | 'hats' | 'bags',
        brand: product.brand || 'Unknown',
        gender: 'unisex' as 'men' | 'women' | 'unisex' | 'kids',
        material: 'Various materials',
        sustainabilityFeatures: ['Eco-friendly'],
        careInstructions: 'Care with love',
        variants: product.variants?.map((variant: any, index: number) => ({
          id: variant.id,
          size: variant.title.split(' ')[0] || '9',
          sizeSystem: 'US' as 'US' | 'EU' | 'UK' | 'CM',
          color: variant.title.split('/')[1]?.trim() || 'Default',
          condition: 'new' as 'new' | 'like-new' | 'good' | 'fair',
          price: (variant.prices?.[0]?.amount || 0) / 100,
          inventory: variant.inventory_quantity || 0,
          sku: `SKU-${product.id}-${index}`,
          images: product.images?.map((img: any) => img.url) || []
        })) || [],
        tags: product.tags || [],
        status: (product.status === 'published' ? 'active' : 'draft') as 'draft' | 'active' | 'archived',
        createdAt: product.created_at || new Date().toISOString(),
        updatedAt: product.updated_at || new Date().toISOString()
      }));
      
      setProducts(adminProducts);
      
    } catch (error) {
      console.error('❌ Error loading products:', error);
      
      // Fallback to mock data if API fails
      // Fallback to mock data if API fails
      setProducts(MOCK_PRODUCTS);
      
      Sentry.captureException(error, {
        tags: { section: 'products-page', operation: 'load-products' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProduct = async (productData: ProductFormData) => {
    try {
      setIsLoading(true);
      
      // Convert admin product format to Medusa format for API
      const medusaProduct = {
        title: productData.title,
        description: productData.description,
        handle: productData.title.toLowerCase().replace(/\s+/g, '-'),
        status: 'published',
        images: productData.variants[0]?.images?.map((img, index) => ({
          id: `img_${Date.now()}_${index}`,
          url: img
        })) || [],
        variants: productData.variants.map((variant, index) => ({
          id: `variant_${Date.now()}_${index}`,
          title: `${variant.size} ${variant.sizeSystem} / ${variant.color}`,
          prices: [{ amount: Math.round(variant.price * 100), currency_code: 'usd' }],
          inventory_quantity: variant.inventory
        })),
        options: [
          { id: 'opt_size', title: 'Size', values: productData.variants.map(v => `${v.size} ${v.sizeSystem}`) },
          { id: 'opt_color', title: 'Color', values: Array.from(new Set(productData.variants.map(v => v.color))) }
        ],
        tags: productData.tags,
        product_type: 'new',
        brand: productData.brand,
        category: productData.category
      };

      if (productData.id) {
        // Update existing product
        const response = await fetch(`http://localhost:9000/admin/products/${productData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(medusaProduct)
        });
        
        if (!response.ok) throw new Error('Failed to update product');
        
        setProducts(prev => prev.map(p => 
          p.id === productData.id ? { ...productData, updatedAt: new Date().toISOString() } : p
        ));
      } else {
        // Create new product via Mock Medusa API
        
        const response = await fetch('http://localhost:9000/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(medusaProduct)
        });
        
        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Failed to create product: ${error}`);
        }
        
        const result = await response.json();
        
        // Add to local state with API response
        const newProduct = {
          ...productData,
          id: result.product.id,
          createdAt: result.product.created_at,
          updatedAt: result.product.updated_at
        };
        setProducts(prev => [newProduct, ...prev]);
      }
      
      setIsEditing(false);
      setSelectedProduct(null);
      
      // Trigger a refresh of products to sync with API
      setTimeout(() => loadProducts(), 1000);
      
    } catch (error) {
      console.error('❌ Error saving product:', error);
      Sentry.captureException(error, {
        tags: { section: 'products-page', operation: 'save-product' },
        extra: { productData }
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProducts = async (productIds: string[]) => {
    try {
      setIsLoading(true);
      
      // In real implementation, delete via API
      setProducts(prev => prev.filter(p => !productIds.includes(p.id!)));
      
      Sentry.addBreadcrumb({
        message: 'Products deleted',
        category: 'admin',
        data: { count: productIds.length }
      });
    } catch (error) {
      Sentry.captureException(error, {
        tags: { section: 'products-page', operation: 'delete-products' },
        extra: { productIds }
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkUpdate = async (productIds: string[], updates: Partial<ProductFormData>) => {
    try {
      setIsLoading(true);
      
      setProducts(prev => prev.map(p => 
        productIds.includes(p.id!) 
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p
      ));
    } catch (error) {
      Sentry.captureException(error, {
        tags: { section: 'products-page', operation: 'bulk-update' },
        extra: { productIds, updates }
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'json', exportFilters?: ProductFilters) => {
    try {
      // Filter products based on current filters
      const filteredProducts = applyFilters(products, exportFilters || filters);
      
      if (format === 'csv') {
        // Generate CSV
        const headers = ['ID', 'Title', 'Brand', 'Category', 'Status', 'Variants', 'Total Inventory'];
        const rows = filteredProducts.map(product => [
          product.id,
          product.title,
          product.brand,
          product.category,
          product.status,
          product.variants.length,
          product.variants.reduce((sum, v) => sum + v.inventory, 0)
        ]);
        
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        downloadFile(csvContent, `products-${Date.now()}.csv`, 'text/csv');
      } else {
        // Generate JSON
        const jsonContent = JSON.stringify(filteredProducts, null, 2);
        downloadFile(jsonContent, `products-${Date.now()}.json`, 'application/json');
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { section: 'products-page', operation: 'export' },
        extra: { format, filters: exportFilters }
      });
    }
  };

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const applyFilters = (productList: ProductFormData[], filterOptions: ProductFilters) => {
    return productList.filter(product => {
      // Apply search filter
      if (filterOptions.search) {
        const searchLower = filterOptions.search.toLowerCase();
        const matchesSearch = 
          product.title.toLowerCase().includes(searchLower) ||
          product.brand.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Apply category filter
      if (filterOptions.category !== 'all' && product.category !== filterOptions.category) {
        return false;
      }

      // Apply status filter
      if (filterOptions.status !== 'all' && product.status !== filterOptions.status) {
        return false;
      }

      return true;
    });
  };

  const filteredProducts = applyFilters(products, filters);

  if (isEditing) {
    return (
      <AdminLayout>
        <div className="max-w-6xl mx-auto p-6">
          <ProductEditor
            product={selectedProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setIsEditing(false);
              setSelectedProduct(null);
            }}
            isLoading={isLoading}
          />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">
              Manage your sustainable footwear catalog - {filteredProducts.length} of {products.length} products
            </p>
          </div>
          
          <button
            onClick={() => {
              setSelectedProduct(null);
              setIsEditing(true);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500"
          >
            Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Products
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search by title, brand, or description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>

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
        </div>

        {/* Product List */}
        <ProductList
          products={filteredProducts}
          onEdit={(product) => {
            setSelectedProduct(product);
            setIsEditing(true);
          }}
          onDelete={handleDeleteProducts}
          onBulkUpdate={handleBulkUpdate}
          onExport={handleExport}
          isLoading={isLoading}
        />
      </div>
    </AdminLayout>
  );
}

// Simple ProductList component for now
const ProductList: React.FC<{
  products: ProductFormData[];
  onEdit: (product: ProductFormData) => void;
  onDelete: (productIds: string[]) => Promise<void>;
  onBulkUpdate: (productIds: string[], updates: Partial<ProductFormData>) => Promise<void>;
  onExport: (format: 'csv' | 'json') => Promise<void>;
  isLoading: boolean;
}> = ({ products, onEdit, onDelete, onExport, isLoading }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium">Product List</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onExport('csv')}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            Export CSV
          </button>
          <button
            onClick={() => onExport('json')}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            Export JSON
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found.</p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Variants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {product.variants[0]?.images[0] && (
                      <img
                        src={product.variants[0].images[0]}
                        alt={product.title}
                        className="w-10 h-10 rounded object-cover mr-3"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.title}</div>
                      <div className="text-sm text-gray-500">{product.brand}</div>
                      {product.sustainabilityFeatures.length > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                          🌱 Sustainable
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                  {product.category}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {product.variants.length} variants
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Enhanced ProductEditor component with advanced features
const ProductEditor: React.FC<{
  product: ProductFormData | null;
  onSave: (product: ProductFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}> = ({ product, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<ProductFormData>(
    product || {
      title: '',
      description: '',
      category: 'shoes',
      brand: '',
      gender: 'unisex',
      material: '',
      sustainabilityFeatures: [],
      careInstructions: '',
      variants: [],
      tags: [],
      status: 'draft'
    }
  );

  const [activeVariantIndex, setActiveVariantIndex] = useState<number | null>(null);
  const [tagInput, setTagInput] = useState('');

  const SUSTAINABILITY_FEATURES = [
    'Eco-friendly materials',
    'Recycled components', 
    'Vegan materials',
    'Carbon neutral shipping',
    'Locally sourced',
    'Refurbished/Restored',
    'Biodegradable packaging',
    'Fair trade certified'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.variants.length === 0) {
      alert('Please add at least one product variant');
      return;
    }
    await onSave(formData);
  };

  // Variant management
  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: `variant-${Date.now()}`,
      size: '',
      sizeSystem: 'US',
      color: '',
      condition: 'new',
      price: 0,
      inventory: 0,
      sku: '',
      images: []
    };

    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, newVariant]
    }));
    setActiveVariantIndex(formData.variants.length);
  };

  const updateVariant = (index: number, updates: Partial<ProductVariant>) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, ...updates } : variant
      )
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
    if (activeVariantIndex === index) {
      setActiveVariantIndex(null);
    }
  };

  // Tag management
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {product ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your sustainable footwear catalog
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="shoes">Shoes</option>
                <option value="hats">Hats</option>
                <option value="bags">Bags</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
                <option value="kids">Kids</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Material
            </label>
            <input
              type="text"
              value={formData.material}
              onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
              placeholder="e.g., Organic cotton, Recycled polyester"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Care Instructions
            </label>
            <textarea
              value={formData.careInstructions}
              onChange={(e) => setFormData(prev => ({ ...prev, careInstructions: e.target.value }))}
              rows={2}
              placeholder="How to care for this product..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Sustainability Features */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-green-800">
            🌱 Sustainability Features
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SUSTAINABILITY_FEATURES.map((feature) => (
              <label key={feature} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.sustainabilityFeatures.includes(feature)}
                  onChange={(e) => {
                    const features = e.target.checked
                      ? [...formData.sustainabilityFeatures, feature]
                      : formData.sustainabilityFeatures.filter(f => f !== feature);
                    setFormData(prev => ({ ...prev, sustainabilityFeatures: features }));
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Tags</h2>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagInputKeyPress}
              placeholder="Add a tag..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>

        {/* Product Variants */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Product Variants *</h2>
            <button
              type="button"
              onClick={addVariant}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500"
            >
              Add Variant
            </button>
          </div>

          {formData.variants.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No variants added yet. Click "Add Variant" to start.
            </p>
          ) : (
            <div className="space-y-4">
              {formData.variants.map((variant, index) => (
                <div
                  key={variant.id}
                  className={`border rounded-lg p-4 ${
                    activeVariantIndex === index ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3
                      className="font-medium cursor-pointer"
                      onClick={() => setActiveVariantIndex(activeVariantIndex === index ? null : index)}
                    >
                      Variant {index + 1}: {variant.size} {variant.color || 'Unnamed'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>

                  {activeVariantIndex === index && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Size *
                        </label>
                        <input
                          type="text"
                          value={variant.size}
                          onChange={(e) => updateVariant(index, { size: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Size System
                        </label>
                        <select
                          value={variant.sizeSystem}
                          onChange={(e) => updateVariant(index, { sizeSystem: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="US">US</option>
                          <option value="EU">EU</option>
                          <option value="UK">UK</option>
                          <option value="CM">CM</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Color *
                        </label>
                        <input
                          type="text"
                          value={variant.color}
                          onChange={(e) => updateVariant(index, { color: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Condition *
                        </label>
                        <select
                          value={variant.condition}
                          onChange={(e) => updateVariant(index, { condition: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="new">New - Brand new, never worn</option>
                          <option value="like-new">Like New - Excellent condition, minimal wear</option>
                          <option value="good">Good - Good condition, light signs of wear</option>
                          <option value="fair">Fair - Fair condition, visible wear but functional</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={variant.price}
                          onChange={(e) => updateVariant(index, { price: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Compare Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={variant.compareAtPrice || ''}
                          onChange={(e) => updateVariant(index, { compareAtPrice: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Original price (optional)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Inventory *
                        </label>
                        <input
                          type="number"
                          value={variant.inventory}
                          onChange={(e) => updateVariant(index, { inventory: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SKU
                        </label>
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) => updateVariant(index, { sku: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Product SKU"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="draft">Draft</option>
                          <option value="active">Active</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || formData.variants.length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};
