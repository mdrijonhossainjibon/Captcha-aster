import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import DepositAddress from '@/lib/models/DepositAddress'
import CryptoConfig from '@/lib/models/CryptoConfig'
import {
    getERC20Balance,
    getERC20Decimals,
    formatTokenBalance,
    getNativeBalance,
    formatNativeBalance,
} from 'auth-fingerprint'

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
        const session = await getServerSession(authOptions)
        if (session?.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()

        const { id } = await request.json()
        if (!id) {
            return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 })
        }

        // 1. Load the deposit address record
        const depositAddress = await DepositAddress.findById(id).lean()
        if (!depositAddress) {
            return NextResponse.json(
                { success: false, error: 'Deposit address not found' },
                { status: 404 }
            )
        }

        // 2. Find matching CryptoConfig to get rpcUrl + tokenAddress
        const crypto = await CryptoConfig.findOne({ id: depositAddress.cryptoId }).lean()
        if (!crypto) {
            return NextResponse.json(
                { success: false, error: `No CryptoConfig found for "${depositAddress.cryptoId}"` },
                { status: 404 }
            )
        }

        const network = (crypto.networks as any[]).find(n => n.id === depositAddress.networkId)
        if (!network) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Network "${depositAddress.networkId}" not found in CryptoConfig for "${depositAddress.cryptoId}"`,
                },
                { status: 404 }
            )
        }

        if (!network.rpcUrl) {
            return NextResponse.json(
                {
                    success: false,
                    error: `No RPC URL configured for network "${depositAddress.networkId}". Please set it in Crypto Settings → Networks.`,
                },
                { status: 422 }
            )
        }

        const { rpcUrl, address } = network
        const walletAddress = depositAddress.address

        let balance: number
        let balanceFormatted: string
        let type: 'token' | 'native'

        console.log(network)

        if (address) {
            // ── ERC-20 token (USDT, USDC, BUSD, etc.) ─────────────────────
            type = 'token'

            const [rawHex, decimals] = await Promise.all([
                getERC20Balance(rpcUrl, address, walletAddress),
                getERC20Decimals(rpcUrl, address),
            ])

            balanceFormatted = formatTokenBalance(rawHex, decimals)
            balance = parseFloat(balanceFormatted)
        } else {
            // ── Native coin (ETH, BNB, MATIC, AVAX, etc.) ─────────────────
            type = 'native'

            const rawHex = await getNativeBalance(rpcUrl, walletAddress)
            balanceFormatted = formatNativeBalance(rawHex)
            balance = parseFloat(balanceFormatted)
        }

        // 3. Persist updated balance to DB
        await DepositAddress.findByIdAndUpdate(id, {
            lastBalance: balance,
            lastUsedAt: new Date(),
        })

        return NextResponse.json({
            success: true,
            balance,
            balanceFormatted,
            type,
            tokenAddress: address ?? null,
            address: walletAddress,
            network: depositAddress.networkId,
            crypto: depositAddress.cryptoId,
        })
    } catch (error: any) {
        console.error('[balance/route] Error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
