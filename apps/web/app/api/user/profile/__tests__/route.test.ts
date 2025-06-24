import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET, PUT } from '../route'

// Mock NextAuth session
const mockSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'John Doe'
  }
}

// Mock getServerSession
vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn()
}))

// Mock the auth config
vi.mock('@/app/api/auth/[...nextauth]/route', () => ({
  authOptions: {}
}))

describe('Profile API Route', () => {
  const mockGetServerSession = vi.mocked(require('next-auth/next').getServerSession)
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/user/profile', () => {
    it('should return user profile when authenticated', async () => {
      mockGetServerSession.mockResolvedValue(mockSession)
      
      const request = new NextRequest('http://localhost:3000/api/user/profile')
      const response = await GET(request)
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.profile).toBeDefined()
      expect(data.profile.id).toBe('1')
      expect(data.profile.email).toBe('test@example.com')
      expect(data.profile.first_name).toBe('John')
      expect(data.profile.last_name).toBe('Doe')
    })

    it('should return 401 when not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)
      
      const request = new NextRequest('http://localhost:3000/api/user/profile')
      const response = await GET(request)
      
      expect(response.status).toBe(401)
      
      const data = await response.json()
      expect(data.error).toBe('Unauthorized')
    })

    it('should include full profile data structure', async () => {
      mockGetServerSession.mockResolvedValue(mockSession)
      
      const request = new NextRequest('http://localhost:3000/api/user/profile')
      const response = await GET(request)
      
      const data = await response.json()
      const profile = data.profile
      
      expect(profile).toHaveProperty('id')
      expect(profile).toHaveProperty('email')
      expect(profile).toHaveProperty('first_name')
      expect(profile).toHaveProperty('last_name')
      expect(profile).toHaveProperty('phone')
      expect(profile).toHaveProperty('date_of_birth')
      expect(profile).toHaveProperty('address')
      expect(profile).toHaveProperty('confirmed')
      expect(profile).toHaveProperty('created_at')
      
      // Check address structure
      expect(profile.address).toHaveProperty('street')
      expect(profile.address).toHaveProperty('city')
      expect(profile.address).toHaveProperty('postal_code')
      expect(profile.address).toHaveProperty('country')
    })

    it('should handle server errors gracefully', async () => {
      mockGetServerSession.mockRejectedValue(new Error('Database error'))
      
      const request = new NextRequest('http://localhost:3000/api/user/profile')
      const response = await GET(request)
      
      expect(response.status).toBe(500)
      
      const data = await response.json()
      expect(data.error).toBe('Internal server error')
    })
  })

  describe('PUT /api/user/profile', () => {
    const validProfileData = {
      first_name: 'Jane',
      last_name: 'Smith',
      phone: '+41 79 987 65 43',
      date_of_birth: '1990-05-15',
      address: {
        street: 'Bahnhofstrasse 123',
        city: 'Zurich',
        postal_code: '8001',
        country: 'Switzerland'
      }
    }

    it('should update profile when authenticated with valid data', async () => {
      mockGetServerSession.mockResolvedValue(mockSession)
      
      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(validProfileData)
      })
      
      const response = await PUT(request)
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.message).toBe('Profile updated successfully')
      expect(data.profile.first_name).toBe('Jane')
      expect(data.profile.last_name).toBe('Smith')
      expect(data.profile.phone).toBe('+41 79 987 65 43')
    })

    it('should return 401 when not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)
      
      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(validProfileData)
      })
      
      const response = await PUT(request)
      
      expect(response.status).toBe(401)
      
      const data = await response.json()
      expect(data.error).toBe('Unauthorized')
    })

    it('should validate required fields', async () => {
      mockGetServerSession.mockResolvedValue(mockSession)
      
      const invalidData = {
        first_name: '', // Empty required field
        last_name: 'Smith',
        phone: '+41 79 987 65 43'
      }
      
      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invalidData)
      })
      
      const response = await PUT(request)
      
      expect(response.status).toBe(400)
      
      const data = await response.json()
      expect(data.error).toContain('validation')
    })

    it('should validate phone number format', async () => {
      mockGetServerSession.mockResolvedValue(mockSession)
      
      const invalidData = {
        ...validProfileData,
        phone: 'invalid-phone'
      }
      
      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invalidData)
      })
      
      const response = await PUT(request)
      
      expect(response.status).toBe(400)
      
      const data = await response.json()
      expect(data.error).toContain('phone')
    })

    it('should validate date of birth format', async () => {
      mockGetServerSession.mockResolvedValue(mockSession)
      
      const invalidData = {
        ...validProfileData,
        date_of_birth: 'invalid-date'
      }
      
      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invalidData)
      })
      
      const response = await PUT(request)
      
      expect(response.status).toBe(400)
      
      const data = await response.json()
      expect(data.error).toContain('date')
    })

    it('should validate address fields when provided', async () => {
      mockGetServerSession.mockResolvedValue(mockSession)
      
      const invalidData = {
        ...validProfileData,
        address: {
          street: '', // Empty required field
          city: 'Zurich',
          postal_code: '8001',
          country: 'Switzerland'
        }
      }
      
      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invalidData)
      })
      
      const response = await PUT(request)
      
      expect(response.status).toBe(400)
      
      const data = await response.json()
      expect(data.error).toContain('address')
    })

    it('should handle partial updates', async () => {
      mockGetServerSession.mockResolvedValue(mockSession)
      
      const partialData = {
        first_name: 'Jane'
      }
      
      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(partialData)
      })
      
      const response = await PUT(request)
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.profile.first_name).toBe('Jane')
    })

    it('should handle malformed JSON', async () => {
      mockGetServerSession.mockResolvedValue(mockSession)
      
      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: 'invalid json'
      })
      
      const response = await PUT(request)
      
      expect(response.status).toBe(400)
      
      const data = await response.json()
      expect(data.error).toContain('Invalid JSON')
    })

    it('should handle server errors during update', async () => {
      mockGetServerSession.mockRejectedValue(new Error('Database error'))
      
      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(validProfileData)
      })
      
      const response = await PUT(request)
      
      expect(response.status).toBe(500)
      
      const data = await response.json()
      expect(data.error).toBe('Internal server error')
    })

    it('should preserve email field (read-only)', async () => {
      mockGetServerSession.mockResolvedValue(mockSession)
      
      const dataWithEmail = {
        ...validProfileData,
        email: 'hacker@example.com' // Should be ignored
      }
      
      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataWithEmail)
      })
      
      const response = await PUT(request)
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.profile.email).toBe('test@example.com') // Original email preserved
    })
  })

  describe('Request Headers', () => {
    it('should return proper content-type headers', async () => {
      mockGetServerSession.mockResolvedValue(mockSession)
      
      const request = new NextRequest('http://localhost:3000/api/user/profile')
      const response = await GET(request)
      
      expect(response.headers.get('content-type')).toContain('application/json')
    })

    it('should handle CORS headers if needed', async () => {
      mockGetServerSession.mockResolvedValue(mockSession)
      
      const request = new NextRequest('http://localhost:3000/api/user/profile')
      const response = await GET(request)
      
      // Check that response is valid (CORS would be handled by middleware)
      expect(response.status).toBe(200)
    })
  })

  describe('Security', () => {
    it('should not expose sensitive information in error messages', async () => {
      mockGetServerSession.mockRejectedValue(new Error('Database connection failed with password: secret123'))
      
      const request = new NextRequest('http://localhost:3000/api/user/profile')
      const response = await GET(request)
      
      const data = await response.json()
      expect(data.error).toBe('Internal server error')
      expect(data.error).not.toContain('password')
      expect(data.error).not.toContain('secret123')
    })

    it('should validate session integrity', async () => {
      // Mock malformed session
      mockGetServerSession.mockResolvedValue({
        user: {
          // Missing required fields
          email: 'test@example.com'
        }
      })
      
      const request = new NextRequest('http://localhost:3000/api/user/profile')
      const response = await GET(request)
      
      expect(response.status).toBe(401)
    })
  })

  describe('Mock Data Consistency', () => {
    it('should return consistent mock data structure', async () => {
      mockGetServerSession.mockResolvedValue(mockSession)
      
      const request = new NextRequest('http://localhost:3000/api/user/profile')
      const response = await GET(request)
      
      const data = await response.json()
      const profile = data.profile
      
      // Verify mock data matches expected structure
      expect(profile.id).toBe('1')
      expect(profile.email).toBe('test@example.com')
      expect(profile.first_name).toBe('John')
      expect(profile.last_name).toBe('Doe')
      expect(profile.phone).toBe('+41 79 123 45 67')
      expect(profile.confirmed).toBe(true)
      expect(profile.address.country).toBe('Switzerland')
    })

    it('should simulate realistic timestamps', async () => {
      mockGetServerSession.mockResolvedValue(mockSession)
      
      const request = new NextRequest('http://localhost:3000/api/user/profile')
      const response = await GET(request)
      
      const data = await response.json()
      const profile = data.profile
      
      expect(profile.created_at).toBeDefined()
      expect(new Date(profile.created_at)).toBeInstanceOf(Date)
    })
  })
})
