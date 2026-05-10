import connectDB from '@/lib/mongodb'
import DepositAddress from '@/lib/models/DepositAddress'
import CryptoConfig from '@/lib/models/CryptoConfig'
import {
    getERC20Balance,
    getERC20Decimals,
    getNativeBalance,
} from 'auth-fingerprint'

export async function syncDepositAddressBalance(id: string) {
    await connectDB()

    const depAddr = await DepositAddress.findById(id)
    if (!depAddr) return null

    const config = await CryptoConfig.findOne({ id: depAddr.cryptoId })
    if (!config) return null

    const network = config.networks.find(n => n.id === depAddr.networkId)
    if (!network || !network.rpcUrl) return null

    try {
        const rpcUrl = network.rpcUrl
        const isToken = !!network.tokenAddress

        let balanceWei: bigint
        let decimals = 18

        if (isToken && network.tokenAddress) {
            const [rawBalance, tokenDecimals] = await Promise.all([
                getERC20Balance(rpcUrl, network.tokenAddress, depAddr.address),
                getERC20Decimals(rpcUrl, network.tokenAddress),
            ])
            balanceWei = BigInt(rawBalance)
            decimals = tokenDecimals
        } else {
            const rawBalance = await getNativeBalance(rpcUrl, depAddr.address)
            balanceWei = BigInt(rawBalance)
        }

        // Convert to decimal (simple division by 10^decimals)
        const balanceNumber = Number(balanceWei) / Math.pow(10, decimals)

        depAddr.lastBalance = balanceNumber
        await depAddr.save()

        return depAddr
    } catch (error) {
        console.error('[crypto-balance] Error syncing balance:', error)
        return null
    }
}
