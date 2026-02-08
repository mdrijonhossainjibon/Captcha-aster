import Link from "next/link"
import { Sparkles } from "lucide-react"

const footerLinks = {
  Product: [
    { label: "Features", href: "#features-section" },
    { label: "Extension", href: "/extension" },
    { label: "API Docs", href: "/api-docs" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "#" },
    { label: "Cookies", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-3 sm:space-y-4">
            <Link href="/landing" className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl bg-primary flex items-center justify-center">
                <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-foreground">
                Captcha<span className="text-primary">Ɱaster</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-xs">
              AI-powered captcha solving service. Fast, reliable, and secure.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground">2026 CaptchaⱮaster. All rights reserved.</p>
          <div className="flex gap-4 sm:gap-6">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm">
              Twitter
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm">
              Discord
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm">
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
