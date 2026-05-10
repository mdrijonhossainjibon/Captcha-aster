import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import RedeemCode from '@/lib/models/RedeemCode'
import User from '@/lib/models/User'
import { requireAuth } from '@/lib/auth'

// GET /api/admin/redeem-codes — list all redeem codes
export async function GET() {
    try {
        await connectDB()
        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
        }
        const fullUser = await User.findById(authUser.userId)
        if (!fullUser || fullUser.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
        }

        const codes = await RedeemCode.find()
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name email')
            .lean()

        const formatted = codes.map((c: any) => ({
            id: c._id.toString(),
            code: c.code,
            credits: c.credits,
            maxUses: c.maxUses,
            usedCount: c.usedCount,
            expiresAt: c.expiresAt,
            isActive: c.isActive,
            createdBy: c.createdBy,
            createdAt: c.createdAt,
            usedByCount: c.usedBy?.length || 0,
        }))

        return NextResponse.json({ success: true, data: formatted })
    } catch (error) {
        console.error('Redeem codes GET error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/admin/redeem-codes — create a new redeem code
export async function POST(request: NextRequest) {
    try {
        await connectDB()
        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
        }
        const fullUser = await User.findById(authUser.userId)
        if (!fullUser || fullUser.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
        }

        const { code, credits, maxUses, expiresAt } = await request.json()

        if (!code || !credits) {
            return NextResponse.json({ success: false, error: 'Code and credits are required' }, { status: 400 })
        }

        const existing = await RedeemCode.findOne({ code: code.toUpperCase() })
        if (existing) {
            return NextResponse.json({ success: false, error: 'Code already exists' }, { status: 400 })
        }

        const newCode = await RedeemCode.create({
            code: code.toUpperCase(),
            credits: Number(credits),
            maxUses: Number(maxUses) || 1,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            createdBy: authUser.userId,
        })

        return NextResponse.json({
            success: true,
            message: 'Redeem code created',
            data: { id: newCode._id.toString(), code: newCode.code, credits: newCode.credits }
        })
    } catch (error) {
        console.error('Redeem codes POST error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}

// PATCH /api/admin/redeem-codes — toggle active or edit
export async function PATCH(request: NextRequest) {
    try {
        await connectDB()
        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
        }
        const fullUser = await User.findById(authUser.userId)
        if (!fullUser || fullUser.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
        }

        const { id, isActive, credits, maxUses, expiresAt, resetUsedBy } = await request.json()

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 })
        }

        const update: any = {}
        if (typeof isActive === 'boolean') update.isActive = isActive
        if (credits) update.credits = Number(credits)
        if (maxUses) update.maxUses = Number(maxUses)
        if (expiresAt !== undefined) update.expiresAt = expiresAt ? new Date(expiresAt) : null
        if (resetUsedBy) {
            update.usedCount = 0
            update.usedBy = []
        }

        await RedeemCode.findByIdAndUpdate(id, { $set: update })

        return NextResponse.json({ success: true, message: 'Redeem code updated' })
    } catch (error) {
        console.error('Redeem codes PATCH error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE /api/admin/redeem-codes — delete a redeem code
export async function DELETE(request: NextRequest) {
    try {
        await connectDB()
        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
        }
        const fullUser = await User.findById(authUser.userId)
        if (!fullUser || fullUser.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 })
        }

        await RedeemCode.findByIdAndDelete(id)

        return NextResponse.json({ success: true, message: 'Redeem code deleted' })
    } catch (error) {
        console.error('Redeem codes DELETE error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
