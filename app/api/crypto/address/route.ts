import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import DepositAddress from '@/lib/models/DepositAddress'
import CryptoConfig from '@/lib/models/CryptoConfig'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * GET /api/crypto/address?cryptoId=usdt&networkId=bsc
 * Get or generate deposit address for user
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

        const { searchParams } = new URL(request.url)
        const cryptoId = searchParams.get('cryptoId')
        const networkId = searchParams.get('networkId')

        if (!cryptoId || !networkId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'cryptoId and networkId are required',
                },
                { status: 400 }
            )
        }

        // Verify crypto and network exist
        const cryptoConfig = await CryptoConfig.findOne({ id: cryptoId, isActive: true })
        if (!cryptoConfig) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid cryptocurrency',
                },
                { status: 400 }
            )
        }

        const network = cryptoConfig.networks.find(n => n.id === networkId && n.isActive)
        if (!network) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid network',
                },
                { status: 400 }
            )
        }

        // For now, return the default address from config
        // In production, you would generate unique addresses per user
        return NextResponse.json({
            success: true,
            data: {
                address: network.address,
                cryptoId,
                cryptoName: cryptoConfig.name,
                networkId,
                networkName: network.name,
                minDeposit: network.minDeposit,
                fee: network.fee,
                confirmations: network.confirmations,
            },
        })
    } catch (error: any) {
        console.error('Error fetching deposit address:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch deposit address',
            },
            { status: 500 }
        )
    }
}
