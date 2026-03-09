'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    BarChart3,
    BookOpen,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Globe,
    Heart,
    Package,
    Settings,
    ShoppingCart,
    Users,
    X,
    Zap
} from 'lucide-react'
import { useState } from 'react'

interface GuideSection {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  steps: {
    title: string
    description: string
    action?: string
    tips?: string[]
  }[]
}

export function UserGuide() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const guideSections: GuideSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      description: 'Learn the basics of your FitFoot admin interface',
      steps: [
        {
          title: 'Welcome to Your Swiss Admin Interface',
          description: 'Your FitFoot admin is designed specifically for sustainable Swiss footwear businesses. Everything is optimized for efficiency and beauty.',
          tips: [
            'The interface uses Swiss formatting (CHF currency, de-CH dates)',
            'All sustainability features are built-in',
            'Mobile-responsive design works on all devices'
          ]
        },
        {
          title: 'Dashboard Overview',
          description: 'Your dashboard shows key metrics, recent orders, and top products at a glance.',
          action: 'Check your revenue, orders, customers, and product statistics',
          tips: [
            'Green arrows indicate growth, red arrows indicate decline',
            'Click "View All" buttons to access detailed pages',
            'Quick actions are available at the bottom'
          ]
        },
        {
          title: 'Navigation',
          description: 'Use the sidebar to navigate between different sections of your admin.',
          tips: [
            'Dashboard: Overview and quick actions',
            'Products: Manage your sustainable footwear catalog',
            'Orders: Process and track customer orders',
            'Customers: View customer data and analytics',
            'Analytics: Business insights and reports',
            'Settings: Configure your store'
          ]
        }
      ]
    },
    {
      id: 'products',
      title: 'Managing Products',
      icon: Package,
      description: 'Add, edit, and organize your Swiss sustainable footwear',
      steps: [
        {
          title: 'Adding a New Product',
          description: 'Create beautiful product listings for your sustainable footwear.',
          action: 'Click "Add New Product" from Dashboard or Products page',
          tips: [
            'Use descriptive titles like "Alpine Trek Pro - Swiss Made Hiking Boots"',
            'URL handles are auto-generated from titles',
            'Add detailed descriptions highlighting sustainability'
          ]
        },
        {
          title: 'Swiss Features Section',
          description: 'Highlight what makes your products uniquely Swiss.',
          action: 'Check boxes for Made in Switzerland, Swiss Design, Local Suppliers',
          tips: [
            'Made in Switzerland: Product manufactured in Switzerland',
            'Swiss Design: Designed with Swiss precision and aesthetics',
            'Local Suppliers: Materials sourced from Swiss suppliers'
          ]
        },
        {
          title: 'Product Variants',
          description: 'Add different sizes, colors, and configurations.',
          action: 'Use the Variants tab to add size options',
          tips: [
            'Each variant needs: Size, SKU, Price (CHF), Inventory',
            'Use clear SKU codes like "ATP-42-BRN" (Alpine Trek Pro, Size 42, Brown)',
            'Set competitive prices in Swiss Francs'
          ]
        },
        {
          title: 'Product Images',
          description: 'Upload high-quality images to showcase your footwear.',
          action: 'Drag and drop images or click "Choose Files"',
          tips: [
            'First image becomes the primary product image',
            'Use high-resolution images (at least 1200px wide)',
            'Show multiple angles and details'
          ]
        },
        {
          title: 'SEO Optimization',
          description: 'Optimize your products for search engines.',
          action: 'Fill in SEO title and meta description',
          tips: [
            'Keep SEO titles under 60 characters',
            'Meta descriptions should be under 160 characters',
            'Include keywords like "Swiss", "sustainable", "footwear"'
          ]
        },
        {
          title: 'Sustainability Tracking',
          description: 'Document the environmental impact of your products.',
          action: 'Use the Sustainability tab to add materials and certifications',
          tips: [
            'List materials: "Organic hemp, Recycled ocean plastic"',
            'Add certifications: "GOTS Certified, Fair Trade"',
            'Track carbon footprint and recyclability'
          ]
        }
      ]
    },
    {
      id: 'orders',
      title: 'Order Management',
      icon: ShoppingCart,
      description: 'Process and fulfill customer orders efficiently',
      steps: [
        {
          title: 'Order Overview',
          description: 'Monitor all orders with real-time statistics and filtering.',
          action: 'View orders dashboard with statistics cards',
          tips: [
            'Statistics show total orders, pending, shipped, and revenue',
            'Use search to find specific orders or customers',
            'Filter by status to focus on specific order types'
          ]
        },
        {
          title: 'Processing Orders',
          description: 'Update order status as you fulfill them.',
          action: 'Click status dropdown to change order status',
          tips: [
            'Pending: New orders waiting for processing',
            'Processing: Orders being prepared',
            'Shipped: Orders sent to customers',
            'Delivered: Orders received by customers'
          ]
        },
        {
          title: 'Order Details',
          description: 'View complete order information and customer details.',
          action: 'Click the eye icon to view order details',
          tips: [
            'See customer information and contact details',
            'Review ordered items and quantities',
            'Check shipping and billing addresses',
            'Add tracking numbers for shipped orders'
          ]
        },
        {
          title: 'Customer Communication',
          description: 'Stay in touch with your customers throughout the process.',
          action: 'Use "Contact Customer" button in order details',
          tips: [
            'Send order confirmations promptly',
            'Provide tracking information when available',
            'Follow up on delivered orders for feedback'
          ]
        }
      ]
    },
    {
      id: 'customers',
      title: 'Customer Management',
      icon: Users,
      description: 'Build relationships with your sustainable footwear customers',
      steps: [
        {
          title: 'Customer Overview',
          description: 'View all your customers and their order history.',
          tips: [
            'See customer lifetime value and order frequency',
            'Track customer preferences and sizes',
            'Identify your most valuable customers'
          ]
        },
        {
          title: 'Customer Insights',
          description: 'Understand your customer base better.',
          tips: [
            'Analyze which products are most popular',
            'Track repeat purchase patterns',
            'Identify seasonal buying trends'
          ]
        }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      icon: BarChart3,
      description: 'Track your business performance and growth',
      steps: [
        {
          title: 'Sales Analytics',
          description: 'Monitor revenue trends and product performance.',
          tips: [
            'Track monthly and yearly revenue growth',
            'Identify best-selling products',
            'Monitor seasonal trends'
          ]
        },
        {
          title: 'Sustainability Impact',
          description: 'Measure your environmental contribution.',
          tips: [
            'Track CO₂ saved through sustainable practices',
            'Monitor percentage of recycled materials used',
            'Showcase your Swiss manufacturing commitment'
          ]
        }
      ]
    },
    {
      id: 'settings',
      title: 'Store Settings',
      icon: Settings,
      description: 'Configure your store preferences and account settings',
      steps: [
        {
          title: 'Profile Settings',
          description: 'Update your admin profile information.',
          action: 'Go to Settings > Profile to update your details',
          tips: [
            'Keep your contact information current',
            'Use a professional profile photo',
            'Set up two-factor authentication for security'
          ]
        },
        {
          title: 'Store Configuration',
          description: 'Set up your store preferences.',
          tips: [
            'Configure payment methods',
            'Set up shipping zones and rates',
            'Customize email templates'
          ]
        }
      ]
    }
  ]

  const toggleSection = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId)
  }

  return (
    <>
      {/* Guide Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-amber-600 hover:bg-amber-700 text-white shadow-lg"
        size="lg"
      >
        <BookOpen className="w-5 h-5 mr-2" />
        Admin Guide
      </Button>

      {/* Guide Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center">
                    🇨🇭 FitFoot Admin User Guide
                  </h2>
                  <p className="text-amber-100 mt-2">
                    Complete guide for managing your Swiss sustainable footwear business
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-amber-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex h-[calc(90vh-120px)]">
              {/* Sidebar */}
              <div className="w-80 border-r border-gray-200 bg-gray-50 overflow-y-auto">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    Guide Sections
                  </h3>
                  <div className="space-y-2">
                    {guideSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => toggleSection(section.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          activeSection === section.id
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <section.icon className="w-5 h-5 mr-3" />
                            <span className="font-medium">{section.title}</span>
                          </div>
                          {activeSection === section.id ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-8">
                          {section.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  {activeSection ? (
                    <div>
                      {(() => {
                        const section = guideSections.find(s => s.id === activeSection)
                        if (!section) return null

                        return (
                          <div>
                            <div className="flex items-center mb-6">
                              <section.icon className="w-8 h-8 text-amber-600 mr-3" />
                              <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                  {section.title}
                                </h3>
                                <p className="text-gray-600">{section.description}</p>
                              </div>
                            </div>

                            <div className="space-y-6">
                              {section.steps.map((step, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-6">
                                  <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                                      {index + 1}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                        {step.title}
                                      </h4>
                                      <p className="text-gray-700 mb-3">
                                        {step.description}
                                      </p>
                                      
                                      {step.action && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                                          <div className="flex items-center">
                                            <Zap className="w-4 h-4 text-blue-600 mr-2" />
                                            <span className="text-sm font-medium text-blue-800">
                                              Action: {step.action}
                                            </span>
                                          </div>
                                        </div>
                                      )}

                                      {step.tips && step.tips.length > 0 && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                          <div className="flex items-center mb-2">
                                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                                            <span className="text-sm font-medium text-green-800">
                                              Pro Tips:
                                            </span>
                                          </div>
                                          <ul className="text-sm text-green-700 space-y-1">
                                            {step.tips.map((tip, tipIndex) => (
                                              <li key={tipIndex} className="flex items-start">
                                                <span className="text-green-500 mr-2">•</span>
                                                {tip}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Welcome to Your Admin Guide
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Select a section from the sidebar to learn how to use your beautiful FitFoot admin interface.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
                          <Heart className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                          <h4 className="font-semibold text-amber-800">Swiss Quality</h4>
                          <p className="text-sm text-amber-700">Built with Swiss precision and attention to detail</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                          <Globe className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <h4 className="font-semibold text-green-800">Sustainable</h4>
                          <p className="text-sm text-green-700">Designed for sustainable footwear businesses</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  💡 Need help? This guide covers everything you need to know about your admin interface.
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    Swiss Made Interface
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Sustainable Focus
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 