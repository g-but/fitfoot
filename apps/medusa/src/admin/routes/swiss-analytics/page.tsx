import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"

// Swiss Analytics Page Component
const SwissAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    swissProducts: 0,
    sustainableProducts: 0,
    totalOrders: 0,
    swissOrdersPercentage: 0,
    sustainability: {
      co2Saved: 0,
      recycledMaterials: 0,
      localSuppliers: 0,
      certifications: 0
    },
    topSwissProducts: [],
    recentSustainableOrders: []
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      // Fetch products data
      const productsResponse = await fetch('/admin/products?limit=1000', {
        credentials: 'include'
      })
      
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        const products = productsData.products || []

        // Calculate Swiss and sustainability metrics
        const swissProducts = products.filter((p: any) => 
          p.metadata?.swiss_made === 'true' || p.metadata?.swiss_design === 'true'
        )
        
        const sustainableProducts = products.filter((p: any) => 
          p.metadata?.sustainable === 'true' || 
          p.metadata?.eco_friendly === 'true' ||
          p.metadata?.recycled_materials === 'true'
        )

        // Calculate sustainability impact
        const co2Saved = sustainableProducts.reduce((total: number, product: any) => {
          const footprint = parseFloat(product.metadata?.carbon_footprint || '0')
          return total + (footprint > 0 ? footprint * 0.5 : 0.8) // Estimated savings
        }, 0)

        const recycledMaterialsCount = products.filter((p: any) => 
          p.metadata?.recycled_materials === 'true'
        ).length

        const localSuppliersCount = products.filter((p: any) => 
          p.metadata?.local_suppliers === 'true'
        ).length

        const certificationsCount = products.reduce((total: number, product: any) => {
          const certs = product.metadata?.sustainability_certifications || ''
          return total + (certs.split(',').filter(Boolean).length)
        }, 0)

        setAnalytics({
          totalProducts: products.length,
          swissProducts: swissProducts.length,
          sustainableProducts: sustainableProducts.length,
          totalOrders: 0, // Would need orders API
          swissOrdersPercentage: 0, // Would need orders API
          sustainability: {
            co2Saved: co2Saved,
            recycledMaterials: recycledMaterialsCount,
            localSuppliers: localSuppliersCount,
            certifications: certificationsCount
          },
          topSwissProducts: swissProducts.slice(0, 5),
          recentSustainableOrders: [] // Would need orders API
        })
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF'
    }).format(amount)
  }

  const getPercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0
  }

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <Text>Loading Swiss Analytics...</Text>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <Heading level="h1" className="text-3xl font-bold mb-2 text-white">
              🇨🇭 Swiss Analytics Dashboard
            </Heading>
            <Text className="text-red-100 text-lg">
              Track your Swiss sustainable footwear business performance
            </Text>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-4xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-2xl">📦</span>
            </div>
            <div className="text-right">
              <Text className="text-2xl font-bold text-gray-900">
                {analytics.totalProducts}
              </Text>
              <Text className="text-sm text-gray-600">Total Products</Text>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-red-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <span className="text-red-600 text-2xl">🇨🇭</span>
            </div>
            <div className="text-right">
              <Text className="text-2xl font-bold text-red-700">
                {analytics.swissProducts}
              </Text>
              <Text className="text-sm text-red-600">
                Swiss Products ({getPercentage(analytics.swissProducts, analytics.totalProducts)}%)
              </Text>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-green-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-green-600 text-2xl">🌱</span>
            </div>
            <div className="text-right">
              <Text className="text-2xl font-bold text-green-700">
                {analytics.sustainableProducts}
              </Text>
              <Text className="text-sm text-green-600">
                Sustainable ({getPercentage(analytics.sustainableProducts, analytics.totalProducts)}%)
              </Text>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-amber-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <span className="text-amber-600 text-2xl">⚡</span>
            </div>
            <div className="text-right">
              <Text className="text-2xl font-bold text-amber-700">
                {analytics.sustainability.co2Saved.toFixed(1)}t
              </Text>
              <Text className="text-sm text-amber-600">CO₂ Saved</Text>
            </div>
          </div>
        </div>
      </div>

      {/* Sustainability Impact */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 border border-green-200">
        <Heading level="h2" className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          🌱 Environmental Impact
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {analytics.sustainability.co2Saved.toFixed(1)}
            </div>
            <Text className="text-sm text-gray-600">Tons CO₂ Saved</Text>
            <Text className="text-xs text-green-600 mt-1">
              Through sustainable practices
            </Text>
          </div>

          <div className="text-center bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {analytics.sustainability.recycledMaterials}
            </div>
            <Text className="text-sm text-gray-600">Products with Recycled Materials</Text>
            <Text className="text-xs text-blue-600 mt-1">
              {getPercentage(analytics.sustainability.recycledMaterials, analytics.totalProducts)}% of catalog
            </Text>
          </div>

          <div className="text-center bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {analytics.sustainability.localSuppliers}
            </div>
            <Text className="text-sm text-gray-600">Local Swiss Suppliers</Text>
            <Text className="text-xs text-red-600 mt-1">
              Supporting local economy
            </Text>
          </div>

          <div className="text-center bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl font-bold text-amber-600 mb-2">
              {analytics.sustainability.certifications}
            </div>
            <Text className="text-sm text-gray-600">Sustainability Certifications</Text>
            <Text className="text-xs text-amber-600 mt-1">
              Verified quality standards
            </Text>
          </div>
        </div>
      </div>

      {/* Top Swiss Products */}
      <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
        <Heading level="h2" className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          🏆 Top Swiss Products
        </Heading>
        {analytics.topSwissProducts.length > 0 ? (
          <div className="space-y-4">
            {analytics.topSwissProducts.map((product: any, index: number) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                    {index + 1}
                  </div>
                  <div>
                    <Text className="font-medium text-gray-900">{product.title}</Text>
                    <div className="flex items-center mt-1 space-x-2">
                      {product.metadata?.swiss_made === 'true' && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          🇨🇭 Made in Switzerland
                        </span>
                      )}
                      {product.metadata?.swiss_design === 'true' && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          🎨 Swiss Design
                        </span>
                      )}
                      {product.metadata?.sustainable === 'true' && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          🌱 Sustainable
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Text className="font-bold text-gray-900">
                    {formatCurrency(product.variants?.[0]?.prices?.[0]?.amount / 100 || 0)}
                  </Text>
                  <Text className="text-sm text-gray-600">Base Price</Text>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="text-6xl mb-4 block">🇨🇭</span>
            <Text className="text-gray-600">
              No Swiss products found. Start marking your products with Swiss features!
            </Text>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-amber-50 rounded-xl p-8 border border-amber-200">
        <Heading level="h2" className="text-2xl font-bold text-amber-900 mb-6 flex items-center">
          💡 Recommendations
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6">
            <Heading level="h3" className="text-lg font-semibold text-gray-900 mb-3">
              Increase Swiss Product Visibility
            </Heading>
            <Text className="text-gray-600 mb-4">
              Only {getPercentage(analytics.swissProducts, analytics.totalProducts)}% of your products are marked as Swiss. 
              Consider highlighting more Swiss-made or Swiss-designed products.
            </Text>
            <a
              href="/admin/products"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <span className="mr-2">🇨🇭</span>
              Review Products
            </a>
          </div>

          <div className="bg-white rounded-lg p-6">
            <Heading level="h3" className="text-lg font-semibold text-gray-900 mb-3">
              Expand Sustainability Features
            </Heading>
            <Text className="text-gray-600 mb-4">
              {getPercentage(analytics.sustainableProducts, analytics.totalProducts)}% of products have sustainability features. 
              Add more eco-friendly certifications and materials information.
            </Text>
            <a
              href="/admin/products"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <span className="mr-2">🌱</span>
              Add Sustainability
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// Route configuration
export const config = defineRouteConfig({
  label: "Swiss Analytics",
  icon: "chart-bar",
})

export default SwissAnalyticsPage 