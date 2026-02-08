"use client"

import { CryptoPayoutForm } from "@/components/crypto-payout-form"
import { useState } from "react"

export default function PayoutExamplePage() {
    const [userBalance] = useState(1000) // Example balance - replace with actual user balance

    const handlePayoutSuccess = (txHash: string) => {
        console.log("Payout successful:", txHash)
        // You can add additional logic here like:
        // - Show success notification
        // - Refresh user balance
        // - Redirect to transaction history
    }

    const handlePayoutError = (error: string) => {
        console.error("Payout error:", error)
        // You can add additional logic here like:
        // - Show error notification
        // - Log error for debugging
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Page Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                        Crypto Withdrawal
                    </h1>
                    <p className="text-muted-foreground">
                        Withdraw your cryptocurrency including Secto (SECT) to any wallet
                    </p>
                </div>

                {/* Payout Form */}
                <CryptoPayoutForm
                    userBalance={userBalance}
                    onSuccess={handlePayoutSuccess}
                    onError={handlePayoutError}
                />

                {/* Additional Info */}
                <div className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/60 to-card/80 border border-border/50">
                    <h3 className="text-lg font-bold text-foreground mb-4">
                        Supported Cryptocurrencies
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                            <div className="font-semibold text-sm">USDT</div>
                            <div className="text-xs text-muted-foreground">Multiple Networks</div>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                            <div className="font-semibold text-sm">BTC</div>
                            <div className="text-xs text-muted-foreground">Bitcoin Network</div>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                            <div className="font-semibold text-sm">ETH</div>
                            <div className="text-xs text-muted-foreground">Ethereum & L2s</div>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                            <div className="font-semibold text-sm">USDC</div>
                            <div className="text-xs text-muted-foreground">Multiple Networks</div>
                        </div>
                        <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                            <div className="font-semibold text-sm text-cyan-400">SECT</div>
                            <div className="text-xs text-cyan-400/70">Arbitrum One</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
