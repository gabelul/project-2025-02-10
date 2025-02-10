import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email } = await request.json()
    
    // In a real application, you would:
    // 1. Generate a reset token
    // 2. Store it in the database with an expiration
    // 3. Send an email with the reset link
    
    // For demo purposes, we'll just simulate success
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return NextResponse.json({
      message: 'Reset email sent successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}