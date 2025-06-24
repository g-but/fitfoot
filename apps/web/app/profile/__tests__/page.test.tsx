import { useAuth } from '@/contexts/AuthContext'
import { createMockAuthContext, mockUser } from '@/src/__tests__/test-utils'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ProfilePage from '../page'

// Mock the AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <div data-testid="protected-route">{children}</div>
}))

// Mock Next.js navigation
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  )
}))

describe('ProfilePage', () => {
  const mockAuthContext = createMockAuthContext()
  
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(mockAuthContext)
    global.fetch = vi.fn()
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  describe('🔐 Authentication & Protection', () => {
    it('should render within ProtectedRoute wrapper', () => {
      render(<ProfilePage />)
      
      expect(screen.getByTestId('protected-route')).toBeInTheDocument()
    })

    it('should display user information when authenticated', () => {
      render(<ProfilePage />)
      
      expect(screen.getByText('My Profile')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    it('should show email verification status for confirmed user', () => {
      render(<ProfilePage />)
      
      expect(screen.getByText('Email Verified')).toBeInTheDocument()
      expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument()
    })

    it('should show email verification status for unconfirmed user', () => {
      const unconfirmedUser = { ...mockUser, confirmed: false }
      vi.mocked(useAuth).mockReturnValue(createMockAuthContext(true, unconfirmedUser))
      
      render(<ProfilePage />)
      
      expect(screen.getByText('Email Not Verified')).toBeInTheDocument()
      expect(screen.getByText('Resend Verification')).toBeInTheDocument()
    })
  })

  describe('🎨 UI Components & Layout', () => {
    it('should render main page elements', () => {
      render(<ProfilePage />)
      
      expect(screen.getByRole('heading', { level: 1, name: 'My Profile' })).toBeInTheDocument()
      expect(screen.getByText('Manage your personal information and preferences')).toBeInTheDocument()
      expect(screen.getByText('Edit Profile')).toBeInTheDocument()
    })

    it('should render user avatar with initials', () => {
      render(<ProfilePage />)
      
      // Look for the avatar containing initials
      const avatar = screen.getByText('JD') // John Doe initials
      expect(avatar).toBeInTheDocument()
      expect(avatar.closest('div')).toHaveClass('bg-amber-600')
    })

    it('should render quick actions sidebar', () => {
      render(<ProfilePage />)
      
      expect(screen.getByText('Quick Actions')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /view orders/i })).toHaveAttribute('href', '/orders')
      expect(screen.getByRole('link', { name: /my wishlist/i })).toHaveAttribute('href', '/wishlist')
      expect(screen.getByRole('link', { name: /account settings/i })).toHaveAttribute('href', '/settings')
    })

    it('should render personal information form fields', () => {
      render(<ProfilePage />)
      
      expect(screen.getByText('Personal Information')).toBeInTheDocument()
      expect(screen.getByText('First Name')).toBeInTheDocument()
      expect(screen.getByText('Last Name')).toBeInTheDocument()
      expect(screen.getByText('Email Address')).toBeInTheDocument()
      expect(screen.getByText('Phone Number')).toBeInTheDocument()
    })

    it('should render address section', () => {
      render(<ProfilePage />)
      
      expect(screen.getByText('Address Information')).toBeInTheDocument()
      expect(screen.getByText('Street Address')).toBeInTheDocument()
      expect(screen.getByText('City')).toBeInTheDocument()
      expect(screen.getByText('Postal Code')).toBeInTheDocument()
      expect(screen.getByText('Country')).toBeInTheDocument()
    })
  })

  describe('✏️ Edit Mode Functionality', () => {
    it('should enter edit mode when Edit Profile button is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<ProfilePage />)
      
      const editButton = screen.getByRole('button', { name: /edit profile/i })
      await user.click(editButton)
      
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /edit profile/i })).not.toBeInTheDocument()
    })

    it('should show form inputs in edit mode', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<ProfilePage />)
      
      const editButton = screen.getByRole('button', { name: /edit profile/i })
      await user.click(editButton)
      
      expect(screen.getByDisplayValue('John')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument()
      expect(screen.getByDisplayValue('+41 79 123 45 67')).toBeInTheDocument()
    })

    it('should exit edit mode when Cancel button is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<ProfilePage />)
      
      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i })
      await user.click(editButton)
      
      // Cancel editing
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)
      
      expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /save changes/i })).not.toBeInTheDocument()
    })

    it('should handle form input changes', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<ProfilePage />)
      
      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i })
      await user.click(editButton)
      
      // Change first name
      const firstNameInput = screen.getByDisplayValue('John')
      await user.clear(firstNameInput)
      await user.type(firstNameInput, 'Jane')
      
      expect(screen.getByDisplayValue('Jane')).toBeInTheDocument()
    })
  })

  describe('💾 Save Functionality', () => {
    it('should show saving state when Save button is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<ProfilePage />)
      
      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i })
      await user.click(editButton)
      
      // Click save
      const saveButton = screen.getByRole('button', { name: /save changes/i })
      await user.click(saveButton)
      
      expect(screen.getByText('Saving...')).toBeInTheDocument()
      expect(saveButton).toBeDisabled()
    })

    it('should show success message after successful save', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<ProfilePage />)
      
      // Enter edit mode and save
      const editButton = screen.getByRole('button', { name: /edit profile/i })
      await user.click(editButton)
      
      const saveButton = screen.getByRole('button', { name: /save changes/i })
      await user.click(saveButton)
      
      // Advance timer to complete the save operation
      vi.advanceTimersByTime(1000)
      
      await waitFor(() => {
        expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument()
      })
      
      // Should exit edit mode
      expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument()
    })

    it('should clear success message after timeout', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<ProfilePage />)
      
      // Enter edit mode and save
      const editButton = screen.getByRole('button', { name: /edit profile/i })
      await user.click(editButton)
      
      const saveButton = screen.getByRole('button', { name: /save changes/i })
      await user.click(saveButton)
      
      // Complete save operation
      vi.advanceTimersByTime(1000)
      
      await waitFor(() => {
        expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument()
      })
      
      // Advance timer to clear success message
      vi.advanceTimersByTime(3000)
      
      await waitFor(() => {
        expect(screen.queryByText('Profile updated successfully!')).not.toBeInTheDocument()
      })
    })
  })

  describe('🌍 Address Management', () => {
    it('should handle address field changes in edit mode', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<ProfilePage />)
      
      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i })
      await user.click(editButton)
      
      // Find and update street address input
      const streetInput = screen.getByPlaceholderText('Street address')
      await user.type(streetInput, 'Bahnhofstrasse 123')
      
      expect(streetInput).toHaveValue('Bahnhofstrasse 123')
    })

    it('should handle country selection', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<ProfilePage />)
      
      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i })
      await user.click(editButton)
      
      // Find country select and change value
      const countrySelect = screen.getByDisplayValue('Switzerland')
      await user.selectOptions(countrySelect, 'Germany')
      
      expect(countrySelect).toHaveValue('Germany')
    })
  })

  describe('🚨 Error Handling', () => {
    it('should display validation messages for required fields', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<ProfilePage />)
      
      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i })
      await user.click(editButton)
      
      // Clear required field
      const firstNameInput = screen.getByDisplayValue('John')
      await user.clear(firstNameInput)
      
      // Try to save
      const saveButton = screen.getByRole('button', { name: /save changes/i })
      await user.click(saveButton)
      
      // Should still be in edit mode since validation failed
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
    })
  })

  describe('📱 Responsive Design', () => {
    it('should render properly on different screen sizes', () => {
      render(<ProfilePage />)
      
      // Check for responsive grid classes
      const mainContainer = screen.getByText('My Profile').closest('div')
      expect(mainContainer?.querySelector('.lg\\:grid-cols-3')).toBeInTheDocument()
    })
  })

  describe('♿ Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<ProfilePage />)
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('My Profile')
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('John Doe')
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Quick Actions')
    })

    it('should have proper form labels', () => {
      render(<ProfilePage />)
      
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    })

    it('should have proper button roles and labels', () => {
      render(<ProfilePage />)
      
      expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /resend verification/i })).toBeInTheDocument()
    })
  })
}) 