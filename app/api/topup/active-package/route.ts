import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Package from '@/lib/models/Package'
import User from '@/lib/models/User'
import { requireAuth } from '@/lib/auth'

// GET /api/topup/active-package — get user's active package + balance
export async function GET(request: NextRequest) {
    try {
        await connectDB()
        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
        }

        const fullUser = await User.findById(authUser.userId).select('balance')
        const activePackage = await Package.findOne({ userId: authUser.userId, status: 'active' }).lean()

        return NextResponse.json({
            success: true,
            data: {
                balance: fullUser?.balance || 0,
                activePackage: activePackage
                    ? {
                        id: activePackage._id.toString(),
                        code: activePackage.packageCode,
                        name: activePackage.name,
                        credits: activePackage.credits,
                        creditsUsed: activePackage.creditsUsed,
                        creditsRemaining: activePackage.credits - activePackage.creditsUsed,
                        endDate: activePackage.endDate,
                        type: activePackage.type,
                    }
                    : null
            }
        })
    } catch (error) {
        console.error('Active package error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
