'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getProducts, getCollections, MedusaProduct, MedusaCollection } from '@/lib/medusa.client'

export default function ShopPage() {
  const [products, setProducts] = useState<MedusaProduct[]>([])
  const [collections, setCollections] = useState<MedusaCollection[]>([])
  const [selectedCollection, setSelectedCollection] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock products as fallback when Medusa is not available
  const mockProducts: MedusaProduct[] = [
    {
      id: 'mock-1',
      title: 'Alpine Sneaker',
      description: 'Premium leather sneakers designed in Switzerland',
      handle: 'alpine-sneaker',
      status: 'published',
      images: [{ id: 'img-1', url: '/placeholder-product.jpg' }],
      variants: [{
        id: 'var-1',
        title: 'Default',
        prices: [{ amount: 24900, currency_code: 'CHF' }]
      }],
      tags: [{ id: 'tag-1', value: 'sneakers' }]
    },
    {
      id: 'mock-2',
      title: 'Urban Backpack',
      description: 'Handcrafted leather backpack for city adventures',
      handle: 'urban-backpack',
      status: 'published',
      images: [{ id: 'img-2', url: '/placeholder-product.jpg' }],
      variants: [{
        id: 'var-2',
        title: 'Default',
        prices: [{ amount: 34900, currency_code: 'CHF' }]
      }],
      tags: [{ id: 'tag-2', value: 'bags' }]
    },
    {
      id: 'mock-3',
      title: 'Classic Cap',
      description: 'Timeless leather cap with Swiss craftsmanship',
      handle: 'classic-cap',
      status: 'published',
      images: [{ id: 'img-3', url: '/placeholder-product.jpg' }],
      variants: [{
        id: 'var-3',
        title: 'Default',
        prices: [{ amount: 8900, currency_code: 'CHF' }]
      }],
      tags: [{ id: 'tag-3', value: 'caps' }]
    },
    {
      id: 'mock-4',
      title: 'Mountain Boot',
      description: 'Durable boots for outdoor adventures',
      handle: 'mountain-boot',
      status: 'published',
      images: [{ id: 'img-4', url: '/placeholder-product.jpg' }],
      variants: [{
        id: 'var-4',
        title: 'Default',
        prices: [{ amount: 39900, currency_code: 'CHF' }]
      }],
      tags: [{ id: 'tag-4', value: 'sneakers' }]
    },
    {
      id: 'mock-5',
      title: 'Travel Bag',
      description: 'Spacious travel bag for weekend getaways',
      handle: 'travel-bag',
      status: 'published',
      images: [{ id: 'img-5', url: '/placeholder-product.jpg' }],
      variants: [{
        id: 'var-5',
        title: 'Default',
        prices: [{ amount: 45900, currency_code: 'CHF' }]
      }],
      tags: [{ id: 'tag-5', value: 'bags' }]
    },
    {
      id: 'mock-6',
      title: 'Sport Cap',
      description: 'Athletic cap for active lifestyles',
      handle: 'sport-cap',
      status: 'published',
      images: [{ id: 'img-6', url: '/placeholder-product.jpg' }],
      variants: [{
        id: 'var-6',
        title: 'Default',
        prices: [{ amount: 9900, currency_code: 'CHF' }]
      }],
      tags: [{ id: 'tag-6', value: 'caps' }]
    }
  ]

  const mockCollections: MedusaCollection[] = [
    { id: 'all', title: 'All Products', handle: 'all' },
    { id: 'sneakers', title: 'Sneakers', handle: 'sneakers' },
    { id: 'bags', title: 'Bags', handle: 'bags' },
    { id: 'caps', title: 'Caps', handle: 'caps' }
  ]

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Try to fetch from Medusa
        const [medusaProducts, medusaCollections] = await Promise.all([
          getProducts({ limit: 50 }),
          getCollections()
        ])

        if (medusaProducts.length > 0) {
          setProducts(medusaProducts)
          setCollections([{ id: 'all', title: 'All Products', handle: 'all' }, ...medusaCollections])
        } else {
          // Fallback to mock data
          setProducts(mockProducts)
          setCollections(mockCollections)
        }
      } catch (err) {
        console.error('Error fetching shop data:', err)
        // Use mock data as fallback
        setProducts(mockProducts)
        setCollections(mockCollections)
        setError('Using demo products. Connect to Medusa for live inventory.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProducts = selectedCollection === 'all' 
    ? products 
    : products.filter(product => 
        product.tags?.some(tag => tag.value === selectedCollection) ||
        product.collection?.handle === selectedCollection
      )

  const formatPrice = (amount: number, currency: string = 'CHF') => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-neutral-light py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
            Shop Collection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our premium collection of Swiss-designed footwear and accessories. 
            Each piece is crafted with the finest materials and attention to detail.
          </p>
          {error && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md max-w-md mx-auto">
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {collections.map((collection) => (
              <Button
                key={collection.id}
                variant={selectedCollection === collection.handle ? "accent" : "outline"}
                size="sm"
                onClick={() => setSelectedCollection(collection.handle)}
              >
                {collection.title}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found in this category.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSelectedCollection('all')}
              >
                View All Products
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow border">
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-200 relative overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzE2MS4zIDEwMCAxMzAgMTMxLjMgMTMwIDE3MFMxNjEuMyAyNDAgMjAwIDI0MFMyNzAgMjA4LjcgMjcwIDE3MFMyMzguNyAxMDAgMjAwIDEwMFpNMjAwIDIxMEMxNzcuOSAyMTAgMTYwIDE5Mi4xIDE2MCAxNzBTMTc3LjkgMTMwIDIwMCAxMzBTMjQwIDE0Ny45IDI0MCAxNzBTMjIyLjEgMjEwIDIwMCAyMTBaIiBmaWxsPSIjOUI5QjlCIi8+CjxwYXRoIGQ9Ik0zMjAgMjgwSDgwQzY2LjcgMjgwIDU2IDI5MC43IDU2IDMwNFMzMzMuMyAzMjggMzQ2LjcgMzI4SDMyMEMzMzMuMyAzMjggMzQ0IDMxNy4zIDM0NCAzMDRTMzMzLjMgMjgwIDMyMCAyODBaIiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPgo='
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-primary mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                      {product.description || 'Premium quality, designed in Switzerland'}
                    </p>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {product.variants && product.variants.length > 0 && product.variants[0].prices.length > 0
                          ? formatPrice(product.variants[0].prices[0].amount, product.variants[0].prices[0].currency_code)
                          : 'CHF 99.00'
                        }
                      </span>
                      {product.tags && product.tags.length > 0 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {product.tags[0].value}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Link href={`/shop/products/${product.handle}`} className="block">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      <Button variant="accent" className="w-full">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-light py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Need Help Finding the Perfect Product?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our team is here to help you find exactly what you're looking for. 
            Get in touch for personalized recommendations.
          </p>
          <div className="space-x-4">
            <Link href="/contact">
              <Button variant="accent" size="lg">
                Contact Us
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 