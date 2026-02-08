"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-primary to-primary/80 rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 text-center overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative z-10">
            <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Sparkles className="w-6 sm:w-8 h-6 sm:h-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-3 sm:mb-4">Ready to Solve Captchas?</h2>
            <p className="text-base sm:text-lg lg:text-xl text-primary-foreground/80 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust CaptchaⱮaster for their captcha solving needs. Start with 10 free credits.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
              <Link href="/extension" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold gap-2">
                  Get Started Free
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
                </Button>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
