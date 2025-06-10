import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HeaderClient } from '../header'
import type { SiteSettings } from '@/lib/types'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, onClick, ...props }: any) => (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}))

describe('Header Component', () => {
  const mockSiteSettings: SiteSettings = {
    _id: 'settings',
    _type: 'siteSettings',
    title: 'Test Fitfoot',
    description: 'Test description',
    keywords: ['test', 'fitfoot'],
    siteUrl: 'https://test.fitfoot.com',
    logo: { text: 'Test Logo' },
    navigation: [
      { label: 'Custom Home', href: '/' },
      { label: 'Custom Products', href: '/products' },
      { label: 'Custom About', href: '/about' },
    ],
    headerCta: {
      text: 'Custom CTA',
      href: '/custom-shop',
    },
  }

  describe('🖥️ Desktop Navigation', () => {
    it('should render logo correctly', () => {
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      // Check for logo image with alt text
      const logo = screen.getByAltText('Test Logo logo')
      expect(logo).toBeInTheDocument()
      expect(logo.closest('a')).toHaveAttribute('href', '/')
    })

    it('should render custom navigation links', () => {
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      expect(screen.getByText('Custom Home')).toBeInTheDocument()
      expect(screen.getByText('Custom Products')).toBeInTheDocument()
      expect(screen.getByText('Custom About')).toBeInTheDocument()
    })

    it('should render default navigation when no custom navigation provided', () => {
      render(<HeaderClient siteSettings={null} />)
      
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Products')).toBeInTheDocument()
      expect(screen.getByText('Shop')).toBeInTheDocument()
      expect(screen.getByText('About')).toBeInTheDocument()
      expect(screen.getByText('Contact')).toBeInTheDocument()
    })

    it('should render desktop CTA button with custom text', () => {
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      const ctaButton = screen.getByText('Custom CTA')
      expect(ctaButton).toBeInTheDocument()
      expect(ctaButton.closest('a')).toHaveAttribute('href', '/custom-shop')
    })

    it('should render default CTA when no custom CTA provided', () => {
      render(<HeaderClient siteSettings={null} />)
      
      const ctaButton = screen.getByText('Shop Now')
      expect(ctaButton).toBeInTheDocument()
      expect(ctaButton.closest('a')).toHaveAttribute('href', '/shop')
    })
  })

  describe('📱 Mobile Navigation - Core Functionality', () => {
    it('should render mobile menu button', () => {
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      const menuButton = screen.getByRole('button', { name: /open menu/i })
      expect(menuButton).toBeInTheDocument()
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')
      expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu')
    })

    it('should toggle mobile menu when button is clicked', async () => {
      const user = userEvent.setup()
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      const menuButton = screen.getByRole('button', { name: /open menu/i })
      
      // Mobile menu should not be visible initially
      expect(screen.queryByRole('navigation', { name: /mobile navigation/i })).not.toBeInTheDocument()
      
      // Click to open menu
      await user.click(menuButton)
      
      // Menu should be visible and button should change
      expect(screen.getByRole('navigation', { name: /mobile navigation/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute('aria-expanded', 'true')
    })

    it('should close mobile menu when close button is clicked', async () => {
      const user = userEvent.setup()
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      const menuButton = screen.getByRole('button', { name: /open menu/i })
      
      // Open menu
      await user.click(menuButton)
      expect(screen.getByRole('navigation', { name: /mobile navigation/i })).toBeInTheDocument()
      
      // Close menu
      const closeButton = screen.getByRole('button', { name: /close menu/i })
      await user.click(closeButton)
      
      // Menu should be hidden
      await waitFor(() => {
        expect(screen.queryByRole('navigation', { name: /mobile navigation/i })).not.toBeInTheDocument()
      })
    })

    it('should show hamburger icon when menu is closed', () => {
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      const menuButton = screen.getByRole('button', { name: /open menu/i })
      const hamburgerIcon = menuButton.querySelector('svg path[d*="M4 6h16M4 12h16M4 18h16"]')
      
      expect(hamburgerIcon).toBeInTheDocument()
    })

    it('should show X icon when menu is open', async () => {
      const user = userEvent.setup()
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      const menuButton = screen.getByRole('button', { name: /open menu/i })
      await user.click(menuButton)
      
      const closeButton = screen.getByRole('button', { name: /close menu/i })
      const xIcon = closeButton.querySelector('svg path[d*="M6 18L18 6M6 6l12 12"]')
      
      expect(xIcon).toBeInTheDocument()
    })

    it('should close mobile menu when navigation link is clicked', async () => {
      const user = userEvent.setup()
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      // Open mobile menu
      await user.click(screen.getByRole('button', { name: /open menu/i }))
      expect(screen.getByRole('navigation', { name: /mobile navigation/i })).toBeInTheDocument()
      
      // Click a navigation link within the mobile menu specifically
      const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i })
      const homeLink = mobileMenu.querySelector('a[href="/"]')
      await user.click(homeLink!)
      
      // Menu should close
      await waitFor(() => {
        expect(screen.queryByRole('navigation', { name: /mobile navigation/i })).not.toBeInTheDocument()
      })
    })
  })

  describe('📱 Mobile Navigation - Menu Content', () => {
    it('should display all navigation links in mobile menu', async () => {
      const user = userEvent.setup()
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      // Open mobile menu
      await user.click(screen.getByRole('button', { name: /open menu/i }))
      
      // Check all navigation links are present in mobile menu specifically
      const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i })
      const mobileLinks = mobileMenu.querySelectorAll('a')
      
      // Check that mobile menu contains the expected links
      expect(mobileLinks[0]).toHaveTextContent('Custom Home')
      expect(mobileLinks[0]).toHaveAttribute('href', '/')
      expect(mobileLinks[1]).toHaveTextContent('Custom Products')
      expect(mobileLinks[1]).toHaveAttribute('href', '/products')
      expect(mobileLinks[2]).toHaveTextContent('Custom About')
      expect(mobileLinks[2]).toHaveAttribute('href', '/about')
    })

    it('should display mobile CTA button in menu', async () => {
      const user = userEvent.setup()
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      // Open mobile menu
      await user.click(screen.getByRole('button', { name: /open menu/i }))
      
      // Check mobile CTA button
      const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i })
      const mobileCTA = mobileMenu.querySelector('a[href="/custom-shop"] button')
      
      expect(mobileCTA).toBeInTheDocument()
      expect(mobileCTA).toHaveTextContent('Custom CTA')
    })

    it('should close mobile menu when CTA button is clicked', async () => {
      const user = userEvent.setup()
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      // Open mobile menu
      await user.click(screen.getByRole('button', { name: /open menu/i }))
      
      // Click mobile CTA button
      const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i })
      const mobileCTA = mobileMenu.querySelector('a[href="/custom-shop"] button')
      await user.click(mobileCTA!)
      
      // Menu should close
      await waitFor(() => {
        expect(screen.queryByRole('navigation', { name: /mobile navigation/i })).not.toBeInTheDocument()
      })
    })

    it('should close mobile menu when logo is clicked', async () => {
      const user = userEvent.setup()
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      // Open mobile menu
      await user.click(screen.getByRole('button', { name: /open menu/i }))
      expect(screen.getByRole('navigation', { name: /mobile navigation/i })).toBeInTheDocument()
      
      // Click logo (find by alt text or aria-label)
      const logo = screen.getByLabelText('Test Logo - Go to homepage')
      await user.click(logo)
      
      // Menu should close
      await waitFor(() => {
        expect(screen.queryByRole('navigation', { name: /mobile navigation/i })).not.toBeInTheDocument()
      })
    })
  })

  describe('♿ Accessibility', () => {
    it('should have proper ARIA attributes on mobile menu button', () => {
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      const menuButton = screen.getByRole('button', { name: /open menu/i })
      
      expect(menuButton).toHaveAttribute('aria-label', 'Open menu')
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')
      expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu')
    })

    it('should update ARIA attributes when menu is opened', async () => {
      const user = userEvent.setup()
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      const menuButton = screen.getByRole('button', { name: /open menu/i })
      await user.click(menuButton)
      
      const closeButton = screen.getByRole('button', { name: /close menu/i })
      expect(closeButton).toHaveAttribute('aria-label', 'Close menu')
      expect(closeButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('should have proper role and aria-label on mobile navigation', async () => {
      const user = userEvent.setup()
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      await user.click(screen.getByRole('button', { name: /open menu/i }))
      
      const mobileNav = screen.getByRole('navigation', { name: /mobile navigation/i })
      expect(mobileNav).toHaveAttribute('id', 'mobile-menu')
      expect(mobileNav).toHaveAttribute('aria-label', 'Mobile navigation')
    })

    it('should have aria-hidden on SVG icons', async () => {
      const user = userEvent.setup()
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      // Check hamburger icon
      const menuButton = screen.getByRole('button', { name: /open menu/i })
      const hamburgerSvg = menuButton.querySelector('svg')
      expect(hamburgerSvg).toHaveAttribute('aria-hidden', 'true')
      
      // Open menu and check X icon
      await user.click(menuButton)
      const closeButton = screen.getByRole('button', { name: /close menu/i })
      const xSvg = closeButton.querySelector('svg')
      expect(xSvg).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('🎨 Responsive Behavior', () => {
    it('should hide desktop navigation on mobile viewports', () => {
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      // Desktop navigation should have hidden class for mobile
      const desktopNav = screen.getByText('Custom Home').closest('nav')
      expect(desktopNav).toHaveClass('hidden', 'md:flex')
    })

    it('should hide mobile menu button on desktop viewports', () => {
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      const menuButton = screen.getByRole('button', { name: /open menu/i })
      expect(menuButton).toHaveClass('md:hidden')
    })

    it('should hide desktop CTA button on small screens', () => {
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      // Desktop CTA should be hidden on small screens
      const desktopCTA = screen.getByText('Custom CTA')
      expect(desktopCTA).toHaveClass('hidden', 'sm:inline-flex')
    })

    it('should show full-width mobile CTA in mobile menu', async () => {
      const user = userEvent.setup()
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      await user.click(screen.getByRole('button', { name: /open menu/i }))
      
      const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i })
      const mobileCTA = mobileMenu.querySelector('button')
      
      expect(mobileCTA).toHaveClass('w-full')
    })
  })

  describe('⚡ Performance & State Management', () => {
    it('should not render mobile menu DOM element when closed', () => {
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      // Mobile menu should not exist in DOM when closed
      expect(screen.queryByRole('navigation', { name: /mobile navigation/i })).not.toBeInTheDocument()
    })

    it('should maintain menu state independently', async () => {
      const user = userEvent.setup()
      render(<HeaderClient siteSettings={mockSiteSettings} />)
      
      const menuButton = screen.getByRole('button', { name: /open menu/i })
      
      // Open and close multiple times
      await user.click(menuButton)
      expect(screen.getByRole('navigation', { name: /mobile navigation/i })).toBeInTheDocument()
      
      await user.click(screen.getByRole('button', { name: /close menu/i }))
      await waitFor(() => {
        expect(screen.queryByRole('navigation', { name: /mobile navigation/i })).not.toBeInTheDocument()
      })
      
      // Should work again
      await user.click(menuButton)
      expect(screen.getByRole('navigation', { name: /mobile navigation/i })).toBeInTheDocument()
    })
  })
}) 