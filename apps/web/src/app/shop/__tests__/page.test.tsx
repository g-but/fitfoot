import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ShopPage from '../page'
import { getProducts, getCollections } from '@/lib/medusa.client'

// Mock the Medusa client
vi.mock('@/lib/medusa.client', () => ({
  getProducts: vi.fn(),
  getCollections: vi.fn(),
}))

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

const mockMedusaProducts = [
  {
    id: 'medusa-1',
    title: 'Medusa Leather Sneaker',
    description: 'High-quality leather sneaker from live inventory',
    handle: 'medusa-leather-sneaker',
    status: 'published',
    images: [{ id: 'img-1', url: 'https://example.com/sneaker.jpg' }],
    variants: [{
      id: 'var-1',
      title: 'Default',
      prices: [{ amount: 29900, currency_code: 'CHF' }]
    }],
    tags: [{ id: 'tag-1', value: 'sneakers' }],
    collection: { id: 'col-1', handle: 'sneakers', title: 'Sneakers' }
  },
  {
    id: 'medusa-2',
    title: 'Medusa Luxury Bag',
    description: 'Premium bag from live inventory',
    handle: 'medusa-luxury-bag',
    status: 'published',
    images: [{ id: 'img-2', url: 'https://example.com/bag.jpg' }],
    variants: [{
      id: 'var-2',
      title: 'Default',
      prices: [{ amount: 44900, currency_code: 'CHF' }]
    }],
    tags: [{ id: 'tag-2', value: 'bags' }],
    collection: { id: 'col-2', handle: 'bags', title: 'Bags' }
  }
]

const mockMedusaCollections = [
  { id: 'col-1', title: 'Sneakers', handle: 'sneakers' },
  { id: 'col-2', title: 'Bags', handle: 'bags' },
  { id: 'col-3', title: 'Caps', handle: 'caps' }
]

