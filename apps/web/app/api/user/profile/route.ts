import { NextRequest, NextResponse } from 'next/server'

// Mock user profile data
const mockProfile = {
  id: '1',
  email: 'user@example.com',
  first_name: 'John',
  last_name: 'Doe',
  phone: '+41 79 123 45 67',
  date_of_birth: '1990-01-01',
  address: {
    street: 'Bahnhofstrasse 123',
    city: 'Zurich',
    postal_code: '8001',
    country: 'Switzerland'
  },
  confirmed: true,
  created_at: '2024-01-01T00:00:00Z'
}

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would:
    // 1. Extract and verify the JWT token from Authorization header
    // 2. Get user ID from token
    // 3. Fetch user profile from database
    
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No valid authorization token provided' },
        { status: 401 }
      )
    }

    // Simulate token validation
    const token = authHeader.substring(7)
    if (!token) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      profile: mockProfile
    })

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // In a real app, you would:
    // 1. Extract and verify the JWT token from Authorization header
    // 2. Get user ID from token
    // 3. Validate the profile data
    // 4. Update user profile in database
    
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No valid authorization token provided' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Basic validation
    if (!body.first_name || !body.last_name) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      )
    }

    // Validate phone number format if provided
    if (body.phone && !/^\+\d{1,3}\s?\d{2,3}\s?\d{3}\s?\d{2}\s?\d{2}$/.test(body.phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    // Update mock profile (in real app, update database)
    const updatedProfile = {
      ...mockProfile,
      first_name: body.first_name,
      last_name: body.last_name,
      phone: body.phone || mockProfile.phone,
      date_of_birth: body.date_of_birth || mockProfile.date_of_birth,
      address: {
        ...mockProfile.address,
        ...body.address
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 