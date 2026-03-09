import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Badge, Container, Heading, Switch, Text, Textarea } from "@medusajs/ui"
import { useEffect, useState } from "react"

// Swiss Product Features Widget
const SwissProductWidget = ({ data }: { data: any }) => {
  const [swissFeatures, setSwissFeatures] = useState({
    swiss_made: false,
    swiss_design: false,
    local_suppliers: false,
    sustainable: false,
    eco_friendly: false,
    carbon_neutral: false,
    recycled_materials: false,
    fair_trade: false
  })

  const [sustainabilityInfo, setSustainabilityInfo] = useState({
    materials: '',
    certifications: '',
    carbon_footprint: '',
    recyclability_percentage: ''
  })

  const [loading, setLoading] = useState(false)

  // Load existing metadata when component mounts
  useEffect(() => {
    if (data?.metadata) {
      setSwissFeatures({
        swiss_made: data.metadata.swiss_made === 'true',
        swiss_design: data.metadata.swiss_design === 'true',
        local_suppliers: data.metadata.local_suppliers === 'true',
        sustainable: data.metadata.sustainable === 'true',
        eco_friendly: data.metadata.eco_friendly === 'true',
        carbon_neutral: data.metadata.carbon_neutral === 'true',
        recycled_materials: data.metadata.recycled_materials === 'true',
        fair_trade: data.metadata.fair_trade === 'true'
      })

      setSustainabilityInfo({
        materials: data.metadata.sustainability_materials || '',
        certifications: data.metadata.sustainability_certifications || '',
        carbon_footprint: data.metadata.carbon_footprint || '',
        recyclability_percentage: data.metadata.recyclability_percentage || ''
      })
    }
  }, [data])

  // Save Swiss features to product metadata
  const saveSwissFeatures = async () => {
    if (!data?.id) return

    setLoading(true)
    try {
      const metadata = {
        ...data.metadata,
        // Swiss Features
        swiss_made: swissFeatures.swiss_made.toString(),
        swiss_design: swissFeatures.swiss_design.toString(),
        local_suppliers: swissFeatures.local_suppliers.toString(),
        // Sustainability Features
        sustainable: swissFeatures.sustainable.toString(),
        eco_friendly: swissFeatures.eco_friendly.toString(),
        carbon_neutral: swissFeatures.carbon_neutral.toString(),
        recycled_materials: swissFeatures.recycled_materials.toString(),
        fair_trade: swissFeatures.fair_trade.toString(),
        // Sustainability Info
        sustainability_materials: sustainabilityInfo.materials,
        sustainability_certifications: sustainabilityInfo.certifications,
        carbon_footprint: sustainabilityInfo.carbon_footprint,
        recyclability_percentage: sustainabilityInfo.recyclability_percentage
      }

      const response = await fetch(`/admin/products/${data.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          metadata
        })
      })

      if (response.ok) {
        // Show success notification
        console.log('Swiss features saved successfully!')
      } else {
        console.error('Failed to save Swiss features')
      }
    } catch (error) {
      console.error('Error saving Swiss features:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFeatureToggle = (feature: keyof typeof swissFeatures) => {
    setSwissFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }))
  }

  const handleSustainabilityChange = (field: keyof typeof sustainabilityInfo, value: string) => {
    setSustainabilityInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Container className="p-6 bg-gradient-to-br from-red-50 to-white border border-red-200 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading level="h3" className="text-xl font-bold text-gray-900 mb-2 flex items-center">
            🇨🇭 Swiss Quality Features
          </Heading>
          <Text className="text-gray-600">
            Configure Swiss-specific features and sustainability tracking for this product
          </Text>
        </div>
        <button
          onClick={saveSwissFeatures}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Swiss Heritage Features */}
      <div className="mb-8">
        <Heading level="h4" className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          🏔️ Swiss Heritage
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div>
              <Text className="font-medium text-gray-900">Made in Switzerland</Text>
              <Text className="text-sm text-gray-600">Product manufactured in Switzerland</Text>
            </div>
            <Switch
              checked={swissFeatures.swiss_made}
              onCheckedChange={() => handleFeatureToggle('swiss_made')}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div>
              <Text className="font-medium text-gray-900">Swiss Design</Text>
              <Text className="text-sm text-gray-600">Designed with Swiss precision</Text>
            </div>
            <Switch
              checked={swissFeatures.swiss_design}
              onCheckedChange={() => handleFeatureToggle('swiss_design')}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div>
              <Text className="font-medium text-gray-900">Local Suppliers</Text>
              <Text className="text-sm text-gray-600">Materials from Swiss suppliers</Text>
            </div>
            <Switch
              checked={swissFeatures.local_suppliers}
              onCheckedChange={() => handleFeatureToggle('local_suppliers')}
            />
          </div>
        </div>
      </div>

      {/* Sustainability Features */}
      <div className="mb-8">
        <Heading level="h4" className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          🌱 Sustainability Features
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200">
            <div>
              <Text className="font-medium text-green-900">Sustainable</Text>
              <Text className="text-sm text-green-600">Eco-conscious production</Text>
            </div>
            <Switch
              checked={swissFeatures.sustainable}
              onCheckedChange={() => handleFeatureToggle('sustainable')}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200">
            <div>
              <Text className="font-medium text-green-900">Eco-Friendly</Text>
              <Text className="text-sm text-green-600">Environmentally friendly</Text>
            </div>
            <Switch
              checked={swissFeatures.eco_friendly}
              onCheckedChange={() => handleFeatureToggle('eco_friendly')}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200">
            <div>
              <Text className="font-medium text-green-900">Carbon Neutral</Text>
              <Text className="text-sm text-green-600">Net-zero carbon footprint</Text>
            </div>
            <Switch
              checked={swissFeatures.carbon_neutral}
              onCheckedChange={() => handleFeatureToggle('carbon_neutral')}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200">
            <div>
              <Text className="font-medium text-green-900">Recycled Materials</Text>
              <Text className="text-sm text-green-600">Made from recycled content</Text>
            </div>
            <Switch
              checked={swissFeatures.recycled_materials}
              onCheckedChange={() => handleFeatureToggle('recycled_materials')}
            />
          </div>
        </div>
      </div>

      {/* Sustainability Details */}
      <div className="mb-6">
        <Heading level="h4" className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          📊 Sustainability Details
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Materials Used
            </label>
            <Textarea
              value={sustainabilityInfo.materials}
              onChange={(e) => handleSustainabilityChange('materials', e.target.value)}
              placeholder="e.g., Organic hemp, Recycled ocean plastic, Cork sole"
              className="w-full"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certifications
            </label>
            <Textarea
              value={sustainabilityInfo.certifications}
              onChange={(e) => handleSustainabilityChange('certifications', e.target.value)}
              placeholder="e.g., GOTS Certified, Fair Trade, OEKO-TEX Standard 100"
              className="w-full"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carbon Footprint (kg CO₂)
            </label>
            <input
              type="number"
              value={sustainabilityInfo.carbon_footprint}
              onChange={(e) => handleSustainabilityChange('carbon_footprint', e.target.value)}
              placeholder="e.g., 2.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recyclability (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={sustainabilityInfo.recyclability_percentage}
              onChange={(e) => handleSustainabilityChange('recyclability_percentage', e.target.value)}
              placeholder="e.g., 85"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Active Features Summary */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <Text className="font-medium text-gray-900 mb-3">Active Features:</Text>
        <div className="flex flex-wrap gap-2">
          {swissFeatures.swiss_made && (
            <Badge className="bg-red-100 text-red-800">🇨🇭 Made in Switzerland</Badge>
          )}
          {swissFeatures.swiss_design && (
            <Badge className="bg-red-100 text-red-800">🎨 Swiss Design</Badge>
          )}
          {swissFeatures.local_suppliers && (
            <Badge className="bg-red-100 text-red-800">🏪 Local Suppliers</Badge>
          )}
          {swissFeatures.sustainable && (
            <Badge className="bg-green-100 text-green-800">🌱 Sustainable</Badge>
          )}
          {swissFeatures.eco_friendly && (
            <Badge className="bg-green-100 text-green-800">🌍 Eco-Friendly</Badge>
          )}
          {swissFeatures.carbon_neutral && (
            <Badge className="bg-green-100 text-green-800">⚡ Carbon Neutral</Badge>
          )}
          {swissFeatures.recycled_materials && (
            <Badge className="bg-blue-100 text-blue-800">♻️ Recycled Materials</Badge>
          )}
          {swissFeatures.fair_trade && (
            <Badge className="bg-amber-100 text-amber-800">🤝 Fair Trade</Badge>
          )}
          {Object.values(swissFeatures).every(v => !v) && (
            <Text className="text-gray-500 italic">No features selected</Text>
          )}
        </div>
      </div>
    </Container>
  )
}

// Widget configuration - appears on product detail pages
export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default SwissProductWidget 