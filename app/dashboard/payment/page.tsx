import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardPaymentContent } from "@/components/dashboard-payment-content"

export default function DashboardPaymentPage() {
  return (
    <Suspense fallback={null}>
      <DashboardLayout>
        <DashboardPaymentContent />
      </DashboardLayout>
    </Suspense>
  )
}
