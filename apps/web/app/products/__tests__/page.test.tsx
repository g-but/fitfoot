import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProductsPage from '../page'
import { getAllProducts, getProductsPage } from '@/lib/sanity.queries'

// Mock the Sanity queries
vi.mock('@/lib/sanity.queries', () => ({
  getAllProducts: vi.fn(),
  getProductsPage: vi.fn(),
}))

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

const mockProductsPageData = {
  _id: 'products',
  _type: 'productsPage' as const,
  title: 'Products Page',
  heroTitle: 'Premium Swiss Products',
  heroSubtitle: 'Explore our collection of carefully crafted footwear and accessories, designed in Switzerland with attention to detail.',
  filterButtons: [
    { label: 'All Items', value: 'all' },
    { label: 'Footwear', value: 'sneaker' },
    { label: 'Accessories', value: 'bag' },
    { label: 'Headwear', value: 'cap' }
  ],
  ctaSection: {
    title: 'Looking for Something Specific?',
    description: 'Our team is always ready to help you find the perfect product or answer any questions.',
    buttonText: 'Get in Touch'
  }
}

const mockProducts = [
  {
    _id: 'prod1',
    title: 'Swiss Leather Sneaker',
    type: 'sneaker',
    materials: 'Premium Italian leather',
    designedIn: 'Switzerland',
    madeIn: 'Italy',
    image: {
      _type: 'image' as const,
      asset: {
        _ref: 'image-123',
        _type: 'reference' as const
      }
    }
  },
  {
    _id: 'prod2',
    title: 'Alpine Backpack',
    type: 'bag',
    materials: 'Waterproof canvas',
    designedIn: 'Switzerland',
    madeIn: 'Portugal',
    image: {
      _type: 'image' as const,
      asset: {
        _ref: 'image-456',
        _type: 'reference' as const
      }
    }
  }
]

