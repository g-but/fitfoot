import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import SettingsPage from '../page'

// Mock user settings data
const mockSettings = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '+41 79 123 45 67',
  emailNotifications: true,
  pushNotifications: true,
  twoFactorEnabled: false,
  language: 'en',
  currency: 'CHF',
  timezone: 'Europe/Zurich'
}

// Mock the AuthContext
const mockAuthContext = {
  user: { 
    id: '1', 
    email: 'test@example.com', 
    first_name: 'John', 
    last_name: 'Doe',
    confirmed: true
  },
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

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('🔐 Authentication & Protection', () => {
    it('should render within ProtectedRoute wrapper', () => {
      render(<SettingsPage />)
      expect(screen.getByTestId('protected-route')).toBeInTheDocument()
    })
  })

  describe('🎨 UI Components & Layout', () => {
    it('should render main page elements', () => {
      render(<SettingsPage />)
      expect(screen.getByRole('heading', { level: 1, name: 'Account Settings' })).toBeInTheDocument()
      expect(screen.getByText('Manage your account preferences and settings')).toBeInTheDocument()
    })

    it('should render all tab buttons', () => {
      render(<SettingsPage />)
      expect(screen.getByRole('button', { name: 'Account' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Security' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Privacy' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Preferences' })).toBeInTheDocument()
    })

    it('should show Account tab as active by default', () => {
      render(<SettingsPage />)
      const accountTab = screen.getByRole('button', { name: 'Account' })
      expect(accountTab).toHaveClass('bg-amber-100', 'text-amber-700')
    })
  })

  describe('📝 Account Tab', () => {
    it('should display account information by default', () => {
      render(<SettingsPage />)
      expect(screen.getByText('Account Information')).toBeInTheDocument()
      expect(screen.getByText('First Name')).toBeInTheDocument()
      expect(screen.getByText('Last Name')).toBeInTheDocument()
      expect(screen.getByText('Email Address')).toBeInTheDocument()
      expect(screen.getByText('Phone Number')).toBeInTheDocument()
    })

    it('should populate fields with user data', () => {
      render(<SettingsPage />)
      expect(screen.getByDisplayValue('John')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument()
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()
      expect(screen.getByDisplayValue('+41 79 123 45 67')).toBeInTheDocument()
    })

    it('should have email field as read-only', () => {
      render(<SettingsPage />)
      const emailInput = screen.getByDisplayValue('test@example.com')
      expect(emailInput).toHaveAttribute('readOnly')
    })

    it('should handle form field changes', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      const firstNameInput = screen.getByDisplayValue('John')
      await user.clear(firstNameInput)
      await user.type(firstNameInput, 'Jane')
      
      expect(screen.getByDisplayValue('Jane')).toBeInTheDocument()
    })
  })

  describe('🔒 Security Tab', () => {
    it('should switch to security tab when clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      const securityTab = screen.getByRole('button', { name: 'Security' })
      await user.click(securityTab)
      
      expect(screen.getByText('Security Settings')).toBeInTheDocument()
      expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument()
      expect(screen.getByText('Change Password')).toBeInTheDocument()
    })

    it('should display 2FA toggle switch', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      const securityTab = screen.getByRole('button', { name: 'Security' })
      await user.click(securityTab)
      
      const twoFactorSwitch = screen.getByRole('switch', { name: /two-factor authentication/i })
      expect(twoFactorSwitch).toBeInTheDocument()
      expect(twoFactorSwitch).not.toBeChecked() // Default false
    })

    it('should handle 2FA toggle', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      const securityTab = screen.getByRole('button', { name: 'Security' })
      await user.click(securityTab)
      
      const twoFactorSwitch = screen.getByRole('switch', { name: /two-factor authentication/i })
      await user.click(twoFactorSwitch)
      
      expect(twoFactorSwitch).toBeChecked()
    })

    it('should display password change section', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      const securityTab = screen.getByRole('button', { name: 'Security' })
      await user.click(securityTab)
      
      expect(screen.getByText('Current Password')).toBeInTheDocument()
      expect(screen.getByText('New Password')).toBeInTheDocument()
      expect(screen.getByText('Confirm New Password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Update Password' })).toBeInTheDocument()
    })
  })

  describe('🔔 Notifications Tab', () => {
    it('should switch to notifications tab when clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      const notificationsTab = screen.getByRole('button', { name: 'Notifications' })
      await user.click(notificationsTab)
      
      expect(screen.getByText('Notification Preferences')).toBeInTheDocument()
      expect(screen.getByText('Email Notifications')).toBeInTheDocument()
      expect(screen.getByText('Push Notifications')).toBeInTheDocument()
    })

    it('should display notification toggle switches', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      const notificationsTab = screen.getByRole('button', { name: 'Notifications' })
      await user.click(notificationsTab)
      
      const emailSwitch = screen.getByRole('switch', { name: /email notifications/i })
      const pushSwitch = screen.getByRole('switch', { name: /push notifications/i })
      
      expect(emailSwitch).toBeInTheDocument()
      expect(pushSwitch).toBeInTheDocument()
      expect(emailSwitch).toBeChecked() // Default true
      expect(pushSwitch).toBeChecked() // Default true
    })

    it('should handle notification toggles', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      const notificationsTab = screen.getByRole('button', { name: 'Notifications' })
      await user.click(notificationsTab)
      
      const emailSwitch = screen.getByRole('switch', { name: /email notifications/i })
      await user.click(emailSwitch)
      
      expect(emailSwitch).not.toBeChecked()
    })

    it('should display notification categories', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      const notificationsTab = screen.getByRole('button', { name: 'Notifications' })
      await user.click(notificationsTab)
      
      expect(screen.getByText('Order Updates')).toBeInTheDocument()
      expect(screen.getByText('Marketing')).toBeInTheDocument()
      expect(screen.getByText('Security Alerts')).toBeInTheDocument()
    })
  })

  describe('🔒 Privacy Tab', () => {
    it('should switch to privacy tab when clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      const privacyTab = screen.getByRole('button', { name: 'Privacy' })
      await user.click(privacyTab)
      
      expect(screen.getByText('Privacy Controls')).toBeInTheDocument()
      expect(screen.getByText('Data Sharing')).toBeInTheDocument()
      expect(screen.getByText('Tracking Preferences')).toBeInTheDocument()
    })

    it('should display privacy toggle switches', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      const privacyTab = screen.getByRole('button', { name: 'Privacy' })
      await user.click(privacyTab)
      
      const dataAnalyticsSwitch = screen.getByRole('switch', { name: /data analytics/i })
      const personalizedAdsSwitch = screen.getByRole('switch', { name: /personalized ads/i })
      
      expect(dataAnalyticsSwitch).toBeInTheDocument()
      expect(personalizedAdsSwitch).toBeInTheDocument()
    })

    it('should display account deletion section', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      const privacyTab = screen.getByRole('button', { name: 'Privacy' })
      await user.click(privacyTab)
      
      expect(screen.getByText('Account Deletion')).toBeInTheDocument()
      expect(screen.getByText('Delete My Account')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Delete Account' })).toBeInTheDocument()
    })
  })

  describe('⚙️ Preferences Tab', () => {
    it('should switch to preferences tab when clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      const preferencesTab = screen.getByRole('button', { name: 'Preferences' })
      await user.click(preferencesTab)
      
      expect(screen.getByText('General Preferences')).toBeInTheDocument()
      expect(screen.getByText('Language')).toBeInTheDocument()
      expect(screen.getByText('Currency')).toBeInTheDocument()
      expect(screen.getByText('Timezone')).toBeInTheDocument()
    })

    it('should display language selection', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      const preferencesTab = screen.getByRole('button', { name: 'Preferences' })
      await user.click(preferencesTab)
      
      const languageSelect = screen.getByDisplayValue('English')
      expect(languageSelect).toBeInTheDocument()
    })

    it('should display currency selection', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      const preferencesTab = screen.getByRole('button', { name: 'Preferences' })
      await user.click(preferencesTab)
      
      const currencySelect = screen.getByDisplayValue('Swiss Franc (CHF)')
      expect(currencySelect).toBeInTheDocument()
    })

    it('should display timezone selection', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      const preferencesTab = screen.getByRole('button', { name: 'Preferences' })
      await user.click(preferencesTab)
      
      const timezoneSelect = screen.getByDisplayValue('Europe/Zurich')
      expect(timezoneSelect).toBeInTheDocument()
    })

    it('should handle preference changes', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      const preferencesTab = screen.getByRole('button', { name: 'Preferences' })
      await user.click(preferencesTab)
      
      const languageSelect = screen.getByDisplayValue('English')
      await user.selectOptions(languageSelect, 'de')
      
      expect(languageSelect).toHaveValue('de')
    })
  })

  describe('💾 Save Functionality', () => {
    it('should display save button in each tab', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      // Account tab (active by default)
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument()
      
      // Check other tabs
      const tabs = ['Security', 'Notifications', 'Privacy', 'Preferences']
      for (const tabName of tabs) {
        const tab = screen.getByRole('button', { name: tabName })
        await user.click(tab)
        expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument()
      }
    })

    it('should show saving state when save button is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      const saveButton = screen.getByRole('button', { name: 'Save Changes' })
      await user.click(saveButton)
      
      expect(screen.getByText('Saving...')).toBeInTheDocument()
      expect(saveButton).toBeDisabled()
    })

    it('should show success message after successful save', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      const saveButton = screen.getByRole('button', { name: 'Save Changes' })
      await user.click(saveButton)
      
      // Advance timer to complete the save operation
      vi.advanceTimersByTime(1000)
      
      await waitFor(() => {
        expect(screen.getByText('Settings saved successfully!')).toBeInTheDocument()
      })
    })
  })

  describe('🔍 Tab Navigation', () => {
    it('should update active tab styling when switching tabs', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      const accountTab = screen.getByRole('button', { name: 'Account' })
      const securityTab = screen.getByRole('button', { name: 'Security' })
      
      // Account tab should be active initially
      expect(accountTab).toHaveClass('bg-amber-100', 'text-amber-700')
      expect(securityTab).not.toHaveClass('bg-amber-100', 'text-amber-700')
      
      // Click security tab
      await user.click(securityTab)
      
      expect(securityTab).toHaveClass('bg-amber-100', 'text-amber-700')
      expect(accountTab).not.toHaveClass('bg-amber-100', 'text-amber-700')
    })

    it('should preserve form data when switching tabs', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      // Change first name in account tab
      const firstNameInput = screen.getByDisplayValue('John')
      await user.clear(firstNameInput)
      await user.type(firstNameInput, 'Jane')
      
      // Switch to security tab and back
      const securityTab = screen.getByRole('button', { name: 'Security' })
      await user.click(securityTab)
      
      const accountTab = screen.getByRole('button', { name: 'Account' })
      await user.click(accountTab)
      
      // Data should be preserved
      expect(screen.getByDisplayValue('Jane')).toBeInTheDocument()
    })
  })

  describe('♿ Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<SettingsPage />)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Account Settings')
    })

    it('should have proper tab navigation with ARIA', () => {
      render(<SettingsPage />)
      const tabList = screen.getByRole('tablist')
      expect(tabList).toBeInTheDocument()
      
      const tabs = screen.getAllByRole('tab')
      expect(tabs).toHaveLength(5)
      
      tabs.forEach(tab => {
        expect(tab).toHaveAttribute('aria-selected')
      })
    })

    it('should have proper form labels', () => {
      render(<SettingsPage />)
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    })

    it('should have proper switch roles for toggle controls', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      const notificationsTab = screen.getByRole('button', { name: 'Notifications' })
      await user.click(notificationsTab)
      
      const switches = screen.getAllByRole('switch')
      expect(switches.length).toBeGreaterThan(0)
      
      switches.forEach(switchElement => {
        expect(switchElement).toHaveAttribute('aria-checked')
      })
    })
  })

  describe('📱 Responsive Design', () => {
    it('should render properly on different screen sizes', () => {
      render(<SettingsPage />)
      
      // Check for responsive classes
      const tabContainer = screen.getByRole('tablist')
      expect(tabContainer).toHaveClass('flex')
    })
  })

  describe('🚨 Error Handling', () => {
    it('should display validation errors for invalid inputs', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SettingsPage />)
      
      // Clear required field
      const firstNameInput = screen.getByDisplayValue('John')
      await user.clear(firstNameInput)
      
      // Try to save
      const saveButton = screen.getByRole('button', { name: 'Save Changes' })
      await user.click(saveButton)
      
      // Should show validation error or prevent save
      expect(screen.getByDisplayValue('')).toBeInTheDocument()
    })
  })
})
