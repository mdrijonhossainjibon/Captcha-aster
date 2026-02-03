'use client'

export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center overflow-hidden relative">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-72 h-72 bg-accent/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4">
        {/* Company branding */}
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">
            Spark<span className="text-primary">AI</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Solver
          </p>
        </div>

        {/* Smiley face loader */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="55" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary/20" />
            <circle cx="40" cy="45" r="4" fill="currentColor" className="text-primary" />
            <circle cx="80" cy="45" r="4" fill="currentColor" className="text-primary" />
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

        {/* Loading text */}
        <div className="text-center space-y-1">
          <h2 className="text-lg font-semibold text-foreground">Loading</h2>
          <p className="text-sm text-muted-foreground">Setting up...</p>
        </div>

        {/* Status dots */}
        <div className="flex gap-2">
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

      <style jsx>{`
        @keyframes smile {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
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
