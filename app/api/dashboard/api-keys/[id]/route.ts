import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import ApiKey from '@/lib/models/ApiKey'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Regenerate API key
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB()

        // Get token from Authorization header
        const authHeader = request.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.substring(7)

        // Verify token
        let decoded: any
        try {
            decoded = jwt.verify(token, JWT_SECRET)
        } catch (error) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const userId = decoded.userId
        const keyId = params.id

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

// Delete API key
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB()

        // Get token from Authorization header
        const authHeader = request.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.substring(7)

        // Verify token
        let decoded: any
        try {
            decoded = jwt.verify(token, JWT_SECRET)
        } catch (error) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const userId = decoded.userId
        const keyId = params.id

        // Find and delete the API key
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
            message: 'API key deleted successfully',
        })
    } catch (error) {
        console.error('Delete API key error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
