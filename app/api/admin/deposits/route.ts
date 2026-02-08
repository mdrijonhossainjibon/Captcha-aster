import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Deposit from '@/lib/models/Deposit'
import User from '@/lib/models/User'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        await connectDB()

        // Authenticate user
        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get query parameters for pagination and filtering
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const search = searchParams.get('search') || ''
        const status = searchParams.get('status') || ''

        // Build query
        let query: any = {}

        if (status && status !== 'all') {
            query.status = status
        }

        // Get total count for pagination
        const totalDeposits = await Deposit.countDocuments(query)
        const totalPages = Math.ceil(totalDeposits / limit)
        const skip = (page - 1) * limit

        // Fetch deposits with pagination and populate user data
        const deposits = await Deposit.find(query)
            .populate('userId', 'email name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()

        // Filter by search term after population (searching user email or txHash)
        let filteredDeposits = deposits
        if (search) {
            filteredDeposits = deposits.filter((deposit: any) => {
                const userEmail = deposit.userId?.email || ''
                const txHash = deposit.txHash || ''
                const searchLower = search.toLowerCase()
                return userEmail.toLowerCase().includes(searchLower) ||
                    txHash.toLowerCase().includes(searchLower)
            })
        }

        // Format deposits for frontend
        const formattedDeposits = filteredDeposits.map((deposit: any) => ({
            id: deposit._id.toString(),
            transactionId:  `DEP-${deposit._id.toString().slice(-8)}`,
            user: deposit.userId?.email || 'Unknown',
            userName: deposit.userId?.name || 'N/A',
            amount: deposit.amount,
            amountUSD: deposit.amountUSD,
            crypto: deposit.cryptoName,
            network: deposit.networkName,
            method: `${deposit.cryptoName} (${deposit.networkName})`,
            status: deposit.status,
            txHash: deposit.txHash,
            address: deposit.address,
            confirmations: deposit.confirmations,
            requiredConfirmations: deposit.requiredConfirmations,
            fee: deposit.fee,
            notes: deposit.notes,
            createdAt: new Date(deposit.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }),
            createdAtFull: new Date(deposit.createdAt).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        }))

        // Calculate stats
        const stats = {
            total: totalDeposits,
            completed: await Deposit.countDocuments({ status: 'completed' }),
            pending: await Deposit.countDocuments({ status: 'pending' }),
            confirming: await Deposit.countDocuments({ status: 'confirming' }),
            failed: await Deposit.countDocuments({ status: 'failed' })
        }

        return NextResponse.json({
            success: true,
            deposits: formattedDeposits,
            stats,
            pagination: {
                total: totalDeposits,
                page: page,
                limit: limit,
                totalPages: totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        })
    } catch (error) {
        console.error('Deposit history fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch deposit history' }, { status: 500 })
    }
}
