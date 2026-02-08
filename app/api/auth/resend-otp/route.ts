import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import OTP from '@/lib/models/OTP'
import { generateOTP, sendOTPEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const { email } = await request.json()

        // Validate input
        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Check if user has 2FA enabled
        if (!user.twoFactorEnabled) {
            return NextResponse.json({ error: '2FA is not enabled for this account' }, { status: 400 })
        }

        // Generate new OTP
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
            return NextResponse.json({ error: 'Failed to send OTP email' }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: 'New OTP sent to your email',
        })
    } catch (error) {
        console.error('Resend OTP error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
