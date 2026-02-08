import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

/**
 * GET /api/auth/me
 * Get current user profile
 * Requires authentication
 */
export async function GET(request: NextRequest) {
    try {
        // Verify authentication
        // Verify authentication
        const authUser = await requireAuth()

        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()

        // Fetch user from database
        const user = await User.findById(authUser.userId).select('-password')

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                balance: user.balance,
                twoFactorEnabled: user.twoFactorEnabled,
                isActive: user.isActive,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        })
    } catch (error) {
        console.error('Get profile error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

/**
 * PATCH /api/auth/me
 * Update current user profile
 * Requires authentication
 */
export async function PATCH(request: NextRequest) {
    try {
        // Verify authentication
        const authUser = await requireAuth()

        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()

        const { name, twoFactorEnabled } = await request.json()

        // Update user
        const user = await User.findByIdAndUpdate(
            authUser.userId,
            {
                ...(name !== undefined && { name }),
                ...(twoFactorEnabled !== undefined && { twoFactorEnabled }),
            },
            { new: true, runValidators: true }
        ).select('-password')

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                balance: user.balance,
                twoFactorEnabled: user.twoFactorEnabled,
                isActive: user.isActive,
                isAdmin: user.isAdmin,
            },
        })
    } catch (error) {
        console.error('Update profile error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
