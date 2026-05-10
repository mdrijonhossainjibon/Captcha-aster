import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import RedeemCode from '@/lib/models/RedeemCode'
import Package from '@/lib/models/Package'
import { requireAuth } from '@/lib/auth'

// POST /api/topup/redeem — redeem a free code
export async function POST(request: NextRequest) {
    try {
        await connectDB()
        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
        }

        const { code } = await request.json()

        if (!code || typeof code !== 'string') {
            return NextResponse.json({ success: false, error: 'Redeem code is required' }, { status: 400 })
        }

        const normalizedCode = code.trim().toUpperCase()

        // Find the redeem code
        const redeemCode = await RedeemCode.findOne({ code: normalizedCode })

        if (!redeemCode) {
            return NextResponse.json({ success: false, error: 'Invalid redeem code' }, { status: 404 })
        }

        if (!redeemCode.isActive) {
            return NextResponse.json({ success: false, error: 'This redeem code is no longer active' }, { status: 400 })
        }

        if (redeemCode.expiresAt && new Date() > redeemCode.expiresAt) {
            return NextResponse.json({ success: false, error: 'This redeem code has expired' }, { status: 400 })
        }

        if (redeemCode.usedCount >= redeemCode.maxUses) {
            return NextResponse.json({ success: false, error: 'This redeem code has reached its maximum uses' }, { status: 400 })
        }

        // Check if user already used this code
        const alreadyUsed = redeemCode.usedBy.some(
            (u) => u.userId.toString() === authUser.userId
        )
        if (alreadyUsed) {
            return NextResponse.json({ success: false, error: 'You have already used this redeem code' }, { status: 400 })
        }

        // Find active package to extend
        const activePackage = await Package.findOne({ userId: authUser.userId, status: 'active' })

        if (!activePackage) {
            return NextResponse.json({
                success: false,
                error: 'No active package found. Please subscribe to a plan first.'
            }, { status: 400 })
        }

        // Extend credits
        activePackage.credits += redeemCode.credits
        await activePackage.save()

        // Mark code as used
        redeemCode.usedCount += 1
        redeemCode.usedBy.push({ userId: authUser.userId as any, usedAt: new Date() })
        await redeemCode.save()

        return NextResponse.json({
            success: true,
            message: `Successfully redeemed ${redeemCode.credits} free credits!`,
            data: {
                creditsAdded: redeemCode.credits,
                totalCredits: activePackage.credits,
                creditsUsed: activePackage.creditsUsed,
                packageCode: activePackage.packageCode
            }
        })
    } catch (error) {
        console.error('Redeem code error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
