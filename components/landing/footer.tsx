import Link from "next/link"
import Image from "next/image"
import { Twitter, Github, MessageSquare, ArrowUpRight } from "lucide-react"

const footerLinks = {
  Product: [
    { label: "Features", href: "#features-section" },
    { label: "API Docs", href: "/api-docs" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
  ],
}
export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 sm:gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl  flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="CaptchaMaster Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold text-foreground">
                Captcha<span className="text-primary">Ɱaster</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              The world's most advanced AI-powered captcha solving service. Fast, reliable, and completely secure.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Twitter, href: "#", color: "hover:text-sky-400" },
                { icon: MessageSquare, href: "#", color: "hover:text-indigo-400" },
                { icon: Github, href: "#", color: "hover:text-white" }
              ].map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  className={`p-2 rounded-lg bg-card border border-border transition-all duration-300 ${social.color} hover:scale-110`}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h4 className="font-bold text-foreground uppercase tracking-wider text-xs sm:text-sm">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p className="text-sm text-muted-foreground">© 2026 CaptchaⱮaster. All rights reserved.</p>
            <span className="hidden md:inline text-border">|</span>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-muted-foreground font-medium">Systems Operational</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                </div>
              ))}
              <div className="pl-4 text-xs text-muted-foreground flex items-center">
                <span className="font-bold text-foreground mr-1">10k+</span> users trust us
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
