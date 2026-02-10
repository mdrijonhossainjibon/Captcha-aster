import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import ApiKey from '@/lib/models/ApiKey'
import { requireAuth } from '@/lib/auth'

// Regenerate API key
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB()

        const { id: keyId } = await params

        // Get authenticated user from session
        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = authUser.userId

        // Find the API key
        const apiKey = await ApiKey.findOne({ _id: keyId, userId })
        if (!apiKey) {
            return NextResponse.json({ error: 'API key not found' }, { status: 404 })
        }

        // Generate new key
        const newKey = (ApiKey as any).generateKey()

        // Update the API key
        apiKey.key = newKey
        apiKey.lastUsed = null
        apiKey.usageCount = 0
        await apiKey.save()

        return NextResponse.json({
            success: true,
            message: 'API key regenerated successfully',
            apiKey: {
                id: apiKey._id,
                name: apiKey.name,
                key: `${newKey.substring(0, 20)}...${newKey.substring(newKey.length - 6)}`,
                fullKey: newKey,
                status: apiKey.status,
                lastUsed: 'Just now',
            },
        })
    } catch (error) {
        console.error('Regenerate API key error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// Update API key metadata (e.g., name)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB()

        const { id: keyId } = await params

        // Get authenticated user from session
        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = authUser.userId

        let name, status
        try {
            const body = await request.json()
            name = body.name
            status = body.status
        } catch (e) {
            return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
        }

        // Find the API key
        const apiKey = await ApiKey.findOne({ _id: keyId, userId })
        if (!apiKey) {
            return NextResponse.json({ error: 'API key not found' }, { status: 404 })
        }

        // Update allowed fields
        if (name !== undefined) apiKey.name = name
        if (status !== undefined) apiKey.status = status

        await apiKey.save()

        return NextResponse.json({
            success: true,
            message: 'API key updated successfully',
            apiKey: {
                id: apiKey._id,
                name: apiKey.name,
                status: apiKey.status,
                lastUsed: apiKey.lastUsed,
            },
        })
    } catch (error) {
        console.error('Update API key error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// Delete API key
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB()

        const { id: keyId } = await params

        // Get authenticated user from session
        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = authUser.userId

        // Find and delete the API key (revoke status)
        const apiKey = await ApiKey.findOneAndUpdate(
            { _id: keyId, userId },
            { status: 'revoked' },
            { new: true }
        )

        if (!apiKey) {
            return NextResponse.json({ error: 'API key not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: 'API key revoked successfully',
        })
    } catch (error) {
        console.error('Delete API key error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
