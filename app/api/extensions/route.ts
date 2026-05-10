import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Extension from '@/lib/models/Extension'

export async function GET(request: NextRequest) {
    try {
        await connectDB()
        const { searchParams } = new URL(request.url)
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')))
        const skip = (page - 1) * limit
        const platform = searchParams.get('platform')

        const query: any = { isActive: true }
        if (platform && platform !== 'All') query.platform = platform

        const [extensions, total] = await Promise.all([
            Extension.find(query)
                .select('name description version platform changelog fileName fileSize fileType downloadUrl iconUrl downloads createdAt')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Extension.countDocuments(query),
        ])

        return NextResponse.json({
            success: true,
            extensions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        })
    } catch (error) {
        console.error('GET public extensions error:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch extensions' }, { status: 500 })
    }
}
