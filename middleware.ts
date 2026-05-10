import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-fallback-secret")

interface TokenPayload {
  userId: string
  email: string
  role: string
  [key: string]: any
}

async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as TokenPayload
  } catch {
    return null
  }
}

const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
  "/about",
  "/cookies",
  "/extensions",
  "/features",
  "/forgot-password",
  "/how-it-works",
  "/images",
  "/privacy",
  "/profile",
  "/reset-password",
  "/terms",
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/")) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  const token = request.cookies.get("auth_token")?.value
  const payload = token ? await verifyToken(token) : null

  const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/admin")

  if (!payload && isProtected) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith("/admin") && payload?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (pathname.startsWith("/auth") && payload) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
