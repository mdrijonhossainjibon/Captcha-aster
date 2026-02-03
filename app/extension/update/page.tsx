"use client"

import { useState, useEffect } from "react"
import { Download, Sparkles, ArrowLeft, Check, Zap, Shield, Bug } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const updateFeatures = [
  {
    icon: Zap,
    title: "Faster Solving",
    description: "50% faster captcha recognition",
  },
  {
    icon: Shield,
    title: "New Captcha Support",
    description: "Added Cloudflare Turnstile v2",
  },
  {
    icon: Bug,
    title: "Bug Fixes",
    description: "Fixed memory leak issues",
  },
]

export default function UpdatePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleUpdate = () => {
    setIsDownloading(true)
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsDownloading(false)
          setIsComplete(true)
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

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
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-foreground">Update Available</h1>
                <p className="text-[10px] text-muted-foreground">v2.5.0 ready to install</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="p-6">
          {/* Version badge */}
          <div
            className={`mx-auto w-fit px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-green-500/10 border border-primary/20 mb-6 transition-all duration-500 delay-200 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">v2.4.1</span>
              <span className="text-primary">→</span>
              <span className="text-sm font-semibold text-primary">v2.5.0</span>
              <span className="px-1.5 py-0.5 rounded-md bg-green-500/20 text-[10px] font-medium text-green-500">
                NEW
              </span>
            </div>
          </div>

          {/* What's new */}
          <div
            className={`mb-6 transition-all duration-500 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <h3 className="text-sm font-medium text-foreground mb-3">What&apos;s New</h3>
            <div className="space-y-3">
              {updateFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`flex items-start gap-3 p-3 rounded-xl bg-secondary/50 border border-border transition-all duration-300 hover:bg-secondary/80`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          {isDownloading && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Downloading update...</span>
                <span className="text-xs font-medium text-primary">{downloadProgress}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success state */}
          {isComplete && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-green-500">Update Complete!</h4>
                  <p className="text-xs text-muted-foreground">Restart extension to apply changes</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div
            className={`space-y-3 transition-all duration-500 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {!isComplete ? (
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                onClick={handleUpdate}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Update Now
                  </>
                )}
              </Button>
            ) : (
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white gap-2">
                <Sparkles className="w-4 h-4" />
                Restart Extension
              </Button>
            )}
            <Link href="/extension">
              <Button variant="outline" className="w-full bg-transparent">
                {isComplete ? "Done" : "Remind me later"}
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border bg-secondary/30">
          <div className="flex items-center justify-between">
            <a href="#" className="text-[10px] text-primary font-medium hover:underline">
              View full changelog
            </a>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-green-500 font-medium">Update ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
