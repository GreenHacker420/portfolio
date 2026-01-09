
import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized({ req, token }) {
            // Only check if we are accessing /admin
            if (req.nextUrl.pathname.startsWith('/admin')) {
                // If it's the login page, allow it (middleware handles this automatically usually, but let's be safe)
                if (req.nextUrl.pathname === '/admin/login') return true;
                // Otherwise, require valid token
                return !!token;
            }
            return true;
        },
    },
    pages: {
        signIn: "/admin/login",
    },
});

export const config = {
    matcher: ["/admin/:path*"]
};
