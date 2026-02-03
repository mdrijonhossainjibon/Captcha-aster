import { Suspense } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, CreditCard, AlertTriangle } from "lucide-react"
import { SkeletonStats, SkeletonGrid } from "@/components/skeletons"

export const metadata = {
  title: "Admin Dashboard",
  description: "SparkAI Admin Control Panel",
}

async function AdminStats() {
  await new Promise((resolve) => setTimeout(resolve, 600))
  
  const stats = [
    { title: "Total Users", value: "12,543", icon: Users, color: "bg-blue-500/10", iconColor: "text-blue-600" },
    { title: "Active Sessions", value: "2,847", icon: BarChart3, color: "bg-green-500/10", iconColor: "text-green-600" },
    { title: "Revenue (30d)", value: "$45,230", icon: CreditCard, color: "bg-purple-500/10", iconColor: "text-purple-600" },
    { title: "System Alerts", value: "5", icon: AlertTriangle, color: "bg-red-500/10", iconColor: "text-red-600" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-in fade-in duration-500">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={index}
            className="border-border hover:border-primary/50 transition-all duration-300 animate-in fade-in duration-500"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

async function AdminContent() {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500" style={{ animationDelay: '200ms' }}>
      {/* Recent Activity */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Last 10 system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0 animate-in fade-in duration-300" style={{ animationDelay: `${i * 50}ms` }}>
                <div>
                  <p className="font-medium text-foreground">User Action {i + 1}</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current health</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">API Server</span>
              <span className="px-2 py-1 text-xs font-semibold rounded bg-green-500/20 text-green-700">Healthy</span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: "95%" }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Database</span>
              <span className="px-2 py-1 text-xs font-semibold rounded bg-green-500/20 text-green-700">Healthy</span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: "88%" }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cache</span>
              <span className="px-2 py-1 text-xs font-semibold rounded bg-yellow-500/20 text-yellow-700">Degraded</span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "65%" }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 animate-in fade-in duration-500">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your system overview.</p>
        </div>

        {/* Stats Grid with Suspense */}
        <Suspense fallback={<SkeletonStats />}>
          <AdminStats />
        </Suspense>

        {/* Main sections with Suspense */}
        <Suspense fallback={<SkeletonGrid />}>
          <AdminContent />
        </Suspense>
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
