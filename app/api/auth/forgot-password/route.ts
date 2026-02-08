import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import PasswordReset from '@/lib/models/PasswordReset'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const { email } = await request.json()

        // Validate input
        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() })

        // Always return success to prevent email enumeration
        // Don't reveal if the email exists or not
        if (!user) {
            console.log(`⚠️  Password reset requested for non-existent email: ${email}`)
            return NextResponse.json({
                success: true,
                message: 'If an account exists with this email, you will receive a password reset link.',
            })
        }

        // Check if user is active
        if (!user.isActive) {
            console.log(`⚠️  Password reset requested for inactive account: ${email}`)
            return NextResponse.json({
                success: true,
                message: 'If an account exists with this email, you will receive a password reset link.',
            })
        }

        // Generate reset token
        const resetToken = PasswordReset.generateToken()

        // Delete any existing reset tokens for this user
        await PasswordReset.deleteMany({ userId: user._id })

        // Create new reset token
        await PasswordReset.create({
            userId: user._id,
            email: user.email,
            token: resetToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        })

        // Send password reset email
        const emailSent = await sendPasswordResetEmail({
            email: user.email,
            resetToken,
            name: user.name,
        })

        if (!emailSent) {
            console.warn('⚠️  Password reset email failed to send, but continuing...')
        }

        return NextResponse.json({
            success: true,
            message: 'If an account exists with this email, you will receive a password reset link.',
        })
    } catch (error) {
        console.error('Forgot password error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
