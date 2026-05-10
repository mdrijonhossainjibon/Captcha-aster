import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Package from '@/lib/models/Package'
import User from '@/lib/models/User'
import { requireAuth } from '@/lib/auth'

// POST /api/topup/credits — buy credits from balance, extend active package
export async function POST(request: NextRequest) {
    try {
        await connectDB()
        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
        }

        const { credits, price } = await request.json()

        if (!credits || !price || credits < 1 || price < 0) {
            return NextResponse.json({ success: false, error: 'Invalid credits or price' }, { status: 400 })
        }

        const fullUser = await User.findById(authUser.userId)
        if (!fullUser) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
        }

        if (price > 0 && fullUser.balance < price) {
            return NextResponse.json({
                success: false,
                error: `Insufficient balance. Required: $${price.toFixed(2)}, Available: $${fullUser.balance.toFixed(2)}`
            }, { status: 400 })
        }

        // Find active package to extend
        const activePackage = await Package.findOne({ userId: authUser.userId, status: 'active' })

        if (!activePackage) {
            return NextResponse.json({
                success: false,
                error: 'No active package found. Please subscribe to a plan first.'
            }, { status: 400 })
        }

        // Extend credits on the active package
        activePackage.credits += credits
        await activePackage.save()

        // Deduct price from balance (if not free)
        if (price > 0) {
            await User.findByIdAndUpdate(authUser.userId, { $inc: { balance: -price } })
        }

        return NextResponse.json({
            success: true,
            message: `Successfully added ${credits} credits to your package`,
            data: {
                creditsAdded: credits,
                totalCredits: activePackage.credits,
                creditsUsed: activePackage.creditsUsed,
                packageCode: activePackage.packageCode,
                newBalance: fullUser.balance - price
            }
        })
    } catch (error) {
        console.error('Topup credits error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
