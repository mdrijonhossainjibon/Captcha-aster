import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Solution from '@/lib/models/Solution'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        await connectDB()

        const authUser = await requireAdmin()
        if (!authUser) {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const service = searchParams.get('service') || ''
        const type = searchParams.get('type') || ''
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')

        // Build query
        const query: any = {}
        if (search) query.question = { $regex: search, $options: 'i' }
        if (service) query.service = service
        if (type) query.type = type

        const total = await Solution.countDocuments(query)
        const totalPages = Math.ceil(total / limit)
        const skip = (page - 1) * limit

        const solutions = await Solution.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()

        // Stats
        const totalSolutions = await Solution.countDocuments()
        const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
        const todaySolutions = await Solution.countDocuments({ createdAt: { $gte: todayStart } })

        const serviceBreakdown = await Solution.aggregate([
            { $group: { _id: '$service', count: { $sum: 1 } } }
        ])

        const typeBreakdown = await Solution.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ])

        return NextResponse.json({
            success: true,
            solutions: solutions.map((s: any) => ({
                id: s._id.toString(),
                hash: s.hash?.slice(0, 12) + '...',
                question: s.question || '(no question)',
                type: s.type,
                service: s.service,
                solution: s.solution,
                imageData: s.imageData || [],
                examples: s.examples || [],
                createdAt: s.createdAt,
            })),


            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
            stats: {
                total: totalSolutions,
                today: todaySolutions,
                byService: Object.fromEntries(serviceBreakdown.map(s => [s._id, s.count])),
                byType: Object.fromEntries(typeBreakdown.map(t => [t._id, t.count])),
            }
        })
    } catch (error) {
        console.error('Admin solutions error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await connectDB()

        const authUser = await requireAdmin()
        if (!authUser) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const solutionId = searchParams.get('solutionId')
        const clearAll = searchParams.get('clearAll') === 'true'

        if (clearAll) {
            const result = await Solution.deleteMany({})
            return NextResponse.json({ success: true, message: `Cleared ${result.deletedCount} solutions` })
        }

        if (!solutionId) {
            return NextResponse.json({ error: 'solutionId required' }, { status: 400 })
        }

        const deleted = await Solution.findByIdAndDelete(solutionId)
        if (!deleted) {
            return NextResponse.json({ error: 'Solution not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: 'Solution deleted' })
    } catch (error) {
        console.error('Admin solution delete error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
