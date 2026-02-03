import { Suspense } from "react"
import { TopupContent } from "@/components/topup-content"

export default function TopupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Suspense fallback={null}>
        <TopupContent />
      </Suspense>
    </div>
  )
}
