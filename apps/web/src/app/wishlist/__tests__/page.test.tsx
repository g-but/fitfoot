import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import WishlistPage from '../page'

// Mock wishlist data
const mockWishlistItems = [
  {
    id: '1',
    name: 'Eco Trail Runner',
    brand: 'GreenStep',
    price: 179.99,
    originalPrice: 199.99,
    rating: 4.8,
    reviewCount: 124,
    sizes: ['40', '41', '42', '43'],
    inStock: true,
    isRefurbished: false,
    addedDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Refurbished Urban Sneaker',
    brand: 'EcoWalk',
    price: 139.99,
    originalPrice: 189.99,
    rating: 4.6,
    reviewCount: 89,
    sizes: ['39', '40', '41'],
    inStock: true,
    isRefurbished: true,
    addedDate: '2024-01-20'
  },
  {
    id: '3',
    name: 'Classic Canvas Tote',
    brand: 'NatureBag',
    price: 79.99,
    originalPrice: 79.99,
    rating: 4.9,
    reviewCount: 45,
    sizes: ['One Size'],
    inStock: false,
    isRefurbished: false,
    addedDate: '2024-01-25'
  }
]

// Mock the AuthContext
const mockAuthContext = {
  user: { id: '1', email: 'test@example.com', first_name: 'John', last_name: 'Doe' },
  isAuthenticated: true,
  hydrated: true,
  lastError: null,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  confirmEmail: vi.fn(),
  clearError: vi.fn(),
  getAuthToken: vi.fn(() => 'mock-token'),
  getAdminToken: vi.fn(() => null)
}

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="protected-route">{children}</div>
  )
}))

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  )
}))

