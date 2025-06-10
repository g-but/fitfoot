import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import { server } from './mocks/server'

// Establish API mocking before all tests
beforeAll(() => {
  // Start the MSW server
  server.listen({
    onUnhandledRequest: 'error'
  })
})

// Clean up after each test
afterEach(() => {
  // Clean up DOM after each test
  cleanup()
  
  // Reset any request handlers that are declared in a test
  server.resetHandlers()
})

// Clean up after all tests are done
afterAll(() => {
  // Stop the MSW server
  server.close()
})

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => {
    return React.createElement('a', { href, ...props }, children)
  },
}))

// Global React import for JSX
import React from 'react'
import { vi } from 'vitest'

// Make React available globally
global.React = React 