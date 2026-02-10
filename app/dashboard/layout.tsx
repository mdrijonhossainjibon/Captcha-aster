"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import type { ReactNode } from "react"
import { useState } from "react"
import { Header } from "@/components/header"

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <DashboardSidebar
                isMobileMenuOpen={isMobileMenuOpen}
                onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
            />

            {/* Header - positioned to work with sidebar */}
            <div className={`lg:ml-64`}>
                <Header />
            </div>

            {/* Main Content */}
            <main className="min-h-screen transition-all duration-300 lg:ml-64">
                {children}
            </main>
        </div>
    )
}
