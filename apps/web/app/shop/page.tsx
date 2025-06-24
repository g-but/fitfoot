'use client';

import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { getProducts } from '@/lib/medusa.client';
import {
    Filter,
    Grid3X3,
    Heart,
    Home,
    Leaf,
    List,
    Loader2,
    Recycle,
    RefreshCw,
    Search,
    ShoppingCart,
    Sparkles,
    Star,
    TrendingUp,
    X
} from 'lucide-react';
import Link from 'next/link';
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
  collection?: {
    id: string;
    title: string;
    handle: string;
  };
  tags?: Array<{
    id: string;
    value: string;
  }>;
  product_type?: 'new' | 'refurbished';
  condition_grade?: string;
  original_price?: number;
  refurbished_price?: number;
  sustainability_data?: any;
  environmental_impact?: {
    carbon_footprint_saved_kg: number;
    materials_recycled_percentage: number;
    water_saved_liters: number;
    waste_diverted_kg: number;
  };
  refurbishment_history?: any;
  created_at: string;
  category?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  discount?: number;
  sizes?: string[];
  colors?: string[];
}

interface FilterState {
  productType: string[]
  category: string[]
  priceRange: { min: number; max: number }
  inStock: boolean | null
  rating: number | null
  brand: string[]
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'sustainability'
}

