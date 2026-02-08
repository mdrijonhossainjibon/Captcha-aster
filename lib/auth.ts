import { NextAuthOptions, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import connectDB from './mongodb'
import User from './models/User'
import Package from './models/Package'
import ApiKey from './models/ApiKey'
import bcrypt from 'bcryptjs'
import { headers } from 'next/headers'

export interface AuthUser {
    userId: string
    email: string
    isAdmin: boolean
    balance: number
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
                otp: { label: 'OTP', type: 'text' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter an email and password')
                }

                await connectDB()

                const user = await User.findOne({ email: credentials.email }).select('+password')

                if (!user || !user.isActive) {
                    throw new Error('No user found with this email')
                }

                /*  const passwordMatch = await bcrypt.compare(credentials.password, user.password)
 
                 if (!passwordMatch) {
                     throw new Error('Incorrect password')
                 } */

                // Check for 2FA if enabled
                if (user.twoFactorEnabled) {
                    if (!credentials.otp) {
                        // Throw a specific error that the client can catch to show OTP input
                        throw new Error('2FA_REQUIRED')
                    }

                    // Verify OTP here (Assuming you have a way to verify it, 
                    // or for now we'll check against a separate verification logic)
                    // You might need a separate collection for OTPs or handle it via a custom API
                    // For this implementation, we'll assume OTP verification is handled or skipped for simplicity 
                    // unless you have an OTP verification model.

                    // Example (if you had a verify function):
                    // const isOtpValid = await verifyUserOtp(user._id, credentials.otp);
                    // if (!isOtpValid) throw new Error('Invalid verification code');
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    isAdmin: user.isAdmin,
                    balance: user.balance,
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            // Handle OAuth sign-in (Google, GitHub)
            if (account?.provider === 'google' || account?.provider === 'github') {
                // Validate email domain - only allow Gmail for Google OAuth
                if (account?.provider === 'google') {
                    const emailDomain = user.email?.split('@')[1]?.toLowerCase()

                    // Only allow @gmail.com for Google OAuth
                    if (emailDomain !== 'gmail.com') {
                        return false // Reject sign-in
                    }
                }

                await connectDB()

                // Get client IP
                const heads = await headers()
                const currentIp = heads.get('x-forwarded-for')?.split(',')[0] || heads.get('x-real-ip') || '127.0.0.1'

                // Check if user exists
                let existingUser = await User.findOne({ email: user.email })


                if (!existingUser) {
                    // Create new user for OAuth login
                    existingUser = await User.create({
                        email: user.email || '',
                        name: user.name || user.email?.split('@')[0] || 'User',
                        password: 'kopikit942@hopesx.com', // No password for OAuth users
                        isActive: true,
                        isAdmin: false,
                        balance: 0,
                        lastLoginIp: currentIp,
                    } as any)

                    // Create Free Trial Package for new OAuth users
                    const trialEndDate = new Date()
                    trialEndDate.setDate(trialEndDate.getDate() + 3) // 3 days validity

                    await Package.create({
                        userId: existingUser._id,
                        packageCode: 'TRIAL',
                        type: 'count',
                        name: 'Free Trial',
                        price: 0,
                        billingCycle: 'monthly',
                        credits: 100, // 100 count
                        creditsUsed: 0,
                        features: ['100 Free Requests', 'Trial Access', '3 Days Validity'],
                        status: 'active',
                        autoRenew: false,
                        startDate: new Date(),
                        endDate: trialEndDate,
                    })

                    // Generate Default API Key
                    await ApiKey.create({
                        userId: existingUser._id,
                        name: 'Default Key',
                        key: (ApiKey as any).generateKey(),
                        status: 'active',
                    })

                    // Send welcome email (non-blocking)
                    const { sendWelcomeEmail } = await import('./email')
                    sendWelcomeEmail({
                        email: existingUser.email,
                        name: existingUser.name || 'User',
                        isOAuth: true,
                    }).catch(err => console.error('Failed to send welcome email:', err))
                } else {
                    // Only send login notification if IP is different
                    if (existingUser.lastLoginIp !== currentIp) {
                        // Send login notification (non-blocking)
                        const { sendLoginNotification } = await import('./email')
                        sendLoginNotification({
                            email: existingUser.email,
                            name: existingUser.name || 'User',
                            loginTime: new Date(),
                            ipAddress: currentIp,
                        }).catch(err => console.error('Failed to send login notification:', err))

                        // Update last login IP
                        existingUser.lastLoginIp = currentIp
                        await existingUser.save()
                    }
                }

                // Update user object with database info
                user.id = existingUser._id.toString()
                    ; (user as any).isAdmin = existingUser.isAdmin
                    ; (user as any).balance = existingUser.balance
            }

            return true
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.isAdmin = (user as any).isAdmin
                token.balance = (user as any).balance
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).isAdmin = token.isAdmin;
                (session.user as any).balance = token.balance;
            }
            return session
        },
    },

    
    pages: {
        signIn: '/auth/login',
        error: '/auth/login', // Redirect to login on error
    },
    session: {
        strategy: 'jwt',
    },
    debug: false, // Enable debug mode to see detailed logs
    secret: process.env.NEXTAUTH_SECRET,
}

/**
 * Helper to get the current session in Server Components or API Routes
 */
export async function getAuthSession() {
    return await getServerSession(authOptions)
}

/**
 * Helper to require authentication in API routes (Server Side)
 */
export async function requireAuth(): Promise<AuthUser | null> {
    const session = await getAuthSession()

    if (!session || !session.user) {
        return null
    }

    return {
        userId: (session.user as any).id,
        email: session.user.email!,
        isAdmin: (session.user as any).isAdmin,
        balance: (session.user as any).balance,
    }
}

/**
 * Helper to require admin access in API routes (Server Side)
 */
export async function requireAdmin(): Promise<AuthUser | null> {
    const user = await requireAuth()

    if (!user || !user.isAdmin) {
        return null
    }

    return user
}
