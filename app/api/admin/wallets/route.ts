import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import AdminWallet from '@/lib/models/AdminWallet'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (session?.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()
        const wallets = await AdminWallet.find().sort({ createdAt: -1 })
        return NextResponse.json({ success: true, data: wallets })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (session?.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()
        const body = await request.json()
        const wallet = await AdminWallet.create(body)
        return NextResponse.json({ success: true, data: wallet, message: 'Master wallet created' })
    } catch (error: any) {
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
        const body = await request.json()
        const { id, ...updateData } = body
        const wallet = await AdminWallet.findByIdAndUpdate(id, updateData, { new: true })
        return NextResponse.json({ success: true, data: wallet, message: 'Master wallet updated' })
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
        await AdminWallet.findByIdAndDelete(id)
        return NextResponse.json({ success: true, message: 'Master wallet deleted' })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
