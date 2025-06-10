import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAllProducts, getProductBySlug, getHomePage, getAboutPage, getSiteSettings } from '../sanity.queries'
import { client } from '../sanity.client'
import type { Product, HomePage, AboutPage, SiteSettings } from '../types'

// Mock the Sanity client
vi.mock('../sanity.client', () => ({
  client: {
    fetch: vi.fn(),
    withConfig: vi.fn()
  }
}))

// Type the mocked client
const mockClient = client as any

describe('Sanity Queries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllProducts', () => {
    it('should fetch all products successfully', async () => {
      const mockProducts: Product[] = [
        {
          _id: '1',
          _type: 'product',
          title: 'Test Sneaker',
          slug: { current: 'test-sneaker' },
          type: 'sneaker',
          materials: 'Genuine leather',
          designedIn: 'Switzerland',
          madeIn: 'Italy'
        }
      ]

      // Mock the fetch method
      mockClient.fetch.mockResolvedValue(mockProducts)

      const result = await getAllProducts()

      expect(result).toEqual(mockProducts)
      expect(mockClient.fetch).toHaveBeenCalledWith(
        expect.stringContaining('*[_type == "product"] | order(_createdAt desc)')
      )
    })

    it('should handle empty results', async () => {
      mockClient.fetch.mockResolvedValue([])
      const result = await getAllProducts()
      expect(result).toEqual([])
    })

    it('should handle fetch errors', async () => {
      const error = new Error('Sanity fetch failed')
      mockClient.fetch.mockRejectedValue(error)

      await expect(getAllProducts()).rejects.toThrow('Sanity fetch failed')
    })
  })

  describe('getProductBySlug', () => {
    it('should fetch product by slug successfully', async () => {
      const mockProduct: Product = {
        _id: '1',
        _type: 'product',
        title: 'Test Sneaker',
        slug: { current: 'test-sneaker' },
        type: 'sneaker',
        materials: 'Genuine leather',
        designedIn: 'Switzerland',
        madeIn: 'Italy'
      }

      mockClient.fetch.mockResolvedValue(mockProduct)

      const result = await getProductBySlug('test-sneaker')

      expect(result).toEqual(mockProduct)
      expect(mockClient.fetch).toHaveBeenCalledWith(
        expect.stringContaining('*[_type == "product" && slug.current == $slug][0]'),
        { slug: 'test-sneaker' }
      )
    })

    it('should return null for non-existent product', async () => {
      mockClient.fetch.mockResolvedValue(null)
      const result = await getProductBySlug('non-existent')
      expect(result).toBeNull()
    })
  })

  describe('getHomePage', () => {
    it('should fetch home page data with fresh client', async () => {
      const mockHomePage: HomePage = {
        _id: 'home',
        _type: 'homePage',
        title: 'Home Page',
        heroTitle: 'Welcome to Fitfoot',
        heroSubtitle: 'Quality footwear from Switzerland',
        featuredProducts: []
      }

      // Mock the withConfig method to return a fresh client
      const mockFreshClient = { fetch: vi.fn().mockResolvedValue(mockHomePage) }
      mockClient.withConfig.mockReturnValue(mockFreshClient)

      const result = await getHomePage()

      expect(result).toEqual(mockHomePage)
      expect(mockClient.withConfig).toHaveBeenCalledWith({ useCdn: false })
      expect(mockFreshClient.fetch).toHaveBeenCalledWith(
        expect.stringContaining('*[_type == "homePage"][0]')
      )
    })

    it('should handle null home page data', async () => {
      const mockFreshClient = { fetch: vi.fn().mockResolvedValue(null) }
      mockClient.withConfig.mockReturnValue(mockFreshClient)

      const result = await getHomePage()
      expect(result).toBeNull()
    })
  })

  describe('getAboutPage', () => {
    it('should fetch about page data successfully', async () => {
      const mockAboutPage: AboutPage = {
        _id: 'about',
        _type: 'aboutPage',
        title: 'About Us'
      }

      mockClient.fetch.mockResolvedValue(mockAboutPage)
      const result = await getAboutPage()
      expect(result).toEqual(mockAboutPage)
      expect(mockClient.fetch).toHaveBeenCalledWith(
        expect.stringContaining('*[_type == "aboutPage"][0]')
      )
    })

    it('should return null when no about page exists', async () => {
      mockClient.fetch.mockResolvedValue(null)
      const result = await getAboutPage()
      expect(result).toBeNull()
    })
  })

  describe('getSiteSettings', () => {
    it('should fetch site settings successfully', async () => {
      const mockSiteSettings: SiteSettings = {
        _id: 'settings',
        _type: 'siteSettings',
        title: 'Fitfoot',
        description: 'Swiss quality footwear',
        keywords: ['footwear', 'swiss', 'quality'],
        siteUrl: 'https://fitfoot.com'
      }

      mockClient.fetch.mockResolvedValue(mockSiteSettings)
      const result = await getSiteSettings()
      expect(result).toEqual(mockSiteSettings)
      expect(mockClient.fetch).toHaveBeenCalledWith(
        expect.stringContaining('*[_type == "siteSettings"][0]')
      )
    })

    it('should return null when no site settings exist', async () => {
      mockClient.fetch.mockResolvedValue(null)
      const result = await getSiteSettings()
      expect(result).toBeNull()
    })
  })

  describe('Query validation', () => {
    it('should include all required fields in product queries', async () => {
      mockClient.fetch.mockResolvedValue([])

      await getAllProducts()

      const query = mockClient.fetch.mock.calls[0][0] as string
      
      // Check that all essential product fields are included
      expect(query).toContain('_id')
      expect(query).toContain('title')
      expect(query).toContain('slug')
      expect(query).toContain('type')
      expect(query).toContain('materials')
      expect(query).toContain('designedIn')
      expect(query).toContain('madeIn')
    })
  })
}) 