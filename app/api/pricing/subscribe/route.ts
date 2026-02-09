import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import PricingPlan from '@/lib/models/PricingPlan'
import Package from '@/lib/models/Package'
import User from '@/lib/models/User'
import { requireAuth } from '@/lib/auth'
import { sendSubscriptionEmail } from '@/lib/email'

// POST /api/pricing/subscribe - Subscribe to a pricing plan
export async function POST(request: NextRequest) {
    try {
        await connectDB()

        // Get authenticated user from session
        const user = await requireAuth()
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { planId, planCode } = body

        if (!planId && !planCode) {
            return NextResponse.json(
                { success: false, error: 'Plan ID or code is required' },
                { status: 400 }
            )
        }

        // Find the pricing plan
        const query = planId ? { _id: planId } : { code: planCode.toUpperCase() }
        const pricingPlan = await PricingPlan.findOne({ ...query, isActive: true })

        if (!pricingPlan) {
            return NextResponse.json(
                { success: false, error: 'Pricing plan not found or inactive' },
                { status: 404 }
            )
        }

        // Check if user has enough balance
        const fullUser = await User.findById(user.userId)
        if (!fullUser) {
            return NextResponse.json(
                { success: false, error: 'User account not found' },
                { status: 404 }
            )
        }

        if (fullUser.balance < pricingPlan.price) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Insufficient balance. Required: $${pricingPlan.price.toFixed(2)}, Available: $${fullUser.balance.toFixed(2)}`
                },
                { status: 400 }
            )
        }

        // Calculate dates
        const startDate = new Date()
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + pricingPlan.validityDays)




        // Create or Update subscription package
        const packageData = {
            userId: user.userId,
            packageCode: pricingPlan.code,
            type: pricingPlan.type,
            name: `${pricingPlan.type.toUpperCase()} - ${pricingPlan.code}`,
            price: pricingPlan.price,
            billingCycle: pricingPlan.validityDays > 7 ? 'monthly' : 'monthly',
            credits: pricingPlan.credits,
            creditsUsed: 0,
            features: [
                `${pricingPlan.recognition} Recognition`,
                `${pricingPlan.validity} Validity`,
                pricingPlan.type === 'count' ? `${pricingPlan.count?.toLocaleString()} Total Requests` :
                    pricingPlan.type === 'daily' ? `${pricingPlan.dailyLimit?.toLocaleString()} Requests/Day` :
                        `${pricingPlan.rateLimit} Requests/Minute`,
            ],
            status: 'active',
            autoRenew: false,
            startDate,
            endDate,
        }

        // Check for existing active package and update it, otherwise create new
        const subscription = await Package.findOneAndUpdate(
            { userId: user.userId, status: 'active' },
            { $set: packageData },
            { new: true, upsert: true }
        )

        // Deduct price from user balance
        await User.findByIdAndUpdate(user.userId, {
            $inc: { balance: -pricingPlan.price }
        })

        // Send subscription confirmation email (non-blocking)
        sendSubscriptionEmail({
            email: fullUser.email,
            name: fullUser.name || 'User',
            planName: pricingPlan.name,
            price: pricingPlan.price,
            credits: pricingPlan.credits || 0,
            endDate,
        }).catch(err => console.error('Failed to send subscription email:', err))

        return NextResponse.json({
            success: true,
            message: 'Subscription created successfully',
            data: {
                subscriptionId: subscription._id.toString(),
                planCode: pricingPlan.code,
                price: pricingPlan.priceDisplay,
                credits: pricingPlan.count,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            },
        })
    } catch (error) {
        console.error('Error creating subscription:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create subscription' },
            { status: 500 }
        )
    }
}
