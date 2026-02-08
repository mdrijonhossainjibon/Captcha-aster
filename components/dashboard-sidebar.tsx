"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Sparkles,
  LayoutDashboard,
  Shield,
  CreditCard,
  Settings,
  User,
  History,
  Zap,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Crown,
  HelpCircle,
  Bell,
  Download,
  Package,
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },

  { href: "/dashboard/activities", label: "Activities", icon: Zap },
  { href: "/dashboard/pricing", label: "Pricing", icon: Package },
  { href: "/dashboard/topup", label: "Top Up", icon: CreditCard },
]

const accountNavItems = [
  { href: "/dashboard/profile", label: "Profile", icon: User },
]

const resourceNavItems = [
  { href: "/extension", label: "Extension", icon: Download },
  { href: "/how-it-works", label: "How It Works", icon: HelpCircle },
]

interface DashboardSidebarProps {
  isMobileMenuOpen?: boolean
  onCloseMobileMenu?: () => void
}

export function DashboardSidebar({ isMobileMenuOpen = false, onCloseMobileMenu }: DashboardSidebarProps = {}) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const NavItem = ({ item, index }: { item: (typeof mainNavItems)[0]; index: number }) => {
    const isActive = pathname === item.href
    const Icon = item.icon

    return (
      <Link
        href={item.href}
        onClick={() => onCloseMobileMenu?.()}
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
        {/* Active indicator */}
        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />}

        {/* Icon with glow on active */}
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
              isActive ? "text-primary drop-shadow-[0_0_8px_oklch(0.82_0.18_90/0.6)]" : "text-muted-foreground group-hover:text-foreground",
            )}
          />
        </div>

        {/* Label with slide animation */}
        <span
          className={cn(
            "font-medium whitespace-nowrap transition-all duration-300",
            "opacity-100",
            !isActive && "text-muted-foreground group-hover:text-foreground",
          )}
        >
          {item.label}
        </span>

        {/* Hover glow effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            "bg-gradient-to-r from-primary/5 to-transparent pointer-events-none",
          )}
        />
      </Link>
    )
  }

  const NavSection = ({
    title,
    items,
    startIndex,
  }: {
    title: string
    items: typeof mainNavItems
    startIndex: number
  }) => (
    <div className="space-y-1">
      <p
        className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
        style={{
          opacity: isVisible ? 1 : 0,
          transitionDelay: `${startIndex * 50}ms`,
        }}
      >
        {title}
      </p>
      {items.map((item, idx) => (
        <NavItem key={item.href} item={item} index={startIndex + idx} />
      ))}
    </div>
  )

  return (
    <aside
      className={cn(
        "fixed left-0 h-screen z-40 flex flex-col transition-all duration-300 ease-in-out",
        "bg-card/80 backdrop-blur-xl border-r border-border",
        // Desktop: always visible, fixed width
        "lg:top-0",
        "lg:w-64",
        // Mobile: slide in from left, full height including under header
        "top-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <Link href="/landing" className="flex items-center gap-3">
          {/* Animated Logo */}
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            {/* Orbiting dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-card animate-pulse" />
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">
              Captcha<span className="text-primary">Ɱaster</span>
            </span>
            <span className="text-xs text-muted-foreground">Captcha Solver</span>
          </div>
        </Link>
      </div>


      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        <NavSection title="Main" items={mainNavItems} startIndex={0} />
        <NavSection title="Account" items={accountNavItems} startIndex={4} />
        <NavSection title="Resources" items={resourceNavItems} startIndex={7} />
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-border">
        <div
          className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 transition-all duration-300"
        >
          {/* Avatar */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {session?.user?.name || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {(session?.user as any)?.isAdmin ? "Admin Member" : "Pro Member"}
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-inherit" />
          </button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-20 left-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
    </aside>
  )
}
