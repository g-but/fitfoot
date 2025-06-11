import { Button } from '@/components/ui/button'
import { getAllProducts, getHomePage } from '@/lib/sanity.queries'
import { ArrowRight, Award, CheckCircle, Leaf, Shield, Star } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

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
  const heroTitle = homePageData?.heroTitle || "Step into\nSwiss Excellence"
  const heroSubtitle = homePageData?.heroSubtitle || "Premium footwear and accessories designed in Switzerland, crafted with genuine materials and precision engineering."
  const featuredProducts = homePageData?.featuredProducts || products?.slice(0, 3) || []
  
  return (
    <div className="relative">
      {/* === HERO SECTION === */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with subtle gradient */}
        <div className="absolute inset-0 gradient-subtle"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto text-center">
            {/* Swiss Quality Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Swiss Craftsmanship Since 2024</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-hero font-heading text-foreground mb-6 animate-slide-up">
              {heroTitle.split('\n').map((line: string, index: number) => (
                <React.Fragment key={index}>
                  {index === 1 ? (
                    <span className="gradient-gold-text">{line}</span>
                  ) : (
                    line
                  )}
                  {index < heroTitle.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>
            
            {/* Subtitle */}
            <p className="text-large text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              {heroSubtitle}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-scale-in">
              <Link href="/products">
                <Button size="xl" className="btn-gold group">
                  Explore Collection
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="xl" className="btn-outline-gold">
                  Our Story
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground animate-fade-in">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>Premium Materials</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                <span>Swiss Design</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-primary" />
                <span>Sustainable Crafting</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === FEATURED PRODUCTS SECTION === */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-section font-heading text-foreground mb-6">
              Featured Collection
            </h2>
            <div className="w-20 h-1 gradient-gold mx-auto rounded-full mb-6"></div>
            <p className="text-large text-muted-foreground">
              Discover our carefully curated selection of premium Swiss-designed footwear and accessories
            </p>
          </div>
          
          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product: any, index) => (
                <div key={product._id} className="card-luxury hover-lift group">
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
                        {index === 0 && "👟"}
                        {index === 1 && "🎒"}
                        {index === 2 && "🧢"}
                      </div>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-heading text-foreground group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                        {product.type || 'Premium'}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {product.materials || '100% genuine leather'}, designed in {product.designedIn || 'Switzerland'}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span>Swiss Design</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span>Premium Quality</span>
                      </div>
                    </div>
                    
                    <Link href={`/products/${product.slug?.current || product._id}`}>
                      <Button className="w-full btn-outline-gold group">
                        View Details
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              // Fallback placeholder cards with premium design
              [
                { title: "Alpine Sneaker", type: "Footwear", icon: "👟" },
                { title: "Swiss Leather Bag", type: "Accessory", icon: "🎒" },
                { title: "Premium Cap", type: "Accessory", icon: "🧢" }
              ].map((item, index) => (
                <div key={index} className="card-luxury hover-lift group">
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
                        {item.icon}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-heading text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                        {item.type}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      100% genuine leather, designed in Switzerland with Swiss precision and artisan craftsmanship
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span>Swiss Design</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span>Premium Quality</span>
                      </div>
                    </div>
                    
                    <Link href="/products">
                      <Button className="w-full btn-outline-gold group">
                        View Details
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* === BRAND VALUES SECTION === */}
      <section className="py-24 gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Content */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-section font-heading text-foreground mb-6">
                    {homePageData?.aboutSection?.title || 'Swiss Craftsmanship'}
                    <span className="gradient-gold-text block">Excellence</span>
                  </h2>
                  <p className="text-large text-muted-foreground leading-relaxed">
                    {homePageData?.aboutSection?.description || 'Every product is designed with precision, crafted with care, and built to last generations.'}
                  </p>
                </div>
                
                {/* Features List */}
                <div className="space-y-6">
                  {homePageData?.aboutSection?.features && homePageData.aboutSection.features.length > 0 ? (
                    homePageData.aboutSection.features.map((feature, index: number) => (
                      <div key={index} className="flex items-start gap-4 group">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <CheckCircle className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">{feature.text}</h4>
                          <p className="text-muted-foreground">Premium quality and attention to detail</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    [
                      { title: "Premium Materials", desc: "Only the finest genuine leather and sustainable materials" },
                      { title: "Swiss Design", desc: "Minimalist aesthetics with functional precision" },
                      { title: "Artisan Crafted", desc: "Handcrafted by skilled artisans with generations of expertise" },
                      { title: "Sustainable Future", desc: "Environmentally conscious production and materials" }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start gap-4 group"  >
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <CheckCircle className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                          <p className="text-muted-foreground">{feature.desc}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* CTA */}
                <div className="pt-4">
                  <Link href="/about">
                    <Button className="btn-outline-gold">
                      Learn More About Us
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Visual */}
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/15 rounded-2xl shadow-luxury relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/10 to-primary/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-primary/30">
                      <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section className="py-24 bg-foreground text-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent transform -skew-y-12"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-section font-heading text-background mb-6">
              Ready to Experience
              <span className="gradient-gold-text block">Swiss Quality?</span>
            </h2>
            <p className="text-large text-background/80 mb-12 leading-relaxed">
              Join thousands of customers who trust Fitfoot for premium footwear and accessories that combine Swiss design with exceptional craftsmanship.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/shop">
                <Button size="xl" className="btn-gold">
                  Shop Collection
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="xl" className="border-background/30 text-background hover:bg-background hover:text-foreground">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 