import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import ApiKey from '@/lib/models/ApiKey'
import { requireAuth } from '@/lib/auth'

// Get all API keys for a user
export async function GET() {
    try {
        await connectDB()

        // Get authenticated user from session
        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = authUser.userId

        // Get all API keys for this user
        const apiKeys = await ApiKey.find({ userId, status: { $ne: 'revoked' } })
            .sort({ createdAt: 1 })
            .select('-__v')

        // Format the response
        const formattedKeys = apiKeys.map((key) => ({
            id: key._id,
            name: key.name,
            key: key.key,
            fullKey: key.key, // Only send full key when needed
            status: key.status,
            lastUsed: key.lastUsed ? formatTimeAgo(key.lastUsed) : 'Never',
            usageCount: key.usageCount,
            createdAt: key.createdAt,
        }))

        // Ensure we always have 3 slots
        const slots = []
        for (let i = 0; i < 3; i++) {
            if (formattedKeys[i]) {
                // Determine if it's a master key (first created key)
                const isMaster = i === 0;
                slots.push({
                    ...formattedKeys[i],
                    name: isMaster && formattedKeys[i].name !== 'Master Key' ? 'Master Key' : formattedKeys[i].name,
                    isMaster
                })
            } else {
                slots.push({
                    name: `Slot ${i + 1}`,
                    key: '',
                    status: 'empty',
                    lastUsed: '',
                    isMaster: i === 0
                })
            }
        }

        return NextResponse.json({
            success: true,
            apiKeys: slots,
        })
    } catch (error) {
        console.error('Get API keys error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// Create new API key
export async function POST(request: NextRequest) {
    try {
        await connectDB()

        // Get authenticated user from session
        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = authUser.userId
        const { name } = await request.json()

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }

        // Check if user already has 3 API keys
        const existingKeys = await ApiKey.countDocuments({ userId, status: { $ne: 'revoked' } })
        if (existingKeys >= 3) {
            return NextResponse.json({ error: 'Maximum 3 API keys allowed' }, { status: 400 })
        }

        // Generate new API key
        const newKey = (ApiKey as any).generateKey()

        // Create API key
        const apiKey = await ApiKey.create({
            userId,
            name,
            key: newKey,
            status: 'active',
        })

        return NextResponse.json({
            success: true,
            message: 'API key created successfully',
            apiKey: {
                id: apiKey._id,
                name: apiKey.name,
                key: `${newKey.substring(0, 20)}...${newKey.substring(newKey.length - 6)}`,
                fullKey: newKey,
                status: apiKey.status,
                lastUsed: 'Never',
                createdAt: apiKey.createdAt,
            },
        })
    } catch (error) {
        console.error('Create API key error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// Delete API key
export async function DELETE(request: NextRequest) {
    try {
        await connectDB()

        // Get authenticated user from session
        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = authUser.userId
        const { id } = await request.json()

        if (!id) {
            return NextResponse.json({ error: 'Key ID is required' }, { status: 400 })
        }

        // Find the key to delete
        const keyToDelete = await ApiKey.findOne({ _id: id, userId })

        if (!keyToDelete) {
            return NextResponse.json({ error: 'API key not found' }, { status: 404 })
        }

        // Check if it is the master key (oldest key)
        const oldestKey = await ApiKey.findOne({ userId, status: { $ne: 'revoked' } }).sort({ createdAt: 1 })

        if (oldestKey && oldestKey._id.toString() === keyToDelete._id.toString()) {
            return NextResponse.json({ error: 'Cannot delete the Master Key' }, { status: 400 })
        }

        // Permanently delete or revoke? Let's delete for now to free up the slot.
        await ApiKey.deleteOne({ _id: id })

        return NextResponse.json({
            success: true,
            message: 'API key deleted successfully',
        })
    } catch (error) {
        console.error('Delete API key error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)

    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
    return new Date(date).toLocaleDateString()
}
