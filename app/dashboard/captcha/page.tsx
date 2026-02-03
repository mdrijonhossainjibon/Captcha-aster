import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardCaptchaContent } from "@/components/dashboard-captcha-content"

export default function DashboardCaptchaPage() {
  return (
    <Suspense fallback={null}>
      <DashboardLayout>
        <DashboardCaptchaContent />
      </DashboardLayout>
    </Suspense>
  )
}
