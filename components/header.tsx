"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Clock, RefreshCw, AlertTriangle, Bell, User, MoreVertical, Puzzle, ArrowUpRight, Download, Code, Wallet, Loader2, Gift, LogOut, Shield, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  onMenuToggle?: () => void
}

export function Header({ onMenuToggle }: HeaderProps = {}) {
  const { data: session } = useSession()
  const [balance, setBalance] = useState<number>(0.00)
  const [isLoadingBalance, setIsLoadingBalance] = useState(true)

  const isAdmin = session?.user?.role === "admin"

  const extensions = [
    { label: "Chrome Extension", href: "https://github.com/rk643264321/Captcha-aster-Extension/raw/refs/heads/main/captchamaster-1.0.1-chrome.zip", icon: Download, description: "Browser extension for Chrome" },
    { label: "Firefox Add-on", href: "https://github.com/rk643264321/Captcha-aster-Extension/raw/refs/heads/main/captchamaster-1.0.1-firefox.zip", icon: Download, description: "Browser extension for Firefox" },
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
            <Link href="/" className="lg:hidden flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/10 overflow-hidden transition-all duration-300 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="CaptchaMaster Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold text-foreground">
                Captcha<span className="text-primary">Ɱaster</span>
              </span>
            </Link>
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
            </div>

            {/* Separator */}
            <div className="hidden md:block w-px h-6 bg-border/50 mx-1" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Wallet Balance - Moved to visible on mobile/desktop */}
              <div className="flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl bg-secondary/30 transition-colors border border-border/30">
                <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                <div className="flex items-baseline gap-1">
                  {isLoadingBalance && balance === 0 ? (
                    <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                  ) : (
                    <span className="text-sm font-bold text-foreground">${balance.toFixed(4)}</span>
                  )}
                  <span className="text-[10px] text-muted-foreground hidden sm:inline uppercase">USD</span>
                </div>
              </div>

              <Link href="/dashboard/referrals" className="hidden sm:flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
                  title="Invite & Earn 15%"
                >
                  <Gift className="w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-primary/5 relative rounded-xl"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-card" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-xl transition-all duration-300"
                  >
                    <div className="relative">
                      <User className="w-5 h-5" />
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border-2 border-card" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-border bg-card/95 backdrop-blur-md shadow-xl">
                  <DropdownMenuLabel className="p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-foreground leading-none">{session?.user?.name || "User"}</p>
                      <p className="text-xs text-muted-foreground leading-none truncate">{session?.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50" />

                  <Link href="/dashboard">
                    <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  </Link>

                  {isAdmin && (
                    <Link href="/admin">
                      <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors text-destructive-foreground/90">
                        <Shield className="w-4 h-4 text-destructive" />
                        <span className="text-destructive">Admin Panel</span>
                      </DropdownMenuItem>
                    </Link>
                  )}

                  <DropdownMenuSeparator className="bg-border/50" />

                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: '/auth/login' })}
                    className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors group"
                  >
                    <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Toggle - Added to Right */}
              {onMenuToggle && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onMenuToggle}
                  className="lg:hidden text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-xl ml-1"
                >
                  <MoreVertical className="w-6 h-6" />
                </Button>
              )}
            </div>
          </div>
        </div>


      </div>
    </header>
  )
}
