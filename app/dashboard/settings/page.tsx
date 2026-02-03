import { Suspense } from "react"
import { DashboardSettingsContent } from "@/components/dashboard-settings-content"

export default function DashboardSettingsPage() {
  return (
    <Suspense fallback={null}>
      <DashboardSettingsContent />
    </Suspense>
  )
}
