import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FitFoot - Sustainable Footwear That Feels Good | Swiss Quality',
  description: 'Step into sustainability with premium Swiss footwear. Choose new eco-friendly shoes or expertly refurbished favorites. Every step makes a difference.',
}

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section - Emotional Connection */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden safe-area-top">
        <div className="absolute inset-0 gradient-subtle"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-20 sm:px-6">
          <div className="max-w-6xl mx-auto text-center">
            {/* Emotional Hook */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-50 border border-gold-200 mb-8 animate-fade-in touch-target">
              <div className="w-2 h-2 bg-gold-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gold-700">Join 2,847 people walking sustainably</span>
            </div>

            {/* Hero Title - Benefit-Focused */}
            <h1 className="text-hero sm:text-6xl lg:text-7xl font-heading text-foreground mb-6 animate-slide-up leading-tight">
              Every step feels good.<br className="hidden sm:block" />
              <span className="gradient-gold-text block mt-2 pb-2">Inside and out.</span>
            </h1>

            {/* Value Proposition - Clear & Compelling */}
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up px-4 sm:px-0">
              Premium Swiss footwear that's kind to your feet and the planet. Choose from brand new eco-friendly designs or expertly refurbished favorites.
            </p>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-2 mb-12 animate-fade-in">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-white"></div>
              </div>
              <div className="flex items-center gap-1 ml-3">
                <div className="flex text-gold-400">
                  {'★'.repeat(5)}
                </div>
                <span className="text-sm text-muted-foreground ml-2">4.9/5 from 847 reviews</span>
              </div>
            </div>

            {/* Primary CTA - Action-Oriented */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16 animate-scale-in px-4 sm:px-0">
              <a href="/shop" className="w-full sm:w-auto">
                <button className="native-button haptic-medium w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-foreground text-background hover:bg-foreground/90 h-14 sm:h-12 rounded-xl px-8 sm:px-10 text-base group touch-target shadow-lg hover:shadow-xl">
                  Find Your Perfect Fit
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </a>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <button className="native-button haptic-light w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-14 sm:h-12 rounded-xl px-8 sm:px-10 text-base touch-target">
                  How It Works
                </button>
              </a>
            </div>

            {/* Trust Indicators - Benefit-Focused */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-6 sm:gap-8 text-sm text-muted-foreground animate-fade-in px-4 sm:px-0">
              <div className="flex items-center gap-2 touch-target">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-truck w-4 h-4 text-gold-600">
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
                  <path d="M15 18H9"></path>
                  <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path>
                  <circle cx="17" cy="18" r="2"></circle>
                  <circle cx="7" cy="18" r="2"></circle>
                </svg>
                <span>Free shipping over CHF 100</span>
              </div>
              <div className="flex items-center gap-2 touch-target">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check w-4 h-4 text-gold-600">
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
                <span>30-day guarantee</span>
              </div>
              <div className="flex items-center gap-2 touch-target">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf w-4 h-4 text-gold-600">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                </svg>
                <span>Carbon neutral delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Building Trust */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-foreground mb-6">Two paths, one mission</h2>
            <div className="w-20 h-1 gradient-gold mx-auto rounded-full mb-6"></div>
            <p className="text-lg sm:text-xl text-muted-foreground px-4 sm:px-0">
              Whether you choose new or refurbished, every pair helps create a more sustainable future
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* New Eco-Friendly Path */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gold-100 rounded-2xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-8 h-8 text-gold-600">
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                  <path d="M20 3v4"></path>
                  <path d="M22 5h-4"></path>
                  <path d="M4 17v2"></path>
                  <path d="M5 18H3"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-heading text-foreground mb-4">Brand New & Eco-Friendly</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Fresh designs crafted with sustainable materials. Recycled plastics, organic cotton, and responsibly sourced leather.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Latest sustainable materials</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Carbon-neutral production</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Full warranty included</span>
                </div>
              </div>
              <a href="/shop?type=new" className="block">
                <button className="w-full btn-gold h-12 rounded-xl font-medium transition-colors">
                  Shop New Collection
                </button>
              </a>
            </div>

            {/* Refurbished Path */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-recycle w-8 h-8 text-gray-600">
                  <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"></path>
                  <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"></path>
                  <path d="m14 16-3 3 3 3"></path>
                  <path d="M8.293 13.596 7.196 9.5 3.1 10.598"></path>
                  <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"></path>
                  <path d="m13.378 9.633 4.096 1.098 1.097-4.096"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-heading text-foreground mb-4">Expertly Refurbished</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Premium shoes given new life by our craftspeople. Same quality, bigger impact, better price.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Up to 60% off original price</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">95% less environmental impact</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Quality guarantee included</span>
                </div>
              </div>
              <a href="/shop?type=refurbished" className="block">
                <button className="w-full bg-gray-800 text-white hover:bg-gray-900 h-12 rounded-xl font-medium transition-colors">
                  Shop Refurbished
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection Section - Mobile Enhanced */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-foreground mb-6">Customer favorites</h2>
            <div className="w-20 h-1 gradient-gold mx-auto rounded-full mb-6"></div>
            <p className="text-lg sm:text-xl text-muted-foreground px-4 sm:px-0">
              The shoes our community loves most, chosen for comfort, style, and impact
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {/* Product 1 - Best Seller */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-gold-50 to-gold-100 rounded-xl mb-6 relative overflow-hidden">
                  <div className="absolute top-3 left-3 bg-gold-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Best Seller
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-30 group-hover:scale-110 transition-transform">👟</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-heading text-foreground">Eco Trail Runner</h3>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gold-600">CHF 179</div>
                      <div className="text-sm text-gray-500 line-through">CHF 249</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-gold-400 text-sm">
                      {'★'.repeat(5)}
                    </div>
                    <span className="text-sm text-muted-foreground">(127 reviews)</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Recycled materials meet premium comfort. Perfect for daily runs and weekend adventures.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gold-600 bg-gold-50 px-3 py-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf">
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                    </svg>
                    <span>Saves 12kg CO₂ vs new production</span>
                  </div>
                  <a href="/shop" className="block">
                    <button className="w-full btn-gold h-12 rounded-xl font-medium transition-colors group">
                      Add to Cart
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Product 2 - New Arrival */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-6 relative overflow-hidden">
                  <div className="absolute top-3 left-3 bg-foreground text-white text-xs px-2 py-1 rounded-full font-medium">
                    New
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-30 group-hover:scale-110 transition-transform">👞</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-heading text-foreground">Urban Sneaker</h3>
                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">CHF 139</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-gold-400 text-sm">
                      {'★'.repeat(4)}{'☆'}
                    </div>
                    <span className="text-sm text-muted-foreground">(89 reviews)</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Fresh design with organic cotton lining and recycled rubber sole. City-ready style.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gold-600 bg-gold-50 px-3 py-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles">
                      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                    </svg>
                    <span>Made with 70% recycled materials</span>
                  </div>
                  <a href="/shop" className="block">
                    <button className="w-full bg-foreground text-background hover:bg-foreground/90 h-12 rounded-xl font-medium transition-colors">
                      Add to Cart
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Product 3 - Great Deal */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 sm:col-span-2 lg:col-span-1">
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-6 relative overflow-hidden">
                  <div className="absolute top-3 left-3 bg-gray-800 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Great Deal
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-30 group-hover:scale-110 transition-transform">🥾</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-heading text-foreground">Refurb Hiking Boot</h3>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">CHF 89</div>
                      <div className="text-sm text-gray-500 line-through">CHF 219</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-gold-400 text-sm">
                      {'★'.repeat(5)}
                    </div>
                    <span className="text-sm text-muted-foreground">(203 reviews)</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Premium hiking boot expertly restored. Waterproof, durable, and ready for adventure.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-recycle">
                      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"></path>
                      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"></path>
                      <path d="m14 16-3 3 3 3"></path>
                      <path d="M8.293 13.596 7.196 9.5 3.1 10.598"></path>
                      <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"></path>
                      <path d="m13.378 9.633 4.096 1.098 1.097-4.096"></path>
                    </svg>
                    <span>95% less environmental impact</span>
                  </div>
                  <a href="/shop" className="block">
                    <button className="w-full bg-gray-800 text-white hover:bg-gray-900 h-12 rounded-xl font-medium transition-colors">
                      Add to Cart
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* View All CTA */}
          <div className="text-center mt-12">
            <a href="/shop" className="inline-block">
              <button className="bg-foreground text-background hover:bg-foreground/90 px-8 py-4 rounded-xl font-medium transition-colors">
                View All Products
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Impact Section - Emotional Connection */}
      <section className="py-16 sm:py-24 bg-gold-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-foreground mb-6">Your impact so far</h2>
            <div className="w-20 h-1 gradient-gold mx-auto rounded-full mb-12"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-gold-600 mb-2">2,847</div>
                <div className="text-muted-foreground">Pairs saved from waste</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-gold-600 mb-2">34,164</div>
                <div className="text-muted-foreground">kg CO₂ prevented</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-gold-600 mb-2">127,892</div>
                <div className="text-muted-foreground">Liters water saved</div>
              </div>
            </div>

            <p className="text-lg text-muted-foreground mb-8">
              Every pair you choose makes a difference. Join our community of conscious consumers creating positive change.
            </p>

            <a href="/shop" className="inline-block">
              <button className="btn-gold px-8 py-4 rounded-xl font-medium transition-colors">
                Start Your Impact
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA - Urgency & Scarcity */}
      <section className="py-16 sm:py-24 bg-foreground text-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading mb-6">Ready to step forward?</h2>
            <p className="text-lg sm:text-xl text-background/80 mb-8 max-w-2xl mx-auto">
              Join thousands who've already made the switch to sustainable footwear. Your perfect pair is waiting.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a href="/shop" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-white text-foreground hover:bg-gray-100 px-8 py-4 rounded-xl font-medium transition-colors">
                  Shop Now
                </button>
              </a>
              <a href="/about" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto border border-background/20 text-background hover:bg-background/10 px-8 py-4 rounded-xl font-medium transition-colors">
                  Learn More
                </button>
              </a>
            </div>

            <div className="flex items-center justify-center gap-4 text-sm text-background/60">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check">
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
                <span>30-day guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-truck">
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
                  <path d="M15 18H9"></path>
                  <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path>
                  <circle cx="17" cy="18" r="2"></circle>
                  <circle cx="7" cy="18" r="2"></circle>
                </svg>
                <span>Free shipping over CHF 100</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 