"use client"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"

const captchas = [
  { name: "Kolotibablo Auto Login", supported: true },
  { name: "reCAPTCHA v2", supported: true },
  { name: "POPULARCAPTCHA", supported: true },
  { name: "Cloudflare Turnstile", supported: true },
  { name: "Friendly Captcha", supported: true },
  { name: "GeeTest", supported: true },
  { name: "AWS WAF", supported: true },
  { name: "ProsoPo", supported: true },
]

export function SupportedCaptchas() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("supported-captchas")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="supported-captchas" className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Compatibility
          </span>
          <h2 className="text-4xl font-bold text-foreground mb-4">Supported Captcha Types</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We support all major captcha types. If you see it, we can solve it.
          </p>
        </div>

        {/* Captcha grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {captchas.map((captcha, index) => (
            <div
              key={captcha.name}
              className={`flex items-center gap-3 p-4 bg-card rounded-xl border border-border transition-all duration-500 hover:border-primary/30 hover:shadow-lg ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-green-500" />
              </div>
              <span className="font-medium text-foreground">{captcha.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
