import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Package from '@/lib/models/Package'
import ApiKey from '@/lib/models/ApiKey'
import OTP from '@/lib/models/OTP'
import { generateOTP, sendOTPEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
    try {
        await connectDB()

        let name, email, password
        try {
            const body = await request.json()
            name = body.name
            email = body.email
            password = body.password
        } catch (e) {
            return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
        }

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
        }

        // Validate password strength
        if (password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
        }

        // Check password requirements
        const hasUppercase = /[A-Z]/.test(password)
        const hasLowercase = /[a-z]/.test(password)
        const hasNumber = /[0-9]/.test(password)

        if (!hasUppercase || !hasLowercase || !hasNumber) {
            return NextResponse.json({
                error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
            }, { status: 400 })
        }

        // Validate Gmail only
        const emailLower = email.toLowerCase()
        if (!emailLower.endsWith('@gmail.com')) {
            return NextResponse.json({
                error: 'Only Gmail addresses are allowed for registration',
            }, { status: 400 })
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: emailLower })

        if (existingUser) {
            return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
        }

        // Get client IP
        const currentIp = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || '127.0.0.1'

        // Create new user (password will be hashed automatically by the model)
        const user = await User.create({
            name,
            email: emailLower,
            password,
            twoFactorEnabled: true, // Enable 2FA for all new signups
            balance: 0,
            isActive: false, // User is inactive until email is verified
            role: 'user',
            lastLoginIp: currentIp,
        })

        // Create Free Trial Package
        const trialEndDate = new Date()
        trialEndDate.setDate(trialEndDate.getDate() + 3) // 3 days validity

        await Package.create({
            userId: user._id,
            packageCode: 'TRIAL',
            type: 'count', // As requested: count based
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
            userId: user._id,
            name: 'Default Key',
            key: (ApiKey as any).generateKey(),
            status: 'active',
        })

        // Generate OTP for email verification
        const otpCode = generateOTP()

        // Delete any existing OTPs for this email
        await OTP.deleteMany({ email: user.email })

        // Save new OTP
        await OTP.create({
            email: user.email,
            otp: otpCode,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        })

        // Send OTP email
        const emailSent = await sendOTPEmail({
            email: user.email,
            otp: otpCode,
            name: user.name,
        })

        if (!emailSent) {
            console.warn('⚠️  OTP email failed to send, but continuing...')
        }

        console.log('✅ User registered successfully:', user.email)

        return NextResponse.json({
            success: true,
            message: 'Account created successfully. Please verify your email.',
            email: user.email,
            requiresVerification: true,
        })
    } catch (error: any) {
        console.error('Registration error:', error)

        // Handle duplicate key error
        if (error.code === 11000) {
            return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
        }

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
