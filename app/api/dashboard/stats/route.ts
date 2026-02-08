import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Package from '@/lib/models/Package'
import Usage from '@/lib/models/Usage'
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

        // Get today's usage
        const todayUsage = await Usage.findOne({
            userId,
            date: today,
        })

        // Get active package
        const activePackage = await Package.findOne({ userId, status: 'active' })

     
        
        const now = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const msUntilReset = tomorrow.getTime() - now.getTime()
        const hoursUntilReset = Math.floor(msUntilReset / (1000 * 60 * 60))
        const minutesUntilReset = Math.floor((msUntilReset % (1000 * 60 * 60)) / (1000 * 60))

        // Default values
        let statsTotal = 0
        let statsUsed = todayUsage?.totalRequests || 0
        let resetsIn: string | null = `${hoursUntilReset}h ${minutesUntilReset}m`

        if (activePackage) {
            if (activePackage.type === 'count') {
                // Count-based plans: Show total package consumption
                statsTotal = activePackage.credits
                statsUsed = activePackage.creditsUsed
                resetsIn = null // No reset for lifetime credit pools
            } else if (activePackage.type === 'daily' || activePackage.type === 'minute') {
                // Daily/Minute plans: Show today's usage against the calculated daily limit
                statsTotal = Math.floor(activePackage.credits / 30)
                statsUsed = todayUsage?.totalRequests || 0
                // resetsIn stays as time until midnight
            }
        }

        // Calculate usage stats
        const requestsLeft = Math.max(0, statsTotal - statsUsed)
        const percentage = statsTotal > 0 ? (statsUsed / statsTotal) * 100 : 0
        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                balance: user.balance,
            },
            dailyUsage: {
                used: statsUsed,
                total: statsTotal,
                percentage: Math.round(percentage * 10) / 10,
                resetsIn,
                totalRequests: statsUsed,
                requestsLeft,
                type: activePackage?.type || 'daily'
            },
            package: activePackage
                ? {
                    id: activePackage._id,
                    code: activePackage.packageCode,
                    name: activePackage.name,
                    price: activePackage?.price,
                    credits: activePackage.credits,
                    creditsUsed: activePackage.creditsUsed,
                    creditsRemaining: activePackage.credits - activePackage.creditsUsed,
                    usagePercentage: Math.round(((activePackage.creditsUsed / activePackage.credits) * 100) * 10) / 10,
                    features: activePackage.features,
                    autoRenew: activePackage.autoRenew,
                    status: activePackage.status,
                    endDate: activePackage.endDate,
                }
                : null,
        })
    } catch (error) {
        console.error('Dashboard stats error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
