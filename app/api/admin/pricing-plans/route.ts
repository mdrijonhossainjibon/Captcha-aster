import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import PricingPlan from '@/lib/models/PricingPlan'
import { requireAuth } from '@/lib/auth'

// GET - Fetch all pricing plans
export async function GET(request: NextRequest) {
    try {
        await connectDB()

        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type') || ''

        let query: any = {}
        if (type && type !== 'all') {
            query.type = type
        }

        const plans = await PricingPlan.find(query)
            .sort({ sortOrder: 1, createdAt: 1 })
            .lean()

        const formattedPlans = plans.map((plan: any) => ({
            id: plan._id.toString(),
            code: plan.code,
            type: plan.type,
            price: plan.priceDisplay,
            priceValue: plan.price,
            validity: plan.validity,
            validityDays: plan.validityDays,
            recognition: plan.recognition,
            count: plan.count,
            dailyLimit: plan.dailyLimit,
            rateLimit: plan.rateLimit,
            active: plan.isActive,
            isPromo: plan.isPromo,
            sortOrder: plan.sortOrder
        }))

        // Calculate stats
        const stats = {
            total: plans.length,
            count: plans.filter((p: any) => p.type === 'count').length,
            daily: plans.filter((p: any) => p.type === 'daily').length,
            minute: plans.filter((p: any) => p.type === 'minute').length,
            active: plans.filter((p: any) => p.isActive).length
        }

        return NextResponse.json({
            success: true,
            plans: formattedPlans,
            stats
        })
    } catch (error) {
        console.error('Pricing plans fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch pricing plans' }, { status: 500 })
    }
}

// POST - Create new pricing plan
export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { code, type, price, validity, validityDays, recognition, count, dailyLimit, rateLimit, isActive } = body

        // Validate required fields
        if (!code || !type || !price || !validity) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Check if code already exists
        const existingPlan = await PricingPlan.findOne({ code: code.toUpperCase() })
        if (existingPlan) {
            return NextResponse.json({ error: 'Package code already exists' }, { status: 400 })
        }

        // Create pricing plan
        const newPlan = await PricingPlan.create({
            code: code.toUpperCase(),
            type,
            price: parseFloat(price),
            priceDisplay: `$${parseFloat(price).toFixed(2)}`,
            validity,
            validityDays: validityDays || 30,
            recognition: recognition || 'Image',
            count: type === 'count' ? count : undefined,
            dailyLimit: type === 'daily' ? dailyLimit : undefined,
            rateLimit: type === 'minute' ? rateLimit : undefined,
            isActive: isActive !== undefined ? isActive : true,
            isPromo: false,
            sortOrder: 0
        })

        return NextResponse.json({
            success: true,
            message: 'Pricing plan created successfully',
            plan: {
                id: newPlan._id.toString(),
                code: newPlan.code,
                type: newPlan.type
            }
        })
    } catch (error) {
        console.error('Pricing plan creation error:', error)
        return NextResponse.json({ error: 'Failed to create pricing plan' }, { status: 500 })
    }
}

// PATCH - Update pricing plan
export async function PATCH(request: NextRequest) {
    try {
        await connectDB()

        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { planId, ...updates } = body

        if (!planId) {
            return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 })
        }

        // If price is being updated, update priceDisplay too
        if (updates.price) {
            updates.priceDisplay = `$${parseFloat(updates.price).toFixed(2)}`
        }

        const updatedPlan = await PricingPlan.findByIdAndUpdate(
            planId,
            { $set: updates },
            { new: true }
        )

        if (!updatedPlan) {
            return NextResponse.json({ error: 'Pricing plan not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: 'Pricing plan updated successfully'
        })
    } catch (error) {
        console.error('Pricing plan update error:', error)
        return NextResponse.json({ error: 'Failed to update pricing plan' }, { status: 500 })
    }
}

// DELETE - Delete pricing plan
export async function DELETE(request: NextRequest) {
    try {
        await connectDB()

        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const planId = searchParams.get('planId')

        if (!planId) {
            return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 })
        }

        const deletedPlan = await PricingPlan.findByIdAndDelete(planId)

        if (!deletedPlan) {
            return NextResponse.json({ error: 'Pricing plan not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: 'Pricing plan deleted successfully'
        })
    } catch (error) {
        console.error('Pricing plan deletion error:', error)
        return NextResponse.json({ error: 'Failed to delete pricing plan' }, { status: 500 })
    }
}
