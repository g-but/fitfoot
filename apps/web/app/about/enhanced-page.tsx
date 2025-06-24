'use client'

import { Button } from '@/components/ui/button'
import {
    Award,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Factory,
    Globe,
    Handshake,
    Heart,
    Paintbrush2,
    Recycle,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Users
} from 'lucide-react'
import { useState } from 'react'

const sdgGoals = [
  {
    number: 12,
    title: "Responsible Consumption and Production",
    description: "Our artisanal refurbishment reduces shoe waste by 85%, extending product lifecycles significantly.",
    icon: <Recycle className="w-6 h-6" />,
    color: "bg-yellow-500",
    metrics: ["2,847 kg waste diverted", "1,234 shoes refurbished", "85% material recovery rate"]
  },
  {
    number: 13,
    title: "Climate Action", 
    description: "Each refurbished shoe saves 6.8kg CO₂ compared to manufacturing new ones.",
    icon: <Globe className="w-6 h-6" />,
    color: "bg-green-600",
    metrics: ["45.6 tons CO₂ saved annually", "Carbon neutral shipping", "100% renewable energy"]
  },
  {
    number: 8,
    title: "Decent Work and Economic Growth",
    description: "Supporting artisan cobblers and creating sustainable employment in shoe restoration.",
    icon: <Users className="w-6 h-6" />,
    color: "bg-red-500",
    metrics: ["156 artisan partners", "Fair wage guarantee", "Skills development programs"]
  },
  {
    number: 11,
    title: "Sustainable Cities and Communities",
    description: "Local refurbishment hubs in Swiss cities, reducing transportation emissions.",
    icon: <Factory className="w-6 h-6" />,
    color: "bg-orange-500",
    metrics: ["8 Swiss refurbishment hubs", "Local sourcing priority", "Community workshops"]
  }
]

const refurbishmentProcess = [
  {
    step: "Assessment",
    icon: <CheckCircle className="w-8 h-8" />,
    description: "Expert evaluation of shoe condition, materials, and restoration potential",
    techniques: ["Digital condition scanning", "Material composition analysis", "Durability testing"],
    color: "bg-blue-50 border-blue-200"
  },
  {
    step: "Cleaning & Repair",
    icon: <Sparkles className="w-8 h-8" />,
    description: "Deep cleaning with eco-friendly solutions and precision repair work",
    techniques: ["Ultrasonic cleaning", "Leather conditioning", "Sole restoration", "Hardware replacement"],
    color: "bg-green-50 border-green-200"
  },
  {
    step: "Artisanal Enhancement",
    icon: <Paintbrush2 className="w-8 h-8" />,
    description: "Master craftspeople enhance visual appeal while preserving authenticity",
    techniques: ["Color restoration", "Texture enhancement", "Custom detailing", "Protective coating"],
    color: "bg-purple-50 border-purple-200"
  },
  {
    step: "Quality Assurance",
    icon: <ShieldCheck className="w-8 h-8" />,
    description: "Rigorous testing ensures restored shoes meet new-shoe standards",
    techniques: ["Stress testing", "Waterproofing verification", "Comfort assessment", "Durability certification"],
    color: "bg-amber-50 border-amber-200"
  }
]

