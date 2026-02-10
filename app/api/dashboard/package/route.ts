import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Package from '@/lib/models/Package'
import { requireAuth } from '@/lib/auth'

// Update package auto-renew
export async function PATCH(request: NextRequest) {
    try {
        await connectDB()

        // Get authenticated user from session
        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = authUser.userId

        let autoRenew
        try {
            const body = await request.json()
            autoRenew = body.autoRenew
        } catch (e) {
            return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
        }

        if (typeof autoRenew !== 'boolean') {
            return NextResponse.json({ error: 'autoRenew must be a boolean' }, { status: 400 })
        }

        // Find active package
        const activePackage = await Package.findOne({
            userId,
            status: 'active',
            endDate: { $gt: new Date() },
        })

        if (!activePackage) {
            return NextResponse.json({ error: 'No active package found' }, { status: 404 })
        }

        // Update auto-renew
        activePackage.autoRenew = autoRenew
        await activePackage.save()

        return NextResponse.json({
            success: true,
            message: `Auto-renew ${autoRenew ? 'enabled' : 'disabled'}`,
            autoRenew: activePackage.autoRenew,
        })
    } catch (error) {
        console.error('Update package error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// Cancel package
export async function DELETE(request: NextRequest) {
    try {
        await connectDB()

        // Get authenticated user from session
        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = authUser.userId

        // Find and cancel active package
        const activePackage = await Package.findOneAndUpdate(
            {
                userId,
                status: 'active',
                endDate: { $gt: new Date() },
            },
            {
                status: 'cancelled',
                autoRenew: false,
            },
            { new: true }
        )

        if (!activePackage) {
            return NextResponse.json({ error: 'No active package found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: 'Package cancelled successfully',
        })
    } catch (error) {
        console.error('Cancel package error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
