import { Suspense } from 'react'
import { ResetPasswordForm } from '@/components/reset-password-form'

function ResetPasswordContent() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
            <ResetPasswordForm />
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
            }
        >
            <ResetPasswordContent />
        </Suspense>
    )
}
