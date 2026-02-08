import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import PasswordReset from '@/lib/models/PasswordReset'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const { token, password } = await request.json()

        // Validate input
        if (!token || !password) {
            return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
        }

        // Validate password strength
        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
        }

        // Find the reset token
        const resetRecord = await PasswordReset.findOne({
            token,
            used: false,
        })

        if (!resetRecord) {
            return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 404 })
        }

        // Check if token is expired
        if (resetRecord.expiresAt < new Date()) {
            await PasswordReset.deleteOne({ _id: resetRecord._id })
            return NextResponse.json({ error: 'Reset token has expired' }, { status: 410 })
        }

        // Find user
        const user = await User.findById(resetRecord.userId)

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Update user password
        user.password = hashedPassword
        await user.save()

        // Mark token as used
        resetRecord.used = true
        await resetRecord.save()

        // Delete all reset tokens for this user
        await PasswordReset.deleteMany({ userId: user._id })

        console.log('✅ Password reset successful for:', user.email)

        return NextResponse.json({
            success: true,
            message: 'Password has been reset successfully',
        })
    } catch (error) {
        console.error('Reset password error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
