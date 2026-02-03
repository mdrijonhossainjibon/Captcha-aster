"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Play, ArrowRight, Shield, Zap, Clock } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCount((prev) => (prev < 99.8 ? prev + 0.1 : 88.9))
    }, 20)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div
            className={`space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">AI-Powered Captcha Solver</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Solve Captchas{" "}
              <span className="text-primary relative">
                Instantly
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path
                    d="M2 10C50 4 150 4 198 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-primary/50"
                  />
                </svg>
              </span>{" "}
              with AI
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-muted-foreground max-w-lg text-pretty">
              The most advanced captcha solving service. Fast, reliable, and powered by cutting-edge AI technology.
              Support for Kolotibablo Auto  Login, reCAPTCHA, hCaptcha, AWS ,Turnstile, and more.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/extension">
                <Button size="lg" className="h-14 px-8 text-lg font-semibold gap-2 bg-primary hover:bg-primary/90">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold gap-2 bg-transparent">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm text-muted-foreground">Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">{"< 2s Average"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-muted-foreground">24/7 Uptime</span>
              </div>
            </div>
          </div>

          {/* Right content - Animated card */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="relative bg-card rounded-3xl border border-border shadow-2xl shadow-primary/10 p-8 animate-float">
              {/* Glowing effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent" />

              {/* Card content */}
              <div className="relative space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center animate-pulse-glow">
                      <Sparkles className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">CaptchaⱮaster</p>
                      <p className="text-sm text-muted-foreground">Processing captcha...</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-sm font-medium">
                    Online
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kolotibablo Auto  Login</span>
                    <span className="font-medium text-foreground">{count.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-100"
                      style={{ width: `${count}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">1.2s</p>
                    <p className="text-xs text-muted-foreground">Avg Speed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">89.9%</p>
                    <p className="text-xs text-muted-foreground">Success</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">24/7</p>
                    <p className="text-xs text-muted-foreground">Uptime</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div
              className="absolute -top-4 -right-4 px-4 py-2 bg-card rounded-xl border border-border shadow-lg animate-float"
              style={{ animationDelay: "0.5s" }}
            >
              <p className="text-sm font-medium text-green-600">+2,847 solved today</p>
            </div>
            <div
              className="absolute -bottom-4 -left-4 px-4 py-2 bg-card rounded-xl border border-border shadow-lg animate-float"
              style={{ animationDelay: "0.8s" }}
            >
              <p className="text-sm font-medium text-foreground">
                hCaptcha <span className="text-green-600">Solved!</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
