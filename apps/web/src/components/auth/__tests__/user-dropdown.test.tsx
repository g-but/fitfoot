import { useAuth } from '@/contexts/AuthContext'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UserDropdown } from '../user-dropdown'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// Mock the AuthContext
vi.mock('@/contexts/AuthContext')

// Mock utils
vi.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}))

const mockLogout = vi.fn()
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

describe('UserDropdown', () => {
  const mockUser = {
    id: '1',
    email: 'john.doe@example.com',
    first_name: 'John',
    last_name: 'Doe',
    confirmed: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('When user is not logged in', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        isLoggedIn: false,
        logout: mockLogout,
        // ... other auth properties
      } as any)
    })

    it('should not render anything', () => {
      const { container } = render(<UserDropdown />)
      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('When user is logged in', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        isLoggedIn: true,
        logout: mockLogout,
        // ... other auth properties
      } as any)
    })

    it('should render user initials and name', () => {
      render(<UserDropdown />)
      
      expect(screen.getByText('JD')).toBeInTheDocument() // Initials
      expect(screen.getByText('John')).toBeInTheDocument() // First name
    })

    it('should show dropdown when clicked', async () => {
      const user = userEvent.setup()
      render(<UserDropdown />)
      
      const trigger = screen.getByRole('button', { name: /user menu/i })
      await user.click(trigger)
      
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
      expect(screen.getByText('Profile')).toBeInTheDocument()
      expect(screen.getByText('My Orders')).toBeInTheDocument()
      expect(screen.getByText('Wishlist')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
      expect(screen.getByText('Sign out')).toBeInTheDocument()
    })

    it('should close dropdown when clicking outside', async () => {
      const user = userEvent.setup()
      render(
        <div>
          <UserDropdown />
          <div data-testid="outside">Outside element</div>
        </div>
      )
      
      const trigger = screen.getByRole('button', { name: /user menu/i })
      await user.click(trigger)
      
      // Dropdown should be open
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
      
      // Click outside
      const outside = screen.getByTestId('outside')
      await user.click(outside)
      
      // Dropdown should be closed
      await waitFor(() => {
        expect(screen.queryByText('john.doe@example.com')).not.toBeInTheDocument()
      })
    })

    it('should close dropdown when pressing Escape', async () => {
      const user = userEvent.setup()
      render(<UserDropdown />)
      
      const trigger = screen.getByRole('button', { name: /user menu/i })
      await user.click(trigger)
      
      // Dropdown should be open
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
      
      // Press Escape
      await user.keyboard('{Escape}')
      
      // Dropdown should be closed
      await waitFor(() => {
        expect(screen.queryByText('john.doe@example.com')).not.toBeInTheDocument()
      })
    })

    it('should close dropdown when clicking menu items', async () => {
      const user = userEvent.setup()
      render(<UserDropdown />)
      
      const trigger = screen.getByRole('button', { name: /user menu/i })
      await user.click(trigger)
      
      // Click on Profile link
      const profileLink = screen.getByText('Profile')
      await user.click(profileLink)
      
      // Dropdown should be closed
      await waitFor(() => {
        expect(screen.queryByText('john.doe@example.com')).not.toBeInTheDocument()
      })
    })

    it('should call logout when sign out is clicked', async () => {
      const user = userEvent.setup()
      render(<UserDropdown />)
      
      const trigger = screen.getByRole('button', { name: /user menu/i })
      await user.click(trigger)
      
      const signOutButton = screen.getByText('Sign out')
      await user.click(signOutButton)
      
      expect(mockLogout).toHaveBeenCalledTimes(1)
    })

    it('should handle logout errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockLogout.mockRejectedValueOnce(new Error('Logout failed'))
      
      const user = userEvent.setup()
      render(<UserDropdown />)
      
      const trigger = screen.getByRole('button', { name: /user menu/i })
      await user.click(trigger)
      
      const signOutButton = screen.getByText('Sign out')
      await user.click(signOutButton)
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Logout failed:', expect.any(Error))
      })
      
      consoleSpy.mockRestore()
    })

    it('should show email confirmation warning for unconfirmed users', () => {
      mockUseAuth.mockReturnValue({
        user: { ...mockUser, confirmed: false },
        isLoggedIn: true,
        logout: mockLogout,
      } as any)
      
      render(<UserDropdown />)
      
      const trigger = screen.getByRole('button', { name: /user menu/i })
      fireEvent.click(trigger)
      
      expect(screen.getByText('Email not confirmed')).toBeInTheDocument()
    })

    it('should not show email confirmation warning for confirmed users', () => {
      render(<UserDropdown />)
      
      const trigger = screen.getByRole('button', { name: /user menu/i })
      fireEvent.click(trigger)
      
      expect(screen.queryByText('Email not confirmed')).not.toBeInTheDocument()
    })

    it('should have proper ARIA attributes', () => {
      render(<UserDropdown />)
      
      const trigger = screen.getByRole('button', { name: /user menu/i })
      
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).toHaveAttribute('aria-haspopup', 'true')
      
      fireEvent.click(trigger)
      
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
      
      const menu = screen.getByRole('menu')
      expect(menu).toHaveAttribute('aria-orientation', 'vertical')
    })

    it('should rotate chevron icon when dropdown is open', () => {
      render(<UserDropdown />)
      
      const trigger = screen.getByRole('button', { name: /user menu/i })
      const chevron = trigger.querySelector('svg')
      
      // Initially should not have rotation class
      expect(chevron).not.toHaveClass('transform rotate-180')
      
      fireEvent.click(trigger)
      
      // After opening should have rotation class
      expect(chevron).toHaveClass('transform rotate-180')
    })

    it('should truncate long user names properly', () => {
      const longNameUser = {
        ...mockUser,
        first_name: 'Verylongfirstnamethatexceedsmaximumlength',
      }
      
      mockUseAuth.mockReturnValue({
        user: longNameUser,
        isLoggedIn: true,
        logout: mockLogout,
      } as any)
      
      render(<UserDropdown />)
      
      const nameElement = screen.getByText('Verylongfirstnamethatexceedsmaximumlength')
      expect(nameElement).toHaveClass('max-w-32', 'truncate')
    })

    it('should have correct navigation links', () => {
      render(<UserDropdown />)
      
      const trigger = screen.getByRole('button', { name: /user menu/i })
      fireEvent.click(trigger)
      
      expect(screen.getByRole('link', { name: /profile/i })).toHaveAttribute('href', '/profile')
      expect(screen.getByRole('link', { name: /my orders/i })).toHaveAttribute('href', '/orders')
      expect(screen.getByRole('link', { name: /wishlist/i })).toHaveAttribute('href', '/wishlist')
      expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute('href', '/settings')
    })
  })
}) 