import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"

// Swiss Dashboard Widget Component
const SwissDashboardWidget = () => {
  const [sustainabilityData, setSustainabilityData] = useState({
    co2Saved: 2.3,
    recycledMaterials: 89,
    swissMade: 100,
    localSuppliers: 15
  })

  const [stats, setStats] = useState({
    totalProducts: 0,
    swissProducts: 0,
    sustainableProducts: 0
  })

  useEffect(() => {
    // Fetch real data from Medusa API
    const fetchData = async () => {
      try {
        const response = await fetch('/admin/products', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          const products = data.products || []
          
          setStats({
            totalProducts: products.length,
            swissProducts: products.filter((p: any) => 
              p.metadata?.swiss_made || p.metadata?.swiss_design
            ).length,
            sustainableProducts: products.filter((p: any) => 
              p.metadata?.sustainable || p.metadata?.eco_friendly
            ).length
          })
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    fetchData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF'
    }).format(amount)
  }

  return (
    <Container className="p-6 bg-gradient-to-br from-red-50 to-white border border-red-200 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading level="h2" className="text-2xl font-bold text-gray-900 mb-2">
            🇨🇭 FitFoot Swiss Dashboard
          </Heading>
          <Text className="text-gray-600">
            Sustainable Swiss Footwear Business Overview
          </Text>
        </div>
        <div className="hidden md:block">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">🏔️</span>
          </div>
        </div>
      </div>

      {/* Swiss Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm font-medium text-gray-600">Total Products</Text>
              <Heading level="h3" className="text-2xl font-bold text-gray-900">
                {stats.totalProducts}
              </Heading>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-red-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm font-medium text-red-600">Swiss Products</Text>
              <Heading level="h3" className="text-2xl font-bold text-red-700">
                {stats.swissProducts}
              </Heading>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <span className="text-red-600 text-xl">🇨🇭</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm font-medium text-green-600">Sustainable</Text>
              <Heading level="h3" className="text-2xl font-bold text-green-700">
                {stats.sustainableProducts}
              </Heading>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">🌱</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sustainability Impact */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <Heading level="h3" className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          🌱 Sustainability Impact
        </Heading>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {sustainabilityData.co2Saved} tons
            </div>
            <Text className="text-sm text-gray-600">CO₂ Saved</Text>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {sustainabilityData.recycledMaterials}%
            </div>
            <Text className="text-sm text-gray-600">Recycled Materials</Text>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {sustainabilityData.swissMade}%
            </div>
            <Text className="text-sm text-gray-600">Swiss Made</Text>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">
              {sustainabilityData.localSuppliers}
            </div>
            <Text className="text-sm text-gray-600">Local Suppliers</Text>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="/admin/products"
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <span className="mr-2">📦</span>
          Manage Products
        </a>
        <a
          href="/admin/orders"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span className="mr-2">🛒</span>
          View Orders
        </a>
        <a
          href="/admin/customers"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <span className="mr-2">👥</span>
          Customers
        </a>
      </div>

      {/* Swiss Features Notice */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center">
          <span className="text-amber-600 text-xl mr-3">💡</span>
          <div>
            <Text className="font-medium text-amber-800">
              Swiss Quality Features Enabled
            </Text>
            <Text className="text-sm text-amber-700 mt-1">
              Your products can be marked as "Made in Switzerland", "Swiss Design", and track sustainability metrics.
            </Text>
          </div>
        </div>
      </div>
    </Container>
  )
}

// Widget configuration
export const config = defineWidgetConfig({
  zone: "dashboard.after",
})

export default SwissDashboardWidget 