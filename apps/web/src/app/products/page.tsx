import React from 'react'
import { Button } from '@/components/ui/button'
import { getAllProducts, getProductsPage } from '@/lib/sanity.queries'

export default async function ProductsPage() {
  // Fetch data from Sanity
  const [products, productsPageData] = await Promise.all([
    getAllProducts(),
    getProductsPage()
  ])

  // Mock product data as fallback
  const fallbackProducts = [
    {
      _id: '1',
      title: 'Alpine Sneaker',
      type: 'sneaker',
      materials: '100% genuine leather',
      designedIn: 'Switzerland',
      madeIn: 'Turkey',
    },
    {
      _id: '2',
      title: 'Urban Backpack',
      type: 'bag',
      materials: '100% genuine leather',
      designedIn: 'Switzerland',
      madeIn: 'Turkey',
    },
    {
      _id: '3',
      title: 'Classic Cap',
      type: 'cap',
      materials: '100% genuine leather',
      designedIn: 'Switzerland',
      madeIn: 'Turkey',
    },
    {
      _id: '4',
      title: 'Mountain Boot',
      type: 'sneaker',
      materials: '100% genuine leather',
      designedIn: 'Switzerland',
      madeIn: 'Turkey',
    },
    {
      _id: '5',
      title: 'Travel Bag',
      type: 'bag',
      materials: '100% genuine leather',
      designedIn: 'Switzerland',
      madeIn: 'Turkey',
    },
    {
      _id: '6',
      title: 'Sport Cap',
      type: 'cap',
      materials: '100% genuine leather',
      designedIn: 'Switzerland',
      madeIn: 'Turkey',
    },
  ]

  const displayProducts = products?.length > 0 ? products : fallbackProducts
  const filterButtons = productsPageData?.filterButtons || [
    { label: 'All Products', value: 'all' },
    { label: 'Sneakers', value: 'sneaker' },
    { label: 'Bags', value: 'bag' },
    { label: 'Caps', value: 'cap' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-neutral-light py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
            {productsPageData?.heroTitle || 'Our Products'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {productsPageData?.heroSubtitle || 'Discover our collection of premium footwear and accessories, each piece designed in Switzerland and crafted with the finest materials.'}
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {filterButtons.map((button: any, index: number) => (
              <Button key={index} variant="outline" size="sm">
                {button.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.map((product: any) => (
              <div key={product._id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border">
                {/* Product Image Placeholder */}
                <div className="aspect-square bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-primary">
                      {product.title}
                    </h3>
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full capitalize">
                      {product.type}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {product.materials}
                  </p>
                  
                  <div className="space-y-1 text-sm text-gray-500 mb-4">
                    <p>Designed in {product.designedIn}</p>
                    <p>Made in {product.madeIn}</p>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-light py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">
            {productsPageData?.ctaSection?.title || "Can't find what you're looking for?"}
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            {productsPageData?.ctaSection?.description || "Get in touch with our team. We're always working on new designs and would love to hear from you."}
          </p>
          <Button variant="accent" size="lg">
            {productsPageData?.ctaSection?.buttonText || 'Contact Us'}
          </Button>
        </div>
      </section>
    </div>
  )
} 