"use client"

import { cn } from "@/lib/utils"

import Link from "next/link"

import { useEffect } from "react"

import { useState } from "react"

import { redirect, usePathname } from "next/navigation"

import {
  LayoutDashboard,
  Users,
  BarChart3,
  Shield,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Lock,
  Bell,
  Package,
  Zap,
  RefreshCw,
  DollarSign,
  FileText,
  Mail,
  Database,
  GitBranch,
  AlertCircle,
  CreditCard,
  Smartphone,
  Key,
  Activity,
  Wallet,
  History,
  Bot,
  TrendingUp,
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"

const mainNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
]

const managementItems = [
  { href: "/admin/packages", label: "Packages", icon: Package },
  /*  { href: "/admin/wallet", label: "Wallet", icon: Wallet }, */
  { href: "/admin/topup-history", label: "Topup History", icon: History },
]

const aiTrainingItems = [
  { href: "/admin/ai-training/bots", label: "Bot Management", icon: Bot }
]

const systemItems = [
  { href: "/admin/system/smtp", label: "SMTP Config", icon: Settings },
  { href: "/admin/email", label: "Email Templates", icon: Mail },
  { href: "/admin/database", label: "Database", icon: Database }
]





export function AdminSidebar() {
  const { data: session, status }: any = useSession();
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (status === 'loading') {
    return <div className="fixed left-0 top-0 w-64 h-screen bg-card border-r border-border flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  }

  if (session?.user?.role !== 'admin') {
    redirect('/dashboard')
  }

  const NavItem = ({ item, index }: { item: (typeof mainNavItems)[0]; index: number }) => {
    const isActive = pathname === item.href
    const Icon = item.icon

    return (
      <Link
        href={item.href}
        className={cn(
          "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300",
          "hover:bg-primary/10",
          isActive && "bg-primary/15 text-primary",
          !isActive && "text-muted-foreground hover:text-foreground",
        )}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateX(0)" : "translateX(-20px)",
          transitionDelay: `${index * 50}ms`,
        }}
      >
        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />}

        <div
          className={cn(
            "relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300",
            isActive && "bg-primary/20",
            !isActive && "group-hover:bg-secondary",
          )}
        >
          <Icon
            className={cn(
              "w-5 h-5 transition-all duration-300",
              isActive && "text-primary drop-shadow-[0_0_8px_oklch(0.82_0.18_90/0.6)]",
            )}
          />
        </div>

        <span
          className={cn(
            "font-medium whitespace-nowrap transition-all duration-300",
            "opacity-100",
          )}
        >
          {item.label}
        </span>

        <div
          className={cn(
            "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            "bg-gradient-to-r from-primary/5 to-transparent pointer-events-none",
          )}
        />
      </Link>
    )
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen z-40 flex flex-col transition-all duration-300 ease-in-out",
        "bg-card/80 backdrop-blur-xl border-r border-border",
        "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-card animate-pulse" />
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">
              Admin<span className="text-destructive">Panel</span>
            </span>
            <span className="text-xs text-muted-foreground">Management</span>
          </div>
        </Link>
      </div>




      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Main Section */}
        <div className="space-y-2">
          {mainNavItems.map((item, idx) => (
            <NavItem key={item.href} item={item} index={idx} />
          ))}
        </div>

        {/* Management Section */}
        <div>
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Management
          </p>
          <div className="space-y-2">
            {managementItems.map((item, idx) => (
              <NavItem key={item.href} item={item} index={mainNavItems.length + idx} />
            ))}
          </div>
        </div>

        {/* AI Training Section */}
        <div>
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            AI Training
          </p>
          <div className="space-y-2">
            {aiTrainingItems.map((item, idx) => (
              <NavItem key={item.href} item={item} index={mainNavItems.length + managementItems.length + idx} />
            ))}
          </div>
        </div>

        {/* System Section */}
        <div>
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            System
          </p>
          <div className="space-y-2">
            {systemItems.map((item, idx) => (
              <NavItem
                key={item.href}
                item={item}
                index={mainNavItems.length + managementItems.length + aiTrainingItems.length + idx}
              />
            ))}
          </div>
        </div>




      </nav>

      {/* User section */}
      <div className="p-3 border-t border-border">
        <div
          className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 transition-all duration-300"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-sm font-bold">
              AD
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Super Admin
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-20 left-4 w-32 h-32 bg-destructive/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-0 w-24 h-24 bg-orange-600/5 rounded-full blur-2xl pointer-events-none" />
    </aside>
  )
}
