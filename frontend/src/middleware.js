import { NextResponse } from 'next/server'

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = request.cookies.get('session')
    
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    try {
      const userData = JSON.parse(session.value)
      
      if (!userData.role) {
        return NextResponse.redirect(new URL('/', request.url))
      }
      
      // Allow access to admin dashboard for all authenticated users
      if (request.nextUrl.pathname === '/admin') {
        return NextResponse.next()
      }
      
      // Restrict sensitive paths to admin role
      if (request.nextUrl.pathname.includes('/providers') && userData.role !== 'admin') {
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