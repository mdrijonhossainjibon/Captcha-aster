import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import DepositAddress from '@/lib/models/DepositAddress'
import CryptoConfig from '@/lib/models/CryptoConfig'
import Deposit from '@/lib/models/Deposit'
import User from '@/lib/models/User'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth';
import { getDepositHistory, getERC20Decimals, formatTokenBalance } from '@/lib/getDepositHistory'

/**
 * GET /api/crypto/deposits/check
 * Polling endpoint for frontend to check for new completed deposits
 * This now includes the blockchain checking logic previously in the cron
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

        // 1. Get address from query params
        const { searchParams } = new URL(request.url)
        const address = searchParams.get('address')

        if (!address) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Address is required',
                },
                { status: 400 }
            )
        }

        // 2. Get the specific active deposit address for this user
        const depAddr = await DepositAddress.findOne({  userId: user._id,  address: address, isActive: true })
 
 

        const newlyDetected = []

        if (depAddr) {
            // 3. Get crypto config to get RPC URL
            const config = await CryptoConfig.findOne({ id: depAddr.cryptoId, isActive: true })
 
            if (config) {
                const network = config.networks.find(n => n.id === depAddr.networkId)

                if (network && network.rpcUrl) {
                    try {
                        if (network.address) {
                            const data = await getDepositHistory(network.address, depAddr.address, network.rpcUrl);
                            const decimals = await getERC20Decimals(network.rpcUrl, network.address);

 
                            for (const tx of data) {
                                const history = await Deposit.findOne({ txHash: tx.txHash });
                                if (history) {
                                    continue;
                                }

                                const amount = formatTokenBalance(tx.amount, decimals);
                                const amountNum = Number(amount);
                                user.balance += amountNum;
                                await user.save();

                             const deposit = await Deposit.create({
                                    userId: user._id,
                                    cryptoId: depAddr.cryptoId,
                                    cryptoName: config.name,
                                    networkId: depAddr.networkId,
                                    networkName: network.name,
                                    amount: amountNum,
                                    amountUSD: amountNum, // Placeholder price (could be updated with actual price)
                                    address: depAddr.address,
                                    txHash: tx.txHash,
                                    status: 'completed',
                                    confirmations: network.confirmations,
                                    requiredConfirmations: network.confirmations,
                                    fee: network.fee,
                                    notes: 'Incremental deposit detected via real-time polling'
                                })


                                newlyDetected.push(deposit)
                            }

                        }


                    } catch (rpcError) {
                        console.error(`RPC error for ${depAddr.address} on ${network.name}:`, rpcError)
                    }
                }
            }
        }

        return NextResponse.json({
            success: true,
            data: newlyDetected
        })
    } catch (error: any) {
        console.error('Error in real-time deposit check:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to poll deposits',
            },
            { status: 500 }
        )
    }
}
