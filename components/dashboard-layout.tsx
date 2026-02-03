"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import type { ReactNode } from "react"

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="ml-64 min-h-screen transition-all duration-300">{children}</main>
    </div>
  )
}
