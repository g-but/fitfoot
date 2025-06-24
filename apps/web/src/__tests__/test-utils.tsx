import { render, RenderOptions } from '@testing-library/react'
import React from 'react'
import { vi } from 'vitest'

// Mock user data for testing
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
  phone: '+41 79 123 45 67',
  confirmed: true,
  created_at: '2024-01-01T00:00:00Z'
}

export const mockUnconfirmedUser = {
  ...mockUser,
  confirmed: false
}

// Mock AuthContext with different states
export const createMockAuthContext = (isAuthenticated = true, user = mockUser) => ({
  user: isAuthenticated ? user : null,
  isAuthenticated,
  hydrated: true,
  lastError: null,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  confirmEmail: vi.fn(),
  clearError: vi.fn(),
  getAuthToken: vi.fn(() => isAuthenticated ? 'mock-token' : null),
  getAdminToken: vi.fn(() => null)
})

// Auth wrapper for testing authenticated components
interface AuthWrapperProps {
  children: React.ReactNode
  isAuthenticated?: boolean
  user?: typeof mockUser | null
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ 
  children, 
  isAuthenticated = true, 
  user = mockUser 
}) => {
  // Mock the AuthProvider
  const mockContext = createMockAuthContext(isAuthenticated, user)
  
  return (
    <div data-testid="auth-wrapper">
      {React.cloneElement(children as React.ReactElement, { 
        ...mockContext 
      })}
    </div>
  )
}

// Custom render function with AuthProvider
export const renderWithAuth = (
  ui: React.ReactElement,
  options: RenderOptions & { 
    isAuthenticated?: boolean
    user?: typeof mockUser | null
  } = {}
) => {
  const { isAuthenticated = true, user = mockUser, ...renderOptions } = options
  
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AuthWrapper isAuthenticated={isAuthenticated} user={user}>
      {children}
    </AuthWrapper>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Mock API responses
export const mockApiResponses = {
  profileSuccess: {
    success: true,
    profile: {
      id: '1',
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      phone: '+41 79 123 45 67',
      date_of_birth: '1990-01-01',
      address: {
        street: 'Test Street 123',
        city: 'Zurich',
        postal_code: '8001',
        country: 'Switzerland'
      },
      confirmed: true,
      created_at: '2024-01-01T00:00:00Z'
    }
  },
  
  profileError: {
    error: 'Failed to load profile'
  },
  
  updateSuccess: {
    success: true,
    message: 'Profile updated successfully',
    profile: mockApiResponses.profileSuccess.profile
  },
  
  updateError: {
    error: 'Failed to update profile'
  }
}

// Mock fetch responses
export const mockFetch = (response: any, status = 200) => {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(response),
    headers: new Headers(),
    statusText: status === 200 ? 'OK' : 'Error'
  })
}

// Mock fetch with error
export const mockFetchError = (message = 'Network error') => {
  return vi.fn().mockRejectedValue(new Error(message))
}

// Helper to wait for async operations
export const waitForAsyncOperations = () => 
  new Promise(resolve => setTimeout(resolve, 0))

// Mock orders data
export const mockOrders = [
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
    }
  }
]

// Mock wishlist data
export const mockWishlistItems = [
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
  }
]

// Mock settings data
export const mockSettings = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '+41 79 123 45 67',
  emailNotifications: true,
  pushNotifications: true,
  twoFactorEnabled: false,
  language: 'en',
  currency: 'CHF'
}

// Helper to simulate user interactions
export const userInteractions = {
  fillInput: (element: HTMLElement, value: string) => {
    element.focus()
    ;(element as HTMLInputElement).value = value
    element.dispatchEvent(new Event('input', { bubbles: true }))
    element.dispatchEvent(new Event('change', { bubbles: true }))
  },
  
  selectOption: (element: HTMLElement, value: string) => {
    ;(element as HTMLSelectElement).value = value
    element.dispatchEvent(new Event('change', { bubbles: true }))
  },
  
  toggleCheckbox: (element: HTMLElement) => {
    ;(element as HTMLInputElement).checked = !(element as HTMLInputElement).checked
    element.dispatchEvent(new Event('change', { bubbles: true }))
  }
}

// Clean up functions for tests
export const cleanupMocks = () => {
  vi.clearAllMocks()
  vi.resetAllMocks()
}

export default render 