describe('ProductsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('🏠 Page Structure & Layout', () => {
    it('should render main layout with all sections', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      // Check for main sections
      const sections = document.querySelectorAll('section')
      expect(sections.length).toBeGreaterThanOrEqual(4) // Hero, Filter, Products, CTA
    })

    it('should have proper semantic structure', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
      expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThan(0)
      expect(screen.getAllByRole('heading', { level: 3 }).length).toBeGreaterThan(0)
    })
  })

  describe('🎯 Hero Section', () => {
    it('should render hero with custom data from Sanity', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Premium Swiss Products')
      expect(screen.getByText('Explore our collection of carefully crafted footwear and accessories, designed in Switzerland with attention to detail.')).toBeInTheDocument()
    })

    it('should render hero with fallback data when no Sanity data', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(null)
      vi.mocked(getProductsPage).mockResolvedValue(null)

      render(await ProductsPage())

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Our Products')
      expect(screen.getByText(/Discover our collection of premium footwear and accessories/)).toBeInTheDocument()
    })

    it('should have centered hero layout', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      const heroContent = document.querySelector('section.bg-neutral-light .text-center')
      expect(heroContent).toBeInTheDocument()
    })
  })

  describe('🔍 Filter Section', () => {
    it('should render filter buttons with custom data from Sanity', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      expect(screen.getByRole('button', { name: 'All Items' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Footwear' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Accessories' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Headwear' })).toBeInTheDocument()
    })

    it('should render filter buttons with fallback data', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(null)
      vi.mocked(getProductsPage).mockResolvedValue(null)

      render(await ProductsPage())

      expect(screen.getByRole('button', { name: 'All Products' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Sneakers' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Bags' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Caps' })).toBeInTheDocument()
    })

    it('should render filter buttons with correct styling', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      const filterButtons = screen.getAllByRole('button').filter(button => 
        ['All Items', 'Footwear', 'Accessories', 'Headwear'].includes(button.textContent || '')
      )

      expect(filterButtons.length).toBe(4)
      filterButtons.forEach(button => {
        expect(button).toHaveClass('inline-flex')
      })
    })
  })

  describe('🛍️ Products Grid Section', () => {
    it('should render products with custom data from Sanity', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      expect(screen.getByText('Swiss Leather Sneaker')).toBeInTheDocument()
      expect(screen.getByText('Premium Italian leather')).toBeInTheDocument()
      expect(screen.getByText('Alpine Backpack')).toBeInTheDocument()
      expect(screen.getByText('Waterproof canvas')).toBeInTheDocument()
    })

    it('should render products with fallback data when no Sanity products', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(null)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      expect(screen.getByText('Alpine Sneaker')).toBeInTheDocument()
      expect(screen.getByText('Urban Backpack')).toBeInTheDocument()
      expect(screen.getByText('Classic Cap')).toBeInTheDocument()
      expect(screen.getByText('Mountain Boot')).toBeInTheDocument()
    })

    it('should render products with fallback data when empty products array', async () => {
      vi.mocked(getAllProducts).mockResolvedValue([])
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      // Should use fallback products
      expect(screen.getByText('Alpine Sneaker')).toBeInTheDocument()
      expect(screen.getByText('Travel Bag')).toBeInTheDocument()
      expect(screen.getByText('Sport Cap')).toBeInTheDocument()
    })

    it('should render product cards with all required information', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      // Check first product card
      expect(screen.getByText('Swiss Leather Sneaker')).toBeInTheDocument()
      expect(screen.getByText('Premium Italian leather')).toBeInTheDocument()
      
      // Use getAllByText since "Designed in Switzerland" appears in multiple cards
      const designedTexts = screen.getAllByText('Designed in Switzerland')
      expect(designedTexts.length).toBeGreaterThanOrEqual(2)
      
      expect(screen.getByText('Made in Italy')).toBeInTheDocument()
      
      // Check for type badge
      const sneakerBadge = document.querySelector('.capitalize')
      expect(sneakerBadge).toHaveTextContent('sneaker')
    })

    it('should render product image placeholders', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      // Check for image placeholder elements
      const imagePlaceholders = document.querySelectorAll('.aspect-square.bg-gray-200')
      expect(imagePlaceholders.length).toBeGreaterThanOrEqual(2)

      // Check for SVG icons in placeholders
      const svgIcons = document.querySelectorAll('svg')
      expect(svgIcons.length).toBeGreaterThanOrEqual(2)
    })

    it('should render View Details buttons for all products', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      const viewDetailsButtons = screen.getAllByRole('button', { name: 'View Details' })
      expect(viewDetailsButtons.length).toBe(mockProducts.length)
    })

    it('should render products in responsive grid', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      const productsGrid = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3')
      expect(productsGrid).toBeInTheDocument()
    })
  })

  describe('🚀 CTA Section', () => {
    it('should render CTA with custom data from Sanity', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      expect(screen.getByText('Looking for Something Specific?')).toBeInTheDocument()
      expect(screen.getByText('Our team is always ready to help you find the perfect product or answer any questions.')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Get in Touch' })).toHaveAttribute('href', '/contact')
    })

    it('should render CTA with fallback data', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(null)
      vi.mocked(getProductsPage).mockResolvedValue(null)

      render(await ProductsPage())

      expect(screen.getByText(/Can't find what you're looking for/)).toBeInTheDocument()
      expect(screen.getByText(/Get in touch with our team/)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Contact Us' })).toHaveAttribute('href', '/contact')
    })

    it('should have centered CTA layout', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      const ctaSections = document.querySelectorAll('section.bg-neutral-light')
      const ctaSection = ctaSections[ctaSections.length - 1] // Last section should be CTA
      expect(ctaSection.querySelector('.text-center')).toBeInTheDocument()
    })
  })

  describe('🔄 Data Fetching & Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(null)
      vi.mocked(getProductsPage).mockResolvedValue(null)

      // Should be able to render without crashing
      const component = await ProductsPage()
      expect(() => render(component)).not.toThrow()
    })

    it('should make API calls for both products and page data', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      expect(getAllProducts).toHaveBeenCalledTimes(1)
      expect(getProductsPage).toHaveBeenCalledTimes(1)
    })

    it('should handle partial Sanity data', async () => {
      const partialPageData = {
        _id: 'products',
        _type: 'productsPage' as const,
        title: 'Custom Products',
        heroTitle: 'Custom Title',
        // Missing other fields
      }

      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(partialPageData)

      render(await ProductsPage())

      expect(screen.getByText('Custom Title')).toBeInTheDocument()
      // Should use fallbacks for missing fields
      expect(screen.getByRole('button', { name: 'All Products' })).toBeInTheDocument()
      expect(screen.getByText(/Can't find what you're looking for/)).toBeInTheDocument()
    })
  })

  describe('♿ Accessibility', () => {
    it('should have proper heading hierarchy', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      const h1 = screen.getAllByRole('heading', { level: 1 })
      const h2 = screen.getAllByRole('heading', { level: 2 })
      const h3 = screen.getAllByRole('heading', { level: 3 })

      expect(h1).toHaveLength(1) // Main page title
      expect(h2.length).toBeGreaterThan(0) // CTA section heading
      expect(h3.length).toBeGreaterThan(0) // Product titles
    })

    it('should have accessible buttons and links', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      const buttons = screen.getAllByRole('button')
      const links = screen.getAllByRole('link')

      // All buttons should have accessible text content
      buttons.forEach(button => {
        expect(button).toHaveTextContent(/\S/)
      })

      // All links should have accessible text content
      links.forEach(link => {
        expect(link).toHaveTextContent(/\S/)
      })
    })

    it('should have proper semantic structure', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      // Check for proper section structure
      const sections = document.querySelectorAll('section')
      expect(sections.length).toBeGreaterThanOrEqual(4)
    })

    it('should have accessible product cards', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      // Product titles should be headings
      const productTitles = screen.getAllByRole('heading', { level: 3 })
      expect(productTitles.length).toBe(mockProducts.length)
    })
  })

  describe('🎨 Responsive Design & Styling', () => {
    it('should apply correct responsive grid classes', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      // Check for responsive product grid
      const productGrid = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3')
      expect(productGrid).toBeInTheDocument()

      // Check for responsive filter layout
      const filterContainer = document.querySelector('.flex.flex-wrap.gap-4.justify-center')
      expect(filterContainer).toBeInTheDocument()
    })

    it('should have proper spacing and layout classes', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      // Check for consistent spacing
      const containers = document.querySelectorAll('.container.mx-auto.px-4')
      expect(containers.length).toBeGreaterThanOrEqual(4)

      // Check for proper gaps
      const gapElements = document.querySelectorAll('.gap-4, .gap-8')
      expect(gapElements.length).toBeGreaterThan(0)
    })

    it('should have proper color scheme classes', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      // Check for consistent color usage
      const primaryElements = document.querySelectorAll('.text-primary')
      const accentElements = document.querySelectorAll('.bg-accent\\/10, .text-accent')
      const bgElements = document.querySelectorAll('.bg-neutral-light')

      expect(primaryElements.length).toBeGreaterThan(0)
      expect(accentElements.length).toBeGreaterThan(0)
      expect(bgElements.length).toBeGreaterThan(0)
    })

    it('should have proper product card styling', async () => {
      vi.mocked(getAllProducts).mockResolvedValue(mockProducts)
      vi.mocked(getProductsPage).mockResolvedValue(mockProductsPageData)

      render(await ProductsPage())

      // Check for consistent product card styling
      const productCards = document.querySelectorAll('.bg-white.rounded-lg.overflow-hidden.shadow-sm')
      expect(productCards.length).toBe(mockProducts.length)

      // Check for hover effects
      const hoverElements = document.querySelectorAll('.hover\\:shadow-md')
      expect(hoverElements.length).toBe(mockProducts.length)
    })
  })
}) 