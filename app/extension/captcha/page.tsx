"use client"

import { useState, useEffect, Suspense } from "react"
import { ArrowLeft, Shield, Search, Bot, Lock, Fingerprint, Eye, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ExtensionCaptchaCard } from "@/components/extension-captcha-card"

const captchaServices = [
  {
    name: "Google reCAPTCHA",
    description: "v2, v3 & Invisible support",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#4285F4">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    ),
    isPopular: true,
    isActive: true,
    color: "#4285F4",
  },
  {
    name: "hCaptcha",
    description: "Privacy-focused captcha",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#00838F">
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
      </svg>
    ),
    isPopular: true,
    isActive: true,
    color: "#00838F",
  },
  {
    name: "Cloudflare Turnstile",
    description: "Smart verification",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#F38020">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    isPopular: true,
    isActive: false,
    color: "#F38020",
  },
  {
    name: "FunCaptcha",
    description: "Gamified captcha",
    logo: <Bot className="w-5 h-5 text-purple-500" />,
    isPopular: false,
    isActive: false,
    color: "#9333EA",
  },
  {
    name: "GeeTest",
    description: "Slide verification",
    logo: <Fingerprint className="w-5 h-5 text-cyan-500" />,
    isPopular: false,
    isActive: false,
    color: "#06B6D4",
  },
  {
    name: "KeyCAPTCHA",
    description: "Puzzle-based",
    logo: <Lock className="w-5 h-5 text-rose-500" />,
    isPopular: false,
    isActive: false,
    color: "#F43F5E",
  },
  {
    name: "MTCaptcha",
    description: "Enterprise solution",
    logo: <Shield className="w-5 h-5 text-indigo-500" />,
    isPopular: false,
    isActive: false,
    color: "#6366F1",
  },
  {
    name: "Arkose Labs",
    description: "Fraud prevention",
    logo: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
    isPopular: false,
    isActive: false,
    color: "#10B981",
  },
  {
    name: "PerimeterX",
    description: "Bot mitigation",
    logo: <Eye className="w-5 h-5 text-amber-500" />,
    isPopular: false,
    isActive: false,
    color: "#F59E0B",
  },
]

function CaptchaPageContent() {
  const [isVisible, setIsVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const filteredServices = captchaServices.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const activeCount = captchaServices.filter((s) => s.isActive).length

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
            <div className="flex-1">
              <h1 className="text-sm font-semibold text-foreground">Captcha Services</h1>
              <p className="text-[10px] text-muted-foreground">{activeCount} services enabled</p>
            </div>
            <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
              <Shield className="w-3 h-3 inline mr-1" />
              Protected
            </div>
          </div>
        </header>

        {/* Search */}
        <div
          className={`px-4 py-3 border-b border-border transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "50ms" }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search captcha services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-secondary/30 border-border focus:border-primary text-xs"
            />
          </div>
        </div>

        {/* Services List */}
        <div className="max-h-[400px] overflow-y-auto px-4 py-3 space-y-3">
          {/* Popular Section */}
          <div
            className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "100ms" }}
          >
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Popular Services
            </p>
          </div>

          {filteredServices
            .filter((s) => s.isPopular)
            .map((service, index) => (
              <ExtensionCaptchaCard key={service.name} {...service} animationDelay={150 + index * 50} />
            ))}

          {/* Other Services */}
          <div
            className={`pt-2 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "300ms" }}
          >
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Other Services
            </p>
          </div>

          {filteredServices
            .filter((s) => !s.isPopular)
            .map((service, index) => (
              <ExtensionCaptchaCard key={service.name} {...service} animationDelay={350 + index * 50} />
            ))}

          {filteredServices.length === 0 && (
            <div className="py-8 text-center">
              <Shield className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">No services found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border bg-secondary/30">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground">
              <span className="text-primary font-medium">{activeCount}</span> of {captchaServices.length} enabled
            </p>
            <Link href="/extension/settings">
              <button className="text-[10px] text-primary font-medium hover:underline">Advanced Settings</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ExtensionCaptchaPage() {
  return (
    <Suspense fallback={null}>
      <CaptchaPageContent />
    </Suspense>
  )
}
