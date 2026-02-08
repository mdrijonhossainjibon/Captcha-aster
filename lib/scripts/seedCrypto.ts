/**
 * Seed Script for Crypto Configurations
 * Run this script to populate the database with initial crypto data
 * Usage: npx tsx lib/scripts/seedCrypto.ts
 */

import mongoose from 'mongoose'

// MongoDB URI from environment
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:secret@69.169.99.101:27017/AdminHub?authSource=admin'

if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI is not defined')
    process.exit(1)
}

const cryptoData = [
    {
        id: "usdt",
        name: "USDT",
        fullName: "TetherUS",
        icon: "U",
        color: "text-emerald-400",
        bg: "bg-gradient-to-br from-emerald-500/20 to-green-500/10",
        borderGlow: "hover:shadow-emerald-500/20",
        networks: [
            {
                id: "bsc",
                name: "BSC (BEP-20)",
                fee: "0.5 USDT",
                time: "~3 min",
                confirmations: 15,
                minDeposit: "1 USDT",
                address: "0x5a8300B2FD0353C4dFF0FD4b2a29d76778D1b274",
                tokenAddress: "0x55d398326f99059fF775485246999027B3197955",
                chainId: 56,
                isActive: true,
            },
            {
                id: "ethereum",
                name: "Ethereum (ERC-20)",
                fee: "5 USDT",
                time: "~10 min",
                confirmations: 12,
                minDeposit: "10 USDT",
                address: "0x5a8300B2FD0353C4dFF0FD4b2a29d76778D1b274",
                tokenAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
                chainId: 1,
                badge: "Popular",
                badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                isActive: true,
            },
            {
                id: "bsc-testnet",
                name: "BSC Testnet",
                fee: "0 USDT",
                time: "~1 min",
                confirmations: 3,
                minDeposit: "0.1 USDT",
                address: "0x5a8300B2FD0353C4dFF0FD4b2a29d76778D1b274",
                tokenAddress: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
                chainId: 97,
                badge: "Testnet",
                badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                isActive: true,
            },
            {
                id: "sepolia",
                name: "Sepolia Testnet",
                fee: "0 USDT",
                time: "~1 min",
                confirmations: 2,
                minDeposit: "0.1 USDT",
                address: "0x5a8300B2FD0353C4dFF0FD4b2a29d76778D1b274",
                tokenAddress: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
                chainId: 11155111,
                badge: "Testnet",
                badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                isActive: true,
            }
        ],
        isActive: true,
    },
    {
        id: "eth",
        name: "ETH",
        fullName: "Ethereum",
        icon: "Ξ",
        color: "text-blue-400",
        bg: "bg-gradient-to-br from-blue-500/20 to-indigo-500/10",
        borderGlow: "hover:shadow-blue-500/20",
        networks: [
            {
                id: "ethereum",
                name: "Ethereum Mainnet",
                fee: "0.002 ETH",
                time: "~10 min",
                confirmations: 12,
                minDeposit: "0.001 ETH",
                address: "0x5a8300B2FD0353C4dFF0FD4b2a29d76778D1b274",
                chainId: 1,
                badge: "Popular",
                badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                isActive: true,
            },
            {
                id: "sepolia",
                name: "Sepolia Testnet",
                fee: "0 ETH",
                time: "~1 min",
                confirmations: 2,
                minDeposit: "0.0001 ETH",
                address: "0x5a8300B2FD0353C4dFF0FD4b2a29d76778D1b274",
                chainId: 11155111,
                badge: "Testnet",
                badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                isActive: true,
            },
            {
                id: "arbitrum",
                name: "Arbitrum One",
                fee: "0.0001 ETH",
                time: "~2 min",
                confirmations: 1,
                minDeposit: "0.001 ETH",
                address: "0x5a8300B2FD0353C4dFF0FD4b2a29d76778D1b274",
                chainId: 42161,
                badge: "L2 Fast",
                badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
                isActive: true,
            },
        ],
        isActive: true,
    },
    {
        id: "usdc",
        name: "USDC",
        fullName: "USD Coin",
        icon: "U",
        color: "text-blue-500",
        bg: "bg-gradient-to-br from-blue-600/20 to-cyan-500/10",
        borderGlow: "hover:shadow-blue-600/20",
        networks: [
            {
                id: "ethereum",
                name: "Ethereum (ERC-20)",
                fee: "5 USDC",
                time: "~10 min",
                confirmations: 12,
                minDeposit: "10 USDC",
                address: "0x5a8300B2FD0353C4dFF0FD4b2a29d76778D1b274",
                tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                chainId: 1,
                isActive: true,
            },
            {
                id: "polygon",
                name: "Polygon",
                fee: "0.1 USDC",
                time: "~5 min",
                confirmations: 128,
                minDeposit: "1 USDC",
                address: "0x5a8300B2FD0353C4dFF0FD4b2a29d76778D1b274",
                tokenAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
                chainId: 137,
                badge: "Low Fee",
                badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
                isActive: true,
            },
            {
                id: "amoy",
                name: "Polygon Amoy Testnet",
                fee: "0 USDC",
                time: "~2 min",
                confirmations: 32,
                minDeposit: "0.1 USDC",
                address: "0x5a8300B2FD0353C4dFF0FD4b2a29d76778D1b274",
                tokenAddress: "0x41e94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
                chainId: 80002,
                badge: "Testnet",
                badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                isActive: true,
            }
        ],
        isActive: true,
    },
    {
        id: "bnb",
        name: "BNB",
        fullName: "Binance Coin",
        icon: "B",
        color: "text-yellow-400",
        bg: "bg-gradient-to-br from-yellow-500/20 to-orange-500/10",
        borderGlow: "hover:shadow-yellow-500/20",
        networks: [
            {
                id: "bsc",
                name: "BNB Smart Chain",
                fee: "0.0005 BNB",
                time: "~3 min",
                confirmations: 15,
                minDeposit: "0.01 BNB",
                address: "0x5a8300B2FD0353C4dFF0FD4b2a29d76778D1b274",
                chainId: 56,
                badge: "Native",
                badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                isActive: true,
            },
            {
                id: "bsc-testnet",
                name: "BSC Testnet",
                fee: "0 BNB",
                time: "~1 min",
                confirmations: 3,
                minDeposit: "0.001 BNB",
                address: "0x5a8300B2FD0353C4dFF0FD4b2a29d76778D1b274",
                chainId: 97,
                badge: "Testnet",
                badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                isActive: true,
            }
        ],
        isActive: true,
    },
    {
        id: "matic",
        name: "MATIC",
        fullName: "Polygon",
        icon: "M",
        color: "text-purple-400",
        bg: "bg-gradient-to-br from-purple-500/20 to-indigo-500/10",
        borderGlow: "hover:shadow-purple-500/20",
        networks: [
            {
                id: "polygon",
                name: "Polygon Mainnet",
                fee: "0.01 MATIC",
                time: "~5 min",
                confirmations: 128,
                minDeposit: "1 MATIC",
                address: "0x5a8300B2FD0353C4dFF0FD4b2a29d76778D1b274",
                chainId: 137,
                badge: "Native",
                badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
                isActive: true,
            },
            {
                id: "amoy",
                name: "Polygon Amoy Testnet",
                fee: "0 MATIC",
                time: "~2 min",
                confirmations: 32,
                minDeposit: "0.1 MATIC",
                address: "0x5a8300B2FD0353C4dFF0FD4b2a29d76778D1b274",
                chainId: 80002,
                badge: "Testnet",
                badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                isActive: true,
            }
        ],
        isActive: true,
    },
]