describe('ShopPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock console.error to avoid noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('🏠 Page Structure & Layout', () => {
    it('should render loading state initially', async () => {
      vi.mocked(getProducts).mockImplementation(() => new Promise(() => {})) // Never resolves
      vi.mocked(getCollections).mockImplementation(() => new Promise(() => {}))

      render(<ShopPage />)

      expect(screen.getByText('Loading products...')).toBeInTheDocument()
      expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('should render main layout after loading with Medusa data', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      // Check for main sections
      const sections = document.querySelectorAll('section')
      expect(sections.length).toBeGreaterThanOrEqual(4) // Hero, Filter, Products, CTA
    })

    it('should have proper semantic structure', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
      expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThan(0)
      expect(screen.getAllByRole('heading', { level: 3 }).length).toBeGreaterThan(0)
    })
  })

  describe('🎯 Hero Section', () => {
    it('should render hero section with correct content', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Shop Collection')
      expect(screen.getByText(/Discover our premium collection of Swiss-designed footwear/)).toBeInTheDocument()
    })

    it('should display error message in hero when API fails', async () => {
      vi.mocked(getProducts).mockRejectedValue(new Error('API Error'))
      vi.mocked(getCollections).mockRejectedValue(new Error('API Error'))

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      expect(screen.getByText('Using demo products. Connect to Medusa for live inventory.')).toBeInTheDocument()
      expect(document.querySelector('.bg-yellow-100')).toBeInTheDocument()
    })

    it('should have centered hero layout', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      const heroContent = document.querySelector('section.bg-neutral-light .text-center')
      expect(heroContent).toBeInTheDocument()
    })
  })

  describe('🔍 Filter Section', () => {
    it('should render filter buttons with Medusa collections', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      expect(screen.getByRole('button', { name: 'All Products' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Sneakers' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Bags' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Caps' })).toBeInTheDocument()
    })

    it('should render filter buttons with fallback collections when API fails', async () => {
      vi.mocked(getProducts).mockRejectedValue(new Error('API Error'))
      vi.mocked(getCollections).mockRejectedValue(new Error('API Error'))

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      expect(screen.getByRole('button', { name: 'All Products' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Sneakers' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Bags' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Caps' })).toBeInTheDocument()
    })

    it('should handle filter selection', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      const sneakersButton = screen.getByRole('button', { name: 'Sneakers' })
      fireEvent.click(sneakersButton)

      // Button should change appearance when selected
      expect(sneakersButton).toHaveClass('bg-accent')
    })

    it('should filter products by selected collection', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      // Initially should show all products
      expect(screen.getByText('Medusa Leather Sneaker')).toBeInTheDocument()
      expect(screen.getByText('Medusa Luxury Bag')).toBeInTheDocument()

      // Filter by sneakers
      const sneakersButton = screen.getByRole('button', { name: 'Sneakers' })
      fireEvent.click(sneakersButton)

      // Should only show sneaker products
      expect(screen.getByText('Medusa Leather Sneaker')).toBeInTheDocument()
      expect(screen.queryByText('Medusa Luxury Bag')).not.toBeInTheDocument()
    })
  })

  describe('🛍️ Products Grid Section', () => {
    it('should render products with Medusa data', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      expect(screen.getByText('Medusa Leather Sneaker')).toBeInTheDocument()
      expect(screen.getByText('High-quality leather sneaker from live inventory')).toBeInTheDocument()
      expect(screen.getByText('Medusa Luxury Bag')).toBeInTheDocument()
      expect(screen.getByText('Premium bag from live inventory')).toBeInTheDocument()
    })

    it('should render products with fallback data when API fails', async () => {
      vi.mocked(getProducts).mockRejectedValue(new Error('API Error'))
      vi.mocked(getCollections).mockRejectedValue(new Error('API Error'))

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      expect(screen.getByText('Alpine Sneaker')).toBeInTheDocument()
      expect(screen.getByText('Urban Backpack')).toBeInTheDocument()
      expect(screen.getByText('Classic Cap')).toBeInTheDocument()
    })

    it('should render products with fallback data when empty response', async () => {
      vi.mocked(getProducts).mockResolvedValue([])
      vi.mocked(getCollections).mockResolvedValue([])

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      // Should use mock data as fallback
      expect(screen.getByText('Alpine Sneaker')).toBeInTheDocument()
      expect(screen.getByText('Urban Backpack')).toBeInTheDocument()
    })

    it('should format prices correctly in Swiss format', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      // Should format price as Swiss CHF
      expect(screen.getByText('CHF 299.00')).toBeInTheDocument() // 29900 cents = CHF 299.00
      expect(screen.getByText('CHF 449.00')).toBeInTheDocument() // 44900 cents = CHF 449.00
    })

    it('should render product images with error handling', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      const productImages = document.querySelectorAll('img')
      expect(productImages.length).toBe(mockMedusaProducts.length)

      // Test image error handling
      const firstImage = productImages[0]
      fireEvent.error(firstImage)
      
      // Should fallback to placeholder when image fails
      expect(firstImage.src).toContain('data:image/svg+xml')
    })

    it('should render product tags and categories', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      // Check for product tags
      expect(screen.getByText('sneakers')).toBeInTheDocument()
      expect(screen.getByText('bags')).toBeInTheDocument()
    })

    it('should render e-commerce action buttons', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      const viewDetailsButtons = screen.getAllByRole('button', { name: 'View Details' })
      const addToCartButtons = screen.getAllByRole('button', { name: 'Add to Cart' })

      expect(viewDetailsButtons.length).toBe(mockMedusaProducts.length)
      expect(addToCartButtons.length).toBe(mockMedusaProducts.length)
    })

    it('should render products in responsive grid', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      const productsGrid = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-4')
      expect(productsGrid).toBeInTheDocument()
    })

    it('should show empty state when no products match filter', async () => {
      // Mock data with no caps
      const productsWithoutCaps = mockMedusaProducts.filter(p => 
        !p.tags?.some(tag => tag.value === 'caps')
      )
      
      vi.mocked(getProducts).mockResolvedValue(productsWithoutCaps)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      // Filter by caps (should show empty state)
      const capsButton = screen.getByRole('button', { name: 'Caps' })
      fireEvent.click(capsButton)

      expect(screen.getByText('No products found in this category.')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'View All Products' })).toBeInTheDocument()
    })

    it('should handle "View All Products" button in empty state', async () => {
      const productsWithoutCaps = mockMedusaProducts.filter(p => 
        !p.tags?.some(tag => tag.value === 'caps')
      )
      
      vi.mocked(getProducts).mockResolvedValue(productsWithoutCaps)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      // Filter by caps to show empty state
      const capsButton = screen.getByRole('button', { name: 'Caps' })
      fireEvent.click(capsButton)

      // Click "View All Products"
      const viewAllButton = screen.getByRole('button', { name: 'View All Products' })
      fireEvent.click(viewAllButton)

      // Should return to showing all products
      expect(screen.getByText('Medusa Leather Sneaker')).toBeInTheDocument()
      expect(screen.getByText('Medusa Luxury Bag')).toBeInTheDocument()
    })
  })

  describe('🚀 CTA Section', () => {
    it('should render CTA section with correct content', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      expect(screen.getByText('Need Help Finding the Perfect Product?')).toBeInTheDocument()
      expect(screen.getByText(/Our team is here to help you find exactly what you're looking for/)).toBeInTheDocument()
    })

    it('should render CTA buttons with correct links', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      const contactLink = screen.getByRole('link', { name: 'Contact Us' })
      const learnMoreLink = screen.getByRole('link', { name: 'Learn More' })

      expect(contactLink).toHaveAttribute('href', '/contact')
      expect(learnMoreLink).toHaveAttribute('href', '/about')
    })

    it('should have centered CTA layout', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      const ctaSections = document.querySelectorAll('section.bg-neutral-light')
      const ctaSection = ctaSections[ctaSections.length - 1] // Last section should be CTA
      expect(ctaSection.querySelector('.text-center')).toBeInTheDocument()
    })
  })

  describe('🔄 Data Fetching & Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      vi.mocked(getProducts).mockRejectedValue(new Error('Network Error'))
      vi.mocked(getCollections).mockRejectedValue(new Error('Network Error'))

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      // Should show error message and fallback to mock data
      expect(screen.getByText('Using demo products. Connect to Medusa for live inventory.')).toBeInTheDocument()
      expect(screen.getByText('Alpine Sneaker')).toBeInTheDocument()
    })

    it('should make API calls for products and collections', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      expect(getProducts).toHaveBeenCalledTimes(1)
      expect(getProducts).toHaveBeenCalledWith({ limit: 50 })
      expect(getCollections).toHaveBeenCalledTimes(1)
    })

    it('should handle partial API failures', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockRejectedValue(new Error('Collections API Error'))

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      // Should show error message but still render products
      expect(screen.getByText('Using demo products. Connect to Medusa for live inventory.')).toBeInTheDocument()
      expect(screen.getByText('Alpine Sneaker')).toBeInTheDocument()
    })
  })

  describe('♿ Accessibility', () => {
    it('should have proper heading hierarchy', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      const h1 = screen.getAllByRole('heading', { level: 1 })
      const h2 = screen.getAllByRole('heading', { level: 2 })
      const h3 = screen.getAllByRole('heading', { level: 3 })

      expect(h1).toHaveLength(1) // Main page title
      expect(h2.length).toBeGreaterThan(0) // CTA section heading
      expect(h3.length).toBeGreaterThan(0) // Product titles
    })

    it('should have accessible buttons and links', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      const buttons = screen.getAllByRole('button')
      const links = screen.getAllByRole('link')

      // All buttons should have accessible text content
      buttons.forEach(button => {
        expect(button).toHaveTextContent(/\S/)
      })

      // All links should have accessible text content and href
      links.forEach(link => {
        expect(link).toHaveTextContent(/\S/)
        expect(link).toHaveAttribute('href')
      })
    })

    it('should have proper image alt text', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      const productImages = document.querySelectorAll('img')
      productImages.forEach(img => {
        expect(img).toHaveAttribute('alt')
      })
    })

    it('should have accessible loading state', () => {
      vi.mocked(getProducts).mockImplementation(() => new Promise(() => {}))
      vi.mocked(getCollections).mockImplementation(() => new Promise(() => {}))

      render(<ShopPage />)

      expect(screen.getByText('Loading products...')).toBeInTheDocument()
      
      // Loading spinner should be accessible
      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('🎨 Responsive Design & Styling', () => {
    it('should apply correct responsive grid classes', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      // Check for responsive product grid
      const productGrid = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-4')
      expect(productGrid).toBeInTheDocument()

      // Check for responsive filter layout
      const filterContainer = document.querySelector('.flex.flex-wrap.gap-4.justify-center')
      expect(filterContainer).toBeInTheDocument()
    })

    it('should have proper spacing and layout classes', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      // Check for consistent spacing
      const containers = document.querySelectorAll('.container.mx-auto.px-4')
      expect(containers.length).toBeGreaterThanOrEqual(4)

      // Check for proper gaps
      const gapElements = document.querySelectorAll('.gap-4, .gap-8')
      expect(gapElements.length).toBeGreaterThan(0)
    })

    it('should have proper product card hover effects', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      // Check for hover effects on product cards
      const productCards = document.querySelectorAll('.hover\\:shadow-lg')
      expect(productCards.length).toBe(mockMedusaProducts.length)

      // Check for image hover effects
      const productImages = document.querySelectorAll('.hover\\:scale-105')
      expect(productImages.length).toBe(mockMedusaProducts.length)
    })

    it('should have proper color scheme classes', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      // Check for consistent color usage
      const primaryElements = document.querySelectorAll('.text-primary')
      const accentElements = document.querySelectorAll('.bg-accent')
      const bgElements = document.querySelectorAll('.bg-neutral-light')

      expect(primaryElements.length).toBeGreaterThan(0)
      expect(accentElements.length).toBeGreaterThan(0)
      expect(bgElements.length).toBeGreaterThan(0)
    })
  })

  describe('⚡ Performance & User Experience', () => {
    it('should handle rapid filter changes', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      const allButton = screen.getByRole('button', { name: 'All Products' })
      const sneakersButton = screen.getByRole('button', { name: 'Sneakers' })
      const bagsButton = screen.getByRole('button', { name: 'Bags' })

      // Rapidly change filters
      fireEvent.click(sneakersButton)
      fireEvent.click(bagsButton)
      fireEvent.click(allButton)

      // Should handle changes gracefully
      expect(screen.getByText('Medusa Leather Sneaker')).toBeInTheDocument()
      expect(screen.getByText('Medusa Luxury Bag')).toBeInTheDocument()
    })

    it('should maintain state during interactions', async () => {
      vi.mocked(getProducts).mockResolvedValue(mockMedusaProducts)
      vi.mocked(getCollections).mockResolvedValue(mockMedusaCollections)

      render(<ShopPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
      })

      // Select a filter
      const sneakersButton = screen.getByRole('button', { name: 'Sneakers' })
      fireEvent.click(sneakersButton)

      // Verify selection is maintained
      expect(sneakersButton).toHaveClass('bg-accent')
      expect(screen.getByText('Medusa Leather Sneaker')).toBeInTheDocument()
    })
  })
}) 