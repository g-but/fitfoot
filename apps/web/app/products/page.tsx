import { Button } from '@/components/ui/button'
import { urlFor } from '@/lib/sanity.client'
import { getAllProducts, getProductsPage } from '@/lib/sanity.queries'
import type { Product } from '@/lib/types'
import {
    ArrowRight,
    CheckCircle,
    Eye,
    Heart,
    Star
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Our Products - Quality That Lasts | FitFoot',
  description: 'Discover our collection of premium Swiss-designed footwear and accessories. Quality craftsmanship, sustainable materials.',
}

export default async function ProductsPage() {
  // Fetch data from Sanity with error handling
  let products: Product[] = []
  let productsPageData = null

  try {
    const [productsResult, pageDataResult] = await Promise.allSettled([
      getAllProducts(),
      getProductsPage()
    ])
    
    products = productsResult.status === 'fulfilled' ? productsResult.value || [] : []
    productsPageData = pageDataResult.status === 'fulfilled' ? pageDataResult.value : null
  } catch (error) {
    console.error('Error fetching products data:', error)
  }

  // Use Sanity data or fallbacks
  const pageTitle = productsPageData?.heroTitle || "Our Products"
  const pageSubtitle = productsPageData?.heroSubtitle || "Discover our collection of premium Swiss-designed footwear and accessories"

  // Group products by type
  const productsByType = products.reduce((acc: Record<string, Product[]>, product: Product) => {
    const type = product.type || 'other'
    if (!acc[type]) acc[type] = []
    acc[type].push(product)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,215,0,0.1)_0%,transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium border border-white/20">
              <Star className="h-4 w-4 text-gold-400" />
              <span>Swiss Craftsmanship</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              {pageTitle}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {pageSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length > 0 ? (
            <div className="space-y-16">
              {Object.entries(productsByType).map(([type, typeProducts]) => (
                <div key={type}>
                  <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 capitalize">
                      {type}s
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto rounded-full"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(typeProducts as Product[]).map((product) => (
                      <div key={product._id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                        {/* Product Image */}
                        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                          {product.heroImage ? (
                            <Image
                              src={urlFor(product.heroImage).width(400).height(400).url()}
                              alt={product.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                              <div className="text-6xl opacity-30">
                                {type === 'sneaker' && "👟"}
                                {type === 'bag' && "🎒"} 
                                {type === 'cap' && "🧢"}
                                {!['sneaker', 'bag', 'cap'].includes(type) && "📦"}
                              </div>
                            </div>
                          )}
                          
                          {/* Hover Actions */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex space-x-3">
                              <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              <Button size="sm" variant="outline" className="bg-white/90 border-white hover:bg-white">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Product Info */}
                        <div className="p-6 space-y-4">
                          <div className="flex items-start justify-between">
                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gold-600 transition-colors">
                              {product.title}
                            </h3>
                            <span className="text-xs bg-gold-100 text-gold-800 px-2 py-1 rounded-full font-medium capitalize">
                              {product.type}
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>{product.materials || '100% genuine leather'}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Designed in {product.designedIn || 'Switzerland'}</span>
                              <span>•</span>
                              <span>Made in {product.madeIn || 'Turkey'}</span>
                            </div>
                          </div>
                          
                          <Link href={`/products/${product.slug?.current || product._id}`}>
                            <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white group">
                              View Details
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Fallback when no products in Sanity
            <div className="text-center py-20">
              <div className="max-w-md mx-auto space-y-6">
                <div className="text-6xl mb-6">📦</div>
                <h3 className="text-2xl font-semibold text-gray-900">No Products Yet</h3>
                <p className="text-gray-600">
                  Products will appear here once you add them to your Sanity Studio.
                </p>
                <Button asChild className="bg-gold-600 hover:bg-gold-700">
                  <a href="http://localhost:3333" target="_blank" rel="noopener noreferrer">
                    Open Sanity Studio
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-gold-50 to-gold-100">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Crafted for Life
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Every piece is designed to last. Swiss precision meets premium materials 
            in products that get better with time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
              View All Products
            </Button>
            <Button size="lg" variant="outline" className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white">
              Our Story
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}