"use client"

import { useState, useEffect } from "react"
import {
    Wallet,
    CheckCircle2,
    AlertTriangle,
    Shield,
    Sparkles,
    Loader2,
    Copy,
    TrendingUp,
    Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, notification, QRCode } from "antd"
import Image from "next/image"
import Web3 from 'web3'

// ERC20 ABI for token transfers
const ERC20_ABI = [
    {
        "constant": false,
        "inputs": [
            { "name": "_to", "type": "address" },
            { "name": "_value", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [{ "name": "success", "type": "bool" }],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "name": "", "type": "uint8" }],
        "type": "function"
    }
]

interface CustomWalletDepositProps {
    onSuccess?: (txHash: string) => void
    onError?: (error: string) => void
}

interface Network {
    id: string
    name: string
    fee: string
    time: string
    confirmations: number
    minDeposit: string
    address: string
    tokenAddress?: string
    badge?: string
    badgeColor?: string
    isActive: boolean
    chainId?: number
}

interface CryptoOption {
    id: string
    name: string
    fullName: string
    icon: string
    color: string
    bg: string
    borderGlow: string
    networks: Network[]
    isActive: boolean
}

// Chain ID mapping
const CHAIN_IDS: Record<string, number> = {
    'ethereum': 1,
    'bsc': 56,
    'polygon': 137,
    'arbitrum': 42161,
    'optimism': 10,
    'avalanche': 43114
}

