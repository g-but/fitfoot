'use client'

// Badge component - using inline styling for now
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface ShoeProduct {
  id: string
  title: string
  brand: string
  size: string
  condition: 'new' | 'excellent' | 'very_good' | 'good' | 'fair'
  originalPrice: number
  currentPrice: number
  seller: {
    name: string
    rating: number
    verified: boolean
    totalSales: number
  }
  images: string[]
  likes: number
  isLiked: boolean
  sustainability: {
    carbonSaved: number
    refurbishmentLevel: 'none' | 'basic' | 'artisanal' | 'premium'
    ecoScore: number
  }
  tags: string[]
  timePosted: string
}

const sampleShoes: ShoeProduct[] = [
  {
    id: '1',
    title: 'Alpine Runner Pro',
    brand: 'FitFoot',
    size: '42 EU',
    condition: 'excellent',
    originalPrice: 299,
    currentPrice: 209,
    seller: {
      name: 'SwissShoeCollector',
      rating: 4.9,
      verified: true,
      totalSales: 156
    },
    images: ['/api/placeholder/300/300'],
    likes: 24,
    isLiked: false,
    sustainability: {
      carbonSaved: 6.8,
      refurbishmentLevel: 'artisanal',
      ecoScore: 95
    },
    tags: ['artisanal-refurb', 'premium', 'swiss-made'],
    timePosted: '2 hours ago'
  },
  {
    id: '2',
    title: 'Urban Explorer Sneakers',
    brand: 'EcoStep',
    size: '41 EU',
    condition: 'very_good',
    originalPrice: 449,
    currentPrice: 269,
    seller: {
      name: 'GreenStepZurich',
      rating: 4.8,
      verified: true,
      totalSales: 89
    },
    images: ['/api/placeholder/300/300'],
    likes: 18,
    isLiked: true,
    sustainability: {
      carbonSaved: 8.2,
      refurbishmentLevel: 'premium',
      ecoScore: 88
    },
    tags: ['premium-refurb', 'eco-friendly', 'trending'],
    timePosted: '5 hours ago'
  }
]

const _conditionColors = {
  new: 'bg-green-100 text-green-800',
  excellent: 'bg-blue-100 text-blue-800',
  very_good: 'bg-purple-100 text-purple-800',
  good: 'bg-yellow-100 text-yellow-800',
  fair: 'bg-orange-100 text-orange-800'
}

const _refurbishmentLevels = {
  none: { label: 'Original', icon: '👟', color: 'bg-gray-100 text-gray-600' },
  basic: { label: 'Basic Clean', icon: '✨', color: 'bg-blue-100 text-blue-600' },
  artisanal: { label: 'Artisanal Refurb', icon: '🎨', color: 'bg-purple-100 text-purple-600' },
  premium: { label: 'Premium Restore', icon: '💎', color: 'bg-gold-100 text-gold-600' }
}

export default function MarketplacePage() {
  const [_shoes, setShoes] = useState<ShoeProduct[]>(sampleShoes)
  const [_activeFilter, _setActiveFilter] = useState('all')
  const [_showFilters, _setShowFilters] = useState(false)
  const [_sortBy, _setSortBy] = useState('newest')

  const _toggleLike = (shoeId: string) => {
    setShoes(prev => prev.map(shoe => 
      shoe.id === shoeId 
        ? { ...shoe, isLiked: !shoe.isLiked, likes: shoe.isLiked ? shoe.likes - 1 : shoe.likes + 1 }
        : shoe
    ))
  }

  const _formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF'
    }).format(price)
  }

  const _getDiscountPercentage = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">FitFoot Marketplace - Poshmark for Shoes</h1>
        
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">🌱 Zero Waste Shoe Marketplace</h2>
          <p className="text-gray-600 mb-4">
            Buy and sell _shoes with our revolutionary artisanal refurbishment technology. 
            Every purchase saves the environment while giving _shoes a beautiful second life.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-medium text-green-800">🎨 Artisanal Refurbishment</h3>
              <p className="text-sm text-green-600">Professional restoration that enhances visual appeal</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-800">♻️ Environmental Impact</h3>
              <p className="text-sm text-blue-600">Track CO₂ savings and waste reduction</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-medium text-purple-800">🤝 Social Marketplace</h3>
              <p className="text-sm text-purple-600">Connect with eco-conscious shoe lovers</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              <span className="text-6xl">👟</span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-600">🎨 Artisanal Refurbished</span>
                <span className="text-sm text-green-600">6.8kg CO₂ saved</span>
              </div>
              <h3 className="font-semibold mb-1">Alpine Runner Pro</h3>
              <p className="text-sm text-gray-600 mb-2">Size 42 EU • Excellent condition</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-gray-900">CHF 209</span>
                  <span className="text-sm text-gray-500 line-through ml-2">CHF 299</span>
                </div>
                                 <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">30% off</span>
              </div>
              <Button className="w-full mt-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white">
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 