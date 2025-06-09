import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // If user is trying to access admin routes without being authenticated
    if (req.nextUrl.pathname.startsWith('/admin') &&
        !req.nextUrl.pathname.startsWith('/admin/login') &&
        !req.nextauth.token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    // Check if user has admin role for admin routes
    if (req.nextUrl.pathname.startsWith('/admin') &&
        !req.nextUrl.pathname.startsWith('/admin/login') &&
        req.nextauth.token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    // If user is authenticated and trying to access login page, redirect to dashboard
    if (req.nextUrl.pathname === '/admin/login' && req.nextauth.token) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page without authentication
        if (req.nextUrl.pathname === '/admin/login') {
          return true
        }
        
        // For other admin routes, require authentication and admin role
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token && token.role === 'admin'
        }
        
        // Allow all other routes
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*']
}