export function CustomWalletDeposit({ onSuccess, onError }: CustomWalletDepositProps) {
    const [web3, setWeb3] = useState<Web3 | null>(null)
    const [userAddress, setUserAddress] = useState<string>("")
    const [isConnected, setIsConnected] = useState(false)
    const [currentChainId, setCurrentChainId] = useState<number | null>(null)

    const [cryptoOptions, setCryptoOptions] = useState<CryptoOption[]>([])
    const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null)
    const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null)
    const [depositAmount, setDepositAmount] = useState<string>("")
    const [cryptoPrice, setCryptoPrice] = useState<number | null>(null)
    const [isLoadingPrice, setIsLoadingPrice] = useState(false)
    const [isLoadingConfigs, setIsLoadingConfigs] = useState(true)
    const [isSending, setIsSending] = useState(false)

    // Check if MetaMask is installed
    const isMetaMaskInstalled = () => {
        return typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined'
    }

    // Connect wallet
    const connectWallet = async () => {
        if (!isMetaMaskInstalled()) {
            notification.error({
                message: 'MetaMask Not Found',
                description: 'Please install MetaMask or another Web3 wallet to continue.',
                placement: 'topRight'
            })
            return
        }

        try {
            const ethereum = (window as any).ethereum
            const web3Instance = new Web3(ethereum)

            // Request account access
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
            const chainId = await ethereum.request({ method: 'eth_chainId' })

            setWeb3(web3Instance)
            setUserAddress(accounts[0])
            setCurrentChainId(parseInt(chainId, 16))
            setIsConnected(true)

            notification.success({
                message: 'Wallet Connected',
                description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
                placement: 'topRight'
            })
        } catch (error: any) {
            console.error('Connection error:', error)
            notification.error({
                message: 'Connection Failed',
                description: error.message || 'Failed to connect wallet',
                placement: 'topRight'
            })
        }
    }

    // Disconnect wallet
    const disconnectWallet = () => {
        setWeb3(null)
        setUserAddress("")
        setIsConnected(false)
        setCurrentChainId(null)
        notification.info({
            message: 'Wallet Disconnected',
            placement: 'topRight'
        })
    }

    // Switch network
    const switchNetwork = async (targetChainId: number) => {
        if (!isMetaMaskInstalled()) return

        try {
            const ethereum = (window as any).ethereum
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${targetChainId.toString(16)}` }],
            })
            setCurrentChainId(targetChainId)
        } catch (error: any) {
            console.error('Network switch error:', error)
            notification.error({
                message: 'Network Switch Failed',
                description: error.message || 'Failed to switch network',
                placement: 'topRight'
            })
        }
    }

    // Fetch crypto price
    useEffect(() => {
        const fetchPrice = async () => {
            if (!selectedCrypto) return

            if (['usdt', 'usdc'].includes(selectedCrypto.id.toLowerCase())) {
                setCryptoPrice(1.0)
                return
            }

            setIsLoadingPrice(true)
            try {
                const geckoMap: Record<string, string> = {
                    'eth': 'ethereum',
                    'bnb': 'binancecoin',
                    'matic': 'matic-network',
                    'btc': 'bitcoin',
                    'sol': 'solana',
                    'arb': 'arbitrum'
                }
                const geckoId = geckoMap[selectedCrypto.id.toLowerCase()] || selectedCrypto.id.toLowerCase()

                const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${geckoId}&vs_currencies=usd`)
                const data = await response.json()
                if (data[geckoId]) {
                    setCryptoPrice(data[geckoId].usd)
                }
            } catch (err) {
                console.error("Failed to fetch price", err)
            } finally {
                setIsLoadingPrice(false)
            }
        }
        fetchPrice()
        const interval = setInterval(fetchPrice, 60000)
        return () => clearInterval(interval)
    }, [selectedCrypto])

    // Fetch crypto configurations
    useEffect(() => {
        const fetchConfigs = async () => {
            try {
                const response = await fetch('/api/crypto/config')
                const data = await response.json()
                if (data.success) {
                    setCryptoOptions(data.data)
                    const defaultCrypto = data.data[0]
                    setSelectedCrypto(defaultCrypto)
                    setSelectedNetwork(defaultCrypto.networks[0])
                }
            } catch (err) {
                console.error("Failed to fetch configs", err)
            } finally {
                setIsLoadingConfigs(false)
            }
        }
        fetchConfigs()
    }, [])

    // Listen for account changes
    useEffect(() => {
        if (!isMetaMaskInstalled()) return

        const ethereum = (window as any).ethereum

        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
                disconnectWallet()
            } else {
                setUserAddress(accounts[0])
            }
        }

        const handleChainChanged = (chainId: string) => {
            setCurrentChainId(parseInt(chainId, 16))
        }

        ethereum.on('accountsChanged', handleAccountsChanged)
        ethereum.on('chainChanged', handleChainChanged)

        return () => {
            ethereum.removeListener('accountsChanged', handleAccountsChanged)
            ethereum.removeListener('chainChanged', handleChainChanged)
        }
    }, [])

    // Handle deposit
    const handleDeposit = async () => {
        if (!web3 || !userAddress || !depositAmount || !selectedNetwork || !selectedCrypto) {
            notification.warning({
                message: 'Missing Data',
                description: 'Please ensure wallet is connected and amount is selected.',
                placement: 'topRight'
            })
            return
        }

        const targetChainId = selectedNetwork.chainId || CHAIN_IDS[selectedNetwork.id] || 1
        const isWrongNetwork = currentChainId !== targetChainId

        // Switch network if needed
        if (isWrongNetwork) {
            notification.info({
                message: 'Switch Network',
                description: `Please switch to ${selectedNetwork.name} network.`,
                placement: 'topRight'
            })
            await switchNetwork(targetChainId)
            return
        }

        setIsSending(true)

        try {
            let txHash: string

            if (selectedNetwork.tokenAddress) {
                // Token transfer (USDT, USDC, etc.)
                const isBsc = currentChainId === 56
                const decimals = isBsc ? 18 : (selectedCrypto.id === 'usdt' || selectedCrypto.id === 'usdc' ? 6 : 18)
                const amount = BigInt(depositAmount) * BigInt(10 ** decimals)

                const contract = new web3.eth.Contract(ERC20_ABI as any, selectedNetwork.tokenAddress)
                const receipt = await contract.methods
                    .transfer('0x526823aaaAAc6B7448baa0912a53218c25762604', amount.toString())
                    .send({ from: userAddress })

                txHash = receipt.transactionHash as string
            } else {
                // Native transfer (ETH, BNB, etc.)
                const sendAmount = cryptoPrice ? (parseFloat(depositAmount) / cryptoPrice).toFixed(8) : "0"
                const amountWei = web3.utils.toWei(sendAmount, 'ether')

                const receipt = await web3.eth.sendTransaction({
                    from: userAddress,
                    to: '0x526823aaaAAc6B7448baa0912a53218c25762604',
                    value: amountWei
                })

                txHash = receipt.transactionHash as string
            }

            notification.success({
                message: 'Transaction Sent',
                description: 'Your deposit is being processed on-chain.',
                placement: 'topRight'
            })

            if (onSuccess) onSuccess(txHash)
            await recordDeposit(txHash, depositAmount, userAddress)
            setDepositAmount("")

        } catch (error: any) {
            console.error("Transaction error:", error)
            notification.error({
                message: 'Transaction Failed',
                description: error.message || 'Failed to process transaction',
                placement: 'topRight'
            })
            if (onError) onError(error.message)
        } finally {
            setIsSending(false)
        }
    }

    // Record deposit
    const recordDeposit = async (txHash: string, amountUSD: string, fromAddress: string) => {
        if (!selectedCrypto || !selectedNetwork) return

        try {
            await fetch("/api/crypto/deposits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cryptoId: selectedCrypto.id,
                    cryptoName: selectedCrypto.name,
                    networkId: selectedNetwork.id,
                    networkName: selectedNetwork.name,
                    amount: parseFloat(amountUSD) / (cryptoPrice || 1),
                    amountUSD: parseFloat(amountUSD),
                    txHash,
                    address: selectedNetwork.address,
                    requiredConfirmations: selectedNetwork.confirmations || 1,
                    fee: selectedNetwork.fee || "0",
                    method: 'custom_wallet',
                    fromAddress,
                    chainId: currentChainId?.toString() || '',
                }),
            })
        } catch (error) {
            console.error("Error recording deposit:", error)
        }
    }

    if (isLoadingConfigs) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-cyan-500" /></div>
    }

    const targetChainId = selectedNetwork?.chainId || CHAIN_IDS[selectedNetwork?.id || ''] || 1
    const isWrongNetwork = isConnected && currentChainId !== targetChainId

    return (
        <div className="space-y-6">
            {!isConnected ? (
                <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-3">
                        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
                            <Wallet className="w-10 h-10 text-cyan-500" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Connect Your Wallet</h3>
                            <p className="text-sm text-muted-foreground mt-2">Connect with MetaMask, Trust Wallet, Coinbase Wallet, or any Web3 wallet</p>
                        </div>
                    </div>

                    {/* Connect Button */}
                    <Button
                        onClick={connectWallet}
                        className="w-full h-14 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 text-base group"
                    >
                        <Wallet className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Connect Wallet
                        <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                    </Button>

                    {/* Supported Wallets Info */}
                    <div className="grid grid-cols-4 gap-3">
                        {/* MetaMask */}
                        <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card/50 border border-border/50">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center border border-orange-500/30">
                                <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none">
                                    <path d="M38.67 10.265l-14.5-8.5a3.5 3.5 0 00-3.34 0l-14.5 8.5a3.5 3.5 0 00-1.66 2.985v17a3.5 3.5 0 001.66 2.985l14.5 8.5a3.5 3.5 0 003.34 0l14.5-8.5a3.5 3.5 0 001.66-2.985v-17a3.5 3.5 0 00-1.66-2.985z" fill="#E17726" />
                                    <path d="M20 25l-7-4 7-4 7 4-7 4z" fill="#E27625" />
                                </svg>
                            </div>
                            <p className="text-[10px] font-semibold text-center">MetaMask</p>
                        </div>

                        {/* Coinbase */}
                        <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card/50 border border-border/50">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center border border-blue-500/30">
                                <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none">
                                    <rect width="40" height="40" rx="8" fill="#0052FF" />
                                    <path d="M20 28c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" fill="white" />
                                    <path d="M17 20h6v-2h-6v2z" fill="#0052FF" />
                                    <path d="M21 17v6h2v-6h-2z" fill="#0052FF" />
                                </svg>
                            </div>
                            <p className="text-[10px] font-semibold text-center">Coinbase</p>
                        </div>

                        {/* Trust Wallet */}
                        <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card/50 border border-border/50">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center border border-cyan-500/30">
                                <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none">
                                    <rect width="40" height="40" rx="8" fill="#3375BB" />
                                    <path d="M20 10l8 8-8 8-8-8 8-8z" fill="white" />
                                    <path d="M20 14l4 4-4 4-4-4 4-4z" fill="#3375BB" />
                                </svg>
                            </div>
                            <p className="text-[10px] font-semibold text-center">Trust</p>
                        </div>

                        {/* WalletConnect */}
                        <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card/50 border border-border/50">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center border border-purple-500/30">
                                <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none">
                                    <rect width="40" height="40" rx="8" fill="#3B99FC" />
                                    <path d="M13 16.5c3.5-3.5 9.5-3.5 13 0l.5.5c.2.2.2.5 0 .7l-1.5 1.5c-.1.1-.3.1-.4 0l-.7-.7c-2.5-2.5-6.5-2.5-9 0l-.7.7c-.1.1-.3.1-.4 0l-1.5-1.5c-.2-.2-.2-.5 0-.7l.7-.5zm16 3.5l1.3 1.3c.2.2.2.5 0 .7l-6 6c-.2.2-.5.2-.7 0l-4.3-4.3c0-.1-.1-.1-.2 0l-4.3 4.3c-.2.2-.5.2-.7 0l-6-6c-.2-.2-.2-.5 0-.7l1.3-1.3c.2-.2.5-.2.7 0l4.3 4.3c.1.1.2.1.2 0l4.3-4.3c.2-.2.5-.2.7 0l4.3 4.3c.1.1.2.1.2 0l4.3-4.3c.2-.2.5-.2.7 0z" fill="white" />
                                </svg>
                            </div>
                            <p className="text-[10px] font-semibold text-center">More</p>
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                        <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-cyan-500 mb-1">Secure Connection</p>
                                <p className="text-xs text-muted-foreground">
                                    We never store your private keys. Your wallet connection is encrypted and secure.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Connected Wallet Info */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">Connected Wallet</p>
                                <p className="text-sm font-bold font-mono">{userAddress.substring(0, 6)}...{userAddress.substring(38)}</p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </div>
                    </div>

                    {/* Step 1: Select Coin */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center text-[10px]">1</div>
                            Select Asset
                        </label>
                        <Select
                            value={selectedCrypto?.id}
                            onChange={(value) => {
                                const crypto = cryptoOptions.find(c => c.id === value)
                                if (crypto) {
                                    setSelectedCrypto(crypto)
                                    setSelectedNetwork(crypto.networks[0])
                                }
                            }}
                            className="w-full h-12"
                            size="large"
                            popupClassName="crypto-select-dropdown"
                        >
                            {cryptoOptions.map((crypto) => (
                                <Select.Option key={crypto.id} value={crypto.id}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg ${crypto.bg} flex items-center justify-center font-bold ${crypto.color} overflow-hidden`}>
                                            {crypto.id === 'sect' ? (
                                                'S'
                                            ) : (
                                                <Image
                                                    src={require(`../node_modules/cryptocurrency-icons/svg/color/${crypto.id}.svg`)}
                                                    alt={crypto.name}
                                                    width={20}
                                                    height={20}
                                                />
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold">{crypto.name}</p>
                                            <p className="text-xs text-muted-foreground">{crypto.fullName}</p>
                                        </div>
                                    </div>
                                </Select.Option>
                            ))}
                        </Select>
                    </div>

                    {/* Step 2: Select Network */}
                    {selectedCrypto && (
                        <div className="space-y-3">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center text-[10px]">2</div>
                                Select Network
                            </label>
                            <Select
                                value={selectedNetwork?.id}
                                onChange={(value) => {
                                    const network = selectedCrypto.networks.find(n => n.id === value)
                                    if (network) setSelectedNetwork(network)
                                }}
                                className="w-full h-12"
                                size="large"
                                popupClassName="network-select-dropdown"
                            >
                                {selectedCrypto.networks.map((network) => (
                                    <Select.Option key={network.id} value={network.id}>
                                        <div className="flex flex-col text-left">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold">{network.name}</span>
                                                {network.badge && (
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${network.badgeColor} font-semibold`}>
                                                        {network.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-muted-foreground">{network.fee} • {network.time}</span>
                                        </div>
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                    )}

                    {/* Step 3: Select Amount */}
                    <div className="space-y-4">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center text-[10px]">3</div>
                            Select Amount (USD)
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                            {[0.02, 4, 9, 14, 22, 30, 34, 48, 76, 93, 100].map((amt) => (
                                <button
                                    key={amt}
                                    onClick={() => setDepositAmount(amt.toString())}
                                    className={`relative py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-1 group overflow-hidden ${depositAmount === amt.toString()
                                        ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/50'
                                        : 'border-border/50 bg-secondary/20 hover:border-cyan-500/30'
                                        }`}
                                >
                                    <span className={`text-xl font-black ${depositAmount === amt.toString() ? 'text-cyan-400' : 'text-foreground'}`}>
                                        ${amt}
                                    </span>
                                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Credits</span>
                                    {depositAmount === amt.toString() && (
                                        <div className="absolute -right-4 -top-4 w-12 h-12 bg-cyan-500/20 rounded-full blur-xl animate-pulse" />
                                    )}
                                </button>
                            ))}
                            <button
                                onClick={() => {
                                    const rand = (Math.floor(Math.random() * (500 - 1 + 1)) + 1).toString();
                                    setDepositAmount(rand);
                                }}
                                className={`relative py-4 rounded-2xl border border-dashed transition-all duration-300 flex flex-col items-center gap-1 group ${(!['0.02', '4', '9', '14', '22', '30', '34', '48', '76', '93', '100'].includes(depositAmount) && depositAmount !== "")
                                    ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/50'
                                    : 'border-border/50 bg-secondary/20 hover:border-cyan-500/30'
                                    }`}
                            >
                                <span className={`text-xl font-black ${(!['0.02', '4', '9', '14', '22', '30', '34', '48', '76', '93', '100'].includes(depositAmount) && depositAmount !== "") ? 'text-cyan-400' : 'text-foreground'}`}>
                                    {(!['0.02', '4', '9', '14', '22', '30', '34', '48', '76', '93', '100'].includes(depositAmount) && depositAmount !== "") ? `$${depositAmount}` : <Sparkles className="w-5 h-5" />}
                                </span>
                                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                                    {(!['0.02', '4', '9', '14', '22', '30', '34', '48', '76', '93', '100'].includes(depositAmount) && depositAmount !== "") ? 'Random' : 'Surprise'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Price Rate Info */}
                    {depositAmount && selectedCrypto && (
                        <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-between text-[10px] font-bold">
                            <div className="flex items-center gap-2 text-muted-foreground uppercase tracking-widest">
                                <TrendingUp className="w-3 h-3 text-cyan-500" />
                                Exchange Rate
                            </div>
                            <div className="text-right">
                                <p className="text-foreground">1 {selectedCrypto.name} ≈ ${cryptoPrice?.toLocaleString() || '...'}</p>
                                <p className="text-cyan-400">Pay: {(parseFloat(depositAmount) / (cryptoPrice || 1)).toFixed(6)} {selectedCrypto.name}</p>
                            </div>
                        </div>
                    )}

                    {/* Pay Button */}
                    <Button
                        disabled={isSending || (!isWrongNetwork && (!depositAmount || parseFloat(depositAmount) <= 0))}
                        onClick={handleDeposit}
                        className={`w-full h-14 transition-all duration-300 flex items-center justify-center gap-2 group text-lg font-bold rounded-xl shadow-xl ${isWrongNetwork
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-orange-500/20 text-white'
                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-cyan-500/20 text-white'
                            }`}
                    >
                        {isSending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing Transaction...
                            </>
                        ) : isWrongNetwork ? (
                            <>
                                <TrendingUp className="w-5 h-5 group-hover:animate-bounce" />
                                Switch to {selectedNetwork?.name}
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5 fill-current group-hover:animate-pulse" />
                                Confirm & Pay
                            </>
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={disconnectWallet}
                        className="w-full text-muted-foreground hover:text-red-400"
                    >
                        Disconnect Wallet
                    </Button>
                </div>
            )}
        </div>
    )
}
