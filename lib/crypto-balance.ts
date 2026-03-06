import DepositAddress from '@/lib/models/DepositAddress'
import CryptoConfig from '@/lib/models/CryptoConfig'
import {
    getERC20Balance,
    getERC20Decimals,
    formatTokenBalance,
    getNativeBalance,
    formatNativeBalance,
} from 'auth-fingerprint'

export async function syncDepositAddressBalance(id: string) {
    try {
        const depositAddress = await DepositAddress.findById(id).lean()
        if (!depositAddress) return null

        const crypto = await CryptoConfig.findOne({ id: depositAddress.cryptoId }).lean()
        if (!crypto) return null

        const network = (crypto.networks as any[]).find(n => n.id === depositAddress.networkId)
        if (!network || !network.rpcUrl) return null

        const { rpcUrl, address } = network
        const walletAddress = depositAddress.address

        let balance: number

        if (address) {
            // ERC-20 token
            const [rawHex, decimals] = await Promise.all([
                getERC20Balance(rpcUrl, address, walletAddress),
                getERC20Decimals(rpcUrl, address),
            ])
            balance = parseFloat(formatTokenBalance(rawHex, decimals))
        } else {
            // Native coin
            const rawHex = await getNativeBalance(rpcUrl, walletAddress)
            balance = parseFloat(formatNativeBalance(rawHex))
        }

        const updated = await DepositAddress.findByIdAndUpdate(id, {
            lastBalance: balance,
            lastUsedAt: new Date(),
        }, { new: true }).lean()

        return updated
    } catch (error) {
        console.error(`Error syncing balance for ${id}:`, error)
        return null
    }
}
