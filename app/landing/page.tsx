import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { StatsSection } from "@/components/landing/stats-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { SupportedCaptchas } from "@/components/landing/supported-captchas"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <HowItWorks />
        <SupportedCaptchas />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
