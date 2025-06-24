import { act, renderHook, waitFor } from '@testing-library/react'
import { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider, useAuth } from '../AuthContext'

// Mock Next.js router
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock fetch
global.fetch = vi.fn()

// Test wrapper component
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper })

      expect(result.current.user).toBeNull()
      expect(result.current.adminUser).toBeNull()
      expect(result.current.loading).toBe(true) // Initially loading
      expect(result.current.isLoggedIn).toBe(false)
      expect(result.current.isAdmin).toBe(false)
      expect(result.current.lastError).toBeNull()
    })

    it('should restore user from localStorage on initialization', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        confirmed: true,
      }

      localStorageMock.getItem
        .mockReturnValueOnce('mock-token') // customer_token
        .mockReturnValueOnce(JSON.stringify(mockUser)) // customer_user

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper })

      await waitFor(() => {
        expect(result.current.hydrated).toBe(true)
      })

      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isLoggedIn).toBe(true)
      expect(result.current.loading).toBe(false)
    })

    it('should handle corrupted localStorage data gracefully', async () => {
      localStorageMock.getItem
        .mockReturnValueOnce('mock-token')
        .mockReturnValueOnce('invalid-json')

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper })

      await waitFor(() => {
        expect(result.current.hydrated).toBe(true)
      })

      expect(result.current.user).toBeNull()
      expect(consoleSpy).toHaveBeenCalled()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('customer_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('customer_user')
    })
  })

  describe('Registration', () => {
    it('should handle successful registration', async () => {
      const mockResponse = {
        success: true,
        message: 'Registration successful! Please check your email.',
        confirmationUrl: 'http://localhost:3000/auth/confirm-email?token=abc123'
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper })

      await waitFor(() => {
        expect(result.current.hydrated).toBe(true)
      })

      let registrationResult: any
      await act(async () => {
        registrationResult = await result.current.registerCustomer({
          email: 'test@example.com',
          password: 'password123',
          first_name: 'John',
          last_name: 'Doe',
        })
      })

      expect(registrationResult).toEqual(mockResponse)
      expect(result.current.lastError).toBeNull()
      expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          first_name: 'John',
          last_name: 'Doe',
        }),
      })
    })

    it('should handle registration errors', async () => {
      const mockError = {
        error: 'Email already exists'
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve(mockError),
      })

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper })

      await waitFor(() => {
        expect(result.current.hydrated).toBe(true)
      })

      let registrationResult: any
      await act(async () => {
        registrationResult = await result.current.registerCustomer({
          email: 'test@example.com',
          password: 'password123',
          first_name: 'John',
          last_name: 'Doe',
        })
      })

      expect(registrationResult.success).toBe(false)
      expect(registrationResult.message).toBe('Email already exists')
      expect(result.current.lastError).toBe('Email already exists')
    })

    it('should handle network errors during registration', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper })

      await waitFor(() => {
        expect(result.current.hydrated).toBe(true)
      })

      let registrationResult: any
      await act(async () => {
        registrationResult = await result.current.registerCustomer({
          email: 'test@example.com',
          password: 'password123',
          first_name: 'John',
          last_name: 'Doe',
        })
      })

      expect(registrationResult.success).toBe(false)
      expect(registrationResult.message).toBe('Network error. Please try again.')
      expect(result.current.lastError).toBe('Network error. Please try again.')
    })
  })

  describe('Email Confirmation', () => {
    it('should handle successful email confirmation', async () => {
      const mockResponse = {
        success: true,
        message: 'Email confirmed successfully!'
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper })

      await waitFor(() => {
        expect(result.current.hydrated).toBe(true)
      })

      let confirmResult: any
      await act(async () => {
        confirmResult = await result.current.confirmEmail('valid-token')
      })

      expect(confirmResult).toEqual(mockResponse)
      expect(result.current.lastError).toBeNull()
      expect(fetch).toHaveBeenCalledWith('/api/auth/confirm-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: 'valid-token' }),
      })
    })

    it('should handle email confirmation errors', async () => {
      const mockError = {
        error: 'Invalid or expired token'
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve(mockError),
      })

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper })

      await waitFor(() => {
        expect(result.current.hydrated).toBe(true)
      })

      let confirmResult: any
      await act(async () => {
        confirmResult = await result.current.confirmEmail('invalid-token')
      })

      expect(confirmResult.success).toBe(false)
      expect(confirmResult.error).toBe('Invalid or expired token')
      expect(result.current.lastError).toBe('Invalid or expired token')
    })
  })

  describe('Customer Login', () => {
    it('should handle successful login', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
      }

      const mockResponse = {
        token: 'mock-token',
        customer: mockUser,
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper })

      await waitFor(() => {
        expect(result.current.hydrated).toBe(true)
      })

      let loginResult: any
      await act(async () => {
        loginResult = await result.current.loginAsCustomer('test@example.com', 'password123')
      })

      expect(loginResult).toBe(true)
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isLoggedIn).toBe(true)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('customer_token', 'mock-token')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('customer_user', JSON.stringify(mockUser))
    })

    it('should handle login errors', async () => {
      const mockError = {
        error: 'Invalid credentials'
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve(mockError),
      })

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper })

      await waitFor(() => {
        expect(result.current.hydrated).toBe(true)
      })

      await expect(async () => {
        await act(async () => {
          await result.current.loginAsCustomer('test@example.com', 'wrongpassword')
        })
      }).rejects.toThrow('Invalid credentials')
    })
  })

  describe('Logout', () => {
    it('should handle successful logout', async () => {
      // Setup logged in user
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
      }

      localStorageMock.getItem
        .mockReturnValueOnce('mock-token')
        .mockReturnValueOnce(JSON.stringify(mockUser))

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      })

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper })

      await waitFor(() => {
        expect(result.current.hydrated).toBe(true)
        expect(result.current.isLoggedIn).toBe(true)
      })

      await act(async () => {
        await result.current.logout()
      })

      expect(result.current.user).toBeNull()
      expect(result.current.isLoggedIn).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('customer_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('customer_user')
    })

    it('should handle logout even when API call fails', async () => {
      // Setup logged in user
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
      }

      localStorageMock.getItem
        .mockReturnValueOnce('mock-token')
        .mockReturnValueOnce(JSON.stringify(mockUser))

      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper })

      await waitFor(() => {
        expect(result.current.hydrated).toBe(true)
        expect(result.current.isLoggedIn).toBe(true)
      })

      await act(async () => {
        await result.current.logout()
      })

      // Should still clear local state even if API call fails
      expect(result.current.user).toBeNull()
      expect(result.current.isLoggedIn).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('customer_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('customer_user')
    })
  })

  describe('Error Handling', () => {
    it('should clear errors when clearError is called', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper })

      await waitFor(() => {
        expect(result.current.hydrated).toBe(true)
      })

      // Simulate an error by making a failed registration
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Test error' }),
      })

      await act(async () => {
        await result.current.registerCustomer({
          email: 'test@example.com',
          password: 'password123',
          first_name: 'John',
          last_name: 'Doe',
        })
      })

      expect(result.current.lastError).toBe('Test error')

      act(() => {
        result.current.clearError()
      })

      expect(result.current.lastError).toBeNull()
    })
  })

  describe('Token Management', () => {
    it('should return customer token', () => {
      localStorageMock.getItem.mockReturnValue('mock-customer-token')

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper })

      const token = result.current.getAuthToken()
      expect(token).toBe('mock-customer-token')
      expect(localStorageMock.getItem).toHaveBeenCalledWith('customer_token')
    })

    it('should return admin token', () => {
      localStorageMock.getItem.mockReturnValue('mock-admin-token')

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper })

      const token = result.current.getAdminToken()
      expect(token).toBe('mock-admin-token')
      expect(localStorageMock.getItem).toHaveBeenCalledWith('admin_token')
    })

    it('should return null when no token exists', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper })

      expect(result.current.getAuthToken()).toBeNull()
      expect(result.current.getAdminToken()).toBeNull()
    })
  })
}) 