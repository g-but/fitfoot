import { NextRequest, NextResponse } from 'next/server'

interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ResetPasswordRequest = await request.json()
    const { token, password, confirmPassword } = body

    // Input validation
    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Token, password, and password confirmation are required' },
        { status: 400 }
      )
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Token format validation
    if (!/^[a-f0-9]{64}$/.test(token)) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      )
    }

    // Forward to Medusa backend for password reset
    const response = await fetch('http://localhost:9000/auth/customer/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        password
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Password reset failed' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.'
    })

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 