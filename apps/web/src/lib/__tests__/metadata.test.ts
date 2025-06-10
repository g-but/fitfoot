import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateMetadata } from '../metadata'
import { getSiteSettings } from '../sanity.queries'
import type { Metadata } from 'next'

// Mock the Sanity queries
vi.mock('../sanity.queries', () => ({
  getSiteSettings: vi.fn(),
}))

// Mock environment variables
const mockEnv = vi.hoisted(() => ({
  NEXT_PUBLIC_SITE_URL: 'https://test.fitfoot.ch'
}))

vi.stubGlobal('process', {
  env: mockEnv
})

describe('Metadata Generation', () => {
  const mockSiteSettings = {
    _id: 'site-settings',
    _type: 'siteSettings' as const,
    title: 'Fitfoot - Premium Swiss Footwear',
    description: 'Discover premium Swiss-designed footwear and accessories.',
    keywords: ['footwear', 'shoes', 'Swiss design', 'premium', 'leather'],
    siteUrl: 'https://fitfoot.ch'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('🏷️ Basic Metadata Generation', () => {
    it('should generate metadata with site settings', async () => {
      vi.mocked(getSiteSettings).mockResolvedValue(mockSiteSettings)

      const metadata = await generateMetadata()

      expect(metadata.title).toBe('Fitfoot - Premium Swiss Footwear')
      expect(metadata.description).toBe('Discover premium Swiss-designed footwear and accessories.')
      expect(metadata.keywords).toEqual(['footwear', 'shoes', 'Swiss design', 'premium', 'leather'])
      expect(metadata.metadataBase).toEqual(new URL('https://fitfoot.ch'))
    })

    it('should use fallback values when site settings are null', async () => {
      vi.mocked(getSiteSettings).mockResolvedValue(null)

      const metadata = await generateMetadata()

      expect(metadata.title).toBe('Fitfoot - Swiss-designed quality footwear')
      expect(metadata.description).toBe('Step into quality. Designed in Switzerland. Premium footwear and accessories crafted with genuine materials.')
      expect(metadata.keywords).toEqual(['footwear', 'shoes', 'Swiss design', 'quality', 'leather', 'accessories'])
    })

    it('should use fallback values for missing site settings properties', async () => {
      const partialSettings = {
        title: 'Custom Title'
        // Missing description, keywords, siteUrl
      }
      vi.mocked(getSiteSettings).mockResolvedValue(partialSettings)

      const metadata = await generateMetadata()

      expect(metadata.title).toBe('Custom Title')
      expect(metadata.description).toBe('Step into quality. Designed in Switzerland. Premium footwear and accessories crafted with genuine materials.')
      expect(metadata.keywords).toEqual(['footwear', 'shoes', 'Swiss design', 'quality', 'leather', 'accessories'])
      expect(metadata.metadataBase).toEqual(new URL('https://test.fitfoot.ch'))
    })
  })

  describe('🌐 URL and Environment Handling', () => {
    it('should use environment variable when site URL is not in settings', async () => {
      const settingsWithoutUrl = {
        ...mockSiteSettings,
        siteUrl: undefined
      }
      vi.mocked(getSiteSettings).mockResolvedValue(settingsWithoutUrl)

      const metadata = await generateMetadata()

      expect(metadata.metadataBase).toEqual(new URL('https://test.fitfoot.ch'))
      expect(metadata.openGraph?.url).toBe('https://test.fitfoot.ch')
    })

    it('should handle missing environment variable', async () => {
      const settingsWithoutUrl = {
        ...mockSiteSettings,
        siteUrl: undefined
      }
      vi.mocked(getSiteSettings).mockResolvedValue(settingsWithoutUrl)
      
      // Clear the environment variable
      delete mockEnv.NEXT_PUBLIC_SITE_URL

      const metadata = await generateMetadata()

      expect(metadata.metadataBase).toEqual(new URL('https://fitfoot.ch'))
      expect(metadata.openGraph?.url).toBe('https://fitfoot.ch')
    })
  })

  describe('📱 Social Media Metadata', () => {
    it('should generate correct OpenGraph metadata', async () => {
      vi.mocked(getSiteSettings).mockResolvedValue(mockSiteSettings)

      const metadata = await generateMetadata()

      expect(metadata.openGraph).toEqual({
        type: 'website',
        locale: 'en_US',
        url: 'https://fitfoot.ch',
        title: 'Fitfoot - Premium Swiss Footwear',
        description: 'Discover premium Swiss-designed footwear and accessories.',
        siteName: 'Fitfoot',
      })
    })

    it('should generate correct Twitter metadata', async () => {
      vi.mocked(getSiteSettings).mockResolvedValue(mockSiteSettings)

      const metadata = await generateMetadata()

      expect(metadata.twitter).toEqual({
        card: 'summary_large_image',
        title: 'Fitfoot - Premium Swiss Footwear',
        description: 'Discover premium Swiss-designed footwear and accessories.',
      })
    })

    it('should use fallback values in social metadata', async () => {
      vi.mocked(getSiteSettings).mockResolvedValue(null)

      const metadata = await generateMetadata()

      expect(metadata.openGraph?.title).toBe('Fitfoot - Swiss-designed quality footwear')
      expect(metadata.twitter?.title).toBe('Fitfoot - Swiss-designed quality footwear')
      expect(metadata.openGraph?.description).toBe('Step into quality. Designed in Switzerland. Premium footwear and accessories crafted with genuine materials.')
      expect(metadata.twitter?.description).toBe('Step into quality. Designed in Switzerland. Premium footwear and accessories crafted with genuine materials.')
    })
  })

  describe('🤖 SEO Configuration', () => {
    it('should have correct robots configuration', async () => {
      vi.mocked(getSiteSettings).mockResolvedValue(mockSiteSettings)

      const metadata = await generateMetadata()

      expect(metadata.robots).toEqual({
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      })
    })

    it('should include author information', async () => {
      vi.mocked(getSiteSettings).mockResolvedValue(mockSiteSettings)

      const metadata = await generateMetadata()

      expect(metadata.authors).toEqual([{ name: 'Fitfoot' }])
      expect(metadata.creator).toBe('Fitfoot')
      expect(metadata.publisher).toBe('Fitfoot')
    })
  })

  describe('⚡ Performance and Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      vi.mocked(getSiteSettings).mockRejectedValue(new Error('Sanity API Error'))

      const metadata = await generateMetadata()

      // Should still return metadata with fallback values
      expect(metadata.title).toBe('Fitfoot - Swiss-designed quality footwear')
      expect(metadata.description).toBe('Step into quality. Designed in Switzerland. Premium footwear and accessories crafted with genuine materials.')
    })

    it('should return proper Next.js Metadata type', async () => {
      vi.mocked(getSiteSettings).mockResolvedValue(mockSiteSettings)

      const metadata = await generateMetadata()

      // Type assertion to ensure it matches Next.js Metadata interface
      const nextMetadata: Metadata = metadata
      expect(nextMetadata).toBeDefined()
      expect(typeof nextMetadata.title).toBe('string')
      expect(typeof nextMetadata.description).toBe('string')
      expect(Array.isArray(nextMetadata.keywords)).toBe(true)
    })

    it('should handle concurrent metadata generation calls', async () => {
      vi.mocked(getSiteSettings).mockResolvedValue(mockSiteSettings)

      const promises = Array(5).fill(null).map(() => generateMetadata())
      const results = await Promise.all(promises)

      // All results should be identical
      results.forEach((result, index) => {
        if (index > 0) {
          expect(result).toEqual(results[0])
        }
      })

      // getSiteSettings should be called for each invocation
      expect(getSiteSettings).toHaveBeenCalledTimes(5)
    })
  })

  describe('🔍 Data Validation', () => {
    it('should handle empty string values in site settings', async () => {
      const emptySettings = {
        title: '',
        description: '',
        keywords: [],
        siteUrl: ''
      }
      vi.mocked(getSiteSettings).mockResolvedValue(emptySettings)

      const metadata = await generateMetadata()

      expect(metadata.title).toBe('Fitfoot - Swiss-designed quality footwear')
      expect(metadata.description).toBe('Step into quality. Designed in Switzerland. Premium footwear and accessories crafted with genuine materials.')
      expect(metadata.keywords).toEqual(['footwear', 'shoes', 'Swiss design', 'quality', 'leather', 'accessories'])
    })

    it('should properly handle keywords array', async () => {
      const settingsWithKeywords = {
        ...mockSiteSettings,
        keywords: ['custom', 'keywords', 'array']
      }
      vi.mocked(getSiteSettings).mockResolvedValue(settingsWithKeywords)

      const metadata = await generateMetadata()

      expect(metadata.keywords).toEqual(['custom', 'keywords', 'array'])
    })

    it('should validate URL formats', async () => {
      const settingsWithInvalidUrl = {
        ...mockSiteSettings,
        siteUrl: 'invalid-url'
      }
      vi.mocked(getSiteSettings).mockResolvedValue(settingsWithInvalidUrl)

      const metadata = await generateMetadata()

      // Should still work with invalid URL, using fallback
      expect(metadata.metadataBase).toBeInstanceOf(URL)
    })
  })
}) 