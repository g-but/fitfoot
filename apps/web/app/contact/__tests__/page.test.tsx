import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ContactPage from '../page'
import { getContactPage } from '@/lib/sanity.queries'

// Mock the Sanity queries
vi.mock('@/lib/sanity.queries', () => ({
  getContactPage: vi.fn(),
}))

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

const mockContactPageData = {
  _id: 'contact',
  _type: 'contactPage' as const,
  heroTitle: 'Contact Fitfoot',
  heroSubtitle: 'We would love to hear from you. Send us a message and we will respond as soon as possible.',
  contactInfoTitle: 'How to Reach Us',
  formTitle: 'Get in Touch',
  submitButtonText: 'Send Your Message',
  contactMethods: [
    {
      _key: 'email',
      icon: 'email',
      title: 'Email Us',
      details: ['hello@fitfoot.ch', 'We respond within 24 hours']
    },
    {
      _key: 'location',
      icon: 'location', 
      title: 'Visit Us',
      details: ['Zurich, Switzerland', 'By appointment only']
    }
  ],
  formFields: [
    {
      _key: 'name',
      name: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name',
      required: true
    },
    {
      _key: 'email',
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'your.email@example.com',
      required: true
    },
    {
      _key: 'message',
      name: 'message',
      label: 'Your Message',
      type: 'textarea',
      placeholder: 'Tell us how we can help you...',
      required: true
    }
  ]
}

