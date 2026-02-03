import { Suspense } from "react"
import { DashboardProfileContent } from "@/components/dashboard-profile-content"

export default function DashboardProfilePage() {
  return (
    <Suspense fallback={null}>
      <DashboardProfileContent />
    </Suspense>
  )
}
