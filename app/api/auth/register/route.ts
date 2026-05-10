import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Package from '@/lib/models/Package'
import ApiKey from '@/lib/models/ApiKey'
import OTP from '@/lib/models/OTP'
import { generateOTP, sendOTPEmail } from '@/services/email'
import { createToken, setAuthCookie } from '@/services/jwt'

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

        const emailLower = email.toLowerCase()

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
            twoFactorEnabled: false,
            balance: 0,
            isActive: true,
            role: 'user',
            lastLoginIp: currentIp,
        })

        // Generate Default API Key
        await ApiKey.create({
            userId: user._id,
            name: 'Default Key',
            key: (ApiKey as any).generateKey(),
            status: 'active',
        })

        // Generate JWT token and set cookie
        const token = await createToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role || 'user',
            balance: user.balance,
        })

        await setAuthCookie(token)

        return NextResponse.json({
            success: true,
            message: 'Account created successfully.',
            email: user.email,
            requiresVerification: false,
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
