import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import AdminWallet from '@/lib/models/AdminWallet'
import { requireAuth, requireAdmin } from '@/lib/auth'

/**
 * GET /api/admin/wallet
 * Fetch all admin wallets
 */
export async function GET() {
    try {
        await connectDB()

        const user = await requireAdmin()
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const wallets = await AdminWallet.find().sort({ createdAt: -1 })

        return NextResponse.json({
            success: true,
            wallets
        })
    } catch (error: any) {
        console.error('Error fetching admin wallets:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch wallets' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/admin/wallet
 * Create or update admin wallet
 */
export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const user = await requireAdmin()
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { id, address, network, label, symbol, isActive, balance } = body

        if (!address || !network || !label || !symbol) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            )
        }

        if (id) {
            // Update
            const updatedWallet = await AdminWallet.findByIdAndUpdate(
                id,
                { address, network, label, symbol, isActive, balance },
                { new: true }
            )
            return NextResponse.json({
                success: true,
                message: 'Wallet updated successfully',
                wallet: updatedWallet
            })
        } else {
            // Create
            const newWallet = await AdminWallet.create({
                address,
                network,
                label,
                symbol,
                isActive: isActive ?? true,
                balance: balance ?? '0.00'
            })
            return NextResponse.json({
                success: true,
                message: 'Wallet created successfully',
                wallet: newWallet
            }, { status: 201 })
        }
    } catch (error: any) {
        console.error('Error saving admin wallet:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to save wallet' },
            { status: 500 }
        )
    }
}

/**
 * DELETE /api/admin/wallet
 * Delete admin wallet
 */
export async function DELETE(request: NextRequest) {
    try {
        await connectDB()

        const user = await requireAdmin()
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 })
        }

        await AdminWallet.findByIdAndDelete(id)

        return NextResponse.json({
            success: true,
            message: 'Wallet deleted successfully'
        })
    } catch (error: any) {
        console.error('Error deleting admin wallet:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete wallet' },
            { status: 500 }
        )
    }
}
