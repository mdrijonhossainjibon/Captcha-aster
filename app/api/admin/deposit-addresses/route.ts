import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import DepositAddress from '@/lib/models/DepositAddress'
import User from '@/lib/models/User'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (session?.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const search = searchParams.get('search') || ''

        const query: any = {}
        if (search) {
            query.$or = [
                { address: { $regex: search, $options: 'i' } },
                { cryptoId: { $regex: search, $options: 'i' } },
                { networkId: { $regex: search, $options: 'i' } }
            ]
        }

        const skip = (page - 1) * limit

        const [addresses, total] = await Promise.all([
            DepositAddress.find(query)
                .populate('userId', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            DepositAddress.countDocuments(query)
        ])

        return NextResponse.json({
            success: true,
            data: addresses,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error: any) {
        console.error('Error fetching deposit addresses:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (session?.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()
        const { id, isActive } = await request.json()

        const updated = await DepositAddress.findByIdAndUpdate(id, { isActive }, { new: true })

        if (!updated) {
            return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, data: updated })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (session?.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 })
        }

        const deleted = await DepositAddress.findByIdAndDelete(id)

        if (!deleted) {
            return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: 'Address deleted successfully' })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
