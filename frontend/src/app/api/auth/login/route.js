import { NextResponse } from 'next/server'

// Test users database
const USERS = {
  'admin@example.com': { password: 'admin123', role: 'admin' },
  'editor@example.com': { password: 'editor123', role: 'editor' },
  'viewer@example.com': { password: 'viewer123', role: 'viewer' }
}

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('Login attempt:', { email: body.email }) // Log without password

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

    // Create the response with user data
    const response = NextResponse.json({
      success: true,
      user: userData
    })

    // Set auth cookie
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
      { error: 'Authentication failed: ' + error.message },
      { status: 500 }
    )
  }
}