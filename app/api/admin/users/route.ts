import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        await connectDB()

        // Get authenticated user from session and check if admin
        const authUser = await requireAdmin()
        if (!authUser) {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
        }

        // Get query parameters for filtering
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const status = searchParams.get('status') || ''
        const plan = searchParams.get('plan') || ''
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')

        // Build query
        let query: any = {}

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        }

        if (status) {
            if (status === 'Active') {
                query.isActive = true
            } else if (status === 'Inactive') {
                query.isActive = false
            }
        }

        // Get total count for pagination
        const totalUsers = await User.countDocuments(query)
        const totalPages = Math.ceil(totalUsers / limit)
        const skip = (page - 1) * limit

        // Fetch users with pagination
        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()

        // Format users for frontend
        const formattedUsers = users.map(user => ({
            id: user._id.toString(),
            name: user.name || 'N/A',
            email: user.email,
            status: user.isActive ? 'Active' : 'Inactive',
            balance: `$${user.balance?.toFixed(4)}`,
            joined: new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }),
            twoFactorEnabled: user.twoFactorEnabled,
            role: user.role || 'user'
        }))

        return NextResponse.json({
            success: true,
            users: formattedUsers,
            pagination: {
                total: totalUsers,
                page: page,
                limit: limit,
                totalPages: totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        })
    } catch (error) {
        console.error('Admin users fetch error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await connectDB()

        // Get authenticated user from session and check if admin
        const authUser = await requireAdmin()
        if (!authUser) {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
        }

        const body = await request.json()
        const { userId, name, balance, status } = body

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        // Build update object
        const updateData: any = {}
        if (name !== undefined) updateData.name = name
        if (balance !== undefined) {
            // Remove $ sign and convert to number
            const balanceNum = parseFloat(balance.toString().replace('$', ''))
            if (!isNaN(balanceNum)) {
                updateData.balance = balanceNum
            }
        }
        if (status !== undefined) {
            updateData.isActive = status === 'Active'
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password')

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: 'User updated successfully',
            user: {
                id: updatedUser._id.toString(),
                name: updatedUser.name,
                email: updatedUser.email,
                balance: `$${updatedUser.balance.toFixed(2)}`,
                status: updatedUser.isActive ? 'Active' : 'Inactive'
            }
        })
    } catch (error) {
        console.error('Admin user update error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await connectDB()

        // Get authenticated user from session and check if admin
        const authUser = await requireAdmin()
        if (!authUser) {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        // Prevent admin from deleting themselves
        if (userId === authUser.userId) {
            return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
        }

        const deletedUser = await User.findByIdAndDelete(userId)

        if (!deletedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: 'User deleted successfully'
        })
    } catch (error) {
        console.error('Admin user delete error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
