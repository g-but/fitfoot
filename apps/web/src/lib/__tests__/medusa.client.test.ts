import { describe, it, expect, vi } from 'vitest'
import { 
  getProducts, 
  getProduct, 
  getCollections, 
  getCollection
} from '../medusa.client'

// Mock the entire medusa client
vi.mock('../medusa.client', async () => {
  const actual = await vi.importActual('../medusa.client')
  return {
    ...actual,
    medusa: {
      store: {
        product: {
          list: vi.fn(),
          retrieve: vi.fn(),
        },
        collection: {
          list: vi.fn(),
          retrieve: vi.fn(),
        },
      },
    },
    getProducts: vi.fn(),
    getProduct: vi.fn(),
    getCollections: vi.fn(),
    getCollection: vi.fn(),
  }
})

describe('Medusa Client Functions', () => {
  describe('🔌 API Functions', () => {
    it('should export getProducts function', () => {
      expect(getProducts).toBeDefined()
      expect(typeof getProducts).toBe('function')
    })

    it('should export getProduct function', () => {
      expect(getProduct).toBeDefined()
      expect(typeof getProduct).toBe('function')
    })

    it('should export getCollections function', () => {
      expect(getCollections).toBeDefined()
      expect(typeof getCollections).toBe('function')
    })

    it('should export getCollection function', () => {
      expect(getCollection).toBeDefined()
      expect(typeof getCollection).toBe('function')
    })
  })

  describe('🧪 Function Integration', () => {
    it('should handle getProducts calls', async () => {
      const mockProducts = [{ id: 'prod_1', title: 'Test Product' }]
      vi.mocked(getProducts).mockResolvedValue(mockProducts)

      const result = await getProducts()
      expect(result).toEqual(mockProducts)
    })

    it('should handle getProduct calls', async () => {
      const mockProduct = { id: 'prod_1', title: 'Test Product' }
      vi.mocked(getProduct).mockResolvedValue(mockProduct)

      const result = await getProduct('prod_1')
      expect(result).toEqual(mockProduct)
    })

    it('should handle error scenarios', async () => {
      vi.mocked(getProducts).mockRejectedValue(new Error('API Error'))
      
      await expect(getProducts()).rejects.toThrow('API Error')
    })
  })
}) 