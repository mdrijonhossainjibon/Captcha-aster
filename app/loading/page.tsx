'use client'

import { Sparkles } from 'lucide-react'

export default function LoadingPage() {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-accent/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute -bottom-40 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4">
        {/* Company branding */}
        <div className="flex flex-col items-center gap-4">
          {/* Logo icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-xl">
            <Sparkles className="w-10 h-10 text-background" />
          </div>

          {/* Company name */}
          <div className="text-center space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Spark<span className="text-primary">AI</span>
            </h1>
            <p className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground">
              Captcha Solver
            </p>
          </div>
        </div>

        {/* Simple friendly smiley face loader */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 120 120">
            {/* Outer circle background */}
            <circle
              cx="60"
              cy="60"
              r="55"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-secondary/20"
            />
            
            {/* Left eye dot */}
            <circle cx="40" cy="45" r="4" fill="currentColor" className="text-primary" />
            
            {/* Right eye dot */}
            <circle cx="80" cy="45" r="4" fill="currentColor" className="text-primary" />
            
            {/* Animated smile */}
            <path
              d="M 40 70 Q 60 85 80 70"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              className="text-primary"
              style={{
                animation: 'smile 1.5s ease-in-out infinite',
                transformOrigin: '60px 60px'
              }}
            />
          </svg>
        </div>

        {/* Text content */}
        <div className="text-center space-y-2 max-w-md">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">
            Preparing your workspace
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Initializing the captcha solver engine and loading your data
          </p>
        </div>

        {/* Progress bar with label */}
        <div className="w-full max-w-sm space-y-2">
          <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{
                animation: 'shimmer 2s ease-in-out infinite',
                backgroundSize: '200% 100%'
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">Loading...</p>
        </div>

        {/* Status dots */}
        <div className="flex gap-2 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-muted-foreground/40"
              style={{
                animation: 'pulse 1.4s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <style jsx>{`
        @keyframes smile {
          0%, 100% {
            transform: scale(1);
            stroke-dasharray: 0 0;
          }
          50% {
            transform: scale(1.05);
            stroke-dasharray: 0 0;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
