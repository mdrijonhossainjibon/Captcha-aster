import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardTopupContent } from "@/components/dashboard-topup-content"

export default function DashboardTopupPage() {
  return (
    <Suspense fallback={null}>
      <DashboardLayout>
        <DashboardTopupContent />
      </DashboardLayout>
    </Suspense>
  )
}
