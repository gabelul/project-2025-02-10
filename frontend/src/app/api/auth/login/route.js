import { NextResponse } from 'next/server'

// Test users database (replace with real authentication in production)
const USERS = {
  'admin@example.com': { password: 'admin123', role: 'admin' },
  'editor@example.com': { password: 'editor123', role: 'editor' },
  'viewer@example.com': { password: 'viewer123', role: 'viewer' }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = USERS[email]
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const userData = {
      email,
      role: user.role
    }

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: userData
    })

    // Set secure session cookie
    response.cookies.set('session', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}