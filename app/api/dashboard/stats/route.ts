import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Package from '@/lib/models/Package'
import { requireAuth } from '@/lib/auth'

export async function GET() {
    try {
        await connectDB()

        // Get authenticated user from session
        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = authUser.userId

        // Get user
        const user = await User.findById(userId).select('-password')
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Get today's date (start of day)
        const today = new Date()
        today.setHours(0, 0, 0, 0)


        // Get active package
        const activePackage = await Package.findOne({ userId, status: 'active' });




        const now = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const msUntilReset = tomorrow.getTime() - now.getTime()
        const hoursUntilReset = Math.floor(msUntilReset / (1000 * 60 * 60))
        const minutesUntilReset = Math.floor((msUntilReset % (1000 * 60 * 60)) / (1000 * 60))


        let resetsIn: string | null = `${hoursUntilReset}h ${minutesUntilReset}m`




        const percentage = activePackage ? (activePackage.creditsUsed / activePackage.credits) * 100 : 0;



        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                balance: user.balance,
            },
            dailyUsage: {
                used: activePackage ? activePackage.creditsUsed : 0,
                total: activePackage ? activePackage.credits : 0,
                percentage: Math.round(percentage * 10) / 10,
                resetsIn: activePackage ? resetsIn : null,
                totalRequests: activePackage ? activePackage.creditsUsed : 0,
                requestsLeft: activePackage ? activePackage.credits - activePackage.creditsUsed : 0,
                type: activePackage ? activePackage?.type : null
            },
            package: activePackage
                ? {
                    id: activePackage._id,
                    code: activePackage.packageCode,
                    name: activePackage.name,
                    price: activePackage?.price,
                    credits: activePackage?.credits,
                    creditsUsed: activePackage?.creditsUsed,
                    creditsRemaining: activePackage?.credits,
                    usagePercentage: Math.round(((activePackage.creditsUsed / activePackage.credits) * 100) * 10) / 10,
                    features: activePackage?.features,
                    autoRenew: activePackage?.autoRenew,
                    status: activePackage.status,
                    endDate: activePackage.endDate,
                }
                : null,
        })
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
