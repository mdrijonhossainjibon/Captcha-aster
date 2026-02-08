import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import PricingPlan from '@/lib/models/PricingPlan'

// GET /api/pricing - Fetch all active pricing plans
export async function GET(request: Request) {
    try {
        await connectDB()

        

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
