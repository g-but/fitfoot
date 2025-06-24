import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

interface ForgotPasswordRequest {
  email: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ForgotPasswordRequest = await request.json()
    const { email } = body

    // Input validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    // Generate password reset token
    const resetToken = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // For demo purposes, we'll simulate the password reset functionality
    // In a real implementation, you would:
    // 1. Check if user exists in database
    // 2. Store the reset token
    // 3. Send email with reset link
    
    // Simulate checking user existence (always succeed for demo)
    const userExists = true // In real app: check database
    
    if (!userExists) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, we have sent you a password reset link.'
      })
    }
    
    // Simulate successful password reset request
    console.log('📧 Password reset would be sent to:', email)
    console.log('🔑 Reset token generated:', resetToken)

    // Here you would send the password reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`
    
    console.log('📧 Password reset email would be sent to:', email)
    console.log('🔗 Reset URL:', resetUrl)

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, we have sent you a password reset link.',
      // In production, don't return the reset URL
      ...(process.env.NODE_ENV === 'development' && { 
        resetUrl,
        resetToken 
      })
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 