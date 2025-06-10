import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getHomePage, getAllProducts } from '@/lib/sanity.queries'

// Force dynamic rendering to prevent caching issues
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Fetch data from Sanity with error handling
  let homePageData = null
  let products = null

  try {
    const [homePageResult, productsResult] = await Promise.allSettled([
      getHomePage(),
      getAllProducts()
    ])
    
    homePageData = homePageResult.status === 'fulfilled' ? homePageResult.value : null
    products = productsResult.status === 'fulfilled' ? productsResult.value : null
  } catch (error) {
    console.error('Error fetching page data:', error)
    // Continue with null values for fallback rendering
  }

  // Use fetched data or fallback to defaults
  const heroTitle = homePageData?.heroTitle || "Step into quality.\nDesigned in Switzerland."
  const heroSubtitle = homePageData?.heroSubtitle || "Premium footwear and accessories crafted with genuine materials and Swiss precision."
  const featuredProducts = homePageData?.featuredProducts || products?.slice(0, 3) || []
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center subtle-gradient">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/[0.01] to-primary/[0.03]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground max-w-4xl mx-auto leading-tight mb-6">
            {heroTitle.split('\n').map((line: string, index: number) => (
              <React.Fragment key={index}>
                {line}
                {index < heroTitle.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
            {heroSubtitle}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/shop">
              <Button variant="gold" size="lg" className="w-full sm:w-auto px-8 py-3">
                Shop Collection
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline-gold" size="lg" className="w-full sm:w-auto px-8 py-3">
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <div className="w-16 h-0.5 gold-gradient mx-auto rounded-full mb-4"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our carefully curated collection of premium Swiss-designed footwear and accessories
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product: any) => (
                <div key={product._id} className="group bg-card border border-border rounded-lg overflow-hidden luxury-shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-square bg-secondary/50 group-hover:bg-secondary/70 transition-colors duration-300"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                      {product.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {product.materials || '100% genuine leather'}, designed in {product.designedIn || 'Switzerland'}
                    </p>
                    <Link href={`/products/${product.slug?.current || product._id}`}>
                      <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary transition-colors duration-300">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              // Fallback placeholder cards
              [1, 2, 3].map((item) => (
                <div key={item} className="group bg-card border border-border rounded-lg overflow-hidden luxury-shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-square bg-secondary/50 group-hover:bg-secondary/70 transition-colors duration-300"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                      Premium Collection {item}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      100% genuine leather, designed in Switzerland with Swiss precision and craftsmanship
                    </p>
                    <Link href="/shop">
                      <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary transition-colors duration-300">
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
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {homePageData?.aboutSection?.title || 'Swiss Craftsmanship'}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {homePageData?.aboutSection?.description || 'Every Fitfoot product is designed with Swiss precision and crafted using only the finest materials. Our commitment to quality ensures that each piece not only looks exceptional but stands the test of time.'}
              </p>
              <ul className="space-y-4 text-lg text-muted-foreground">
                {homePageData?.aboutSection?.features && homePageData.aboutSection.features.length > 0 ? (
                  homePageData.aboutSection.features.map((feature, index: number) => (
                    <li key={index} className="flex items-center group">
                      <span className="w-2.5 h-2.5 bg-primary rounded-full mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"></span>
                      <span className="group-hover:text-foreground transition-colors duration-300">{feature.text}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-center group">
                      <span className="w-2.5 h-2.5 bg-primary rounded-full mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"></span>
                      <span className="group-hover:text-foreground transition-colors duration-300">100% genuine leather</span>
                    </li>
                    <li className="flex items-center group">
                      <span className="w-2.5 h-2.5 bg-primary rounded-full mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"></span>
                      <span className="group-hover:text-foreground transition-colors duration-300">Designed in Switzerland</span>
                    </li>
                    <li className="flex items-center group">
                      <span className="w-2.5 h-2.5 bg-primary rounded-full mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"></span>
                      <span className="group-hover:text-foreground transition-colors duration-300">Ethically made</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="aspect-square bg-secondary/30 border border-border rounded-lg luxury-shadow relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-primary/40">
                  <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 