// Network Schema
const NetworkSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    fee: { type: String, required: true },
    time: { type: String, required: true },
    confirmations: { type: Number, required: true },
    minDeposit: { type: String, required: true },
    address: { type: String, required: true },
    tokenAddress: { type: String },
    chainId: { type: Number },
    badge: { type: String },
    badgeColor: { type: String },
    isActive: { type: Boolean, default: true },
}, { _id: false })

const CryptoConfigSchema = new mongoose.Schema(
    {
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        fullName: { type: String, required: true },
        icon: { type: String, required: true },
        color: { type: String, required: true },
        bg: { type: String, required: true },
        borderGlow: { type: String, required: true },
        networks: { type: [NetworkSchema], required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
)

const CryptoConfig = mongoose.models.CryptoConfig || mongoose.model('CryptoConfig', CryptoConfigSchema)

async function seedCryptoConfigs() {
    try {
        console.log('🔄 Connecting to MongoDB...')
        await mongoose.connect(MONGODB_URI)
        console.log('✅ Connected to MongoDB')

        console.log('🗑️  Clearing existing crypto configurations...')
        await CryptoConfig.deleteMany({})

        console.log('📝 Inserting crypto configurations...')
        const result = await CryptoConfig.insertMany(cryptoData)

        console.log(`✅ Successfully seeded ${result.length} crypto configurations!`)
        console.log('\nSeeded cryptocurrencies:')
        result.forEach((crypto: any) => {
            console.log(`  - ${crypto.name} (${crypto.fullName}) with ${crypto.networks.length} networks`)
        })

        await mongoose.disconnect()
        console.log('\n✅ Disconnected from MongoDB')
        process.exit(0)
    } catch (error) {
        console.error('❌ Error seeding crypto configurations:', error)
        process.exit(1)
    }
}

seedCryptoConfigs()
