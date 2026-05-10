import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import PricingPlan from '@/lib/models/PricingPlan'
import Package from '@/lib/models/Package'
import { requireAdmin } from '@/lib/auth'
import { sendPackageAssignedEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const authUser = await requireAdmin()
        if (!authUser) {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
        }

        const body = await request.json()
        const { userId, planId, freeTrial, trialDays, trialCredits, autoRenew } = body

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 })
        }

        const user = await User.findById(userId)
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const startDate = new Date()

        if (freeTrial) {
            const endDate = new Date()
            endDate.setDate(endDate.getDate() + (trialDays || 7))

            const newPackage = await Package.create({
                userId: user._id,
                packageCode: 'TRIAL',
                type: 'count',
                name: 'FREE TRIAL',
                price: 0,
                billingCycle: 'monthly',
                credits: trialCredits || 50,
                creditsUsed: 0,
                features: ['Free Trial', `${trialDays || 7} Days Access`],
                status: 'active',
                autoRenew: false,
                startDate,
                endDate,
            })

            await sendPackageAssignedEmail({
                email: user.email,
                name: user.name || 'User',
                packageName: 'FREE TRIAL',
                credits: trialCredits || 50,
                validityDays: trialDays || 7,
            })

            return NextResponse.json({
                success: true,
                message: `Free trial (${trialCredits || 50} credits, ${trialDays || 7} days) assigned to ${user.email}`,
                pkg: {
                    id: newPackage._id.toString(),
                    name: newPackage.name,
                    credits: trialCredits || 50,
                    endDate: endDate.toISOString(),
                },
            })
        }

        if (!planId) {
            return NextResponse.json({ error: 'planId is required' }, { status: 400 })
        }

        const plan = await PricingPlan.findById(planId)
        if (!plan) {
            return NextResponse.json({ error: 'Pricing plan not found' }, { status: 404 })
        }

        const endDate = new Date()
        endDate.setDate(endDate.getDate() + plan.validityDays)

        // Determine credits based on plan type
        let credits = 0
        if (plan.type === 'count') {
            credits = plan.count || 0
        } else if (plan.type === 'daily') {
            credits = plan.dailyLimit || 0
        } else if (plan.type === 'minute') {
            credits = plan.rateLimit || 0
        }

        const newPackage = await Package.create({
            userId: user._id,
            packageCode: plan.code,
            type: plan.type,
            name: `${plan.type.toUpperCase()} - ${plan.code}`,
            price: plan.price,
            billingCycle: 'monthly',
            credits,
            creditsUsed: 0,
            features: [`${plan.recognition} Recognition`, `${plan.validity} Validity`],
            status: 'active',
            autoRenew: autoRenew ?? true,
            startDate,
            endDate,
        })

        await sendPackageAssignedEmail({
            email: user.email,
            name: user.name || 'User',
            packageName: `${plan.type.toUpperCase()} - ${plan.code}`,
            credits,
            validityDays: plan.validityDays,
        })

        return NextResponse.json({
            success: true,
            message: `Package ${plan.code} assigned to ${user.email}`,
            pkg: {
                id: newPackage._id.toString(),
                name: newPackage.name,
                credits,
                endDate: endDate.toISOString(),
            },
        })
    } catch (error) {
        console.error('Assign package error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
