import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Deposit from '@/lib/models/Deposit'
import User from '@/lib/models/User'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * GET /api/crypto/deposits
 * Get user's deposit history
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized',
                },
                { status: 401 }
            )
        }

        await connectDB()

        // Find user
        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'User not found',
                },
                { status: 404 }
            )
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const limit = parseInt(searchParams.get('limit') || '50')
        const skip = parseInt(searchParams.get('skip') || '0')

        // Build query
        const query: any = { userId: user._id }
        if (status) {
            query.status = status
        }

        // Fetch deposits
        const deposits = await Deposit.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .select('-__v')
            .lean()

        const total = await Deposit.countDocuments(query)

        return NextResponse.json({
            success: true,
            data: {
                deposits,
                total,
                limit,
                skip,
            },
        })
    } catch (error: any) {
        console.error('Error fetching deposits:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch deposits',
            },
            { status: 500 }
        )
    }
}

/**
 * POST /api/crypto/deposits
 * Create a new deposit record (for tracking purposes)
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized',
                },
                { status: 401 }
            )
        }

        await connectDB()

        // Find user
        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'User not found',
                },
                { status: 404 }
            )
        }

        const body = await request.json()
        const {
            cryptoId,
            cryptoName,
            networkId,
            networkName,
            amount,
            amountUSD,
            txHash,
            address,
            requiredConfirmations,
            fee,
            notes,
        } = body

        // Validate required fields
        if (!cryptoId || !cryptoName || !networkId || !networkName || !amount || !address || !requiredConfirmations || !fee) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields',
                },
                { status: 400 }
            )
        }

        // Create deposit record
        const deposit = await Deposit.create({
            userId: user._id,
            cryptoId,
            cryptoName,
            networkId,
            networkName,
            amount,
            amountUSD: amountUSD || 0,
            txHash,
            address,
            status: 'completed', // Auto-complete for now as requested
            confirmations: requiredConfirmations,
            requiredConfirmations,
            fee,
            notes,
        })

        // Update user balance
        await User.findByIdAndUpdate(user._id, {
            $inc: { balance: amountUSD || 0 }
        })

        return NextResponse.json({
            success: true,
            message: 'Deposit record created and balance updated',
            data: deposit,
        }, { status: 201 })
    } catch (error: any) {
        console.error('Error creating deposit:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create deposit record',
            },
            { status: 500 }
        )
    }
}
