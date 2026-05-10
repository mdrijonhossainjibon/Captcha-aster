import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import { syncDepositAddressBalance } from '@/services/crypto-balance'

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/deposit-addresses/balance
// Body: { id: string }
//
// Auto-detects native vs ERC-20 using CryptoConfig from DB:
//   • network.tokenAddress exists  → ERC-20 token (USDT, USDC, BUSD…)
//                                    uses getERC20Balance + getERC20Decimals
//   • no tokenAddress              → native coin (ETH, BNB, MATIC…)
//                                    uses getNativeBalance
//
// RPC URL is read from CryptoConfig.networks[].rpcUrl — no manual input needed.
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
    try {
        const session = await requireAuth()
        if (session?.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()

        const { id } = await request.json()
        if (!id) {
            return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 })
        }

        const updatedAddress = await syncDepositAddressBalance(id)

        if (!updatedAddress) {
            return NextResponse.json(
                { success: false, error: 'Failed to sync balance. Ensure RPC URL is correct.' },
                { status: 422 }
            )
        }

        return NextResponse.json({
            success: true,
            balance: updatedAddress.lastBalance,
            address: updatedAddress.address,
            network: updatedAddress.networkId,
            crypto: updatedAddress.cryptoId,
        })
    } catch (error: any) {
        console.error('[balance/route] Error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
