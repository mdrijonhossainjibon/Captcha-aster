"use client"

import { SignupForm } from "@/components/signup-form"
import { useEffect, useState } from "react"

export default function SignupPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 relative overflow-hidden">
      {/* Animated Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient orbs */}
        <div
          className={`absolute top-1/4 -left-16 sm:-left-32 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-3xl transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          style={{ animation: 'float 20s ease-in-out infinite' }}
        />
        <div
          className={`absolute bottom-1/4 -right-16 sm:-right-32 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-3xl transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          style={{ animation: 'float 25s ease-in-out infinite reverse' }}
        />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-primary/5 rounded-full blur-3xl transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          style={{ animation: 'pulse 15s ease-in-out infinite' }}
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 sm:w-2 sm:h-2 bg-primary/20 rounded-full transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'
              }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${15 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}

        {/* Grid pattern - responsive */}
        <div
          className="absolute inset-0 opacity-[0.015] sm:opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Radial gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/50" />
      </div>

      {/* Glassmorphism backdrop for mobile */}
      <div className="absolute inset-0 backdrop-blur-[0.5px] sm:backdrop-blur-0 pointer-events-none" />

      {/* Content Container with responsive constraints */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Signup Form with enhanced shadow on desktop */}
        <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          <SignupForm />
        </div>

        {/* Decorative elements - hidden on mobile */}
        <div className="hidden sm:block absolute -top-4 -left-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-pulse" />
        <div className="hidden sm:block absolute -bottom-4 -right-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Mobile-specific bottom gradient */}
      <div className="sm:hidden absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  )
}

// Add these keyframes to your global CSS if not already present
// @keyframes float {
//   0%, 100% { transform: translateY(0px) translateX(0px); }
//   25% { transform: translateY(-20px) translateX(10px); }
//   50% { transform: translateY(-10px) translateX(-10px); }
//   75% { transform: translateY(-30px) translateX(5px); }
// }
