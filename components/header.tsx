"use client"

import { useState, useEffect } from "react"
import { AnimatedLogo } from "./animated-logo"
import { StatusBox } from "./status-box"
import { Clock, RefreshCw, AlertTriangle, Bell, Settings, User, Menu, Puzzle, ArrowUpRight, Download, Code, Wallet, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface HeaderProps {
  onMenuToggle?: () => void
}

export function Header({ onMenuToggle }: HeaderProps = {}) {
  const [balance, setBalance] = useState<number>(0.00)
  const [isLoadingBalance, setIsLoadingBalance] = useState(true)

  const extensions = [
    { label: "Chrome Extension", href: "/extensions/chrome", icon: Download, description: "Browser extension for Chrome" },
    { label: "Firefox Add-on", href: "/extensions/firefox", icon: Download, description: "Browser extension for Firefox" },
  ]

  const fetchBalance = async () => {
    try {
      setIsLoadingBalance(true)
      const response = await fetch('/api/dashboard/stats')
      const data = await response.json()
      if (data.success && data.user) {
        setBalance(data.user.balance || 0)
      }
    } catch (err) {
      console.error("Failed to fetch balance:", err)
    } finally {
      setIsLoadingBalance(false)
    }
  }

  useEffect(() => {
    fetchBalance()
    // Optional: set up interval to refresh balance every 30s
    const interval = setInterval(fetchBalance, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="w-full border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with logo and navigation */}
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3">
            {onMenuToggle && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onMenuToggle}
                className="lg:hidden text-muted-foreground hover:text-foreground hover:bg-primary/5"
              >
                <Menu className="w-5 h-5" />
              </Button>

            )}
            <div className="lg:hidden">
              <AnimatedLogo />
            </div>
          </div>

          {/* Right Section Content */}
          <div className="flex-1 flex items-center justify-end gap-6 transition-all duration-300">
            {/* Center Navigation Group */}
            <div className="hidden md:flex items-center gap-3">
              {/* Extensions with Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group">
                  <Puzzle className="w-4 h-4 text-foreground" />
                  <span className="text-sm font-medium text-foreground hidden lg:inline">Extensions</span>
                  <ArrowUpRight className="w-3 h-3 text-muted-foreground group-hover:rotate-45 transition-transform" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 mt-2 w-64 p-2 rounded-xl bg-card border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl overflow-hidden">
                  <div className="p-2 border-b border-border/50 bg-secondary/20 font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                    Available Extensions
                  </div>
                  {extensions.map((extension) => {
                    const Icon = extension.icon
                    return (
                      <Link
                        key={extension.label}
                        href={extension.href}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{extension.label}</p>
                          <p className="text-xs text-muted-foreground">{extension.description}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* API Library */}
              <Link href="/extensions/api" className="hidden md:flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                <Code className="w-4 h-4 text-foreground" />
                <span className="text-sm font-medium text-foreground hidden lg:inline">API Library</span>
              </Link>

              {/* Wallet Balance */}
              <div className="flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl bg-secondary/50 transition-colors border border-border/30">
                <Wallet className="w-4 h-4 text-foreground" />
                <div className="flex items-baseline gap-1">
                  {isLoadingBalance && balance === 0 ? (
                    <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                  ) : (
                    <span className="text-sm font-bold text-foreground">${balance.toFixed(4)}</span>
                  )}
                  <span className="text-xs text-muted-foreground hidden sm:inline uppercase">USD</span>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="hidden md:block w-px h-6 bg-border/50 mx-1" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-primary/5 relative rounded-xl"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-card" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-xl"
              >
                <Settings className="w-5 h-5" />
              </Button>
              {/* Profile Avatar */}
              <div className="relative group/avatar cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center ml-2 border border-border hover:border-primary/50 transition-all duration-300">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
              </div>
            </div>
          </div>
        </div>


      </div>
    </header>
  )
}