const categories = ['Running Shoes', 'Sneakers', 'Casual Shoes', 'Boots', 'Sandals', 'Accessories']
const brands = ['GreenStep', 'EcoWalk', 'NatureBag', 'SustainableShoes', 'EcoFit']

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [wishlistItems, setWishlistItems] = useState<string[]>([])
  const [addingToWishlist, setAddingToWishlist] = useState<string[]>([])
  
  const [filters, setFilters] = useState<FilterState>({
    productType: [],
    category: [],
    priceRange: { min: 0, max: Infinity },
    inStock: null,
    rating: null,
    brand: [],
    sortBy: 'newest'
  })
  
  const { isLoggedIn } = useAuth()
  const { addToCart, loading: cartLoading, getItemCount } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  // Apply filters and search
  useEffect(() => {
    let filtered = [...products]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Product type filter
    if (filters.productType.length > 0) {
      filtered = filtered.filter(product => 
        product.product_type && filters.productType.includes(product.product_type)
      )
    }

    // Category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter(product => 
        product.category && filters.category.includes(product.category)
      )
    }

    // Brand filter
    if (filters.brand.length > 0) {
      filtered = filtered.filter(product => 
        product.brand && filters.brand.includes(product.brand)
      )
    }

    // Price range filter - using Medusa's price structure
    filtered = filtered.filter(product => {
      if (!product.variants || product.variants.length === 0) return true;
      const price = product.variants[0].prices?.[0]?.amount || 0;
      const priceInChf = price / 100;
      return priceInChf >= filters.priceRange.min && priceInChf <= filters.priceRange.max
    })

    // Stock filter
    if (filters.inStock !== null) {
      filtered = filtered.filter(product => product.inStock === filters.inStock)
    }

    // Rating filter
    if (filters.rating !== null) {
      filtered = filtered.filter(product => 
        product.rating && product.rating >= filters.rating!
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          const priceA = a.variants?.[0]?.prices?.[0]?.amount || 0;
          const priceB = b.variants?.[0]?.prices?.[0]?.amount || 0;
          return priceA - priceB
        case 'price-desc':
          const priceADesc = a.variants?.[0]?.prices?.[0]?.amount || 0;
          const priceBDesc = b.variants?.[0]?.prices?.[0]?.amount || 0;
          return priceBDesc - priceADesc
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'sustainability':
          const aScore = a.product_type === 'refurbished' ? 95 : 70
          const bScore = b.product_type === 'refurbished' ? 95 : 70
          return bScore - aScore
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    setFilteredProducts(filtered)
  }, [products, searchQuery, filters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use the Medusa client to fetch products
      const medusaProducts = await getProducts({ limit: 50 })
      
      // Enhance products with additional data for better UX
      const enhancedProducts = medusaProducts.map((product: any, index: number) => ({
        ...product,
        product_type: (index % 3 === 0 ? 'refurbished' : 'new') as 'new' | 'refurbished',
        category: categories[index % categories.length],
        brand: brands[index % brands.length],
        rating: 4 + Math.random() * 1,
        reviewCount: Math.floor(Math.random() * 200) + 10,
        inStock: Math.random() > 0.1, // 90% in stock
        discount: undefined, // Will be calculated from prices if needed
        sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'].slice(0, Math.floor(Math.random() * 6) + 3),
        colors: ['Black', 'White', 'Brown', 'Navy', 'Gray'].slice(0, Math.floor(Math.random() * 3) + 1),
        created_at: new Date().toISOString(),
        environmental_impact: {
          carbon_footprint_saved_kg: Math.floor(Math.random() * 50) + 10,
          materials_recycled_percentage: Math.floor(Math.random() * 80) + 20,
          water_saved_liters: Math.floor(Math.random() * 1000) + 100,
          waste_diverted_kg: Math.floor(Math.random() * 20) + 5
        }
      }))
      
      setProducts(enhancedProducts)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products from Medusa'
      setError(errorMessage)
      console.error('Error fetching products from Medusa:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (product: Product) => {
    if (!product.variants || product.variants.length === 0) return 'CHF 0.00';
    const price = product.variants[0].prices?.[0]?.amount || 0;
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
    }).format(price / 100)
  }

  const handleAddToCart = async (productId: string) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product || !product.variants || product.variants.length === 0) {
        throw new Error('Product variant not found');
      }
      
      const variantId = product.variants[0].id;
      await addToCart(productId, variantId, 1)
      
      // Show success feedback
        const notification = document.createElement('div')
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2'
        notification.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          ${product.title} added to cart!
        `
        document.body.appendChild(notification)
        setTimeout(() => notification.remove(), 3000)
    } catch (error) {
      console.error('Failed to add to cart:', error)
      const errorNotification = document.createElement('div')
      errorNotification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 max-w-sm'
      errorNotification.innerHTML = `
        <div class="flex items-start gap-2">
          <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 4c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <div class="flex-1">
            <div class="font-medium">Couldn't add to cart</div>
            <div class="text-sm opacity-90 mt-1">Please try again or check your connection</div>
            <button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-xs underline mt-1">Dismiss</button>
          </div>
        </div>
      `
      document.body.appendChild(errorNotification)
      setTimeout(() => errorNotification.remove(), 5000)
    }
  }

  const handleToggleWishlist = async (productId: string) => {
    if (!isLoggedIn) {
      alert('Please log in to manage your wishlist')
      return
    }

    setAddingToWishlist(prev => [...prev, productId])
    
    setTimeout(() => {
      if (wishlistItems.includes(productId)) {
        setWishlistItems(prev => prev.filter(id => id !== productId))
      } else {
        setWishlistItems(prev => [...prev, productId])
      }
      setAddingToWishlist(prev => prev.filter(id => id !== productId))
    }, 500)
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setFilters({
      productType: [],
      category: [],
      priceRange: { min: 0, max: Infinity },
      inStock: null,
      rating: null,
      brand: [],
      sortBy: 'newest'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gold-600" />
          <p className="text-muted-foreground">Loading products from Medusa...</p>
          <div className="mt-4 text-xs text-gray-500">
            Taking longer than expected? <button 
              onClick={() => window.location.reload()} 
              className="text-gold-600 hover:underline"
            >
              Refresh page
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4 space-y-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-heading text-foreground mb-2">Medusa Connection Error</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't connect to our product catalog. Please ensure Medusa is running.
            </p>
            <p className="text-sm text-gray-500 mb-6">{error}</p>
          </div>
          <div className="space-y-3">
            <button 
              onClick={fetchProducts}
              className="w-full btn-gold px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>
            <div className="flex gap-2">
              <Link href="/" className="flex-1">
                <button className="w-full bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Home className="w-4 h-4" />
                  Browse Homepage
                </button>
              </Link>
              <Link href="/contact" className="flex-1">
                <button className="w-full bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                  Report Issue
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Filter Overlay */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-heading">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-full pb-20">
              <FilterSidebar 
                filters={filters}
                setFilters={setFilters}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                clearAllFilters={clearAllFilters}
                onFilterChange={() => setMobileFiltersOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gold-50 to-gray-50 py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gold-100 border border-gold-200 mb-4 sm:mb-6">
              <TrendingUp className="w-4 h-4 text-gold-600" />
              <span className="text-xs sm:text-sm font-medium text-gold-700">{products.length} products from Medusa</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading text-foreground mb-4 sm:mb-6 leading-tight">
              Find shoes that feel good
              <span className="block gradient-gold-text mt-1 sm:mt-2">inside and out</span>
            </h1>
            
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Every pair in our collection is chosen for comfort, style, and positive environmental impact. 
              New eco-friendly designs or expertly refurbished favorites.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                  placeholder="Search for shoes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar 
              filters={filters}
              setFilters={setFilters}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              clearAllFilters={clearAllFilters}
            />
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                <span className="text-sm text-gray-600">
                  {filteredProducts.length} of {products.length} products
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="sustainability">Most Sustainable</option>
                </select>
                
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-gold-50 text-gold-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-gold-50 text-gold-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    viewMode={viewMode}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isInWishlist={wishlistItems.includes(product.id)}
                    isAddingToWishlist={addingToWishlist.includes(product.id)}
                    cartLoading={cartLoading}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterSidebar({ filters, setFilters, searchQuery, setSearchQuery, clearAllFilters, onFilterChange }: any) {
  const categories = ['Running Shoes', 'Sneakers', 'Casual Shoes', 'Boots', 'Sandals', 'Accessories']
  const brands = ['GreenStep', 'EcoWalk', 'NatureBag', 'SustainableShoes', 'EcoFit']
  const priceRanges = [
    { label: 'Under CHF 50', min: 0, max: 50 },
    { label: 'CHF 50 - 100', min: 50, max: 100 },
    { label: 'CHF 100 - 200', min: 100, max: 200 },
    { label: 'Over CHF 200', min: 200, max: Infinity }
  ]

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev: FilterState) => ({ ...prev, [key]: value }))
    onFilterChange?.()
  }

  const toggleArrayFilter = (key: 'productType' | 'category' | 'brand', value: string) => {
    setFilters((prev: FilterState) => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter((item: string) => item !== value)
        : [...prev[key], value]
    }))
    onFilterChange?.()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Filters</h2>
        <button
          onClick={clearAllFilters}
          className="text-sm text-gold-600 hover:text-gold-700"
        >
          Clear all
        </button>
      </div>

      {/* Product Type */}
      <div>
        <h3 className="font-medium mb-3">Product Type</h3>
        <div className="space-y-2">
          {['new', 'refurbished'].map((type) => (
            <label key={type} className="flex items-center">
          <input
                type="checkbox"
                checked={filters.productType.includes(type)}
                onChange={() => toggleArrayFilter('productType', type)}
                className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
              />
              <span className="ml-2 text-sm capitalize flex items-center gap-2">
                {type}
                {type === 'refurbished' && <Recycle className="w-3 h-3 text-green-600" />}
                {type === 'new' && <Sparkles className="w-3 h-3 text-blue-600" />}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.category.includes(category)}
                onChange={() => toggleArrayFilter('category', category)}
                className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
              />
              <span className="ml-2 text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-medium mb-3">Brands</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.brand.includes(brand)}
                onChange={() => toggleArrayFilter('brand', brand)}
                className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
              />
              <span className="ml-2 text-sm">{brand}</span>
            </label>
          ))}
        </div>
        </div>

        {/* Price Range */}
      <div>
        <h3 className="font-medium mb-3">Price Range</h3>
          <div className="space-y-2">
            {priceRanges.map((range) => (
            <label key={range.label} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  checked={filters.priceRange.min === range.min && filters.priceRange.max === range.max}
                onChange={() => updateFilter('priceRange', { min: range.min, max: range.max })}
                className="text-gold-600 focus:ring-gold-500"
              />
              <span className="ml-2 text-sm">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

      {/* Rating */}
      <div>
        <h3 className="font-medium mb-3">Minimum Rating</h3>
          <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center">
                <input
                type="radio"
                name="rating"
                checked={filters.rating === rating}
                onChange={() => updateFilter('rating', rating)}
                className="text-gold-600 focus:ring-gold-500"
              />
              <span className="ml-2 text-sm flex items-center">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current text-yellow-400" />
                ))}
                <span className="ml-1">& up</span>
              </span>
              </label>
            ))}
          </div>
        </div>

      {/* In Stock */}
      <div>
        <h3 className="font-medium mb-3">Availability</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.inStock === true}
              onChange={(e) => updateFilter('inStock', e.target.checked ? true : null)}
              className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
            />
            <span className="ml-2 text-sm">In Stock Only</span>
          </label>
      </div>
        </div>
          </div>
  )
}

function ProductCard({ 
  product, 
  viewMode, 
  onAddToCart, 
  onToggleWishlist, 
  isInWishlist, 
  isAddingToWishlist, 
  cartLoading, 
  formatPrice 
}: any) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  // Get the primary image URL from Medusa product
  const getImageUrl = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url
    }
    // Fallback to a placeholder
    return `https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center`
  }

  const imageUrl = getImageUrl(product)
  
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 flex gap-6">
        <div className="relative w-32 h-32 flex-shrink-0">
          {imageLoading && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-lg" />
          )}
          <img
            src={imageUrl}
            alt={product.title}
            className={`w-full h-full object-cover rounded-lg ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false)
              setImageError(true)
            }}
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-medium text-lg text-gray-900">{product.title}</h3>
              <p className="text-sm text-gray-500">{product.brand}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">{formatPrice(product)}</span>
              {product.product_type === 'refurbished' && (
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  <Recycle className="w-3 h-3 mr-1" />
                  Refurbished
                </Badge>
              )}
            </div>
            </div>
            
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {product.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current text-yellow-400" />
                  <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">({product.reviewCount})</span>
              </div>
              )}
              
              {product.environmental_impact && (
                <div className="flex items-center gap-1 text-green-600">
                  <Leaf className="w-4 h-4" />
                  <span className="text-sm">Eco-friendly</span>
              </div>
                )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleWishlist(product.id)}
                disabled={isAddingToWishlist}
                className={`p-2 rounded-lg border transition-colors ${
                  isInWishlist 
                    ? 'bg-red-50 border-red-200 text-red-600' 
                    : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-red-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={() => onAddToCart(product.id)}
                disabled={cartLoading}
                className="flex items-center gap-2 px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 disabled:opacity-50 transition-colors"
              >
                    <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative aspect-square">
        {imageLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
        )}
        <img
          src={imageUrl}
          alt={product.title}
          className={`w-full h-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageLoading(false)
            setImageError(true)
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.product_type === 'refurbished' && (
            <Badge className="bg-green-500 text-white">
              <Recycle className="w-3 h-3 mr-1" />
              Refurbished
            </Badge>
          )}
          {product.product_type === 'new' && (
            <Badge className="bg-blue-500 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              New
            </Badge>
          )}
        </div>
        
        {/* Wishlist Button */}
        <button
          onClick={() => onToggleWishlist(product.id)}
          disabled={isAddingToWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            isInWishlist 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-medium text-gray-900 group-hover:text-gold-600 transition-colors">{product.title}</h3>
          <p className="text-sm text-gray-500">{product.brand}</p>
      </div>
      
        <div className="flex items-center gap-2 mb-3">
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-current text-yellow-400" />
              <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-400">({product.reviewCount})</span>
          </div>
          )}
          
          {product.environmental_impact && (
            <div className="flex items-center gap-1 text-green-600">
              <Leaf className="w-4 h-4" />
              <span className="text-xs">Eco</span>
          </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900">{formatPrice(product)}</span>
          
          <button
            onClick={() => onAddToCart(product.id)}
            disabled={cartLoading}
            className="flex items-center gap-2 px-3 py-2 bg-gold-600 text-white text-sm rounded-lg hover:bg-gold-700 disabled:opacity-50 transition-colors"
          >
                <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
} 