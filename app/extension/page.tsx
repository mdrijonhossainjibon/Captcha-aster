import { ExtensionHeader } from "@/components/extension-header"
import { ExtensionStats } from "@/components/extension-stats"
import { ExtensionCaptchaServices } from "@/components/extension-captcha-services"

export default function ExtensionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50/50 to-orange-50/30 flex items-center justify-center p-4">
      {/* Extension popup container */}
      <div className="w-[360px] bg-white border border-yellow-100/40 rounded-2xl shadow-lg overflow-hidden">
        <ExtensionHeader />
        
        {/* Stats section with subtle background */}
        <div className="bg-gradient-to-b from-yellow-50/60 to-orange-50/40 border-b border-yellow-100/30">
          <ExtensionStats />
        </div>

        <ExtensionCaptchaServices />

        {/* Footer */}
        <div className="px-4 py-3 border-t border-yellow-100/30 bg-yellow-50/40">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-orange-600">
              Powered by <span className="font-semibold">CaptchaSolver AI</span>
            </p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-green-600 font-medium">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
