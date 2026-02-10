"use client"

import { LoginForm } from "@/components/login-form"
import { useEffect, useState } from "react"

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // Tailwind's 'md' breakpoint is 768px
    }

    checkMobile() // Initial check
    window.addEventListener('resize', checkMobile) // Listen for resize events

    return () => window.removeEventListener('resize', checkMobile) // Cleanup
  }, [])

  // Mobile Native App Layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
        {/* Mobile Header with Gradient */}
        <div className="relative h-[35vh] bg-gradient-to-br from-primary/20 via-primary/10 to-background overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div
              className={`absolute top-10 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`}
              style={{ animation: 'float 15s ease-in-out infinite' }}
            />
            <div
              className={`absolute -bottom-10 -left-20 w-32 h-32 bg-primary/15 rounded-full blur-2xl transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`}
              style={{ animation: 'float 20s ease-in-out infinite reverse' }}
            />
          </div>

          {/* Logo and Title */}
          <div className={`relative z-10 flex flex-col items-center justify-center h-full px-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}>
            <div className="w-20 h-20 rounded-3xl bg-primary/10 backdrop-blur-xl border border-primary/20 flex items-center justify-center mb-4 shadow-lg overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-3" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Welcome Back</h1>
            <p className="text-sm text-muted-foreground text-center">Sign in to continue</p>
          </div>
        </div>

        {/* Bottom Sheet Style Form Container */}
        <div className={`flex-1 bg-card rounded-t-[32px] -mt-8 relative z-20 shadow-2xl transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-border rounded-full" />
          </div>

          {/* Scrollable Form Content */}
          <div className="overflow-y-auto h-full pb-safe px-4">
            <LoginForm />
          </div>
        </div>
      </div>
    )
  }

  // Desktop Traditional Layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Animated Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient orbs */}
        <div
          className={`absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          style={{ animation: 'float 20s ease-in-out infinite' }}
        />
        <div
          className={`absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          style={{ animation: 'float 25s ease-in-out infinite reverse' }}
        />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          style={{ animation: 'pulse 15s ease-in-out infinite' }}
        />

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-primary/20 rounded-full transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'
              }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${15 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/50" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Login Form */}
        <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          <LoginForm />
        </div>

        {/* Decorative corner elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  )
}
