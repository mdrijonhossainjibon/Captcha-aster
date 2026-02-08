import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import PasswordReset from '@/lib/models/PasswordReset'

/**
 * GET /api/auth/reset-password/verify
 * Verify if a reset token is valid
 */
export async function GET(request: NextRequest) {
    try {
        await connectDB()

        const { searchParams } = new URL(request.url)
        const token = searchParams.get('token')

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 })
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

        return NextResponse.json({
            success: true,
            email: resetRecord.email,
        })
    } catch (error) {
        console.error('Verify reset token error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
