import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardDepositCrypto } from "@/components/dashboard-deposit-crypto"
 

export default function DashboardTopupPage() {
  return (
    <Suspense fallback={null}>
    
        <DashboardDepositCrypto/>
  
    </Suspense>
  )
}
