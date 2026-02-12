import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import OTP from '@/lib/models/OTP'
import { generateOTP, sendOTPEmail } from '@/lib/email'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request: NextRequest) {
    try {
        await connectDB()

        let email, password
        try {
            const body = await request.json()
            email = body.email
            password = body.password
        } catch (e) {
            return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
        }

        // Validate input
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
        }

        // Find user and include password field
        const user = await User.findOne({ email: email }).select('+password')

        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
        }

        // Check if user is active
        if (!user.isActive) {
            return NextResponse.json({ error: 'Account is deactivated. Please contact support.' }, { status: 403 })
        }

        
         const isPasswordValid = await user.comparePassword(password)
 
         if (!isPasswordValid) {
             return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
         }  

        // Check if 2FA is enabled
        if (user.twoFactorEnabled) {
            // Generate OTP
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

            return NextResponse.json({
                success: true,
                requiresOTP: true,
                message: 'OTP sent to your email',
                email: user.email,
            })
        }

        // If 2FA is not enabled, generate token and log in directly
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role || 'user',
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        return NextResponse.json({
            success: true,
            requiresOTP: false,
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                balance: user.balance,
                role: user.role || 'user',
            },
        })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
