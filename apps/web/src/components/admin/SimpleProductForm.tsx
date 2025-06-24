'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface SimpleProductFormProps {
  onClose?: () => void
  editProduct?: any
}

export function SimpleProductForm({ onClose, editProduct }: SimpleProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: editProduct?.title || '',
    description: editProduct?.description || '',
    price: editProduct?.price ? (editProduct.price / 100).toString() : '',  // Convert from cents
    image_url: editProduct?.image_url || '',
    status: editProduct?.status || 'active',
    product_type: editProduct?.product_type || 'new',
    condition_grade: editProduct?.condition_grade || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const productData = {
        ...formData,
        price: Math.round(parseFloat(formData.price) * 100), // Convert to cents
        condition_grade: formData.product_type === 'new' ? null : formData.condition_grade
      }

      const url = editProduct 
        ? `/api/admin/products/${editProduct.id}`
        : '/api/admin/products'
      
      const method = editProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        throw new Error('Failed to save product')
      }

      if (onClose) onClose()
      router.refresh()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {editProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Swiss Alpine Runner"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">Price (CHF) *</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="299.00"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief product description"
            />
          </div>

          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Product Type *</label>
            <select
              value={formData.product_type}
              onChange={(e) => setFormData(prev => ({ ...prev, product_type: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="new">New</option>
              <option value="refurbished">Refurbished</option>
            </select>
          </div>

          {/* Condition Grade (only for refurbished) */}
          {formData.product_type === 'refurbished' && (
            <div>
              <label className="block text-sm font-medium mb-1">Condition *</label>
              <select
                value={formData.condition_grade}
                onChange={(e) => setFormData(prev => ({ ...prev, condition_grade: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select condition</option>
                <option value="excellent">Excellent</option>
                <option value="very_good">Very Good</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>
          )}

          {/* Image URL (optional) */}
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Active (Visible in Shop)</option>
              <option value="draft">Draft (Hidden)</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : (editProduct ? 'Update Product' : 'Add Product')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 