import { NextResponse } from 'next/server'
import { auth, ROLES } from './lib/auth'

const ROLE_PATHS = {
  '/admin/providers': ROLES.ADMIN,
  '/admin/settings': ROLES.ADMIN,
  '/admin/monitoring': ROLES.EDITOR,
  '/admin': ROLES.VIEWER
}

export function middleware(request) {
  // Check if the request is for the admin section
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const user = auth.checkAuth()
    
    if (!user) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Check role-based access
    const path = request.nextUrl.pathname
    const requiredRole = ROLE_PATHS[path] || ROLES.ADMIN

    if (!auth.hasRole(requiredRole)) {
      // Redirect to admin dashboard if user doesn't have required role
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}