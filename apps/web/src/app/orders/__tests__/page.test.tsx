import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import OrdersPage from '../page'

// Mock orders data
const mockOrders = [
  {
    id: '1',
    number: 'FF-2024-001',
    status: 'delivered' as const,
    date: '2024-01-15',
    total: 299.99,
    items: [
      {
        id: '1',
        name: 'Eco Trail Runner',
        image: '/placeholder.jpg',
        size: '42',
        color: 'Forest Green',
        quantity: 1,
        price: 179.99
      }
    ],
    shipping_address: {
      street: 'Test Street 123',
      city: 'Zurich',
      postal_code: '8001',
      country: 'Switzerland'
    },
    tracking_number: 'CH-POST-123456789'
  },
  {
    id: '2',
    number: 'FF-2024-002',
    status: 'shipped' as const,
    date: '2024-01-20',
    total: 159.99,
    items: [
      {
        id: '2',
        name: 'Urban Sneaker',
        image: '/placeholder.jpg',
        size: '41',
        color: 'Classic White',
        quantity: 1,
        price: 139.99
      }
    ],
    shipping_address: {
      street: 'Test Street 123',
      city: 'Zurich',
      postal_code: '8001',
      country: 'Switzerland'
    },
    tracking_number: 'CH-POST-987654321'
  },
  {
    id: '3',
    number: 'FF-2024-003',
    status: 'pending' as const,
    date: '2024-01-25',
    total: 99.99,
    items: [
      {
        id: '3',
        name: 'Canvas Tote Bag',
        image: '/placeholder.jpg',
        size: 'One Size',
        color: 'Natural',
        quantity: 1,
        price: 79.99
      }
    ],
    shipping_address: {
      street: 'Test Street 123',
      city: 'Zurich',
      postal_code: '8001',
      country: 'Switzerland'
    }
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

describe('OrdersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('🔐 Authentication & Protection', () => {
    it('should render within ProtectedRoute wrapper', () => {
      render(<OrdersPage />)
      expect(screen.getByTestId('protected-route')).toBeInTheDocument()
    })
  })

  describe('🎨 UI Components & Layout', () => {
    it('should render main page elements', () => {
      render(<OrdersPage />)
      expect(screen.getByRole('heading', { level: 1, name: 'My Orders' })).toBeInTheDocument()
      expect(screen.getByText('Track and manage your orders')).toBeInTheDocument()
    })

    it('should render search functionality', () => {
      render(<OrdersPage />)
      expect(screen.getByPlaceholderText('Search orders...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
    })

    it('should render filter buttons', () => {
      render(<OrdersPage />)
      expect(screen.getByRole('button', { name: 'All Orders' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Pending' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Shipped' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Delivered' })).toBeInTheDocument()
    })

    it('should display order summary stats', () => {
      render(<OrdersPage />)
      expect(screen.getByText('3 orders total')).toBeInTheDocument()
      expect(screen.getByText('CHF 559.97 lifetime value')).toBeInTheDocument()
    })
  })

  describe('📦 Order Display', () => {
    it('should display all orders by default', () => {
      render(<OrdersPage />)
      expect(screen.getByText('FF-2024-001')).toBeInTheDocument()
      expect(screen.getByText('FF-2024-002')).toBeInTheDocument()
      expect(screen.getByText('FF-2024-003')).toBeInTheDocument()
    })

    it('should display order details correctly', () => {
      render(<OrdersPage />)
      expect(screen.getByText('Eco Trail Runner')).toBeInTheDocument()
      expect(screen.getByText('CHF 299.99')).toBeInTheDocument()
      expect(screen.getByText('January 15, 2024')).toBeInTheDocument()
    })

    it('should display order status badges', () => {
      render(<OrdersPage />)
      expect(screen.getByText('Delivered')).toBeInTheDocument()
      expect(screen.getByText('Shipped')).toBeInTheDocument()
      expect(screen.getByText('Pending')).toBeInTheDocument()
    })

    it('should display tracking numbers for shipped orders', () => {
      render(<OrdersPage />)
      expect(screen.getAllByText(/tracking:/i)).toHaveLength(2) // Only shipped and delivered orders
      expect(screen.getByText('CH-POST-123456789')).toBeInTheDocument()
      expect(screen.getByText('CH-POST-987654321')).toBeInTheDocument()
    })
  })

  describe('🔍 Search Functionality', () => {
    it('should filter orders by search query', async () => {
      const user = userEvent.setup()
      render(<OrdersPage />)
      
      const searchInput = screen.getByPlaceholderText('Search orders...')
      await user.type(searchInput, 'FF-2024-001')
      
      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)
      
      expect(screen.getByText('FF-2024-001')).toBeInTheDocument()
      expect(screen.queryByText('FF-2024-002')).not.toBeInTheDocument()
      expect(screen.queryByText('FF-2024-003')).not.toBeInTheDocument()
    })

    it('should search by product name', async () => {
      const user = userEvent.setup()
      render(<OrdersPage />)
      
      const searchInput = screen.getByPlaceholderText('Search orders...')
      await user.type(searchInput, 'Urban Sneaker')
      
      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)
      
      expect(screen.getByText('Urban Sneaker')).toBeInTheDocument()
      expect(screen.queryByText('Eco Trail Runner')).not.toBeInTheDocument()
    })

    it('should clear search results', async () => {
      const user = userEvent.setup()
      render(<OrdersPage />)
      
      // Perform search
      const searchInput = screen.getByPlaceholderText('Search orders...')
      await user.type(searchInput, 'FF-2024-001')
      
      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)
      
      // Clear search
      await user.clear(searchInput)
      await user.click(searchButton)
      
      // All orders should be visible again
      expect(screen.getByText('FF-2024-001')).toBeInTheDocument()
      expect(screen.getByText('FF-2024-002')).toBeInTheDocument()
      expect(screen.getByText('FF-2024-003')).toBeInTheDocument()
    })
  })

  describe('🏷️ Status Filtering', () => {
    it('should filter by pending status', async () => {
      const user = userEvent.setup()
      render(<OrdersPage />)
      
      const pendingButton = screen.getByRole('button', { name: 'Pending' })
      await user.click(pendingButton)
      
      expect(screen.getByText('FF-2024-003')).toBeInTheDocument()
      expect(screen.queryByText('FF-2024-001')).not.toBeInTheDocument()
      expect(screen.queryByText('FF-2024-002')).not.toBeInTheDocument()
    })

    it('should filter by shipped status', async () => {
      const user = userEvent.setup()
      render(<OrdersPage />)
      
      const shippedButton = screen.getByRole('button', { name: 'Shipped' })
      await user.click(shippedButton)
      
      expect(screen.getByText('FF-2024-002')).toBeInTheDocument()
      expect(screen.queryByText('FF-2024-001')).not.toBeInTheDocument()
      expect(screen.queryByText('FF-2024-003')).not.toBeInTheDocument()
    })

    it('should filter by delivered status', async () => {
      const user = userEvent.setup()
      render(<OrdersPage />)
      
      const deliveredButton = screen.getByRole('button', { name: 'Delivered' })
      await user.click(deliveredButton)
      
      expect(screen.getByText('FF-2024-001')).toBeInTheDocument()
      expect(screen.queryByText('FF-2024-002')).not.toBeInTheDocument()
      expect(screen.queryByText('FF-2024-003')).not.toBeInTheDocument()
    })

    it('should show all orders when All Orders is clicked', async () => {
      const user = userEvent.setup()
      render(<OrdersPage />)
      
      // First filter by delivered
      const deliveredButton = screen.getByRole('button', { name: 'Delivered' })
      await user.click(deliveredButton)
      
      // Then click All Orders
      const allOrdersButton = screen.getByRole('button', { name: 'All Orders' })
      await user.click(allOrdersButton)
      
      expect(screen.getByText('FF-2024-001')).toBeInTheDocument()
      expect(screen.getByText('FF-2024-002')).toBeInTheDocument()
      expect(screen.getByText('FF-2024-003')).toBeInTheDocument()
    })
  })

  describe('📋 Order Details', () => {
    it('should expand order details when clicked', async () => {
      const user = userEvent.setup()
      render(<OrdersPage />)
      
      const orderCard = screen.getByText('FF-2024-001').closest('div')
      expect(orderCard).toBeInTheDocument()
      
      await user.click(orderCard!)
      
      expect(screen.getByText('Order Timeline')).toBeInTheDocument()
      expect(screen.getByText('Shipping Address')).toBeInTheDocument()
    })

    it('should display shipping address in expanded view', async () => {
      const user = userEvent.setup()
      render(<OrdersPage />)
      
      const orderCard = screen.getByText('FF-2024-001').closest('div')
      await user.click(orderCard!)
      
      expect(screen.getByText('Test Street 123')).toBeInTheDocument()
      expect(screen.getByText('8001 Zurich')).toBeInTheDocument()
      expect(screen.getByText('Switzerland')).toBeInTheDocument()
    })

    it('should display order timeline', async () => {
      const user = userEvent.setup()
      render(<OrdersPage />)
      
      const orderCard = screen.getByText('FF-2024-001').closest('div')
      await user.click(orderCard!)
      
      expect(screen.getByText('Order Placed')).toBeInTheDocument()
      expect(screen.getByText('Processing')).toBeInTheDocument()
      expect(screen.getByText('Shipped')).toBeInTheDocument()
      expect(screen.getByText('Delivered')).toBeInTheDocument()
    })
  })

  describe('📱 Empty State', () => {
    it('should show empty state when no orders match filters', async () => {
      const user = userEvent.setup()
      render(<OrdersPage />)
      
      // Search for non-existent order
      const searchInput = screen.getByPlaceholderText('Search orders...')
      await user.type(searchInput, 'NONEXISTENT')
      
      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)
      
      expect(screen.getByText('No orders found')).toBeInTheDocument()
      expect(screen.getByText('Try adjusting your search or filter criteria')).toBeInTheDocument()
    })
  })

  describe('♿ Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<OrdersPage />)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('My Orders')
    })

    it('should have proper button roles', () => {
      render(<OrdersPage />)
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'All Orders' })).toBeInTheDocument()
    })

    it('should have accessible form controls', () => {
      render(<OrdersPage />)
      const searchInput = screen.getByPlaceholderText('Search orders...')
      expect(searchInput).toHaveAttribute('type', 'text')
    })
  })
})
