import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = `${(process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/^https:\/\/(localhost|127\.0\.0\.1)/, 'http://$1')}/api/auth/callback/google`

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth error
    if (error) {
        return NextResponse.redirect(new URL('/auth/login?error=' + error, request.url))
    }

 
    
    // If no code, initiate the OAuth flow
    if (!code) {
        const stateToken = crypto.randomUUID()
        const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
        googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID || '')
        googleAuthUrl.searchParams.set('redirect_uri', REDIRECT_URI)
        googleAuthUrl.searchParams.set('response_type', 'code')
        googleAuthUrl.searchParams.set('scope', 'openid email profile')
        googleAuthUrl.searchParams.set('state', stateToken)
        googleAuthUrl.searchParams.set('access_type', 'offline')
        googleAuthUrl.searchParams.set('prompt', 'consent')

        const response = NextResponse.redirect(googleAuthUrl.toString())
        response.cookies.set('oauth_state', stateToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 600, // 10 minutes
            path: '/',
        })
        return response
    }

    // Verify state
    const savedState = request.cookies.get('oauth_state')?.value
    if (state !== savedState) {
        return NextResponse.redirect(new URL('/auth/login?error=invalid_state', request.url))
    }

    try {
        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: GOOGLE_CLIENT_ID || '',
                client_secret: GOOGLE_CLIENT_SECRET || '',
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code',
            }),
        })

        if (!tokenResponse.ok) {
            throw new Error('Failed to exchange code for tokens')
        }

        const tokenData = await tokenResponse.json()
        const { id_token } = tokenData

        // Decode the ID token to get user info
        const payload = JSON.parse(atob(id_token.split('.')[1]))

        const googleId = payload.sub
        const email = payload.email
        const name = payload.name || payload.given_name || ''
        const image = payload.picture || ''

        if (!email) {
            return NextResponse.redirect(new URL('/auth/login?error=no_email', request.url))
        }

        // Find or create user
        const connectDB = (await import('@/lib/mongodb')).default
        const User = (await import('@/lib/models/User')).default
        const { createToken, setAuthCookie } = await import('@/lib/jwt')

        await connectDB()

        let user = await User.findOne({ email })

        if (user) {
            // Link Google account if not already linked
            if (!user.oauthProvider) {
                user.oauthProvider = 'google'
                user.oauthId = googleId
                if (image) user.image = image
                await user.save()
            }
        } else {
            // Create new user
            user = await User.create({
                email,
                name,
                image: image || undefined,
                oauthProvider: 'google',
                oauthId: googleId,
                balance: 0,
                role: 'user',
            })
        }

        if (!user.isActive) {
            return NextResponse.redirect(new URL('/auth/login?error=account_deactivated', request.url))
        }

        // Create auth token and set cookie
        const token = await createToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role || 'user',
            balance: user.balance,
        })

        const response = NextResponse.redirect(new URL('/dashboard', request.url))
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24,
            path: '/',
        })
        response.cookies.set('oauth_state', '', { maxAge: 0, path: '/' })

        return response
    } catch (error) {
        console.error('Google OAuth error:', error)
        return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url))
    }
}