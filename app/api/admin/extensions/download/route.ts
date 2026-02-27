import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Extension from '@/lib/models/Extension'

// POST - Track a download
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { id } = body

        if (!id) {
            return NextResponse.json({ success: false, error: 'Extension ID required' }, { status: 400 })
        }

        await connectDB()
        const updatedExtension = await Extension.findByIdAndUpdate(
            id,
            { $inc: { downloads: 1 } },
            { new: true }
        )

        if (!updatedExtension) {
            return NextResponse.json({ success: false, error: 'Extension not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Track download error:', error)
        return NextResponse.json({ success: false, error: 'Failed to track download' }, { status: 500 })
    }
}
