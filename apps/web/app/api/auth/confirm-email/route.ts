import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Confirmation token is required' },
        { status: 400 }
      )
    }

    // Validate token format
    if (!/^[a-f0-9]{64}$/.test(token)) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      )
    }

    // Forward to Medusa backend for confirmation
    const response = await fetch(`http://localhost:9000/auth/customer/confirm-email?token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Email confirmation failed' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Email confirmed successfully! You can now log in.',
      user: data.user
    })

  } catch (error) {
    console.error('Email confirmation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Confirmation token is required' },
        { status: 400 }
      )
    }

    // Validate token format
    if (!/^[a-f0-9]{64}$/.test(token)) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      )
    }

    // Forward to Medusa backend for confirmation
    const response = await fetch('http://localhost:9000/auth/customer/confirm-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Email confirmation failed' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Email confirmed successfully! You can now log in.',
      user: data.user
    })

  } catch (error) {
    console.error('Email confirmation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 