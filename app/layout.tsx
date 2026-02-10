import type React from "react"
import type { Metadata } from "next"
import { Outfit, Geist_Mono } from "next/font/google"

import AuthProvider from "@/components/SessionProvider"
import { StoreProvider } from "@/modules/StoreProvider"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
})

const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Captcha Master | Modern AI Solutions",
    template: "%s | Captcha Master",
  },
  description: "Modern AI-powered dashboard for solving captchas with daily limits and premium tools.",
  keywords: ["AI", "Captcha Solver", "Automation", "Dashboard", "Premium Tools", "Captcha Master"],
  authors: [{ name: "Captcha Master Team" }],
  creator: "Captcha Master",
  publisher: "Captcha Master",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://captchamaster.org"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/logo.png", sizes: "any" },
    ],
    apple: [{ url: "/apple-icon.png" }],
  },
  openGraph: {
    title: "Captcha Master | Modern AI Solutions",
    description: "Modern AI-powered dashboard for solving captchas with daily limits and premium tools.",
    url: "https://captchamaster.org",
    siteName: "Captcha Master",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Captcha Master Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Captcha Master | Modern AI Solutions",
    description: "Modern AI-powered dashboard for solving captchas with daily limits and premium tools.",
    images: ["/logo.png"],
    creator: "@captchamaster",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased text-[13.5px] leading-relaxed tracking-tight`}>
        <StoreProvider>
          <AuthProvider>{children}</AuthProvider>
        </StoreProvider>

      </body>
    </html>
  )
}
