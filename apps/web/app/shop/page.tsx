import { Button } from '@/components/ui/button'
import { getContactInfo } from '@/lib/sanity.queries'
import {
    ArrowRight,
    Clock,
    Heart,
    Mail,
    MapPin,
    Phone,
    Shield,
    ShoppingBag,
    Star,
    Zap
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Shop - Coming Soon | FitFoot',
  description: 'Our online shop is launching soon. Contact us directly for immediate purchasing options and early access.',
}

export default async function ShopPage() {
  // Fetch contact information from Sanity
  let contactInfo = null
  try {
    contactInfo = await getContactInfo()
  } catch (error) {
    console.error('Error fetching contact info:', error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gold-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,215,0,0.1)_0%,transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium border border-white/20">
              <Clock className="h-4 w-4 text-gold-400" />
              <span>Opening Soon</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Our Online Shop is
              <span className="block bg-gradient-to-r from-gold-400 to-gold-200 bg-clip-text text-transparent">
                Coming Soon
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We're crafting the perfect online shopping experience for you. 
              In the meantime, reach out directly for immediate purchasing options.
            </p>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              What's Coming
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our online shop will feature the same exceptional quality and service 
              you expect from FitFoot, with added convenience and exclusive online benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShoppingBag className="h-8 w-8" />,
                title: "Seamless Shopping",
                description: "Intuitive browsing, detailed product pages, and secure checkout"
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Fast Delivery",
                description: "Express shipping options and real-time tracking for your orders"
              },
              {
                icon: <Heart className="h-8 w-8" />,
                title: "Exclusive Benefits",
                description: "Early access to new products and member-only discounts"
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Quality Guarantee",
                description: "Our lifetime quality promise with easy returns and exchanges"
              },
              {
                icon: <Star className="h-8 w-8" />,
                title: "Personalized Experience",
                description: "Product recommendations based on your style and preferences"
              },
              {
                icon: <MapPin className="h-8 w-8" />,
                title: "Store Locator",
                description: "Find authorized retailers and schedule fitting appointments"
              }
            ].map((feature, index) => (
              <div key={index} className="group text-center space-y-4 p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold-100 to-gold-200 rounded-2xl text-gold-700 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Immediate Options */}
      <section className="py-24 bg-gradient-to-br from-gold-50 to-gold-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Can't Wait? We're Here to Help
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              While our online shop is in development, you can still get your hands on 
              our products through these immediate options.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contact Options */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Us Directly</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Call Us</p>
                      <a href="tel:+41123456789" className="text-blue-600 hover:text-blue-800">
                        +41 12 345 67 89
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email Us</p>
                      <a href="mailto:hello@fitfoot.ch" className="text-green-600 hover:text-green-800">
                        hello@fitfoot.ch
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center mt-1">
                      <MapPin className="h-5 w-5 text-gold-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Visit Our Showroom</p>
                      <p className="text-gray-600">Bahnhofstrasse 123<br />8001 Zürich, Switzerland</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-4">
                    Get personalized product recommendations, sizing advice, and immediate purchasing options.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="flex-1 bg-gold-600 hover:bg-gold-700 text-white">
                      <Phone className="mr-2 h-4 w-4" />
                      Call Now
                    </Button>
                    <Button variant="outline" className="flex-1 border-gold-600 text-gold-600 hover:bg-gold-50">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Early Access List</h3>
                <p className="text-gray-600 mb-6">
                  Be the first to know when our online shop launches. Plus, get exclusive 
                  early access and a special launch discount.
                </p>
                <div className="flex gap-3">
                  <Button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white">
                    Join Waitlist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 lg:p-12">
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg">
                    <ShoppingBag className="h-10 w-10 text-gold-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Shop Preview</h3>
                  <p className="text-gray-600">
                    Get a sneak peek at what our online shopping experience will look like. 
                    Browse our product catalog and learn about our craftsmanship.
                  </p>
                  <div className="space-y-3">
                    <Link href="/products">
                      <Button className="w-full bg-gold-600 hover:bg-gold-700 text-white">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Browse Products
                      </Button>
                    </Link>
                    <Link href="/about">
                      <Button variant="ghost" className="w-full text-gold-700 hover:bg-gold-50">
                        Learn About Our Craft
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Launch Timeline
          </h2>
          <div className="bg-gradient-to-r from-gold-100 to-gold-200 rounded-2xl p-8 lg:p-12">
            <div className="inline-flex items-center space-x-3 text-gold-800 mb-4">
              <Clock className="h-6 w-6" />
              <span className="text-lg font-semibold">Estimated Launch</span>
            </div>
            <p className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Q2 2025
            </p>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              We're taking the time to build something exceptional. Our online shop will 
              reflect the same attention to detail and quality that goes into every product we make.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gold-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(255,215,0,0.1)_0%,transparent_50%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">
            Don't Wait. 
            <span className="block bg-gradient-to-r from-gold-400 to-gold-200 bg-clip-text text-transparent">
              Start Your Journey Today.
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            While our online shop is being crafted, we're here to help you find 
            the perfect FitFoot products right now.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-gold-600 hover:bg-gold-700 text-white px-8 py-4 text-lg">
                Contact Us Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Explore Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 