import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import OTP from '@/lib/models/OTP'
import { createToken, setAuthCookie } from '@/services/jwt'

export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const { email, otp } = await request.json()

        // Validate input
        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })
        }

        // Find the OTP record
        const otpRecord = await OTP.findOne({
            email: email.toLowerCase(),
            otp: otp,
            verified: false,
        })

        if (!otpRecord) {
            return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 })
        }

        // Check if OTP is expired
        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteOne({ _id: otpRecord._id })
            return NextResponse.json({ error: 'OTP has expired' }, { status: 401 })
        }

        // Mark OTP as verified
        otpRecord.verified = true
        await otpRecord.save()

        // Find user and activate account
        const user = await User.findOne({ email: email.toLowerCase() })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Activate user account
        user.isActive = true
        await user.save()

        // Generate JWT token
        const token = await createToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role || 'user',
            balance: user.balance,
        })

        await setAuthCookie(token)

        // Delete the used OTP
        await OTP.deleteOne({ _id: otpRecord._id })

        // Send welcome email (non-blocking)
        const { sendWelcomeEmail } = await import('@/lib/email')
        sendWelcomeEmail({
            email: user.email,
            name: user.name || 'User',
            isOAuth: false,
        }).catch(err => console.error('Failed to send welcome email:', err))

        console.log('✅ Email verified and account activated:', user.email)

        return NextResponse.json({
            success: true,
            message: 'Email verified successfully',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                balance: user.balance,
                role: user.role || 'user',
            },
        })
    } catch (error) {
        console.error('Email verification error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
