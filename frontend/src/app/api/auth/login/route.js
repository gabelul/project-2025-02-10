import { NextResponse } from 'next/server'
import { login } from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    const userData = await login(email, password)
    
    return NextResponse.json(userData)
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    )
  }
}