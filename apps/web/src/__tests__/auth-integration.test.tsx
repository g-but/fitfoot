import ForgotPassword from '@/app/auth/forgot-password/page'
import Login from '@/app/auth/login/page'
import Register from '@/app/auth/register/page'
import { AuthProvider } from '@/contexts/AuthContext'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(() => null),
  }),
}))

// Mock fetch
global.fetch = vi.fn()

const MockedFetch = global.fetch as any

const renderWithAuth = (component: React.ReactElement) => {
  return render(<AuthProvider>{component}</AuthProvider>)
}

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    MockedFetch.mockClear()
    localStorage.clear()
  })

  describe('Login Flow', () => {
    it('should handle successful login', async () => {
      const user = userEvent.setup()
      
      MockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          token: 'mock-token',
          customer: {
            id: '1',
            email: 'test@example.com',
            first_name: 'John',
            last_name: 'Doe',
          },
        }),
      })

      renderWithAuth(<Login />)

      await user.type(screen.getByPlaceholderText(/enter your email/i), 'test@example.com')
      await user.type(screen.getByPlaceholderText(/enter your password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(MockedFetch).toHaveBeenCalledWith('http://localhost:9000/auth/customer/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
          }),
        })
      })
    })

    it('should handle login errors', async () => {
      const user = userEvent.setup()
      
      MockedFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({
          error: 'Invalid credentials',
        }),
      })

      renderWithAuth(<Login />)

      await user.type(screen.getByPlaceholderText(/enter your email/i), 'test@example.com')
      await user.type(screen.getByPlaceholderText(/enter your password/i), 'wrongpassword')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
      })
    })
  })

  describe('Registration Flow', () => {
    it('should handle successful registration', async () => {
      const user = userEvent.setup()
      
      MockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          message: 'Registration successful! Please check your email to confirm your account.',
        }),
      })

      renderWithAuth(<Register />)

      await user.type(screen.getByPlaceholderText(/first name/i), 'John')
      await user.type(screen.getByPlaceholderText(/last name/i), 'Doe')
      await user.type(screen.getByPlaceholderText(/email address/i), 'john@example.com')
      await user.type(screen.getByPlaceholderText(/create password/i), 'password123')
      await user.type(screen.getByPlaceholderText(/confirm password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(MockedFetch).toHaveBeenCalledWith('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            password: 'password123',
            confirmPassword: 'password123',
            phone: '',
          }),
        })
      })

      expect(screen.getByText(/check your email/i)).toBeInTheDocument()
    })

    it('should validate password confirmation', async () => {
      const user = userEvent.setup()

      renderWithAuth(<Register />)

      await user.type(screen.getByPlaceholderText(/first name/i), 'John')
      await user.type(screen.getByPlaceholderText(/last name/i), 'Doe')
      await user.type(screen.getByPlaceholderText(/email address/i), 'john@example.com')
      await user.type(screen.getByPlaceholderText(/create password/i), 'password123')
      await user.type(screen.getByPlaceholderText(/confirm password/i), 'different123')
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
      })
    })
  })

  describe('Forgot Password Flow', () => {
    it('should handle forgot password request', async () => {
      const user = userEvent.setup()
      
      MockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          message: 'If an account with that email exists, we have sent you a password reset link.',
        }),
      })

      renderWithAuth(<ForgotPassword />)

      await user.type(screen.getByPlaceholderText(/enter your email address/i), 'test@example.com')
      await user.click(screen.getByRole('button', { name: /send reset link/i }))

      await waitFor(() => {
        expect(MockedFetch).toHaveBeenCalledWith('/api/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
          }),
        })
      })

      expect(screen.getByText(/check your email/i)).toBeInTheDocument()
    })

    it('should validate email format', async () => {
      const user = userEvent.setup()

      renderWithAuth(<ForgotPassword />)

      await user.type(screen.getByPlaceholderText(/enter your email address/i), 'invalid-email')
      await user.click(screen.getByRole('button', { name: /send reset link/i }))

      // Should show HTML5 validation error (email input type handles this)
      const emailInput = screen.getByPlaceholderText(/enter your email address/i)
      expect(emailInput).toBeInvalid()
    })
  })

  describe('Authentication State Management', () => {
    it('should persist authentication state in localStorage', async () => {
      const user = userEvent.setup()
      
      MockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          token: 'mock-token',
          customer: {
            id: '1',
            email: 'test@example.com',
            first_name: 'John',
            last_name: 'Doe',
          },
        }),
      })

      renderWithAuth(<Login />)

      await user.type(screen.getByPlaceholderText(/enter your email/i), 'test@example.com')
      await user.type(screen.getByPlaceholderText(/enter your password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(localStorage.getItem('customer_token')).toBe('mock-token')
        expect(JSON.parse(localStorage.getItem('customer_user') || '{}')).toEqual({
          id: '1',
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
        })
      })
    })
  })
}) 