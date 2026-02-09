"use client"

import { useState, useEffect } from "react"
import {
    ChevronDown,
    Copy,
    CheckCircle2,
    AlertTriangle,
    ExternalLink,
    Sparkles,
    Clock,
    Shield,
    TrendingUp,
    Loader2,
    Wallet,
    Coins
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QRCode, Select } from "antd"
import { Popup } from "antd-mobile"
import Image from "next/image"
import { CustomWalletDeposit } from "./custom-wallet-deposit"

// Type definitions
interface Network {
    id: string
    name: string
    fee: string
    time: string
    confirmations: number
    minDeposit: string
    address: string
    badge?: string
    badgeColor?: string
    isActive: boolean
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

const faqs = [
    {
        question: "How to deposit crypto?",
        answer: "Select coin and network, then send to the provided address.",
    },
    {
        question: "Why is my deposit pending?",
        answer: "Deposits require network confirmations before being credited.",
    },
    {
        question: "What is the minimum deposit?",
        answer: "Minimum varies by coin. Check the deposit page for details.",
    },
]

export function DashboardDepositCrypto() {
    const [depositMethod, setDepositMethod] = useState<'crypto' | 'wallet'>('wallet')
    const [cryptoOptions, setCryptoOptions] = useState<CryptoOption[]>([])
    const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null)
    const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null)
    const [isCoinDropdownOpen, setIsCoinDropdownOpen] = useState(false)
    const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch crypto configurations from API
    useEffect(() => {
        const fetchCryptoConfigs = async () => {
            try {
                setIsLoading(true)
                const response = await fetch('/api/crypto/config')
                const data = await response.json()

                if (data.success && data.data.length > 0) {
                    setCryptoOptions(data.data)
                    setSelectedCrypto(data.data[0])
                    setSelectedNetwork(data.data[0].networks[0])
                } else {
                    setError('No cryptocurrencies available')
                }
            } catch (err) {
                console.error('Error fetching crypto configs:', err)
                setError('Failed to load cryptocurrencies')
            } finally {
                setIsLoading(false)
            }
        }

        fetchCryptoConfigs()
    }, [])

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)

        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleCryptoSelect = (crypto: CryptoOption) => {
        setSelectedCrypto(crypto)
        setSelectedNetwork(crypto.networks[0])
        setIsCoinDropdownOpen(false)
    }

    const handleNetworkSelect = (network: Network) => {
        setSelectedNetwork(network)
        setIsNetworkDropdownOpen(false)
    }

    const handleCopyAddress = () => {
        if (selectedNetwork) {
            navigator.clipboard.writeText(selectedNetwork.address)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="p-4 md:p-6 min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-yellow-500 mx-auto" />
                    <p className="text-muted-foreground">Loading cryptocurrencies...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error || !selectedCrypto || !selectedNetwork) {
        return (
            <div className="p-4 md:p-6 min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                    <p className="text-muted-foreground">{error || 'Failed to load data'}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        )
    }


    return (
        <div className="p-4 md:p-6 min-h-screen ">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_400px] gap-4 md:gap-6">
                {/* Left Side - Main Deposit Form */}
                <div className="space-y-4 md:space-y-6">
                    {/* Header with Gradient */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/5 to-transparent rounded-2xl blur-xl" />
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    Deposit Crypto
                                </h1>
                            </div>
                            <p className="text-xs md:text-sm text-muted-foreground">
                                Select your cryptocurrency and network to get started
                            </p>
                        </div>
                    </div>



                    {/* Deposit Method Tabs */}
                    <Tabs value={depositMethod} onValueChange={(value) => setDepositMethod(value as 'crypto' | 'wallet')} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 h-12 md:h-14 bg-card/50 backdrop-blur-sm border border-border/50 p-1">
                            <TabsTrigger
                                value="wallet"
                                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-black font-semibold transition-all duration-300"
                            >
                                <Wallet className="w-4 h-4" />
                                <span className="hidden sm:inline">Web3 Wallet</span>
                                <span className="sm:hidden">Wallet</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="crypto"
                                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-black font-semibold transition-all duration-300"
                            >
                                <Coins className="w-4 h-4" />
                                <span className="hidden sm:inline">Manual Deposit</span>
                                <span className="sm:hidden">Crypto</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Web3 Wallet Deposit Tab Content - NOW FIRST */}
                        <TabsContent value="wallet" className="mt-6">
                            <CustomWalletDeposit
                                onSuccess={(txHash) => {
                                    console.log("Deposit successful:", txHash)
                                }}
                                onError={(error) => {
                                    console.error("Deposit error:", error)
                                }}
                            />
                        </TabsContent>

                        {/* Crypto Deposit Tab Content - NOW SECOND */}
                        <TabsContent value="crypto" className="mt-6 space-y-4 md:space-y-6 relative">
                            {/* Coming Soon Overlay */}
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md bg-card/40 rounded-3xl border border-white/10 group overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-50" />
                                <div className="relative flex flex-col items-center text-center p-8">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center mb-6 shadow-2xl shadow-yellow-500/10 border border-yellow-500/20">
                                        <Clock className="w-10 h-10 text-yellow-500 animate-pulse" />
                                    </div>
                                    <h3 className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
                                        COMING SOON
                                    </h3>
                                    <p className="text-muted-foreground text-sm max-w-[240px] font-medium leading-relaxed">
                                        Manual crypto deposits are currently being optimized for better security.
                                    </p>
                                    <div className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                                        <Sparkles className="w-4 h-4 text-yellow-500" />
                                        <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">Priority Development</span>
                                    </div>
                                </div>
                            </div>

                            <div className="opacity-40 grayscale-[0.5] pointer-events-none space-y-4 md:space-y-6">
                                {/* Connecting Line - Hidden on mobile */}
                                <div className="hidden md:block absolute left-3 top-10 bottom-10 w-0.5 bg-gradient-to-b from-yellow-500 via-yellow-500/50 to-yellow-500/20" />


                                {/* Step 1: Select Coin */}
                                <div className="relative space-y-2 md:space-y-3">
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <div className="relative z-10 w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                                            <span className="text-xs font-bold text-black">1</span>
                                        </div>
                                        <h2 className="text-sm md:text-base font-semibold text-foreground">Select Coin</h2>
                                    </div>

                                    <div className="relative ml-0 md:ml-10">
                                        <Select
                                            value={selectedCrypto.id}
                                            onChange={(value) => {
                                                const crypto = cryptoOptions.find(c => c.id === value)
                                                if (crypto) handleCryptoSelect(crypto)
                                            }}
                                            className="w-full"
                                            size="large"
                                            style={{ width: '100%' }}
                                            popupClassName="crypto-select-dropdown"
                                        >
                                            {cryptoOptions.map((crypto) => (
                                                <Select.Option key={crypto.id} value={crypto.id}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg ${crypto.bg} flex items-center justify-center backdrop-blur-sm border border-white/10`}>
                                                            {crypto.id === 'sect' ? (
                                                                <span className="text-lg font-bold text-cyan-400">S</span>
                                                            ) : (
                                                                <Image src={require(`../node_modules/cryptocurrency-icons/svg/color/${crypto.id}.svg`)} alt={crypto.name} width={20} height={20} />
                                                            )}
                                                        </div>
                                                        <div className="text-left flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <p className={`text-sm font-bold ${crypto.id === 'sect' ? 'text-cyan-400' : ''}`}>
                                                                    {crypto.name}
                                                                </p>
                                                                {crypto.id === 'sect' && (
                                                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                                                        NEW
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className={`text-xs ${crypto.id === 'sect' ? 'text-cyan-400/70' : 'text-muted-foreground'}`}>
                                                                {crypto.fullName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>

                                {/* Step 2: Select Network */}
                                <div className="relative space-y-2 md:space-y-3">
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <div className="relative z-10 w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                                            <span className="text-xs font-bold text-black">2</span>
                                        </div>
                                        <h2 className="text-sm md:text-base font-semibold text-foreground">Select Network</h2>
                                    </div>

                                    <div className="relative ml-0 md:ml-10">
                                        <Select
                                            value={selectedNetwork.id}
                                            onChange={(value) => {
                                                const network = selectedCrypto.networks.find(n => n.id === value)
                                                if (network) handleNetworkSelect(network)
                                            }}
                                            className="w-full"
                                            size="large"
                                            style={{ width: '100%' }}
                                            popupClassName="network-select-dropdown"
                                        >
                                            {selectedCrypto.networks.map((network) => (
                                                <Select.Option key={network.id} value={network.id}>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <p className="text-sm font-bold">{network.name}</p>
                                                                {network.badge && (
                                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${network.badgeColor} font-semibold`}>
                                                                        {network.badge}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                                <span>Fee: {network.fee}</span>
                                                                <span>•</span>
                                                                <span>{network.time}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>

                                {/* Step 3: Deposit Address - Enhanced Professional Design */}
                                <div className="relative space-y-2 md:space-y-3">
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <div className="relative z-10 w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                                            <span className="text-xs font-bold text-black">3</span>
                                        </div>
                                        <h2 className="text-sm md:text-base font-semibold text-foreground">Deposit Address</h2>
                                    </div>

                                    {/* Main Card Container */}
                                    <div className="ml-0 md:ml-10 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/60 to-card/80 border border-border/50 hover:border-yellow-500/40 transition-all duration-500 shadow-2xl overflow-hidden group">
                                        {/* Animated Background Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="relative p-4 md:p-6">
                                            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                                                {/* QR Code Section */}
                                                <div className="flex-shrink-0 mx-auto md:mx-0">
                                                    <div className="relative">
                                                        {/* Animated Glow Effect */}
                                                        <div className="absolute -inset-4 bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-yellow-400/20 rounded-2xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />

                                                        {/* QR Code Container */}
                                                        <div className="relative">
                                                            <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-4 md:p-5 shadow-2xl border-2 border-white/50 backdrop-blur-sm">
                                                                <QRCode
                                                                    value={selectedNetwork.address}
                                                                    size={120}
                                                                    bgColor="#ffffff"
                                                                    fgColor="#000000"
                                                                    errorLevel="H"
                                                                    bordered={false}
                                                                    style={{ borderRadius: '12px' }}
                                                                />
                                                            </div>

                                                            {/* Scan Instruction */}
                                                            <div className="mt-3 text-center">
                                                                <p className="text-[10px] md:text-xs text-muted-foreground font-medium">
                                                                    Scan to deposit
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Address & Details Section */}
                                                <div className="flex-1 space-y-4 md:space-y-5">
                                                    {/* Address Block */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-xs md:text-sm font-semibold text-foreground flex items-center gap-1.5">
                                                                <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-500" />
                                                                Deposit Address
                                                            </p>
                                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 font-semibold">
                                                                {selectedNetwork.name}
                                                            </span>
                                                        </div>

                                                        <div className="relative group/address">
                                                            <div className="flex items-center gap-2">
                                                                <div className="relative flex-1 min-w-0">
                                                                    <code className="block text-[10px] sm:text-xs font-mono text-foreground bg-gradient-to-br from-secondary/90 to-secondary/70 backdrop-blur-sm px-3 py-3 rounded-xl break-all border border-border/50 hover:border-yellow-500/50 transition-all duration-300 shadow-sm">
                                                                        {selectedNetwork.address}
                                                                    </code>
                                                                </div>
                                                                <Button
                                                                    onClick={handleCopyAddress}
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className={`flex-shrink-0 gap-2 transition-all duration-300 rounded-xl ${copied
                                                                        ? 'bg-green-500/20 hover:bg-green-500/30 text-green-500 border-green-500/30'
                                                                        : 'hover:bg-yellow-500/20 border-yellow-500/30'
                                                                        } border`}
                                                                >
                                                                    {copied ? (
                                                                        <>
                                                                            <CheckCircle2 className="w-4 h-4" />
                                                                            <span className="text-xs font-semibold">Copied!</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Copy className="w-4 h-4" />
                                                                            <span className="text-xs font-semibold hidden sm:inline">Copy</span>
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Stats Grid */}
                                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                                        <div className="relative group/stat overflow-hidden rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/30 backdrop-blur-sm border border-border/50 hover:border-yellow-500/40 transition-all duration-300 p-3 md:p-4">
                                                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
                                                            <div className="relative">
                                                                <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5 font-medium">
                                                                    <div className="p-1 rounded-md bg-yellow-500/10">
                                                                        <TrendingUp className="w-3 h-3 text-yellow-500" />
                                                                    </div>
                                                                    <span className="truncate">Minimum Deposit</span>
                                                                </p>
                                                                <p className="text-sm md:text-base font-bold text-foreground truncate">{selectedNetwork.minDeposit}</p>
                                                            </div>
                                                        </div>

                                                        <div className="relative group/stat overflow-hidden rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/30 backdrop-blur-sm border border-border/50 hover:border-blue-500/40 transition-all duration-300 p-3 md:p-4">
                                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
                                                            <div className="relative">
                                                                <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5 font-medium">
                                                                    <div className="p-1 rounded-md bg-blue-500/10">
                                                                        <Clock className="w-3 h-3 text-blue-500" />
                                                                    </div>
                                                                    <span className="truncate">Expected Arrival</span>
                                                                </p>
                                                                <p className="text-sm md:text-base font-bold text-foreground truncate">
                                                                    {selectedNetwork.confirmations} blocks
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Network Info Badge */}
                                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 border border-yellow-500/20">
                                                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                                            <Sparkles className="w-4 h-4 text-yellow-500" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[10px] md:text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
                                                                Network Fee: {selectedNetwork.fee} • Processing: {selectedNetwork.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Warning */}
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300" />
                                    <div className="relative p-4 md:p-5 rounded-xl backdrop-blur-sm bg-yellow-500/10 border border-yellow-500/30 shadow-lg">
                                        <div className="flex items-start gap-2 md:gap-3">
                                            <div className="p-1.5 md:p-2 rounded-lg bg-yellow-500/20 backdrop-blur-sm flex-shrink-0">
                                                <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                                            </div>
                                            <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm flex-1">
                                                <p className="font-bold text-yellow-500 flex items-center gap-2">
                                                    Important Security Notice
                                                    <Shield className="w-4 h-4" />
                                                </p>
                                                <ul className="space-y-1 text-yellow-500/90">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-yellow-500 mt-0.5">•</span>
                                                        <span>Send only <strong>{selectedCrypto.name}</strong> to this deposit address</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-yellow-500 mt-0.5">•</span>
                                                        <span>Ensure the network is <strong>{selectedNetwork.name}</strong></span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-yellow-500 mt-0.5">•</span>
                                                        <span>Sending any other coin may result in <strong>permanent loss</strong></span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                      
                      
                    </Tabs>
                </div>

                {/* Right Side - Enhanced FAQ & Support */}
                <div className="space-y-4 md:space-y-6">
                    {/* FAQ Card */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300" />
                        <div className="relative p-4 md:p-6 rounded-xl backdrop-blur-sm bg-card/50 border border-border shadow-lg">
                            <h2 className="text-base md:text-lg font-bold text-foreground mb-4 md:mb-5 flex items-center gap-2">
                                <ExternalLink className="w-5 h-5 text-yellow-500" />
                                Frequently Asked Questions
                            </h2>

                            <div className="space-y-3 md:space-y-4">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="p-2.5 md:p-3 rounded-lg bg-secondary/30 backdrop-blur-sm border border-border/50 hover:border-yellow-500/30 transition-all duration-300">
                                        <h3 className="text-xs md:text-sm font-semibold text-foreground mb-1.5 md:mb-2">{faq.question}</h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                className="w-full mt-4 md:mt-6 rounded-lg gap-2 hover:bg-yellow-500/10 hover:border-yellow-500/50 transition-all duration-300 text-sm"
                            >
                                <ExternalLink className="w-4 h-4" />
                                View All FAQs
                            </Button>
                        </div>
                    </div>

                    {/* Support Card */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                        <div className="relative p-4 md:p-6 rounded-xl backdrop-blur-sm bg-card/50 border border-border shadow-lg">
                            <div className="flex items-center gap-1.5 md:gap-2 mb-2">
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                <h3 className="text-sm font-semibold text-foreground">Need help?</h3>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3 md:mb-4">
                                Our support team is available 24/7 to assist you
                            </p>
                            <Button className="w-full rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base">
                                Contact Support
                            </Button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-xl blur-lg transition-all duration-300" />
                        <div className="relative p-4 md:p-6 rounded-xl backdrop-blur-sm bg-card/50 border border-border shadow-lg">
                            <h3 className="text-xs md:text-sm font-semibold text-foreground mb-3 md:mb-4">Network Stats</h3>
                            <div className="space-y-2 md:space-y-3">
                                <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                                    <span className="text-xs text-muted-foreground">Processing Time</span>
                                    <span className="text-xs font-bold text-foreground">{selectedNetwork.time}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                                    <span className="text-xs text-muted-foreground">Network Fee</span>
                                    <span className="text-xs font-bold text-foreground">{selectedNetwork.fee}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                                    <span className="text-xs text-muted-foreground">Confirmations</span>
                                    <span className="text-xs font-bold text-foreground">{selectedNetwork.confirmations}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
