"use client"

import { useState, useEffect } from "react"
import { Wrench, Clock, RefreshCw, Bell, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MaintenancePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 30, seconds: 0 })

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-[360px] bg-background border border-border rounded-2xl shadow-2xl shadow-primary/5 overflow-hidden">
        {/* Header */}
        <header
          className={`px-4 py-3 border-b border-border bg-card transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
        >
          <div className="flex items-center gap-3">
            <Link href="/extension">
              <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Wrench className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-foreground">Maintenance</h1>
                <p className="text-[10px] text-muted-foreground">Scheduled update</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="p-6">
          {/* Icon animation */}
          <div
            className={`mx-auto w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mb-6 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
          >
            <div className="relative">
              <Wrench className="w-10 h-10 text-amber-500 animate-pulse" />
              <div className="absolute inset-0 w-10 h-10 rounded-full bg-amber-500/20 animate-ping" />
            </div>
          </div>

          {/* Message */}
          <div
            className={`text-center mb-6 transition-all duration-500 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <h2 className="text-lg font-semibold text-foreground mb-2">Under Maintenance</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We&apos;re improving our captcha solving algorithms for better accuracy and speed.
            </p>
          </div>

          {/* Countdown */}
          <div
            className={`bg-secondary/50 rounded-xl p-4 mb-6 transition-all duration-500 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <div className="flex items-center justify-center gap-1 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Estimated time remaining</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="text-center">
                <div className="w-14 h-14 rounded-lg bg-card border border-border flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{String(countdown.hours).padStart(2, "0")}</span>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1">Hours</span>
              </div>
              <span className="text-2xl font-bold text-muted-foreground">:</span>
              <div className="text-center">
                <div className="w-14 h-14 rounded-lg bg-card border border-border flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{String(countdown.minutes).padStart(2, "0")}</span>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1">Minutes</span>
              </div>
              <span className="text-2xl font-bold text-muted-foreground">:</span>
              <div className="text-center">
                <div className="w-14 h-14 rounded-lg bg-card border border-border flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{String(countdown.seconds).padStart(2, "0")}</span>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1">Seconds</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div
            className={`space-y-3 transition-all duration-500 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Bell className="w-4 h-4" />
              Notify me when ready
            </Button>
            <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4" />
              Check status
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border bg-secondary/30">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground">
              Follow us on <span className="text-primary font-medium cursor-pointer hover:underline">Twitter</span> for
              updates
            </p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] text-amber-500 font-medium">Maintenance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
