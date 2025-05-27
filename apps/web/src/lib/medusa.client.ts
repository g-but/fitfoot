import Medusa from '@medusajs/js-sdk'

// Initialize Medusa client
export const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000',
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
  debug: process.env.NODE_ENV === 'development',
})

// Product types for TypeScript
export interface MedusaProduct {
  id: string
  title: string
  description?: string | null
  handle: string
  status: string
  images?: Array<{
    id: string
    url: string
  }>
  variants?: Array<{
    id: string
    title: string
    prices: Array<{
      amount: number
      currency_code: string
    }>
  }>
  collection?: {
    id: string
    title: string
    handle: string
  }
  tags?: Array<{
    id: string
    value: string
  }>
}

export interface MedusaCollection {
  id: string
  title: string
  handle: string
  products?: MedusaProduct[]
}

// Helper functions for product operations
export const getProducts = async (params?: {
  limit?: number
  offset?: number
  collection_id?: string
  tags?: string[]
}) => {
  try {
    const response = await medusa.store.product.list(params)
    return response.products || []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export const getProduct = async (id: string) => {
  try {
    const response = await medusa.store.product.retrieve(id)
    return response.product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export const getCollections = async () => {
  try {
    const response = await medusa.store.collection.list()
    return response.collections || []
  } catch (error) {
    console.error('Error fetching collections:', error)
    return []
  }
}

export const getCollection = async (id: string) => {
  try {
    const response = await medusa.store.collection.retrieve(id)
    return response.collection
  } catch (error) {
    console.error('Error fetching collection:', error)
    return null
  }
} 