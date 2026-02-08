import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { KolotiCache } from '@/lib/models/KolotiCache'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        await connectDB()

        // Authenticate user
        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()

        // Get query parameters for pagination
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const search = searchParams.get('search') || ''

        // Build query
        let query: any = {}

        if (search) {
            query.$or = [
                { imageHash: { $regex: search, $options: 'i' } },
                { question: { $regex: search, $options: 'i' } }
            ]
        }

        // Get total count for pagination
        const totalRecords = await KolotiCache.countDocuments(query)
        const totalPages = Math.ceil(totalRecords / limit)
        const skip = (page - 1) * limit

        // Fetch records with pagination
        const records = await KolotiCache.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()

        // Format records for frontend
        const formattedRecords = records.map(record => ({
            id: record._id.toString(),
            imageHash: record.imageHash,
            imageData: record.imageData,
            question: record.question,
            answer: record.answer,
            rawResponse: record.rawResponse,
            createdAt: new Date(record.createdAt).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        }))

        return NextResponse.json({
            success: true,
            records: formattedRecords,
            pagination: {
                total: totalRecords,
                page: page,
                limit: limit,
                totalPages: totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        })
    } catch (error) {
        console.error('Koloti cache fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await connectDB()

        // Authenticate user
        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { recordId, answer } = body

        if (!recordId) {
            return NextResponse.json({ error: 'Record ID is required' }, { status: 400 })
        }

        if (!answer || !Array.isArray(answer)) {
            return NextResponse.json({ error: 'Answer must be an array' }, { status: 400 })
        }

        // Validate that all answer elements are numbers
        if (!answer.every(item => typeof item === 'number')) {
            return NextResponse.json({ error: 'All answer elements must be numbers' }, { status: 400 })
        }

        // Update record
        const updatedRecord = await KolotiCache.findByIdAndUpdate(
            recordId,
            { answer },
            { new: true, runValidators: true }
        )

        if (!updatedRecord) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: 'Answer updated successfully',
            record: {
                id: updatedRecord._id.toString(),
                answer: updatedRecord.answer
            }
        })
    } catch (error) {
        console.error('Koloti cache update error:', error)
        return NextResponse.json({ error: 'Failed to update record' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await connectDB()

        // Authenticate user
        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()

        const { searchParams } = new URL(request.url)
        const recordId = searchParams.get('recordId')

        if (!recordId) {
            return NextResponse.json({ error: 'Record ID is required' }, { status: 400 })
        }

        await KolotiCache.findByIdAndDelete(recordId)

        return NextResponse.json({ success: true, message: 'Record deleted successfully' })
    } catch (error) {
        console.error('Koloti cache delete error:', error)
        return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 })
    }
}
