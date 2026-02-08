import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Protect admin routes and block access when role !== admin
export default withAuth(
    function middleware(req) {
        const isAdminPath = req.nextUrl.pathname.startsWith("/admin");
        const role = req.nextauth.token?.role;

        if (isAdminPath && role !== "admin") {
            return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};
