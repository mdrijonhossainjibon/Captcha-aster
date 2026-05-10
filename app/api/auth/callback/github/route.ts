import { NextRequest, NextResponse } from 'next/server'

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const REDIRECT_URI = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/callback/github`

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
        const githubAuthUrl = new URL('https://github.com/login/oauth/authorize')
        githubAuthUrl.searchParams.set('client_id', GITHUB_CLIENT_ID || '')
        githubAuthUrl.searchParams.set('redirect_uri', REDIRECT_URI)
        githubAuthUrl.searchParams.set('scope', 'user:email')
        githubAuthUrl.searchParams.set('state', stateToken)

        const response = NextResponse.redirect(githubAuthUrl.toString())
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
        // Exchange code for access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                code,
                client_id: GITHUB_CLIENT_ID || '',
                client_secret: GITHUB_CLIENT_SECRET || '',
                redirect_uri: REDIRECT_URI,
            }),
        })

        if (!tokenResponse.ok) {
            throw new Error('Failed to exchange code for token')
        }

        const tokenData = await tokenResponse.json()

        if (tokenData.error) {
            throw new Error(tokenData.error_description || tokenData.error)
        }

        const accessToken = tokenData.access_token

        // Get user profile from GitHub
        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
            },
        })

        if (!userResponse.ok) {
            throw new Error('Failed to fetch GitHub user profile')
        }

        const githubUser = await userResponse.json()
        const githubId = githubUser.id.toString()
        const name = githubUser.name || githubUser.login || ''
        const image = githubUser.avatar_url || ''

        // Get user email (GitHub may not return email in profile)
        let email = githubUser.email

        if (!email) {
            // Fetch emails endpoint
            const emailsResponse = await fetch('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/json',
                },
            })

            if (emailsResponse.ok) {
                const emails = await emailsResponse.json()
                const primaryEmail = emails.find((e: { primary: boolean; verified: boolean }) => e.primary && e.verified)
                    || emails.find((e: { verified: boolean }) => e.verified)
                email = primaryEmail?.email
            }
        }

        if (!email) {
            return NextResponse.redirect(new URL('/auth/login?error=no_email', request.url))
        }

        // Find or create user
        const connectDB = (await import('@/lib/mongodb')).default
        const User = (await import('@/lib/models/User')).default
        const { createToken } = await import('@/lib/jwt')

        await connectDB()

        let user = await User.findOne({ email })

        if (user) {
            // Link GitHub account if not already linked
            if (!user.oauthProvider) {
                user.oauthProvider = 'github'
                user.oauthId = githubId
                if (image) user.image = image
                await user.save()
            }
        } else {
            // Create new user
            user = await User.create({
                email,
                name,
                image: image || undefined,
                oauthProvider: 'github',
                oauthId: githubId,
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

        const { setAuthCookie } = await import('@/lib/jwt')
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
        console.error('GitHub OAuth error:', error)
        return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url))
    }
}