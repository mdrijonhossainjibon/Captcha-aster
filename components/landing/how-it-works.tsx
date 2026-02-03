"use client"

import { useState, useEffect } from "react"
import { Download, Settings, Zap, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Download,
    title: "Install Extension",
    description: "Download our Chrome extension with just one click. No complex setup required.",
  },
  {
    icon: Settings,
    title: "Configure Settings",
    description: "Choose your preferred captcha types and auto-solve preferences.",
  },
  {
    icon: Zap,
    title: "Auto-Solve",
    description: "Our AI automatically detects and solves captchas while you browse.",
  },
  {
    icon: CheckCircle,
    title: "Done!",
    description: "Enjoy seamless browsing without captcha interruptions.",
  },
]

export function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("how-it-works")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-4xl font-bold text-foreground mb-4">Get Started in Minutes</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple setup, powerful results. Start solving captchas automatically in just 4 easy steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`relative flex flex-col items-center text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Number badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center z-10">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center mb-6 relative z-10">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