export default function EnhancedAboutPage() {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const [activeProcessStep, setActiveProcessStep] = useState<number | null>(null)

  const toggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gold-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,215,0,0.1)_0%,transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Revolutionizing Shoe Sustainability
              <span className="block bg-gradient-to-r from-gold-400 to-gold-200 bg-clip-text text-transparent">
                Through Artisanal Mastery
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              FitFoot combines the convenience of Poshmark with revolutionary artisanal refurbishment technology, 
              creating the world's first marketplace dedicated exclusively to sustainable shoe commerce.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white">
                <Sparkles className="w-5 h-5 mr-2" />
                See Our Process
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                <Globe className="w-5 h-5 mr-2" />
                UN SDG Impact
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Shoes vs Clothes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Shoes Need Special Attention
            </h2>
            <p className="text-xl text-gray-600">
              While used clothing has found success in resale markets, shoes face unique challenges that require 
              specialized solutions and artisanal expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                <h3 className="text-xl font-semibold text-red-900 mb-3 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3 text-red-600" />
                  Environmental Impact Crisis
                </h3>
                <p className="text-red-800 mb-4">
                  Shoe waste is significantly more harmful than clothing waste due to synthetic materials, 
                  rubber soles, and complex construction that takes 30-40 years to decompose.
                </p>
                <ul className="space-y-2 text-red-700">
                  <li>• 300 million pairs of shoes discarded annually in Europe</li>
                  <li>• 12.5kg CO₂ per new shoe pair production</li>
                  <li>• 95% of discarded shoes end up in landfills</li>
                </ul>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                <h3 className="text-xl font-semibold text-orange-900 mb-3 flex items-center">
                  <Heart className="w-6 h-6 mr-3 text-orange-600" />
                  Consumer Perception Challenge
                </h3>
                <p className="text-orange-800">
                  Unlike clothing, used shoes face hygiene concerns and fit anxieties. Our artisanal process 
                  addresses these concerns through professional sanitization and comfort restoration.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 border border-green-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Sparkles className="w-8 h-8 mr-3 text-gold-600" />
                Our Solution
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Artisanal Refurbishment</h4>
                    <p className="text-gray-600">Master craftspeople restore shoes to like-new condition</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Hygiene Guarantee</h4>
                    <p className="text-gray-600">Professional sanitization exceeds new-shoe standards</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Visual Enhancement</h4>
                    <p className="text-gray-600">Often more beautiful than original condition</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artisanal Refurbishment Process */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Artisanal Refurbishment Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each shoe undergoes a meticulous transformation by master craftspeople using traditional 
              techniques enhanced with modern technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {refurbishmentProcess.map((process, index) => (
              <div 
                key={index}
                className={`${process.color} rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${
                  activeProcessStep === index ? 'ring-4 ring-gold-300' : ''
                }`}
                onClick={() => setActiveProcessStep(activeProcessStep === index ? null : index)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-gray-800">{process.icon}</div>
                  <span className="text-sm font-semibold text-gray-600">Step {index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{process.step}</h3>
                <p className="text-gray-700 mb-4">{process.description}</p>
                
                {activeProcessStep === index && (
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <h4 className="font-semibold text-gray-900 mb-2">Techniques Used:</h4>
                    <ul className="space-y-1">
                      {process.techniques.map((technique, techIndex) => (
                        <li key={techIndex} className="text-sm text-gray-700 flex items-center">
                          <CheckCircle className="w-3 h-3 mr-2 text-green-600" />
                          {technique}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UN SDG Integration with Modern Dropdowns */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Aligned with UN Sustainable Development Goals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              FitFoot directly contributes to multiple UN SDGs through our innovative approach to 
              sustainable shoe commerce and artisanal refurbishment.
            </p>
          </div>

          <div className="space-y-4">
            {sdgGoals.map((goal, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleDropdown(index)}
                  className="w-full px-6 py-6 flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`${goal.color} rounded-full p-3 text-white`}>
                      {goal.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-gray-900">
                        SDG {goal.number}: {goal.title}
                      </h3>
                      <p className="text-gray-600">{goal.description}</p>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    {openDropdown === index ? (
                      <ChevronUp className="w-6 h-6" />
                    ) : (
                      <ChevronDown className="w-6 h-6" />
                    )}
                  </div>
                </button>

                {openDropdown === index && (
                  <div className="px-6 pb-6 bg-white border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      {goal.metrics.map((metric, metricIndex) => (
                        <div key={metricIndex} className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-gray-900 mb-1">
                            {metric.split(' ')[0]} {metric.split(' ')[1]}
                          </div>
                          <div className="text-sm text-gray-600">
                            {metric.split(' ').slice(2).join(' ')}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Our Impact:</h4>
                      <p className="text-gray-700">
                        Through our marketplace and refurbishment technology, we're creating measurable 
                        progress toward achieving this UN Sustainable Development Goal, with transparent 
                        reporting and continuous improvement.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Poshmark Inspiration */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Inspired by Poshmark, Specialized for Shoes
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              We've learned from Poshmark's social commerce success and adapted it specifically for the 
              unique challenges and opportunities of sustainable shoe trading.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <Handshake className="w-12 h-12 text-purple-600 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Social Marketplace</h3>
                <p className="text-gray-600">
                  Like Poshmark, we foster a community of buyers and sellers, but focused exclusively 
                  on shoes with sustainability at the core.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <Award className="w-12 h-12 text-gold-600 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Artisanal Excellence</h3>
                <p className="text-gray-600">
                  Unlike general resale platforms, every shoe goes through our professional 
                  refurbishment process, ensuring quality and hygiene.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Join the Shoe Sustainability Revolution
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Every refurbished shoe purchase contributes to a more sustainable future. 
            Start your journey with FitFoot today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white">
              Shop Refurbished Shoes
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              Sell Your Shoes
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 