describe('ContactPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('🏠 Page Structure & Layout', () => {
    it('should render main layout with all sections', async () => {
      vi.mocked(getContactPage).mockResolvedValue(mockContactPageData)

      render(await ContactPage())

      // Check for main sections
      const sections = document.querySelectorAll('section')
      expect(sections.length).toBeGreaterThanOrEqual(2) // Hero, Contact Content
    })

    it('should have proper semantic structure', async () => {
      vi.mocked(getContactPage).mockResolvedValue(mockContactPageData)

      render(await ContactPage())

      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
      expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThan(0)
    })
  })

  describe('🎯 Hero Section', () => {
    it('should render hero with custom data from Sanity', async () => {
      vi.mocked(getContactPage).mockResolvedValue(mockContactPageData)

      render(await ContactPage())

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Contact Fitfoot')
      expect(screen.getByText('We would love to hear from you. Send us a message and we will respond as soon as possible.')).toBeInTheDocument()
    })

    it('should render hero with fallback data when no Sanity data', async () => {
      vi.mocked(getContactPage).mockResolvedValue(null)

      render(await ContactPage())

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Get in Touch')
      expect(screen.getByText(/Have questions about our products or want to learn more about Fitfoot/)).toBeInTheDocument()
    })

    it('should have centered hero layout', async () => {
      vi.mocked(getContactPage).mockResolvedValue(mockContactPageData)

      render(await ContactPage())

      const heroContent = document.querySelector('section.bg-neutral-light .text-center')
      expect(heroContent).toBeInTheDocument()
    })
  })

  describe('📞 Contact Information Section', () => {
    it('should render contact info with custom data from Sanity', async () => {
      vi.mocked(getContactPage).mockResolvedValue(mockContactPageData)

      render(await ContactPage())

      expect(screen.getByText('How to Reach Us')).toBeInTheDocument()
      expect(screen.getByText('Email Us')).toBeInTheDocument()
      expect(screen.getByText('hello@fitfoot.ch')).toBeInTheDocument()
      expect(screen.getByText('Visit Us')).toBeInTheDocument()
      expect(screen.getByText('Zurich, Switzerland')).toBeInTheDocument()
    })

    it('should render contact info with fallback data', async () => {
      vi.mocked(getContactPage).mockResolvedValue(null)

      render(await ContactPage())

      expect(screen.getByText('Contact Information')).toBeInTheDocument()
      
      // Use getAllByText since "Email" appears both in contact info and form label
      const emailTexts = screen.getAllByText('Email')
      expect(emailTexts.length).toBeGreaterThanOrEqual(2) // Contact info heading and form label
      
      expect(screen.getByText('info@fitfoot.ch')).toBeInTheDocument()
      expect(screen.getByText('support@fitfoot.ch')).toBeInTheDocument()
      expect(screen.getByText('Location')).toBeInTheDocument()
      expect(screen.getByText('Switzerland')).toBeInTheDocument()
    })

    it('should render contact method icons correctly', async () => {
      vi.mocked(getContactPage).mockResolvedValue(mockContactPageData)

      render(await ContactPage())

      // Check for SVG icons (email and location)
      const emailIcons = document.querySelectorAll('svg')
      expect(emailIcons.length).toBeGreaterThanOrEqual(2) // At least email and location icons
    })

    it('should handle multiple details per contact method', async () => {
      vi.mocked(getContactPage).mockResolvedValue(mockContactPageData)

      render(await ContactPage())

      expect(screen.getByText('We respond within 24 hours')).toBeInTheDocument()
      expect(screen.getByText('By appointment only')).toBeInTheDocument()
    })

    it('should handle missing contact methods gracefully', async () => {
      const noContactMethodsData = {
        ...mockContactPageData,
        contactMethods: []
      }

      vi.mocked(getContactPage).mockResolvedValue(noContactMethodsData)

      render(await ContactPage())

      // Should fall back to default contact methods
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Location')).toBeInTheDocument()
    })
  })

  describe('📝 Contact Form Section', () => {
    it('should render form with custom fields from Sanity', async () => {
      vi.mocked(getContactPage).mockResolvedValue(mockContactPageData)

      render(await ContactPage())

      expect(screen.getByText('Get in Touch')).toBeInTheDocument()
      expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
      expect(screen.getByLabelText('Your Message')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Send Your Message' })).toBeInTheDocument()
    })

    it('should render form with fallback fields', async () => {
      vi.mocked(getContactPage).mockResolvedValue(null)

      render(await ContactPage())

      expect(screen.getByText('Send us a Message')).toBeInTheDocument()
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Message')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument()
    })

    it('should render different field types correctly', async () => {
      vi.mocked(getContactPage).mockResolvedValue(mockContactPageData)

      render(await ContactPage())

      // Text input
      const nameField = screen.getByLabelText('Full Name')
      expect(nameField).toHaveAttribute('type', 'text')
      expect(nameField).toHaveAttribute('placeholder', 'Enter your full name')
      expect(nameField).toBeRequired()

      // Email input
      const emailField = screen.getByLabelText('Email Address')
      expect(emailField).toHaveAttribute('type', 'email')
      expect(emailField).toHaveAttribute('placeholder', 'your.email@example.com')

      // Textarea
      const messageField = screen.getByLabelText('Your Message')
      expect(messageField.tagName).toBe('TEXTAREA')
      expect(messageField).toHaveAttribute('placeholder', 'Tell us how we can help you...')
    })

    it('should handle form interaction', async () => {
      vi.mocked(getContactPage).mockResolvedValue(mockContactPageData)

      render(await ContactPage())

      const nameField = screen.getByLabelText('Full Name')
      const emailField = screen.getByLabelText('Email Address')
      const messageField = screen.getByLabelText('Your Message')

      // Test field interaction
      fireEvent.change(nameField, { target: { value: 'John Doe' } })
      fireEvent.change(emailField, { target: { value: 'john@example.com' } })
      fireEvent.change(messageField, { target: { value: 'Hello from John!' } })

      expect(nameField).toHaveValue('John Doe')
      expect(emailField).toHaveValue('john@example.com')
      expect(messageField).toHaveValue('Hello from John!')
    })

    it('should handle missing form fields gracefully', async () => {
      const noFormFieldsData = {
        ...mockContactPageData,
        formFields: []
      }

      vi.mocked(getContactPage).mockResolvedValue(noFormFieldsData)

      render(await ContactPage())

      // Should fall back to default form fields
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Message')).toBeInTheDocument()
    })

    it('should render submit button with correct styling', async () => {
      vi.mocked(getContactPage).mockResolvedValue(mockContactPageData)

      render(await ContactPage())

      const submitButton = screen.getByRole('button', { name: 'Send Your Message' })
      expect(submitButton).toHaveAttribute('type', 'submit')
      expect(submitButton).toHaveClass('w-full') // Full width
    })
  })

  describe('🔄 Data Fetching & Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      vi.mocked(getContactPage).mockResolvedValue(null)

      // Should be able to render without crashing
      const component = await ContactPage()
      expect(() => render(component)).not.toThrow()
    })

    it('should make API call for contact page data', async () => {
      vi.mocked(getContactPage).mockResolvedValue(mockContactPageData)

      render(await ContactPage())

      expect(getContactPage).toHaveBeenCalledTimes(1)
    })

    it('should handle partial Sanity data', async () => {
      const partialData = {
        _id: 'contact',
        _type: 'contactPage' as const,
        heroTitle: 'Contact Us',
        // Missing other fields
      }

      vi.mocked(getContactPage).mockResolvedValue(partialData)

      render(await ContactPage())

      expect(screen.getByText('Contact Us')).toBeInTheDocument()
      // Should use fallbacks for missing fields
      expect(screen.getByText('Contact Information')).toBeInTheDocument()
      expect(screen.getByText('Send us a Message')).toBeInTheDocument()
    })
  })

  describe('♿ Accessibility', () => {
    it('should have proper heading hierarchy', async () => {
      vi.mocked(getContactPage).mockResolvedValue(mockContactPageData)

      render(await ContactPage())

      const h1 = screen.getAllByRole('heading', { level: 1 })
      const h2 = screen.getAllByRole('heading', { level: 2 })
      const h3 = screen.getAllByRole('heading', { level: 3 })

      expect(h1).toHaveLength(1) // Main page title
      expect(h2.length).toBeGreaterThanOrEqual(2) // Section headings
      expect(h3.length).toBeGreaterThanOrEqual(2) // Contact method titles
    })

    it('should have proper form labels', async () => {
      vi.mocked(getContactPage).mockResolvedValue(mockContactPageData)

      render(await ContactPage())

      // All form fields should have associated labels
      const nameField = screen.getByLabelText('Full Name')
      const emailField = screen.getByLabelText('Email Address')
      const messageField = screen.getByLabelText('Your Message')

      expect(nameField).toBeInTheDocument()
      expect(emailField).toBeInTheDocument()
      expect(messageField).toBeInTheDocument()
    })

    it('should have accessible form elements', async () => {
      vi.mocked(getContactPage).mockResolvedValue(mockContactPageData)

      render(await ContactPage())

      const form = document.querySelector('form')
      expect(form).toBeInTheDocument()

      const submitButton = screen.getByRole('button', { name: 'Send Your Message' })
      expect(submitButton).toBeInTheDocument()
    })

    it('should have proper semantic structure', async () => {
      vi.mocked(getContactPage).mockResolvedValue(mockContactPageData)

      render(await ContactPage())

      // Check for proper section structure
      const sections = document.querySelectorAll('section')
      expect(sections.length).toBeGreaterThanOrEqual(2)

      // Check for form element
      const form = document.querySelector('form')
      expect(form).toBeInTheDocument()
    })
  })

  describe('🎨 Responsive Design & Styling', () => {
    it('should apply correct responsive grid classes', async () => {
      vi.mocked(getContactPage).mockResolvedValue(mockContactPageData)

      render(await ContactPage())

      // Check for responsive grid layout
      const gridContainer = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2')
      expect(gridContainer).toBeInTheDocument()
    })

    it('should have proper spacing and layout classes', async () => {
      vi.mocked(getContactPage).mockResolvedValue(mockContactPageData)

      render(await ContactPage())

      // Check for consistent spacing
      const spaceElements = document.querySelectorAll('.space-y-6, .space-y-8')
      expect(spaceElements.length).toBeGreaterThan(0)

      // Check for container and padding classes
      const containers = document.querySelectorAll('.container.mx-auto.px-4')
      expect(containers.length).toBeGreaterThanOrEqual(2)
    })

    it('should have proper color scheme classes', async () => {
      vi.mocked(getContactPage).mockResolvedValue(mockContactPageData)

      render(await ContactPage())

      // Check for consistent color usage
      const primaryElements = document.querySelectorAll('.text-primary')
      const accentElements = document.querySelectorAll('.text-accent')
      const bgElements = document.querySelectorAll('.bg-neutral-light')

      expect(primaryElements.length).toBeGreaterThan(0)
      expect(accentElements.length).toBeGreaterThan(0)
      expect(bgElements.length).toBeGreaterThan(0)
    })

    it('should have proper form styling', async () => {
      vi.mocked(getContactPage).mockResolvedValue(mockContactPageData)

      render(await ContactPage())

      // Check for consistent form field styling
      const inputFields = document.querySelectorAll('input.w-full.px-4.py-3')
      const textareaFields = document.querySelectorAll('textarea.w-full.px-4.py-3')

      expect(inputFields.length).toBeGreaterThanOrEqual(2)
      expect(textareaFields.length).toBeGreaterThanOrEqual(1)
    })
  })
}) 