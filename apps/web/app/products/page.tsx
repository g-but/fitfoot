import { Button } from '@/components/ui/button'
import { getProductsPage } from '@/lib/sanity.queries'
import {
    ArrowRight,
    Award,
    CheckCircle,
    Eye,
    Gem,
    Heart,
    Leaf,
    Play,
    Recycle,
    RotateCcw,
    Shield,
    Target,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react'

export const metadata = {
  title: 'Our Products - Quality That Lasts | FitFoot',
  description: 'Discover what makes FitFoot products exceptional. Premium craftsmanship, sustainable practices, and innovative design in every piece.',
}

export default async function ProductsPage() {
  // Fetch CMS data for customizable content
  let productsPageData = null
  try {
    productsPageData = await getProductsPage()
  } catch (error) {
    console.error('Error fetching products page data:', error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gold-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,215,0,0.1)_0%,transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium border border-white/20">
              <Gem className="h-4 w-4 text-gold-400" />
              <span>Crafted for Life</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              {productsPageData?.heroTitle || "Products Built to"} 
              <span className="block bg-gradient-to-r from-gold-400 to-gold-200 bg-clip-text text-transparent">
                {productsPageData?.heroSubline || "Last Forever"}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {productsPageData?.heroDescription || "Where precision meets purpose. Every product represents our commitment to exceptional quality and environmental responsibility."}
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: <Award className="h-8 w-8" />,
                title: "Premium Quality",
                description: "Materials and craftsmanship that stand the test of time"
              },
              {
                icon: <Leaf className="h-8 w-8" />,
                title: "Sustainable",
                description: "Zero waste commitment with our take-back program"
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Lifetime Value",
                description: "Built to last, designed to perform year after year"
              },
              {
                icon: <Heart className="h-8 w-8" />,
                title: "Thoughtfully Made",
                description: "Every detail considered for your comfort and style"
              }
            ].map((pillar, index) => (
              <div key={index} className="group text-center space-y-4 p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold-100 to-gold-200 rounded-2xl text-gold-700 group-hover:scale-110 transition-transform duration-300">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{pillar.title}</h3>
                <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              {productsPageData?.collectionsTitle || "Our Product Lines"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {productsPageData?.collectionsDescription || "Three collections, each designed with specific needs in mind, all sharing our commitment to quality and sustainability."}
            </p>
          </div>

          <div className="space-y-12">
            {/* Performance Collection */}
            <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
              <div className="p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                    <Zap className="h-4 w-4" />
                    <span>Performance Collection</span>
                  </div>
                  
                  <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    Built for Movement
                  </h3>
                  
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Advanced materials meet ergonomic design. Our performance line delivers 
                    exceptional support and durability for active lifestyles, whether you're 
                    running trails or navigating city streets.
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    {["Shock Absorption", "Breathable Design", "Lightweight"].map((feature) => (
                      <span key={feature} className="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{feature}</span>
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Button className="btn-gold group-hover:scale-105 transition-transform">
                      Explore Collection
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="ghost" className="group-hover:bg-gray-100">
                      <Play className="mr-2 h-4 w-4" />
                      Watch Craft
                    </Button>
                  </div>
                </div>
                
                <div className="relative h-80 lg:h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl overflow-hidden">
                  <div className="absolute inset-4 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-blue-600">
                    <Zap className="h-16 w-16" />
                  </div>
                </div>
              </div>
            </div>

            {/* Classic Collection */}
            <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
              <div className="p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="order-2 lg:order-1 relative h-80 lg:h-96 bg-gradient-to-br from-amber-100 to-gold-200 rounded-2xl overflow-hidden">
                  <div className="absolute inset-4 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-gold-700">
                    <Gem className="h-16 w-16" />
                  </div>
                </div>
                
                <div className="order-1 lg:order-2 space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-gold-100 text-gold-800 px-4 py-2 rounded-full text-sm font-medium">
                    <Gem className="h-4 w-4" />
                    <span>Classic Collection</span>
                  </div>
                  
                  <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    Timeless Elegance
                  </h3>
                  
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Refined craftsmanship with premium leather and traditional techniques. 
                    These pieces transcend trends, offering sophisticated style that only 
                    improves with time.
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    {["Premium Leather", "Hand-finished", "Classic Design"].map((feature) => (
                      <span key={feature} className="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{feature}</span>
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Button className="btn-gold group-hover:scale-105 transition-transform">
                      Explore Collection
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="ghost" className="group-hover:bg-gray-100">
                      <Play className="mr-2 h-4 w-4" />
                      Watch Craft
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Everyday Collection */}
            <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
              <div className="p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                    <Heart className="h-4 w-4" />
                    <span>Everyday Collection</span>
                  </div>
                  
                  <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    Daily Comfort
                  </h3>
                  
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Versatile designs that seamlessly transition from work to weekend. 
                    Comfortable enough for all-day wear, stylish enough for any occasion.
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    {["All-day Comfort", "Versatile Style", "Easy Care"].map((feature) => (
                      <span key={feature} className="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{feature}</span>
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Button className="btn-gold group-hover:scale-105 transition-transform">
                      Explore Collection
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="ghost" className="group-hover:bg-gray-100">
                      <Play className="mr-2 h-4 w-4" />
                      Watch Craft
                    </Button>
                  </div>
                </div>
                
                <div className="relative h-80 lg:h-96 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl overflow-hidden">
                  <div className="absolute inset-4 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-green-600">
                    <Heart className="h-16 w-16" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-24 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              <Leaf className="h-4 w-4" />
              <span>Zero Waste Commitment</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              {productsPageData?.sustainabilityTitle || "Don't Throw Away. Trade In."}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {productsPageData?.sustainabilityDescription || "Your old shoes have value. We believe in circular fashion and zero waste. Send us your worn footwear and we'll give you a discount on your next purchase."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  How Our Take-Back Program Works
                </h3>
                
                <ol className="space-y-4">
                  {[
                    {
                      step: "1",
                      title: "Send Us Your Old Shoes",
                      description: "Any brand, any condition. We'll cover shipping costs."
                    },
                    {
                      step: "2", 
                      title: "We Assess & Process",
                      description: "Repair what can be saved, recycle what cannot."
                    },
                    {
                      step: "3",
                      title: "You Get Your Discount",
                      description: "Receive 15-30% off your next FitFoot purchase."
                    },
                    {
                      step: "4",
                      title: "Impact Multiplied", 
                      description: "Your old shoes get new life or proper recycling."
                    }
                  ].map((item) => (
                    <li key={item.step} className="flex space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {item.step}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Environmental Impact</h4>
                    <p className="text-sm text-gray-600">Making a difference together</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">12k+</div>
                    <div className="text-xs text-gray-500">Shoes Reclaimed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">89%</div>
                    <div className="text-xs text-gray-500">Materials Recycled</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">5.2t</div>
                    <div className="text-xs text-gray-500">Waste Prevented</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-3xl p-8 lg:p-12">
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg">
                    <RotateCcw className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Ready to Trade In?</h3>
                  <p className="text-gray-600">
                    Start your sustainability journey today. Get your trade-in kit and 
                    discover how your old shoes can help you save on new ones.
                  </p>
                  <div className="space-y-3">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      <Recycle className="mr-2 h-4 w-4" />
                      Request Trade-In Kit
                    </Button>
                    <Button variant="ghost" className="w-full text-green-700 hover:bg-green-50">
                      Learn More About Our Process
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Process */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Our Quality Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From concept to creation, every step is carefully considered to ensure 
              the highest standards of quality and craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                icon: <Eye className="h-8 w-8" />,
                title: "Design",
                description: "User-centered design meets functional innovation"
              },
              {
                icon: <Target className="h-8 w-8" />,
                title: "Materials",
                description: "Carefully sourced premium materials that last"
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Craft",
                description: "Skilled artisans bring each design to life"
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Testing",
                description: "Rigorous quality control at every stage"
              },
              {
                icon: <CheckCircle className="h-8 w-8" />,
                title: "Delivery",
                description: "Packaged with care for the perfect unboxing"
              }
            ].map((step, index) => (
              <div key={index} className="group text-center space-y-4 p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300">
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold-100 to-gold-200 rounded-2xl text-gold-700 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  {index < 4 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-gold-200 to-transparent"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gold-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(255,215,0,0.1)_0%,transparent_50%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">
            {productsPageData?.ctaSection?.title || "Ready to Experience"} 
            <span className="block bg-gradient-to-r from-gold-400 to-gold-200 bg-clip-text text-transparent">
              {productsPageData?.ctaSection?.subline || "Lasting Quality?"}
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {productsPageData?.ctaSection?.description || "Discover footwear that's built to last, designed to perform, and created with respect for our planet. Your perfect pair is waiting."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gold-600 hover:bg-gold-700 text-white px-8 py-4 text-lg">
              Shop All Collections
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg">
              <Recycle className="mr-2 h-5 w-5" />
              Start Trade-In Program
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}