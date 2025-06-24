'use client'

import { Button } from '@/components/ui/button'
import { ProtectedRoute } from '@/contexts/AuthContext'
import {
    Filter,
    Grid3X3,
    Heart,
    List,
    Loader2,
    Package,
    Search,
    ShoppingCart,
    Star,
    Trash2,
    X
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface WishlistItem {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  sizes: string[]
  colors: string[]
  category: string
  inStock: boolean
  isRefurbished: boolean
  addedDate: string
  discount?: number
  stockLevel: 'high' | 'medium' | 'low'
}

interface FilterState {
  category: string[]
  priceRange: { min: number; max: number }
  inStock: boolean | null
  isRefurbished: boolean | null
  sortBy: 'date' | 'price-asc' | 'price-desc' | 'rating' | 'name'
}

const mockWishlistItems: WishlistItem[] = [
  {
    id: '1',
    name: 'Eco Trail Runner Pro',
    brand: 'GreenStep',
    price: 179.99,
    originalPrice: 199.99,
    rating: 4.8,
    reviewCount: 124,
    sizes: ['40', '41', '42', '43', '44'],
    colors: ['Forest Green', 'Ocean Blue', 'Stone Gray'],
    category: 'Running Shoes',
    inStock: true,
    isRefurbished: false,
    addedDate: '2024-01-15',
    discount: 10,
    stockLevel: 'high'
  },
  {
    id: '2',
    name: 'Refurbished Urban Sneaker',
    brand: 'EcoWalk',
    price: 139.99,
    originalPrice: 189.99,
    rating: 4.6,
    reviewCount: 89,
    sizes: ['39', '40', '41', '42'],
    colors: ['Classic White', 'Midnight Black'],
    category: 'Sneakers',
    inStock: true,
    isRefurbished: true,
    addedDate: '2024-01-20',
    discount: 26,
    stockLevel: 'medium'
  },
  {
    id: '3',
    name: 'Sustainable Canvas Tote',
    brand: 'NatureBag',
    price: 79.99,
    originalPrice: 79.99,
    rating: 4.9,
    reviewCount: 156,
    sizes: ['One Size'],
    colors: ['Natural', 'Sage Green', 'Charcoal'],
    category: 'Bags',
    inStock: false,
    isRefurbished: false,
    addedDate: '2024-01-25',
    stockLevel: 'low'
  },
  {
    id: '4',
    name: 'Eco Performance Running Shorts',
    brand: 'GreenStep',
    price: 59.99,
    originalPrice: 69.99,
    rating: 4.7,
    reviewCount: 78,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Forest Green'],
    category: 'Apparel',
    inStock: true,
    isRefurbished: false,
    addedDate: '2024-01-28',
    discount: 14,
    stockLevel: 'high'
  }
]

const categories = ['Running Shoes', 'Sneakers', 'Bags', 'Apparel', 'Accessories']
const priceRanges = [
  { label: 'Under CHF 50', min: 0, max: 50 },
  { label: 'CHF 50 - 100', min: 50, max: 100 },
  { label: 'CHF 100 - 200', min: 100, max: 200 },
  { label: 'Over CHF 200', min: 200, max: Infinity }
]

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [filteredItems, setFilteredItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [removingItems, setRemovingItems] = useState<string[]>([])
  const [addingToCart, setAddingToCart] = useState<string[]>([])

  const [filters, setFilters] = useState<FilterState>({
    category: [],
    priceRange: { min: 0, max: Infinity },
    inStock: null,
    isRefurbished: null,
    sortBy: 'date'
  })

  // Load wishlist items
  useEffect(() => {
    setTimeout(() => {
      setWishlistItems(mockWishlistItems)
      setLoading(false)
    }, 1000)
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...wishlistItems]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter(item => filters.category.includes(item.category))
    }

    // Price range filter
    filtered = filtered.filter(item =>
      item.price >= filters.priceRange.min && item.price <= filters.priceRange.max
    )

    // Stock filter
    if (filters.inStock !== null) {
      filtered = filtered.filter(item => item.inStock === filters.inStock)
    }

    // Refurbished filter
    if (filters.isRefurbished !== null) {
      filtered = filtered.filter(item => item.isRefurbished === filters.isRefurbished)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'name':
          return a.name.localeCompare(b.name)
        case 'date':
        default:
          return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
      }
    })

    setFilteredItems(filtered)
  }, [wishlistItems, searchQuery, filters])

  const handleRemoveItem = async (itemId: string) => {
    setRemovingItems(prev => [...prev, itemId])
    setTimeout(() => {
      setWishlistItems(prev => prev.filter(item => item.id !== itemId))
      setRemovingItems(prev => prev.filter(id => id !== itemId))
    }, 500)
  }

  const handleAddToCart = async (itemId: string) => {
    setAddingToCart(prev => [...prev, itemId])
    setTimeout(() => {
      setAddingToCart(prev => prev.filter(id => id !== itemId))
    }, 800)
  }

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const totalValue = filteredItems.reduce((sum, item) => sum + item.price, 0)
  const totalSavings = filteredItems.reduce((sum, item) =>
    sum + (item.originalPrice ? item.originalPrice - item.price : 0), 0
  )
  const inStockCount = filteredItems.filter(item => item.inStock).length

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
            <p className="mt-2 text-gray-600">Loading your wishlist...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 pt-20 pb-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h1>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Discover amazing products and save them to your wishlist for easy access later.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/shop">
                  <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Search className="h-5 w-5 mr-2" />
                    Explore Products
                  </Button>
                </Link>
                <Link href="/shop?category=featured">
                  <Button variant="outline" size="lg">
                    View Featured Items
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                <p className="text-gray-600 mt-1">
                  {filteredItems.length} of {wishlistItems.length} items
                  {inStockCount > 0 && (
                    <span className="text-green-600 ml-2">• {inStockCount} available</span>
                  )}
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">CHF {totalValue.toFixed(2)}</div>
                    <div className="text-gray-500">Total Value</div>
                  </div>
                  {totalSavings > 0 && (
                    <div className="text-center">
                      <div className="font-semibold text-green-600">CHF {totalSavings.toFixed(2)}</div>
                      <div className="text-gray-500">Potential Savings</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your wishlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="sm:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                
                <div className="flex items-center border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-amber-100 text-amber-700' : 'text-gray-400'}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-amber-100 text-amber-700' : 'text-gray-400'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
                
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="date">Recently Added</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-sm text-amber-800">
                  {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedItems([])}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex gap-6">
            
            {/* Left Sidebar Filters */}
            <aside className={`${showFilters ? 'block' : 'hidden'} sm:block w-full sm:w-64 bg-white rounded-lg border border-gray-200 p-6 h-fit shadow-sm`}>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {showFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="sm:hidden ml-auto"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.category.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              category: [...prev.category, category]
                            }))
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              category: prev.category.filter(c => c !== category)
                            }))
                          }
                        }}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <label key={range.label} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={filters.priceRange.min === range.min && filters.priceRange.max === range.max}
                        onChange={() => setFilters(prev => ({
                          ...prev,
                          priceRange: { min: range.min, max: range.max }
                        }))}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stock Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Availability</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="stock"
                      checked={filters.inStock === null}
                      onChange={() => setFilters(prev => ({ ...prev, inStock: null }))}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">All Items</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="stock"
                      checked={filters.inStock === true}
                      onChange={() => setFilters(prev => ({ ...prev, inStock: true }))}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">In Stock</span>
                  </label>
                </div>
              </div>

              {/* Condition Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Condition</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="condition"
                      checked={filters.isRefurbished === null}
                      onChange={() => setFilters(prev => ({ ...prev, isRefurbished: null }))}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">All Conditions</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="condition"
                      checked={filters.isRefurbished === false}
                      onChange={() => setFilters(prev => ({ ...prev, isRefurbished: false }))}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">New</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="condition"
                      checked={filters.isRefurbished === true}
                      onChange={() => setFilters(prev => ({ ...prev, isRefurbished: true }))}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Refurbished</span>
                  </label>
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({
                  category: [],
                  priceRange: { min: 0, max: Infinity },
                  inStock: null,
                  isRefurbished: null,
                  sortBy: 'date'
                })}
                className="w-full"
              >
                Clear All Filters
              </Button>
            </aside>

            {/* Product Grid/List */}
            <main className="flex-1">
              {filteredItems.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('')
                      setFilters({
                        category: [],
                        priceRange: { min: 0, max: Infinity },
                        inStock: null,
                        isRefurbished: null,
                        sortBy: 'date'
                      })
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }>
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow relative ${
                        viewMode === 'list' ? 'flex' : ''
                      } ${selectedItems.includes(item.id) ? 'ring-2 ring-amber-300' : ''}`}
                    >
                      {/* Selection Checkbox */}
                      <div className="absolute top-3 left-3 z-10">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 shadow-sm"
                        />
                      </div>

                      {/* Product Image */}
                      <div className={`relative ${viewMode === 'grid' ? 'aspect-square' : 'w-32 h-32 flex-shrink-0'}`}>
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Package className="h-12 w-12 text-gray-400" />
                        </div>
                        
                        {/* Badges */}
                        <div className="absolute top-3 right-3 space-y-1">
                          {item.isRefurbished && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full block text-center">
                              Refurbished
                            </span>
                          )}
                          {item.discount && (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full block text-center">
                              -{item.discount}%
                            </span>
                          )}
                          {!item.inStock && (
                            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full block text-center">
                              Out of Stock
                            </span>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removingItems.includes(item.id)}
                          className="absolute top-12 right-3 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-sm transition-colors group"
                          title="Remove from wishlist"
                        >
                          {removingItems.includes(item.id) ? (
                            <Loader2 className="h-4 w-4 text-gray-600 animate-spin" />
                          ) : (
                            <Heart className="h-4 w-4 text-red-500 fill-current group-hover:scale-110 transition-transform" />
                          )}
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                        <div className={viewMode === 'list' ? 'flex justify-between items-start' : ''}>
                          <div className={viewMode === 'list' ? 'flex-1' : ''}>
                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
                            <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                            
                            {/* Rating */}
                            <div className="flex items-center space-x-1 mb-3">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < Math.floor(item.rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-600">
                                {item.rating} ({item.reviewCount})
                              </span>
                            </div>

                            {/* Stock Status */}
                            {item.inStock && (
                              <div className="flex items-center mb-3">
                                <div className={`h-2 w-2 rounded-full mr-2 ${
                                  item.stockLevel === 'high' ? 'bg-green-500' :
                                  item.stockLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                                }`} />
                                <span className="text-xs text-gray-600">
                                  {item.stockLevel === 'high' ? 'In Stock' :
                                   item.stockLevel === 'medium' ? 'Low Stock' : 'Last Few'}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Price and Actions */}
                          <div className={viewMode === 'list' ? 'text-right ml-4' : ''}>
                            <div className="flex items-center space-x-2 mb-3">
                              <span className="text-lg font-bold text-gray-900">
                                CHF {item.price.toFixed(2)}
                              </span>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  CHF {item.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className={`space-y-2 ${viewMode === 'list' ? 'w-32' : ''}`}>
                              <Button
                                className="w-full bg-amber-600 hover:bg-amber-700 text-white disabled:bg-gray-300"
                                size="sm"
                                disabled={!item.inStock || addingToCart.includes(item.id)}
                                onClick={() => handleAddToCart(item.id)}
                              >
                                {addingToCart.includes(item.id) ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                )}
                                {!item.inStock ? 'Out of Stock' : 'Add to Cart'}
                              </Button>
                              
                              <Link href={`/products/${item.id}`}>
                                <Button variant="outline" size="sm" className="w-full">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>

          {/* Continue Shopping CTA */}
          {filteredItems.length > 0 && (
            <div className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200 p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Found something you love?</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Continue exploring our sustainable collection and discover more eco-friendly products that match your style.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/shop">
                  <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
                    Continue Shopping
                  </Button>
                </Link>
                <Link href="/shop?category=new-arrivals">
                  <Button variant="outline" size="lg">
                    View New Arrivals
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
} 