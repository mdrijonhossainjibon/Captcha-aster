"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import type { ReactNode } from "react"
import { Suspense, useState } from "react"
import { cn } from "@/lib/utils"

export default function AdminLayout({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <main className={cn(
                "min-h-screen transition-all duration-300",
                "lg:ml-64", // Only add margin on desktop
                isSidebarOpen ? "ml-0" : "ml-0" // Margin is handled by the sidebar itself being fixed
            )}>
                <AdminHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <div className="p-4 sm:p-6">
                    <Suspense fallback={null}>
                        {children}
                    </Suspense>
                </div>
            </main>
        </div>
    )
}
