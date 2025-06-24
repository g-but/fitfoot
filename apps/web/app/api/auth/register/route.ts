import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

interface RegisterRequest {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()
    const { email, password, first_name, last_name, phone } = body

    // Input validation
    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Generate email confirmation token
    const confirmationToken = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // For now, we'll forward to the Medusa backend
    // In a real implementation, you'd:
    // 1. Hash the password
    // 2. Store user in database with confirmed: false
    // 3. Store confirmation token
    // 4. Send confirmation email

    const response = await fetch('http://localhost:9000/auth/customer/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        first_name,
        last_name,
        phone,
        confirmation_token: confirmationToken,
        confirmation_expires: expiresAt.toISOString(),
        confirmed: false
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Registration failed' },
        { status: response.status }
      )
    }

    // Here you would send the confirmation email
    // For now, we'll just return success with the token for testing
    const confirmationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm-email?token=${confirmationToken}`
    

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Please check your email to confirm your account.',
      // In production, don't return the confirmation URL
      ...(process.env.NODE_ENV === 'development' && { 
        confirmationUrl,
        confirmationToken 
      })
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 