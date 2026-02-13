import { Suspense } from "react"
import { DashboardDepositCrypto } from "@/components/dashboard-deposit-crypto"
 

export default function DashboardTopupPage() {
  return (
    <Suspense fallback={null}>
    
        <DashboardDepositCrypto/>
  
    </Suspense>
  )
}
