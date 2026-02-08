"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Menu, X, ChevronDown, Chrome } from "lucide-react"

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/api-docs", label: "API Docs" },
]

const extensionLinks = [
  {
    href: "/extension/firefox",
    label: "Firefox Extension",
    icon: (className: string) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="M12 8a2.5 2.5 0 0 1 2 4.5" />
        <path d="m8.5 13 3.5 3.5 3.5-3.5" />
      </svg>
    )
  },
  {
    href: "/extension/chrome",
    label: "Chrome Extension",
    icon: (className: string) => <Chrome className={className} />
  },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [extensionDropdownOpen, setExtensionDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setExtensionDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Captcha<span className="text-primary">Ɱaster</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Extension Dropdown */}
            <div
              className="relative"
              ref={dropdownRef}
            >
              <button
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors outline-none"
                onClick={() => setExtensionDropdownOpen(!extensionDropdownOpen)}
              >
                Extension
                <ChevronDown className={`w-4 h-4 transition-transform ${extensionDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {extensionDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-background/95 backdrop-blur-lg border border-border rounded-lg shadow-lg overflow-hidden py-1">
                  {extensionLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      {link.icon("w-5 h-5 text-primary")}
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop CTA - Added signup link */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Extension Dropdown */}
              <div>
                <button
                  className="flex items-center justify-between w-full text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setExtensionDropdownOpen(!extensionDropdownOpen)}
                >
                  Extension
                  <ChevronDown className={`w-4 h-4 transition-transform ${extensionDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {extensionDropdownOpen && (
                  <div className="pl-4 mt-2 flex flex-col gap-2">
                    {extensionLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.icon("w-5 h-5 text-primary")}
                        <span>{link.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-4 pt-4 border-t border-border">
                <Link href="/login" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" className="flex-1">
                  <Button className="w-full bg-primary hover:bg-primary/90">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
