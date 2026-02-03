import { Suspense } from "react"
import { PaymentContent } from "@/components/payment-content"

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <Suspense fallback={null}>
        <PaymentContent />
      </Suspense>
    </div>
  )
}
