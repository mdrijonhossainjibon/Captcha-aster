"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  CreditCard,
  LogOut,
  Crown,
  Zap,
  Shield,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ExtensionAccountPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const apiKey = "csk_live_xxxxx...xxxxx"

  const copyApiKey = () => {
    navigator.clipboard.writeText("csk_live_a1b2c3d4e5f6g7h8i9j0")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const accountStats = [
    { label: "Total Solved", value: "12,847", icon: Zap },
    { label: "Success Rate", value: "99.2%", icon: Shield },
    { label: "Member Since", value: "Jan 2024", icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-[360px] bg-background border border-border rounded-2xl shadow-2xl shadow-primary/5 overflow-hidden">
        {/* Header */}
        <header
          className={`px-4 py-3 border-b border-border bg-card transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
        >
          <div className="flex items-center gap-3">
            <Link href="/extension">
              <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-sm font-semibold text-foreground">Account</h1>
          </div>
        </header>

        {/* Account Content */}
        <div className="max-h-[480px] overflow-y-auto">
          {/* Profile Section */}
          <div
            className={`px-4 py-4 border-b border-border transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "100ms" }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/20">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Crown className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-foreground">John Doe</h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  john@example.com
                </p>
                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                  <Crown className="w-3 h-3" />
                  Pro Plan
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div
            className={`px-4 py-3 border-b border-border transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="grid grid-cols-3 gap-2">
              {accountStats.map((stat, index) => (
                <div key={stat.label} className="text-center p-2.5 rounded-xl bg-secondary/30">
                  <stat.icon className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-sm font-bold text-foreground">{stat.value}</p>
                  <p className="text-[9px] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* API Key Section */}
          <div
            className={`px-4 py-3 border-b border-border transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "300ms" }}
          >
            <p className="text-xs font-medium text-foreground mb-2">API Key</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 rounded-lg bg-secondary/50 font-mono text-xs text-muted-foreground truncate">
                {apiKey}
              </div>
              <Button variant="outline" size="icon" className="w-8 h-8 shrink-0 bg-transparent" onClick={copyApiKey}>
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>

          {/* Subscription Section */}
          <div
            className={`px-4 py-3 border-b border-border transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "400ms" }}
          >
            <p className="text-xs font-medium text-foreground mb-2">Subscription</p>
            <div className="p-3 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">Pro Plan</span>
                </div>
                <span className="text-xs text-primary font-medium">$19/mo</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Renews on Feb 15, 2025</span>
                <span>50,000 credits/mo</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full w-[65%] rounded-full bg-primary" />
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">32,500 credits remaining</p>
            </div>
          </div>

          {/* Quick Links */}
          <div
            className={`px-4 py-3 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "500ms" }}
          >
            <div className="space-y-2">
              <Link href="/pricing">
                <button className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-foreground">Manage Subscription</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </Link>
              <button className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-500">
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs font-medium">Sign Out</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border bg-secondary/30">
          <p className="text-[10px] text-center text-muted-foreground">
            Need help? <span className="text-primary cursor-pointer hover:underline">Contact Support</span>
          </p>
        </div>
      </div>
    </div>
  )
}
