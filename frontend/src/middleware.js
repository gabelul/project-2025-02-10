import { NextResponse } from 'next/server'

export async function middleware(request) {
  const authCookie = request.cookies.get('auth')
  
  // Check if the request is for the admin section
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!authCookie) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/', request.url))
    }

    try {
      const user = JSON.parse(authCookie.value)
      
      // Basic role checking - could be more granular
      if (!user.role) {
        return NextResponse.redirect(new URL('/', request.url))
      }
      
      // Allow access to admin dashboard for all authenticated users
      if (request.nextUrl.pathname === '/admin') {
        return NextResponse.next()
      }
      
      // Restrict sensitive paths to admin role
      if (request.nextUrl.pathname.includes('/providers') && user.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      
    } catch {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}