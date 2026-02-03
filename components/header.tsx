"use client"

import { AnimatedLogo } from "./animated-logo"
import { StatusBox } from "./status-box"
import { Clock, RefreshCw, AlertTriangle, Bell, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="w-full border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with logo and navigation */}
        <div className="flex items-center justify-between h-16">
          <AnimatedLogo />

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {["Dashboard", "Analytics", "Settings"].map((item) => (
              <Button
                key={item}
                variant="ghost"
                className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/5"
              >
                {item}
              </Button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground hover:bg-primary/5 relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground hover:bg-primary/5"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center ml-2">
              <User className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>

        {/* Status boxes section */}
        <div className="py-4 border-t border-border/50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatusBox
              title="Daily Limit"
              value="847 / 1,000"
              subValue="153 remaining today"
              icon={Clock}
              variant="default"
              progress={84.7}
              animationDelay={100}
            />
            <StatusBox
              title="Refill Time"
              value="04:32:18"
              subValue="Resets at midnight UTC"
              icon={RefreshCw}
              variant="success"
              animationDelay={200}
            />
            <StatusBox
              title="Expired"
              value="3 Items"
              subValue="Needs attention"
              icon={AlertTriangle}
              variant="warning"
              progress={30}
              animationDelay={300}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
