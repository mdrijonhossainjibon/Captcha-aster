import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const publicPaths = [
    '/auth/:path',
    '/api/auth/:path',
  ]

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  console.log(isPublicPath)
  if (isPublicPath) {
    return NextResponse.next()
  }
  
  
  const token = request.cookies.get('next-auth.session-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

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