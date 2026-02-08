import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import PricingPlan from '@/lib/models/PricingPlan'

// GET /api/pricing - Fetch all active pricing plans
export async function GET(request: Request) {
    try {
        await connectDB()

   /*    await PricingPlan.create({
  "code": "DAILY_100K",
  "type": "daily",
  "price": 96.99,
  "priceDisplay": "$96.99",
  "validity": "30 days",
  "validityDays": 30,
  "recognition": "Up to 5,000 captchas per day",
  "dailyLimit": 96000,
  "isActive": true,
  "isPromo": true,
  "sortOrder": 11,
  "createdAt": "2026-02-01T00:00:00.000Z",
  "updatedAt": "2026-02-06T12:30:00.000Z"
}
) */
 

        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type')

        // Build query
        const query: Record<string, unknown> = { isActive: true }
        if (type && type !== 'all') {
            query.type = type
        }

        // Fetch pricing plans sorted by type and sortOrder
        const pricingPlans = await PricingPlan.find(query)
            .sort({ type: 1, sortOrder: 1, price: 1 })
            .lean()

        // Transform for frontend compatibility
        const transformedPlans = pricingPlans.map((plan) => ({
            id: plan._id.toString(),
            type: plan.type,
            code: plan.code,
            price: plan.priceDisplay,
            priceValue: plan.price,
            validity: plan.validity,
            recognition: plan.recognition,
            isPromo: plan.isPromo,
            // Type-specific fields
            ...(plan.type === 'count' && { count: plan.count }),
            ...(plan.type === 'daily' && { dailyLimit: plan.dailyLimit }),
            ...(plan.type === 'minute' && { rateLimit: plan.rateLimit }),
        }))

        return NextResponse.json({
            success: true,
            data: transformedPlans,
            count: transformedPlans.length,
        })
    } catch (error) {
        console.error('Error fetching pricing plans:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch pricing plans' },
            { status: 500 }
        )
    }
}
