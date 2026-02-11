import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Package from '@/lib/models/Package'
import Activity from '@/lib/models/Activity'
import { requireAdmin } from '@/lib/auth'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        await connectDB()

        // Get authenticated user from session and check if admin
        const authUser = await requireAdmin()
        if (!authUser) {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
        }

        const { userId } = await params

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const user = await User.findById(userId).select('-password').lean()

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Format user for frontend
        const formattedUser = {
            id: user._id.toString(),
            name: user.name || 'N/A',
            email: user.email,
            status: user.isActive ? 'Active' : 'Inactive',
            balance: user.balance || 0,
            joined: user.createdAt,
            role: user.role || 'user',
            twoFactorEnabled: user.twoFactorEnabled,
            lastLogin: user.lastLoginIp,
            // emailVerified is not in the schema
        }

        // Fetch user's active packages
        const activePackages = await Package.find({
            userId: user._id,
            status: 'active'
        }).lean()

        // Fetch user's recent activities
        const recentActivities = await Activity.find({
            userId: user._id
        }).sort({ createdAt: -1 }).limit(10).lean()

        return NextResponse.json({
            success: true,
            user: formattedUser,
            packages: activePackages,
            activities: recentActivities
        })
    } catch (error) {
        console.error('Admin single user fetch error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
