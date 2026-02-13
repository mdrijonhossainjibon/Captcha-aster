import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import DepositAddress from '@/lib/models/DepositAddress'
import AdminWallet from '@/lib/models/AdminWallet'
import CryptoConfig from '@/lib/models/CryptoConfig'
import { JsonRpcProvider, Wallet, Contract, formatUnits } from 'ethers'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (session?.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()
        const { addressIds } = await request.json()

        if (!addressIds || !Array.isArray(addressIds)) {
            return NextResponse.json({ success: false, error: 'addressIds array is required' }, { status: 400 })
        }

        const results = []

        for (const id of addressIds) {
            const depAddr = await DepositAddress.findById(id)
            if (!depAddr) continue

            const config = await CryptoConfig.findOne({ id: depAddr.cryptoId })
            if (!config) continue

            const network = config.networks.find(n => n.id === depAddr.networkId)
            if (!network || !network.rpcUrl) continue

            const masterWallet = await AdminWallet.findOne({ network: depAddr.networkId, isActive: true })
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
                const provider = new JsonRpcProvider(network.rpcUrl)
                const wallet = new Wallet(depAddr.privateKey, provider)

                let balance: bigint
                const isToken = !!network.tokenAddress

                if (isToken) {
                    const abi = ['function balanceOf(address) view returns (uint256)', 'function transfer(address, uint256) returns (bool)']
                    const contract = new Contract(network.tokenAddress!, abi, wallet)
                    balance = await contract.balanceOf(depAddr.address)
                } else {
                    balance = await provider.getBalance(depAddr.address)
                }

                if (balance === BigInt(0)) {
                    results.push({ id, address: depAddr.address, status: 'skipped', message: 'Zero balance' })
                    continue
                }

                const nativeBalance = await provider.getBalance(depAddr.address)
                const feeData = await provider.getFeeData()
                const gasLimit = isToken ? BigInt(100000) : BigInt(21000)
                const estimatedGasCost = (feeData.gasPrice || BigInt(0)) * gasLimit

                if (nativeBalance < estimatedGasCost) {
                    const requiredGas = formatUnits(estimatedGasCost, 18)
                    results.push({
                        id,
                        address: depAddr.address,
                        status: 'need_gas',
                        requiredGas,
                        currentGas: formatUnits(nativeBalance, 18),
                        message: `Insufficient gas. Need approx ${requiredGas} native coins.`
                    })
                    continue
                }

                let tx
                if (isToken) {
                    const abi = ['function transfer(address, uint256) returns (bool)']
                    const contract = new Contract(network.tokenAddress!, abi, wallet)
                    tx = await contract.transfer(masterWallet.address, balance)
                } else {
                    const amountToSend = balance - estimatedGasCost
                    if (amountToSend <= BigInt(0)) {
                        results.push({ id, address: depAddr.address, status: 'error', message: 'Balance too low to cover gas' })
                        continue
                    }
                    tx = await wallet.sendTransaction({
                        to: masterWallet.address,
                        value: amountToSend
                    })
                }

                results.push({
                    id,
                    address: depAddr.address,
                    status: 'success',
                    txHash: tx.hash,
                    message: 'Withdrawal initiated'
                })

            } catch (err: any) {
                results.push({ id, address: depAddr.address, status: 'error', message: err.message })
            }
        }

        return NextResponse.json({ success: true, results })

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
