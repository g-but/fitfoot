'use client';

import * as Sentry from '@sentry/nextjs';
import React, { useState } from 'react';

// Product types
export interface ProductVariant {
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

export interface ProductFormData {
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

interface ProductEditorAdvancedProps {
  product?: ProductFormData;
  onSave: (product: ProductFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

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

const CONDITION_DESCRIPTIONS = {
  new: 'Brand new, never worn',
  'like-new': 'Excellent condition, minimal wear',
  good: 'Good condition, light signs of wear',
  fair: 'Fair condition, visible wear but functional'
};

export const ProductEditorAdvanced: React.FC<ProductEditorAdvancedProps> = ({
  product,
  onSave,
  onCancel,
  isLoading = false
}) => {
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
  const [uploadingImages, setUploadingImages] = useState<string[]>([]);

  // Form validation
  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.title.trim()) errors.push('Product title is required');
    if (!formData.brand.trim()) errors.push('Brand is required');
    if (!formData.description.trim()) errors.push('Description is required');
    if (formData.variants.length === 0) errors.push('At least one variant is required');
    
    formData.variants.forEach((variant, index) => {
      if (!variant.size.trim()) errors.push(`Variant ${index + 1}: Size is required`);
      if (!variant.color.trim()) errors.push(`Variant ${index + 1}: Color is required`);
      if (variant.price <= 0) errors.push(`Variant ${index + 1}: Price must be greater than 0`);
      if (variant.inventory < 0) errors.push(`Variant ${index + 1}: Inventory cannot be negative`);
    });

    return errors;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      alert('Please fix the following errors:\n\n' + errors.join('\n'));
      return;
    }
    
    try {
      await onSave(formData);
      Sentry.addBreadcrumb({
        message: 'Product saved successfully',
        category: 'admin',
        data: { productId: formData.id, title: formData.title }
      });
    } catch (error) {
      Sentry.captureException(error, {
        tags: { section: 'product-editor' },
        user: { id: 'admin' },
        extra: { formData }
      });
      throw error;
    }
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

  const duplicateVariant = (index: number) => {
    const variantToDuplicate = formData.variants[index];
    const newVariant: ProductVariant = {
      ...variantToDuplicate,
      id: `variant-${Date.now()}`,
      sku: variantToDuplicate.sku ? `${variantToDuplicate.sku}-copy` : ''
    };

    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, newVariant]
    }));
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

  // Generate SKU automatically
  const generateSKU = (variant: ProductVariant, productTitle: string, brand: string) => {
    const brandCode = brand.toUpperCase().substring(0, 3);
    const titleCode = productTitle.toUpperCase().replace(/\s+/g, '').substring(0, 3);
    const colorCode = variant.color.toUpperCase().substring(0, 3);
    const sizeCode = variant.size.replace(/\s+/g, '');
    return `${brandCode}-${titleCode}-${colorCode}-${sizeCode}`;
  };

  const autoGenerateSKU = (index: number) => {
    const variant = formData.variants[index];
    const sku = generateSKU(variant, formData.title, formData.brand);
    updateVariant(index, { sku });
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
                placeholder="e.g., Eco Runner Sneakers"
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
                placeholder="e.g., EcoFoot"
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
              placeholder="Describe the product, its features, and benefits..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
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
              placeholder="Add a tag (e.g., running, eco-friendly, leather)..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Tag
            </button>
          </div>
        </div>

        {/* Product Variants */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold">Product Variants *</h2>
              <p className="text-sm text-gray-600 mt-1">
                Add different sizes, colors, and conditions for this product
              </p>
            </div>
            <button
              type="button"
              onClick={addVariant}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500"
            >
              Add Variant
            </button>
          </div>

          {formData.variants.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 mb-2">No variants added yet</p>
              <p className="text-sm text-gray-400">Click "Add Variant" to create your first product variant</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.variants.map((variant, index) => (
                <div
                  key={variant.id}
                  className={`border rounded-lg p-4 transition-all ${
                    activeVariantIndex === index ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3
                      className="font-medium cursor-pointer hover:text-green-600 transition-colors"
                      onClick={() => setActiveVariantIndex(activeVariantIndex === index ? null : index)}
                    >
                      Variant {index + 1}: {variant.size && variant.color ? `${variant.size} - ${variant.color}` : 'Click to edit'}
                      {variant.condition !== 'new' && ` (${variant.condition})`}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => duplicateVariant(index)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        title="Duplicate variant"
                      >
                        Duplicate
                      </button>
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                        title="Remove variant"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {activeVariantIndex === index && (
                    <div className="space-y-4">
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
                            placeholder="e.g., 9, 42, M, L"
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
                            placeholder="e.g., Forest Green, Black"
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
                            {Object.entries(CONDITION_DESCRIPTIONS).map(([value, description]) => (
                              <option key={value} value={value}>
                                {value.charAt(0).toUpperCase() + value.slice(1)} - {description}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price * ($)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={variant.price}
                            onChange={(e) => updateVariant(index, { price: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Compare Price ($)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={variant.compareAtPrice || ''}
                            onChange={(e) => updateVariant(index, { 
                              compareAtPrice: e.target.value ? Number(e.target.value) : undefined 
                            })}
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
                            min="0"
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
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={variant.sku}
                              onChange={(e) => updateVariant(index, { sku: e.target.value })}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="Product SKU"
                            />
                            <button
                              type="button"
                              onClick={() => autoGenerateSKU(index)}
                              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                              title="Auto-generate SKU"
                            >
                              Auto
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Display savings if compare price is set */}
                      {variant.compareAtPrice && variant.compareAtPrice > variant.price && (
                        <div className="bg-green-100 p-3 rounded-md">
                          <p className="text-green-800 text-sm">
                            <strong>Savings:</strong> ${(variant.compareAtPrice - variant.price).toFixed(2)} 
                            ({(((variant.compareAtPrice - variant.price) / variant.compareAtPrice) * 100).toFixed(0)}% off)
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Summary */}
        {formData.variants.length > 0 && (
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-blue-800">Product Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-blue-700"><strong>Total Variants:</strong> {formData.variants.length}</p>
                <p className="text-blue-700"><strong>Total Inventory:</strong> {formData.variants.reduce((sum, v) => sum + v.inventory, 0)}</p>
              </div>
              <div>
                <p className="text-blue-700"><strong>Price Range:</strong> ${Math.min(...formData.variants.map(v => v.price)).toFixed(2)} - ${Math.max(...formData.variants.map(v => v.price)).toFixed(2)}</p>
                <p className="text-blue-700"><strong>Sustainability Features:</strong> {formData.sustainabilityFeatures.length}</p>
              </div>
              <div>
                <p className="text-blue-700"><strong>Tags:</strong> {formData.tags.length}</p>
                <p className="text-blue-700"><strong>Status:</strong> {formData.status}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || formData.variants.length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Save Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};