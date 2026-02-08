import type React from "react"
import type { Metadata } from "next"
import { Outfit, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
})
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Dashboard",
  description: "Modern AI-powered dashboard with daily limits",
  generator: 'v0.app'
}

import AuthProvider from "@/components/SessionProvider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased text-[13.5px] leading-relaxed tracking-tight`}>
        <AuthProvider>
          {children}

        </AuthProvider>
      </body>
    </html>
  )
}
