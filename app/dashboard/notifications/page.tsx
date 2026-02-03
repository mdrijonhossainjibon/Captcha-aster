import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardNotificationsContent } from "@/components/dashboard-notifications-content"

export default function DashboardNotificationsPage() {
  return (
    <Suspense fallback={null}>
      <DashboardLayout>
        <DashboardNotificationsContent />
      </DashboardLayout>
    </Suspense>
  )
}
