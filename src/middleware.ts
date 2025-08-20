import { withAuth } from 'next-auth/middleware'

// Rely on withAuth's authorized callback for gating.
// Avoid manual redirects that can create loops between /admin and /admin/login.
export default withAuth(
  function middleware() {
    // No-op: authorization handled below
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        const isLogin = path === '/admin/login'
        const isAdminArea = path.startsWith('/admin') && !isLogin

        // Allow the login page for everyone
        if (isLogin) return true

        // Protect admin area: require authenticated admin
        if (isAdminArea) {
          return !!token && (token as any).role === 'admin'
        }

        // Everything else allowed
        return true
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
)

export const config = {
  matcher: ['/admin/:path*']
}
