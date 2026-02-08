"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import type { ReactNode } from "react"
import { Suspense } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar />
            <main className="ml-64 min-h-screen transition-all duration-300">
                <AdminHeader />
                <div className="p-6">
                    <Suspense fallback={null}>
                        {children}
                    </Suspense>
                </div>
            </main>
        </div>
    )
}
