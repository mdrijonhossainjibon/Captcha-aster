import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import OTP from '@/lib/models/OTP'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

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

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                isAdmin: user.isAdmin,
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        // Delete the used OTP
        await OTP.deleteOne({ _id: otpRecord._id })

        // Get client IP
        const currentIp = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || '127.0.0.1'

        // Send login notification (non-blocking) only if IP is different
        if ((user as any).lastLoginIp !== currentIp) {
            const { sendLoginNotification } = await import('@/lib/email')
            sendLoginNotification({
                email: user.email,
                name: user.name ?? user.email.split('@')[0],
                loginTime: new Date(),
                ipAddress: currentIp,
            }).catch(err => console.error('Failed to send login notification:', err))

                // Update last login IP
                ; (user as any).lastLoginIp = currentIp
            await user.save()
        }

        return NextResponse.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                balance: user.balance,
                isAdmin: user.isAdmin,
            },
        })
    } catch (error) {
        console.error('OTP verification error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