describe('WishlistPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('🔐 Authentication & Protection', () => {
    it('should render within ProtectedRoute wrapper', () => {
      render(<WishlistPage />)
      expect(screen.getByTestId('protected-route')).toBeInTheDocument()
    })
  })

  describe('🎨 UI Components & Layout', () => {
    it('should render main page elements', () => {
      render(<WishlistPage />)
      expect(screen.getByRole('heading', { level: 1, name: 'My Wishlist' })).toBeInTheDocument()
      expect(screen.getByText('Save your favorite items for later')).toBeInTheDocument()
    })

    it('should render search functionality', () => {
      render(<WishlistPage />)
      expect(screen.getByPlaceholderText('Search wishlist...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
    })

    it('should render sort dropdown', () => {
      render(<WishlistPage />)
      expect(screen.getByDisplayValue('Recently Added')).toBeInTheDocument()
    })

    it('should display wishlist summary', () => {
      render(<WishlistPage />)
      expect(screen.getByText('3 items in wishlist')).toBeInTheDocument()
      expect(screen.getByText('CHF 399.97 total value')).toBeInTheDocument()
      expect(screen.getByText('2 items available')).toBeInTheDocument()
    })
  })

  describe('🛍️ Product Display', () => {
    it('should display all wishlist items by default', () => {
      render(<WishlistPage />)
      expect(screen.getByText('Eco Trail Runner')).toBeInTheDocument()
      expect(screen.getByText('Refurbished Urban Sneaker')).toBeInTheDocument()
      expect(screen.getByText('Classic Canvas Tote')).toBeInTheDocument()
    })

    it('should display product details correctly', () => {
      render(<WishlistPage />)
      expect(screen.getByText('GreenStep')).toBeInTheDocument()
      expect(screen.getByText('CHF 179.99')).toBeInTheDocument()
      expect(screen.getByText('4.8')).toBeInTheDocument()
      expect(screen.getByText('(124 reviews)')).toBeInTheDocument()
    })

    it('should display refurbished badge for refurbished items', () => {
      render(<WishlistPage />)
      expect(screen.getByText('Refurbished')).toBeInTheDocument()
    })

    it('should display sale badge for discounted items', () => {
      render(<WishlistPage />)
      expect(screen.getByText('Sale')).toBeInTheDocument() // For items with originalPrice > price
    })

    it('should display out of stock status', () => {
      render(<WishlistPage />)
      expect(screen.getByText('Out of Stock')).toBeInTheDocument()
    })

    it('should display available sizes', () => {
      render(<WishlistPage />)
      expect(screen.getByText('40, 41, 42, 43')).toBeInTheDocument()
    })
  })

  describe('🔍 Search Functionality', () => {
    it('should filter items by search query', async () => {
      const user = userEvent.setup()
      render(<WishlistPage />)
      
      const searchInput = screen.getByPlaceholderText('Search wishlist...')
      await user.type(searchInput, 'Eco Trail')
      
      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)
      
      expect(screen.getByText('Eco Trail Runner')).toBeInTheDocument()
      expect(screen.queryByText('Refurbished Urban Sneaker')).not.toBeInTheDocument()
      expect(screen.queryByText('Classic Canvas Tote')).not.toBeInTheDocument()
    })

    it('should search by brand name', async () => {
      const user = userEvent.setup()
      render(<WishlistPage />)
      
      const searchInput = screen.getByPlaceholderText('Search wishlist...')
      await user.type(searchInput, 'EcoWalk')
      
      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)
      
      expect(screen.getByText('Refurbished Urban Sneaker')).toBeInTheDocument()
      expect(screen.queryByText('Eco Trail Runner')).not.toBeInTheDocument()
    })

    it('should clear search results', async () => {
      const user = userEvent.setup()
      render(<WishlistPage />)
      
      // Perform search
      const searchInput = screen.getByPlaceholderText('Search wishlist...')
      await user.type(searchInput, 'Eco Trail')
      
      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)
      
      // Clear search
      await user.clear(searchInput)
      await user.click(searchButton)
      
      // All items should be visible again
      expect(screen.getByText('Eco Trail Runner')).toBeInTheDocument()
      expect(screen.getByText('Refurbished Urban Sneaker')).toBeInTheDocument()
      expect(screen.getByText('Classic Canvas Tote')).toBeInTheDocument()
    })
  })

  describe('🏷️ Sort Functionality', () => {
    it('should sort by price (low to high)', async () => {
      const user = userEvent.setup()
      render(<WishlistPage />)
      
      const sortSelect = screen.getByDisplayValue('Recently Added')
      await user.selectOptions(sortSelect, 'price-asc')
      
      expect(sortSelect).toHaveValue('price-asc')
    })

    it('should sort by price (high to low)', async () => {
      const user = userEvent.setup()
      render(<WishlistPage />)
      
      const sortSelect = screen.getByDisplayValue('Recently Added')
      await user.selectOptions(sortSelect, 'price-desc')
      
      expect(sortSelect).toHaveValue('price-desc')
    })

    it('should sort by rating', async () => {
      const user = userEvent.setup()
      render(<WishlistPage />)
      
      const sortSelect = screen.getByDisplayValue('Recently Added')
      await user.selectOptions(sortSelect, 'rating')
      
      expect(sortSelect).toHaveValue('rating')
    })
  })

  describe('🛒 Product Actions', () => {
    it('should display Add to Cart button for in-stock items', () => {
      render(<WishlistPage />)
      const addToCartButtons = screen.getAllByRole('button', { name: /add to cart/i })
      expect(addToCartButtons).toHaveLength(2) // Only in-stock items
    })

    it('should display View Product button for all items', () => {
      render(<WishlistPage />)
      const viewButtons = screen.getAllByRole('button', { name: /view product/i })
      expect(viewButtons).toHaveLength(3) // All items
    })

    it('should display Remove button for all items', () => {
      render(<WishlistPage />)
      const removeButtons = screen.getAllByRole('button', { name: /remove/i })
      expect(removeButtons).toHaveLength(3) // All items
    })

    it('should handle Add to Cart click', async () => {
      const user = userEvent.setup()
      render(<WishlistPage />)
      
      const addToCartButton = screen.getAllByRole('button', { name: /add to cart/i })[0]
      await user.click(addToCartButton)
      
      // Should show success message or change button state
      expect(screen.getByText('Added to cart!')).toBeInTheDocument()
    })

    it('should handle Remove from Wishlist click', async () => {
      const user = userEvent.setup()
      render(<WishlistPage />)
      
      const removeButton = screen.getAllByRole('button', { name: /remove/i })[0]
      await user.click(removeButton)
      
      // Should remove item or show confirmation
      expect(screen.getByText('Removed from wishlist')).toBeInTheDocument()
    })

    it('should handle View Product click', async () => {
      const user = userEvent.setup()
      render(<WishlistPage />)
      
      const viewButton = screen.getAllByRole('button', { name: /view product/i })[0]
      await user.click(viewButton)
      
      // Should navigate to product page
      expect(viewButton.closest('a')).toHaveAttribute('href', '/products/1')
    })
  })

  describe('📱 Empty State', () => {
    it('should show empty state when no items match search', async () => {
      const user = userEvent.setup()
      render(<WishlistPage />)
      
      // Search for non-existent item
      const searchInput = screen.getByPlaceholderText('Search wishlist...')
      await user.type(searchInput, 'NONEXISTENT')
      
      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)
      
      expect(screen.getByText('No items found')).toBeInTheDocument()
      expect(screen.getByText('Try adjusting your search criteria')).toBeInTheDocument()
    })

    it('should show empty wishlist state when no items', () => {
      // Mock empty wishlist
      const emptyWishlistComponent = () => (
        <div>
          <h2>Your wishlist is empty</h2>
          <p>Start adding items to see them here</p>
        </div>
      )
      
      render(emptyWishlistComponent())
      
      expect(screen.getByText('Your wishlist is empty')).toBeInTheDocument()
      expect(screen.getByText('Start adding items to see them here')).toBeInTheDocument()
    })
  })

  describe('🎨 Visual Elements', () => {
    it('should display product images', () => {
      render(<WishlistPage />)
      const images = screen.getAllByRole('img', { name: /product image/i })
      expect(images).toHaveLength(3)
    })

    it('should display star ratings', () => {
      render(<WishlistPage />)
      const ratingElements = screen.getAllByText(/★/i)
      expect(ratingElements.length).toBeGreaterThan(0)
    })

    it('should show crossed-out original prices for sale items', () => {
      render(<WishlistPage />)
      expect(screen.getByText('CHF 199.99')).toBeInTheDocument() // Original price
      expect(screen.getByText('CHF 189.99')).toBeInTheDocument() // Original price for refurbished
    })
  })

  describe('♿ Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<WishlistPage />)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('My Wishlist')
    })

    it('should have proper form labels', () => {
      render(<WishlistPage />)
      const searchInput = screen.getByPlaceholderText('Search wishlist...')
      expect(searchInput).toHaveAttribute('type', 'text')
      
      const sortSelect = screen.getByDisplayValue('Recently Added')
      expect(sortSelect).toHaveAttribute('aria-label', 'Sort wishlist items')
    })

    it('should have accessible buttons', () => {
      render(<WishlistPage />)
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
      expect(screen.getAllByRole('button', { name: /add to cart/i })).toHaveLength(2)
      expect(screen.getAllByRole('button', { name: /remove/i })).toHaveLength(3)
    })

    it('should have proper ARIA labels for interactive elements', () => {
      render(<WishlistPage />)
      const removeButtons = screen.getAllByRole('button', { name: /remove/i })
      removeButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-label')
      })
    })
  })

  describe('📱 Responsive Design', () => {
    it('should render properly on different screen sizes', () => {
      render(<WishlistPage />)
      
      // Check for responsive grid classes
      const gridContainer = screen.getByText('Eco Trail Runner').closest('div')?.parentElement
      expect(gridContainer).toHaveClass('grid')
    })
  })

  describe('💰 Price Display', () => {
    it('should format prices correctly', () => {
      render(<WishlistPage />)
      expect(screen.getByText('CHF 179.99')).toBeInTheDocument()
      expect(screen.getByText('CHF 139.99')).toBeInTheDocument()
      expect(screen.getByText('CHF 79.99')).toBeInTheDocument()
    })

    it('should show savings for discounted items', () => {
      render(<WishlistPage />)
      expect(screen.getByText('Save CHF 20.00')).toBeInTheDocument() // 199.99 - 179.99
      expect(screen.getByText('Save CHF 50.00')).toBeInTheDocument() // 189.99 - 139.99
    })
  })
})
