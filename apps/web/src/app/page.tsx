import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getHomePage, getAllProducts } from '@/lib/sanity.queries'

// Force dynamic rendering to prevent caching issues
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Fetch data from Sanity
  const [homePageData, products] = await Promise.all([
    getHomePage(),
    getAllProducts()
  ])

  // Use fetched data or fallback to defaults
  const heroTitle = homePageData?.heroTitle || "Step into quality.\nDesigned in Switzerland."
  const heroSubtitle = homePageData?.heroSubtitle || "Premium footwear and accessories crafted with genuine materials and Swiss precision."
  const featuredProducts = homePageData?.featuredProducts || products?.slice(0, 3) || []
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-neutral-light">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-primary max-w-[14ch] mx-auto leading-tight">
            {heroTitle.split('\n').map((line: string, index: number) => (
              <React.Fragment key={index}>
                {line}
                {index < heroTitle.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 mt-6 max-w-2xl mx-auto">
            {heroSubtitle}
          </p>
          <div className="mt-8 space-x-4">
            <Link href="/shop">
              <Button variant="accent" size="lg">
                Shop Collection
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

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-primary mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product: any) => (
                <div key={product._id} className="bg-neutral-light rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {product.materials || '100% genuine leather'}, designed in {product.designedIn || 'Switzerland'}
                    </p>
                    <Link href={`/products/${product.slug?.current || product._id}`}>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              // Fallback placeholder cards
              [1, 2, 3].map((item) => (
                <div key={item} className="bg-neutral-light rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      Premium Sneaker {item}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      100% genuine leather, designed in Switzerland
                    </p>
                    <Link href="/shop">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-6">
                {homePageData?.aboutSection?.title || 'Swiss Craftsmanship'}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {homePageData?.aboutSection?.description || 'Every Fitfoot product is designed with Swiss precision and crafted using only the finest materials. Our commitment to quality ensures that each piece not only looks exceptional but stands the test of time.'}
              </p>
              <ul className="space-y-3 text-gray-600">
                {homePageData?.aboutSection?.features && homePageData.aboutSection.features.length > 0 ? (
                  homePageData.aboutSection.features.map((feature, index: number) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                      {feature.text}
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                      100% genuine leather
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                      Designed in Switzerland
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                      Ethically made
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </section>
    </main>
  )
} 