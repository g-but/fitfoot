'use client';

import * as Sentry from '@sentry/nextjs';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

// Types for product management
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
}

interface ProductEditorProps {
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

export const ProductEditor: React.FC<ProductEditorProps> = ({
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
  const [uploadingImages, setUploadingImages] = useState<string[]>([]);

  // Image upload handling
  const onDrop = useCallback(async (acceptedFiles: File[], variantIndex?: number) => {
    const uploadPromises = acceptedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        setUploadingImages(prev => [...prev, file.name]);
        
        // Simulate upload - replace with actual upload logic
        await new Promise(resolve => setTimeout(resolve, 2000));
        const imageUrl = `https://example.com/uploads/${file.name}`;
        
        setUploadingImages(prev => prev.filter(name => name !== file.name));
        return imageUrl;
      } catch (error) {
        setUploadingImages(prev => prev.filter(name => name !== file.name));
        Sentry.captureException(error, {
          tags: { section: 'product-editor' },
          extra: { fileName: file.name, variantIndex }
        });
        throw error;
      }
    });

    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      
      if (typeof variantIndex === 'number') {
        // Add to specific variant
        setFormData(prev => ({
          ...prev,
          variants: prev.variants.map((variant, index) =>
            index === variantIndex
              ? { ...variant, images: [...variant.images, ...uploadedUrls] }
              : variant
          )
        }));
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => onDrop(files),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 10
  });

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

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

          <div className="mt-4">
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
        </div>

        {/* Product Variants */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Product Variants</h2>
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
                          {Object.entries(CONDITION_DESCRIPTIONS).map(([value, description]) => (
                            <option key={value} value={value}>
                              {value.charAt(0).toUpperCase() + value.slice(1)} - {description}
                            </option>
                          ))}
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

                      {/* Variant Images */}
                      <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Variant Images
                        </label>
                        <div
                          {...getRootProps()}
                          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
                            isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300'
                          }`}
                        >
                          <input {...getInputProps()} />
                          <p className="text-gray-600">
                            {isDragActive ? 'Drop images here...' : 'Drag & drop images or click to browse'}
                          </p>
                        </div>
                        
                        {variant.images.length > 0 && (
                          <div className="grid grid-cols-4 gap-2 mt-2">
                            {variant.images.map((url, imgIndex) => (
                              <div key={imgIndex} className="relative">
                                <img
                                  src={url}
                                  alt={`Variant ${index + 1} image ${imgIndex + 1}`}
                                  className="w-full h-20 object-cover rounded"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newImages = variant.images.filter((_, i) => i !== imgIndex);
                                    updateVariant(index, { images: newImages });
                                  }}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
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

      {/* Upload Progress */}
      {uploadingImages.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg p-4 max-w-xs">
          <h4 className="font-medium mb-2">Uploading Images</h4>
          {uploadingImages.map((filename) => (
            <div key={filename} className="flex items-center mb-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
              <span className="text-sm text-gray-600 truncate">{filename}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 