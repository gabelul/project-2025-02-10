import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    const userData = auth.validateCredentials(email, password)
    
    if (!userData) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Set cookies for server-side auth
    const response = NextResponse.json(userData)
    response.cookies.set('auth-token', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}