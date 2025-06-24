'use client';

import { DollarSign, FileText, Package, Recycle, Save, Sparkles, Star, Tag, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Product {
  id?: string;
  title: string;
  description: string;
  price: number;
  product_type: 'new' | 'refurbished';
  condition_grade?: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => Promise<void>;
  product?: Product | null;
}

const conditionGrades = [
  { value: 'excellent', label: 'Excellent', description: 'Like new, minimal wear', color: 'bg-green-100 text-green-800' },
  { value: 'very_good', label: 'Very Good', description: 'Minor signs of wear', color: 'bg-blue-100 text-blue-800' },
  { value: 'good', label: 'Good', description: 'Noticeable wear but functional', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'fair', label: 'Fair', description: 'Significant wear but good value', color: 'bg-orange-100 text-orange-800' },
];

export default function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const [formData, setFormData] = useState<Product>({
    title: '',
    description: '',
    price: 0,
    product_type: 'new',
    condition_grade: 'excellent',
  });
  const [loading, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        title: '',
        description: '',
        price: 0,
        product_type: 'new',
        condition_grade: 'excellent',
      });
    }
    setErrors({});
  }, [product, isOpen]);

  // Handle escape key to close modal and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, loading, onClose]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Product title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    } else if (formData.price > 100000) {
      newErrors.price = 'Price must be less than CHF 1,000';
    }

    if (formData.product_type === 'refurbished' && !formData.condition_grade) {
      newErrors.condition_grade = 'Condition grade is required for refurbished products';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      // Convert price to cents for API
      const productData = {
        ...formData,
        price: Math.round(formData.price * 100), // Convert to cents
      };
      
      await onSave(productData);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      setErrors({ general: 'Failed to save product. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent modal content clicks from closing modal
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {product ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-gray-600 text-sm">
                {product ? 'Update product information' : 'Add a new product to your inventory'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
            title="Close (Esc)"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Type Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">Product Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleInputChange('product_type', 'new')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.product_type === 'new'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">New Product</div>
                    <div className="text-sm opacity-75">Brand new, unused</div>
                  </div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => handleInputChange('product_type', 'refurbished')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.product_type === 'refurbished'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Recycle className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">Refurbished</div>
                    <div className="text-sm opacity-75">Restored to good condition</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Product Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900">
              Product Title *
            </label>
            <div className="relative">
              <Tag className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Alpine Runner Pro - Zero Waste Edition"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={loading}
              />
            </div>
            {errors.title && (
              <p className="text-red-600 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Product Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900">
              Description *
            </label>
            <div className="relative">
              <FileText className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the product, its features, materials, and condition..."
                rows={4}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={loading}
              />
            </div>
            {errors.description && (
              <p className="text-red-600 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-semibold text-gray-900">
              Price (CHF) *
            </label>
            <div className="relative">
              <DollarSign className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                max="1000"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={loading}
              />
            </div>
            {errors.price && (
              <p className="text-red-600 text-sm">{errors.price}</p>
            )}
          </div>

          {/* Condition Grade (only for refurbished) */}
          {formData.product_type === 'refurbished' && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900">
                Condition Grade *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {conditionGrades.map((grade) => (
                  <button
                    key={grade.value}
                    type="button"
                    onClick={() => handleInputChange('condition_grade', grade.value)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      formData.condition_grade === grade.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{grade.label}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${grade.color}`}>
                        <Star className="w-3 h-3 inline mr-1" />
                        {grade.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{grade.description}</p>
                  </button>
                ))}
              </div>
              {errors.condition_grade && (
                <p className="text-red-600 text-sm">{errors.condition_grade}</p>
              )}
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 flex-1"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{product ? 'Update Product' : 'Add Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 