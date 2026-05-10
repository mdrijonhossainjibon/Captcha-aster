import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Package from '@/lib/models/Package'
import { requireAdmin } from '@/lib/auth'
import { sendPackageAssignedEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
    try {
        await connectDB()

        const authUser = await requireAdmin()
        if (!authUser) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 })
        }

        const packages = await Package.find({ userId })
            .sort({ createdAt: -1 })
            .lean()

        const formatted = packages.map((pkg: any) => ({
            id: pkg._id.toString(),
            packageCode: pkg.packageCode,
            type: pkg.type,
            name: pkg.name,
            price: pkg.price,
            credits: pkg.credits,
            creditsUsed: pkg.creditsUsed,
            creditsRemaining: pkg.credits - pkg.creditsUsed,
            status: pkg.status,
            autoRenew: pkg.autoRenew,
            startDate: pkg.startDate,
            endDate: pkg.endDate,
            createdAt: pkg.createdAt,
        }))

        return NextResponse.json({ success: true, packages: formatted })
    } catch (error) {
        console.error('Fetch packages error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await connectDB()

        const authUser = await requireAdmin()
        if (!authUser) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const { packageId, credits, status, autoRenew } = body

        if (!packageId) {
            return NextResponse.json({ error: 'packageId is required' }, { status: 400 })
        }

        const updateData: any = {}
        if (credits !== undefined) updateData.credits = credits
        if (status !== undefined) updateData.status = status
        if (autoRenew !== undefined) updateData.autoRenew = autoRenew

        const updated = await Package.findByIdAndUpdate(packageId, updateData, { new: true, runValidators: true }).lean()

        if (!updated) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: 'Package updated successfully',
            pkg: {
                id: updated._id.toString(),
                name: updated.name,
                credits: updated.credits,
                creditsUsed: updated.creditsUsed,
                status: updated.status,
            },
        })
    } catch (error) {
        console.error('Update package error:', error)
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
        const packageId = searchParams.get('packageId')

        if (!packageId) {
            return NextResponse.json({ error: 'packageId is required' }, { status: 400 })
        }

        const deleted = await Package.findByIdAndDelete(packageId)

        if (!deleted) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: `Package ${deleted.name} removed successfully`,
        })
    } catch (error) {
        console.error('Delete package error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
