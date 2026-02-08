import { withAuth } from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
 
        const token = req.nextauth.token;
        const pathname = req.nextUrl.pathname;
        const isAdminRoute = pathname.startsWith('/admin');


      /*   // Redirect non-admin users away from admin routes
        if (isAdminRoute && !token?.isAdmin) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }

       */

        return NextResponse.next();
    },
    {
        pages: {
            signIn: '/auth/login',
        },
        callbacks: {
            
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    // Protect admin and user routes
    matcher: [
        "/admin/:path*",
        "/api/admin/:path*",
        "/dashboard/:path*",
        "/api/dashboard/:path*",
        "/profile/:path*",
        "/api/crypto/:path*",
        "/api/pricing/:path*"
    ]
};