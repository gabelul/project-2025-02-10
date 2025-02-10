import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json()
    
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Attempt login
    const userData = await auth.login(body.email, body.password)
    
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
    console.error('Login error:', error.message)
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Authentication failed' 
      },
      { status: 401 }
    )
  }
}