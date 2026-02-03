import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

export const metadata = {
  title: "Admin Settings",
  description: "System configuration and settings",
}

export default function AdminSettings() {
  const sections = [
    {
      title: "General",
      settings: [
        { label: "Platform Name", value: "SparkAI" },
        { label: "Support Email", value: "support@sparkai.com" },
        { label: "Max API Rate Limit", value: "1000 req/min" },
      ],
    },
    {
      title: "Security",
      settings: [
        { label: "2FA Required", value: "Enabled", toggle: true },
        { label: "IP Whitelist", value: "Disabled", toggle: true },
        { label: "Session Timeout", value: "30 minutes" },
      ],
    },
    {
      title: "Integrations",
      settings: [
        { label: "Stripe Integration", value: "Connected", status: true },
        { label: "Webhook Verification", value: "Enabled", toggle: true },
        { label: "Analytics Tracking", value: "Enabled", toggle: true },
      ],
    },
  ]

  return (
    <AdminLayout>
      <div className="p-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings and integrations</p>
        </div>

        {/* Settings sections */}
        <div className="space-y-6">
          {sections.map((section, sectionIndex) => (
            <Card
              key={sectionIndex}
              style={{
                opacity: 0,
                animation: `slideInUp 0.5s ease-out ${sectionIndex * 100}ms forwards`,
              }}
            >
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {section.settings.map((setting, settingIndex) => (
                    <div key={settingIndex} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">{setting.label}</label>
                        <p className="text-xs text-muted-foreground">
                          {typeof setting.value === "string" ? setting.value : ""}
                        </p>
                      </div>

                      {setting.toggle ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                        </label>
                      ) : setting.status !== undefined ? (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/10 text-green-700">
                          Connected
                        </span>
                      ) : (
                        <input
                          type="text"
                          defaultValue={setting.value}
                          className="px-3 py-1 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Danger Zone */}
          <Card className="border-red-200/50">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50/50 border border-red-200/50 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-3">Clear all cache</p>
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent">
                  Clear Cache
                </Button>
              </div>
              <div className="p-4 bg-red-50/50 border border-red-200/50 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-3">Database maintenance</p>
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent">
                  Run Maintenance
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save button */}
          <div className="flex justify-end gap-4">
            <Button variant="outline">Cancel</Button>
            <Button className="gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </AdminLayout>
  )
}
