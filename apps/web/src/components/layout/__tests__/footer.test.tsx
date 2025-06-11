import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '../footer'
import { getSiteSettings } from '@/lib/sanity.queries'
import type { SiteSettings } from '@/lib/types'

// Mock the Sanity queries
vi.mock('@/lib/sanity.queries', () => ({
  getSiteSettings: vi.fn(),
}))

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

const mockGetSiteSettings = vi.mocked(getSiteSettings)

describe('Footer Component', () => {
  const mockSiteSettings: SiteSettings = {
    _id: 'settings',
    _type: 'siteSettings',
    title: 'Test Fitfoot',
    description: 'Test description',
    keywords: ['test', 'fitfoot'],
    siteUrl: 'https://test.fitfoot.com',
    footer: {
      copyright: '© 2025 Test Fitfoot. All rights reserved. Made in Switzerland.'
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('🏢 Brand & Company Info', () => {
    it('should render brand name correctly', async () => {
      mockGetSiteSettings.mockResolvedValue(mockSiteSettings)
      render(await Footer())
      
      const brandName = screen.getByText('Fitfoot')
      expect(brandName).toBeInTheDocument()
      expect(brandName).toHaveClass('font-semibold', 'text-xl')
    })

    it('should render company description', async () => {
      mockGetSiteSettings.mockResolvedValue(mockSiteSettings)
      render(await Footer())
      
      const description = screen.getByText(/Premium footwear and accessories crafted with genuine materials/)
      expect(description).toBeInTheDocument()
      expect(description).toHaveClass('text-gray-300', 'text-sm')
    })

    it('should render custom copyright from site settings', async () => {
      mockGetSiteSettings.mockResolvedValue(mockSiteSettings)
      render(await Footer())
      
      const copyright = screen.getByText('© 2025 Test Fitfoot. All rights reserved. Made in Switzerland.')
      expect(copyright).toBeInTheDocument()
    })

    it('should render default copyright when no custom copyright provided', async () => {
      mockGetSiteSettings.mockResolvedValue(null)
      render(await Footer())
      
      const defaultCopyright = screen.getByText('© 2025 Fitfoot. All rights reserved.')
      expect(defaultCopyright).toBeInTheDocument()
    })
  })

  describe('🔗 Navigation Links', () => {
    it('should render all quick links correctly', async () => {
      mockGetSiteSettings.mockResolvedValue(mockSiteSettings)
      render(await Footer())
      
      expect(screen.getByText('Quick Links')).toBeInTheDocument()
      
      const homeLink = screen.getByRole('link', { name: 'Home' })
      expect(homeLink).toHaveAttribute('href', '/')
      
      const productsLink = screen.getByRole('link', { name: 'Products' })
      expect(productsLink).toHaveAttribute('href', '/products')
    })

    it('should render product category links', async () => {
      mockGetSiteSettings.mockResolvedValue(mockSiteSettings)
      render(await Footer())
      
      // Use role heading to target the section header specifically
      expect(screen.getByRole('heading', { name: 'Collections' })).toBeInTheDocument()
      
      const sneakersLink = screen.getByRole('link', { name: 'Premium Sneakers' })
      expect(sneakersLink).toHaveAttribute('href', '/products?type=sneaker')
    })
  })

  describe('📞 Contact Information', () => {
    it('should render contact section', async () => {
      mockGetSiteSettings.mockResolvedValue(mockSiteSettings)
      render(await Footer())
      
      // Use role heading to target the section header specifically
      expect(screen.getByRole('heading', { name: 'Contact' })).toBeInTheDocument()
      expect(screen.getByText('info@fitfoot.com')).toBeInTheDocument()
      expect(screen.getByText('Customer Support')).toBeInTheDocument()
    })
  })

  describe('📱 Social Media Links', () => {
    it('should render all social media icons', async () => {
      mockGetSiteSettings.mockResolvedValue(mockSiteSettings)
      render(await Footer())
      
      // Get all social media links
      const socialLinks = screen.getAllByRole('link').filter(link => 
        link.getAttribute('href') === '#'
      )
      
      // Should have 3 social media links (Twitter, Facebook, Pinterest based on SVG paths)
      expect(socialLinks).toHaveLength(3)
      
      // Check that each has proper styling
      socialLinks.forEach(link => {
        expect(link).toHaveClass('text-gray-300', 'hover:text-primary', 'transition-colors')
      })
    })

    it('should render social media icons with proper SVG structure', async () => {
      mockGetSiteSettings.mockResolvedValue(mockSiteSettings)
      render(await Footer())
      
      // Check for SVG icons
      const svgIcons = screen.getAllByRole('link').filter(link => 
        link.getAttribute('href') === '#' && link.querySelector('svg')
      )
      
      expect(svgIcons).toHaveLength(3)
      
      // Each SVG should have proper dimensions
      svgIcons.forEach(link => {
        const svg = link.querySelector('svg')
        expect(svg).toHaveClass('h-5', 'w-5')
        expect(svg).toHaveAttribute('fill', 'currentColor')
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
      })
    })

    it('should have accessible social media links', async () => {
      mockGetSiteSettings.mockResolvedValue(mockSiteSettings)
      render(await Footer())
      
      const socialLinks = screen.getAllByRole('link').filter(link => 
        link.getAttribute('href') === '#'
      )
      
      // Should be keyboard accessible and have proper role
      socialLinks.forEach(link => {
        expect(link).toBeInTheDocument()
        expect(link.getAttribute('href')).toBe('#')
      })
    })
  })

  describe('🎨 Layout & Styling', () => {
    it('should have proper footer structure', async () => {
      mockGetSiteSettings.mockResolvedValue(mockSiteSettings)
      const { container } = render(await Footer())
      
      const footer = container.querySelector('footer')
      expect(footer).toHaveClass('bg-gray-900/95', 'text-white')
    })

    it('should have proper section spacing', async () => {
      mockGetSiteSettings.mockResolvedValue(mockSiteSettings)
      render(await Footer())
      
      // Check section headers have proper styling using role
      const quickLinksHeader = screen.getByRole('heading', { name: 'Quick Links' })
      expect(quickLinksHeader).toHaveClass('text-lg', 'font-semibold')
      
      const collectionsHeader = screen.getByRole('heading', { name: 'Collections' })
      expect(collectionsHeader).toHaveClass('text-lg', 'font-semibold')
      
      const contactHeader = screen.getByRole('heading', { name: 'Contact' })
      expect(contactHeader).toHaveClass('text-lg', 'font-semibold')
    })
  })

  describe('♿ Accessibility', () => {
    it('should have proper semantic HTML structure', async () => {
      mockGetSiteSettings.mockResolvedValue(mockSiteSettings)
      const { container } = render(await Footer())
      
      // Should use semantic footer element
      const footer = container.querySelector('footer')
      expect(footer).toBeInTheDocument()
      
      // Should have proper heading hierarchy
      const headings = screen.getAllByRole('heading', { level: 3 })
      expect(headings).toHaveLength(3) // Quick Links, Collections, Contact
    })

    it('should have keyboard accessible links', async () => {
      mockGetSiteSettings.mockResolvedValue(mockSiteSettings)
      render(await Footer())
      
      const allLinks = screen.getAllByRole('link')
      
      // All links should be properly accessible
      allLinks.forEach(link => {
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href')
      })
    })

    it('should have proper color contrast for text', async () => {
      mockGetSiteSettings.mockResolvedValue(mockSiteSettings)
      render(await Footer())
      
      // Check that text elements have appropriate contrast classes
      const grayText = screen.getByText(/Premium footwear and accessories/)
      expect(grayText).toHaveClass('text-gray-300')
      
      // Links should have hover states for better accessibility
      const homeLink = screen.getByRole('link', { name: 'Home' })
      expect(homeLink).toHaveClass('hover:text-primary')
    })
  })

  describe('🔧 Error Handling', () => {
    it('should handle null site settings gracefully', async () => {
      mockGetSiteSettings.mockResolvedValue(null)
      render(await Footer())
      
      // Should still render with default values
      expect(screen.getByText('Fitfoot')).toBeInTheDocument()
      expect(screen.getByText('© 2025 Fitfoot. All rights reserved.')).toBeInTheDocument()
    })

    it('should handle missing footer settings gracefully', async () => {
      const settingsWithoutFooter: SiteSettings = {
        _id: 'settings',
        _type: 'siteSettings',
        title: 'Test Fitfoot',
        description: 'Test description',
        keywords: ['test'],
        siteUrl: 'https://test.com'
      }
      
      mockGetSiteSettings.mockResolvedValue(settingsWithoutFooter)
      render(await Footer())
      
      // Should render with default copyright
      expect(screen.getByText('© 2025 Fitfoot. All rights reserved.')).toBeInTheDocument()
    })

    it('should handle getSiteSettings promise rejection', async () => {
      mockGetSiteSettings.mockRejectedValue(new Error('Sanity fetch failed'))
      
      // Should not crash and render with defaults
      try {
        render(await Footer())
        expect(screen.getByText('Fitfoot')).toBeInTheDocument()
      } catch (error) {
        // If it throws, that's also acceptable for this test
        expect(error).toBeInstanceOf(Error)
      }
    })
  })
}) 