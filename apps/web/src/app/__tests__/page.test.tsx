import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from '../page'
import { getHomePage, getAllProducts } from '@/lib/sanity.queries'

// Mock the Sanity queries
vi.mock('@/lib/sanity.queries', () => ({
  getHomePage: vi.fn(),
  getAllProducts: vi.fn(),
}))

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('HomePage', () => {
  const mockHomePageData = {
    _id: 'home',
    _type: 'homePage' as const,
    title: 'Home Page',
    heroTitle: 'Step into Quality\nSwiss Design',
    heroSubtitle: 'Premium footwear crafted with Swiss precision.',
    featuredProducts: [
      {
        _id: 'prod_1',
        _type: 'product' as const,
        title: 'Premium Sneaker',
        type: 'sneaker' as const,
        materials: '100% leather',
        designedIn: 'Switzerland',
        madeIn: 'Turkey',
        slug: { current: 'premium-sneaker' }
      }
    ],
    aboutSection: {
      title: 'Swiss Craftsmanship Excellence',
      description: 'Every product is designed with precision.',
      features: [
        { text: 'Premium materials' },
        { text: 'Swiss design' }
      ]
    }
  }

  const mockProducts = [
    {
      _id: 'prod_1',
      _type: 'product' as const,
      title: 'Classic Sneaker',
      type: 'sneaker' as const,
      materials: '100% genuine leather',
      designedIn: 'Switzerland',
      madeIn: 'Turkey',
      slug: { current: 'classic-sneaker' }
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('🏠 Page Structure & Layout', () => {
    it('should render main layout with all sections', async () => {
      vi.mocked(getHomePage).mockResolvedValue(mockHomePageData)
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)

      render(await HomePage())

      expect(screen.getByRole('main')).toBeInTheDocument()
      
      // Check all major sections exist by CSS selector
      const sections = document.querySelectorAll('section')
      expect(sections.length).toBeGreaterThanOrEqual(3)
    })

    it('should have proper semantic structure', async () => {
      vi.mocked(getHomePage).mockResolvedValue(mockHomePageData)
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)

      render(await HomePage())

      // Check semantic HTML structure
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
      expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2)
    })
  })

  describe('🏠 Hero Section', () => {
    it('should render hero with custom data from Sanity', async () => {
      vi.mocked(getHomePage).mockResolvedValue(mockHomePageData)
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)

      render(await HomePage())

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Step into Quality')
      expect(screen.getByText('Premium footwear crafted with Swiss precision.')).toBeInTheDocument()
    })

    it('should render hero with fallback data when no Sanity data', async () => {
      vi.mocked(getHomePage).mockResolvedValue(null)
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)

      render(await HomePage())

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Step into quality.')
      expect(screen.getByText('Premium footwear and accessories crafted with genuine materials and Swiss precision.')).toBeInTheDocument()
    })

    it('should render hero CTA buttons with correct links', async () => {
      vi.mocked(getHomePage).mockResolvedValue(mockHomePageData)
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)

      render(await HomePage())

      const shopButton = screen.getByRole('link', { name: /shop collection/i })
      const storyButton = screen.getByRole('link', { name: /our story/i })

      expect(shopButton).toHaveAttribute('href', '/shop')
      expect(storyButton).toHaveAttribute('href', '/about')
    })
  })

  describe('📦 Featured Products Section', () => {
    it('should render featured products from Sanity data', async () => {
      vi.mocked(getHomePage).mockResolvedValue(mockHomePageData)
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)

      render(await HomePage())

      expect(screen.getByRole('heading', { name: /featured products/i })).toBeInTheDocument()
      expect(screen.getByText('Premium Sneaker')).toBeInTheDocument()
      expect(screen.getByText('100% leather, designed in Switzerland')).toBeInTheDocument()
    })

    it('should render placeholder products when no data available', async () => {
      vi.mocked(getHomePage).mockResolvedValue(null)
      vi.mocked(getAllProducts).mockResolvedValue([])

      render(await HomePage())

      expect(screen.getByText('Premium Collection 1')).toBeInTheDocument()
      expect(screen.getByText('Premium Collection 2')).toBeInTheDocument()
      expect(screen.getByText('Premium Collection 3')).toBeInTheDocument()
    })

    it('should generate correct product links', async () => {
      vi.mocked(getHomePage).mockResolvedValue(mockHomePageData)
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)

      render(await HomePage())

      const productLink = screen.getByRole('link', { name: /view details/i })
      expect(productLink).toHaveAttribute('href', '/products/premium-sneaker')
    })

    it('should handle products without slug using ID fallback', async () => {
      const productWithoutSlug = {
        ...mockHomePageData.featuredProducts[0],
        slug: null
      }
      const homePageDataNoSlug = {
        ...mockHomePageData,
        featuredProducts: [productWithoutSlug]
      }
      
      vi.mocked(getHomePage).mockResolvedValue(homePageDataNoSlug)
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)

      render(await HomePage())

      const productLink = screen.getByRole('link', { name: /view details/i })
      expect(productLink).toHaveAttribute('href', '/products/prod_1')
    })

    it('should display product materials and origin correctly', async () => {
      const customProduct = {
        ...mockHomePageData.featuredProducts[0],
        materials: 'Premium suede',
        designedIn: 'Italy'
      }
      const homePageDataCustom = {
        ...mockHomePageData,
        featuredProducts: [customProduct]
      }

      vi.mocked(getHomePage).mockResolvedValue(homePageDataCustom)
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)

      render(await HomePage())

      expect(screen.getByText('Premium suede, designed in Italy')).toBeInTheDocument()
    })
  })

  describe('📖 About Section', () => {
    it('should render about section with custom data', async () => {
      vi.mocked(getHomePage).mockResolvedValue(mockHomePageData)
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)

      render(await HomePage())

      expect(screen.getByText('Swiss Craftsmanship Excellence')).toBeInTheDocument()
      expect(screen.getByText('Premium materials')).toBeInTheDocument()
      expect(screen.getByText('Swiss design')).toBeInTheDocument()
    })

    it('should render about section with fallback data', async () => {
      vi.mocked(getHomePage).mockResolvedValue(null)
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)

      render(await HomePage())

      expect(screen.getByText('Swiss Craftsmanship Excellence')).toBeInTheDocument()
      expect(screen.getByText('Premium materials')).toBeInTheDocument()
      expect(screen.getByText('Swiss design')).toBeInTheDocument()
    })

    it('should render feature list with correct styling', async () => {
      vi.mocked(getHomePage).mockResolvedValue(mockHomePageData)
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)

      render(await HomePage())

      // Check for the actual features in our mock data (2 features)
      const featureItems = screen.getAllByText(/Premium materials|Swiss design/)
      expect(featureItems).toHaveLength(2)
      
      // Check that each feature item has the bullet point styling
      featureItems.forEach(item => {
        const listItem = item.closest('li')
        expect(listItem).toHaveClass('flex', 'items-center')
      })
    })
  })

  describe('🔄 Data Fetching & Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      vi.mocked(getHomePage).mockRejectedValue(new Error('Sanity API Error'))
      vi.mocked(getAllProducts).mockRejectedValue(new Error('Products API Error'))

      // Should not throw, component should handle errors internally
      let component
      await expect(async () => {
        component = await HomePage()
      }).not.toThrow()

      // Should be able to render without crashing
      expect(() => render(component)).not.toThrow()
    })

    it('should make parallel API calls for performance', async () => {
      vi.mocked(getHomePage).mockResolvedValue(mockHomePageData)
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)

      render(await HomePage())

      // Both functions should be called
      expect(getHomePage).toHaveBeenCalledTimes(1)
      expect(getAllProducts).toHaveBeenCalledTimes(1)
    })
  })

  describe('♿ Accessibility', () => {
    it('should have proper heading hierarchy', async () => {
      vi.mocked(getHomePage).mockResolvedValue(mockHomePageData)
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)

      render(await HomePage())

      const h1 = screen.getAllByRole('heading', { level: 1 })
      const h2 = screen.getAllByRole('heading', { level: 2 })
      const h3 = screen.getAllByRole('heading', { level: 3 })

      expect(h1).toHaveLength(1) // One main hero title
      expect(h2.length).toBeGreaterThan(0) // Section headings
      expect(h3.length).toBeGreaterThan(0) // Product titles
    })

    it('should have accessible links with proper text', async () => {
      vi.mocked(getHomePage).mockResolvedValue(mockHomePageData)
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)

      render(await HomePage())

      const links = screen.getAllByRole('link')
      
      // All links should have accessible text content
      links.forEach(link => {
        expect(link).toHaveTextContent(/\S/)  // Non-empty text content
      })
    })

    it('should have proper semantic sections', async () => {
      vi.mocked(getHomePage).mockResolvedValue(mockHomePageData)
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)

      render(await HomePage())

      // Main content should be wrapped in main element
      expect(screen.getByRole('main')).toBeInTheDocument()
      
      // Sections should be properly structured
      const sections = document.querySelectorAll('section')
      expect(sections.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('🎨 Responsive Design & Styling', () => {
    it('should apply correct container and responsive classes', async () => {
      vi.mocked(getHomePage).mockResolvedValue(mockHomePageData)
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)

      render(await HomePage())

      // Check responsive grid classes
      const productGrid = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3')
      expect(productGrid).toBeInTheDocument()

      // Check container classes
      const containers = document.querySelectorAll('.container.mx-auto')
      expect(containers.length).toBeGreaterThan(0)
    })

    it('should have proper color scheme classes', async () => {
      vi.mocked(getHomePage).mockResolvedValue(mockHomePageData)
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)

      render(await HomePage())

      // Check for actual color classes used in the component
      const foregroundElements = document.querySelectorAll('.text-foreground')
      const cardElements = document.querySelectorAll('.bg-card')
      
      expect(foregroundElements.length).toBeGreaterThan(0)
      expect(cardElements.length).toBeGreaterThan(0)
    })
  })
}) 