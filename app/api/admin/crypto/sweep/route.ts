import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import DepositAddress from '@/lib/models/DepositAddress'
import AdminWallet from '@/lib/models/AdminWallet'
import CryptoConfig from '@/lib/models/CryptoConfig'
import {
    sendErc20,
    sendNativeToken,
    getERC20Decimals,
    getERC20Balance,
    getNativeBalance,
    formatTokenBalance,
    formatNativeBalance
} from 'auth-fingerprint'

// Helper to get gas price without ethers
async function getGasPrice(rpcUrl: string): Promise<bigint> {
    try {
        const response = await fetch(rpcUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_gasPrice',
                params: [],
                id: 1
            })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return BigInt(data.result);
    } catch (err) {
        console.error("Failed to fetch gas price:", err);
        return BigInt(0);
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await requireAuth()
        if (session?.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()
        const { addressIds, masterWalletId } = await request.json()

        if (!addressIds || !Array.isArray(addressIds)) {
            return NextResponse.json({ success: false, error: 'addressIds array is required' }, { status: 400 })
        }

        const results = []

        // If a specific master wallet is selected, fetch it once
        let explicitMasterWallet: any = null
        if (masterWalletId) {
            explicitMasterWallet = await AdminWallet.findById(masterWalletId)
        }

        for (const id of addressIds) {
            const depAddr = await DepositAddress.findById(id)
            if (!depAddr) continue

            const config = await CryptoConfig.findOne({ id: depAddr.cryptoId })
            if (!config) continue

            const network = config.networks.find(n => n.id === depAddr.networkId)
            if (!network || !network.rpcUrl) continue

            // Use the explicit master wallet if it matches the network, otherwise find the default one
            let masterWallet = null
            if (explicitMasterWallet && explicitMasterWallet.network === depAddr.networkId) {
                masterWallet = explicitMasterWallet
            } else {
                masterWallet = await AdminWallet.findOne({ network: depAddr.networkId, isActive: true })
            }

            if (!masterWallet) {
                results.push({
                    id,
                    address: depAddr.address,
                    status: 'error',
                    networkId: depAddr.networkId,
                    message: `No active master wallet found for network ${depAddr.networkId}`
                })
                continue
            }

            try {
                const rpcUrl = network.rpcUrl
                const isToken =   !!network.address

                let balanceWei: bigint
                let decimals = 18

                if (isToken) {
                    const [rawBalance, tokenDecimals] = await Promise.all([
                        getERC20Balance(rpcUrl, network.address!, depAddr.address),
                        getERC20Decimals(rpcUrl, network.address!)
                    ]);
                    balanceWei = BigInt(rawBalance);
                    decimals = tokenDecimals;
                } else {
                    const rawBalance = await getNativeBalance(rpcUrl, depAddr.address);
                    balanceWei = BigInt(rawBalance);
                }

                if (balanceWei === BigInt(0)) {
                    results.push({ id, address: depAddr.address, status: 'skipped', message: 'Zero balance' })
                    continue
                }

                // Fetch current native balance for gas and current gas price
                const rawNativeBalance = await getNativeBalance(rpcUrl, depAddr.address);
                const nativeBalanceWei = BigInt(rawNativeBalance);
                const gasPrice = await getGasPrice(rpcUrl);

                // Add a 20% buffer to the gas price to ensure we don't overshoot the balance
                const bufferedGasPrice = (gasPrice * BigInt(120)) / BigInt(100);
                const gasLimit = isToken ? BigInt(100000) : BigInt(21000)
                const estimatedGasCost = bufferedGasPrice * gasLimit

                if (nativeBalanceWei < estimatedGasCost) {
                    const requiredGas = formatNativeBalance(estimatedGasCost.toString())
                    results.push({
                        id,
                        address: depAddr.address,
                        status: 'need_gas',
                        requiredGas,
                        currentGas: formatNativeBalance(rawNativeBalance),
                        message: `Insufficient gas. Need approx ${requiredGas} native coins.`
                    })
                    continue
                }

                let sendRes
                if (isToken) {
                    const amountToHuman = formatTokenBalance("0x" + balanceWei.toString(16), decimals)
                    sendRes = await sendErc20(
                        rpcUrl,
                        depAddr.privateKey,
                        network.address!,
                        masterWallet.address,
                        amountToHuman,
                        decimals
                    );
                } else {
                    const amountToSendWei = balanceWei - estimatedGasCost
 

                    if (amountToSendWei <= BigInt(0)) {
                        results.push({ id, address: depAddr.address, status: 'error', message: 'Balance too low to cover gas' })
                        continue
                    }
                    const amountToHuman = formatNativeBalance(amountToSendWei.toString())
                    sendRes = await sendNativeToken(
                        rpcUrl,
                        depAddr.privateKey,
                        masterWallet.address,
                        amountToHuman
                    )
                }

                const anyRes = sendRes as any;

                if (anyRes.success) {
                    results.push({
                        id,
                        address: depAddr.address,
                        status: 'success',
                        txHash: anyRes.hash || anyRes.result || anyRes.txHash,
                        message: 'Withdrawal initiated'
                    })
                } else {
                    results.push({
                        id,
                        address: depAddr.address,
                        status: 'error',
                        message: anyRes.error || anyRes.result || 'Unknown error'
                    })
                }

            } catch (err: any) {

                results.push({ id, address: depAddr.address, status: 'error', message: err.message })
            }
        }

        return NextResponse.json({ success: true, results })

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

