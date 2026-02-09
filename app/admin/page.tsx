import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, DollarSign, CreditCard, TrendingUp, TrendingDown, Cpu, HardDrive, MemoryStick, Clock, Thermometer } from "lucide-react"
import { SkeletonStats } from "@/components/skeletons";

import { headers } from "next/headers"


async function fetchDashboardStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const headerList = await headers()

    const res = await fetch(`${baseUrl}/api/admin/dashboard-stats`, {
      cache: 'no-store',
      headers: {
        'Cookie': headerList.get('cookie') || ''
      }
    })

    if (!res.ok) {
      throw new Error('Failed to fetch dashboard stats')
    }

    return await res.json()
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return null
  }
}

async function AdminStats() {
  const data = await fetchDashboardStats();

  if (!data || !data.success) {
    return <div className="text-center text-muted-foreground py-8">Failed to load statistics</div>
  }

  const { stats } = data

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.value.toLocaleString(),
      change: stats.totalUsers.change,
      trend: stats.totalUsers.trend,
      icon: Users,
      color: "bg-blue-500/10",
      iconColor: "text-blue-600"
    },
    {
      title: "Active Packages",
      value: stats.activePackages.value.toLocaleString(),
      change: stats.activePackages.change,
      trend: stats.activePackages.trend,
      icon: Package,
      color: "bg-green-500/10",
      iconColor: "text-green-600"
    },
    {
      title: "Revenue (30d)",
      value: `$${stats.revenue.monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: stats.revenue.change,
      trend: stats.revenue.trend,
      icon: DollarSign,
      color: "bg-purple-500/10",
      iconColor: "text-purple-600"
    },
    {
      title: "Total Deposits",
      value: stats.totalDeposits.value.toLocaleString(),
      change: stats.totalDeposits.change,
      trend: stats.totalDeposits.trend,
      icon: CreditCard,
      color: "bg-orange-500/10",
      iconColor: "text-orange-600"
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-in fade-in duration-500">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown
        const trendColor = stat.trend === 'up' ? 'text-green-600' : 'text-red-600'

        return (
          <Card
            key={index}
            className="border-border hover:border-primary/50 transition-all duration-300 animate-in fade-in duration-500"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                <span className={`text-sm font-medium ${trendColor}`}>{stat.change}</span>
                <span className="text-xs text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default async function AdminDashboard() {
 
  
  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Command Center</h1>
          <p className="text-muted-foreground mt-1">Real-time system oversight and financial operations.</p>
        </div>
        <div className="flex items-center gap-2 bg-secondary/30 p-1.5 rounded-lg border border-border/40 backdrop-blur-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-background/50 border border-border/40 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-green-600">Live Feedback</span>
          </div>
          <div className="px-3 py-1.5">
            <span className="text-xs font-medium text-muted-foreground">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Layer: Primary Stats - Spanning all 12 columns */}
        <div className="lg:col-span-12">
          <Suspense fallback={<SkeletonStats />}>
            <AdminStats />
          </Suspense>
        </div>

        {/* Main Layer: Bento Grid Content */}
        {/* Left Side: high volume info (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          <Suspense fallback={<div className="h-[500px] w-full bg-card/20 rounded-xl animate-pulse" />}>
            <AdminFinancialStream />
          </Suspense>
        </div>

        {/* Right Side: Monitoring & System (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          <Suspense fallback={<div className="h-[500px] w-full bg-card/20 rounded-xl animate-pulse" />}>
            <AdminSystemMetrics />
          </Suspense>
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

async function AdminFinancialStream() {
  const data = await fetchDashboardStats()
  if (!data || !data.success) return null
  const { recentDeposits } = data

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
      case 'failed': return 'bg-red-500/10 text-red-600 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  return (
    <Card className="h-full border-border/40 bg-card/50 backdrop-blur-md shadow-xl overflow-hidden animate-in fade-in slide-in-from-left-4 duration-700">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-muted/30 px-6 py-5">
        <div>
          <CardTitle className="text-xl font-bold tracking-tight">Financial Stream</CardTitle>
          <CardDescription className="text-xs font-medium uppercase tracking-widest mt-1 opacity-70">Global Transaction Ledger</CardDescription>
        </div>
        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
          <DollarSign className="w-5 h-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {recentDeposits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <Clock className="w-12 h-12 mb-4 opacity-10" />
            <p className="font-medium">No active settlement traces found</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {recentDeposits.map((deposit: any, i: number) => (
              <div
                key={deposit.id}
                className="group flex items-center justify-between px-6 py-4 hover:bg-primary/[0.02] transition-colors cursor-default"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border font-bold text-xs ${deposit.status === 'completed' ? 'bg-green-500/5 border-green-500/20 text-green-600' : 'bg-yellow-500/5 border-yellow-500/20 text-yellow-600'}`}>
                    {deposit.user.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-sm group-hover:text-primary transition-colors">{deposit.user}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-muted-foreground">{deposit.email}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="text-[11px] text-muted-foreground/70">{new Date(deposit.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-black text-base text-foreground tracking-tight">${deposit.amount.toFixed(2)}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">USD Settlement</p>
                  </div>
                  <span className={`min-w-[80px] text-center px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${getStatusColor(deposit.status)}`}>
                    {deposit.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

async function AdminSystemMetrics() {
  const data = await fetchDashboardStats()
  if (!data || !data.success) return null
  const { systemMetrics } = data

  const getSystemStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return { bg: 'bg-green-500/10', text: 'text-green-600', bar: 'bg-green-500', glow: 'shadow-[0_0_10px_rgba(34,197,94,0.3)]' }
      case 'warning': return { bg: 'bg-yellow-500/10', text: 'text-yellow-600', bar: 'bg-yellow-500', glow: 'shadow-[0_0_10px_rgba(234,179,8,0.3)]' }
      case 'critical': return { bg: 'bg-red-500/10', text: 'text-red-600', bar: 'bg-red-500', glow: 'shadow-[0_0_10px_rgba(239,68,68,0.3)]' }
      default: return { bg: 'bg-gray-500/10', text: 'text-gray-600', bar: 'bg-gray-400', glow: '' }
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-right-4 duration-700">
      {/* Processor Module */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden group hover:border-primary/40 transition-all duration-300">
        <div className="h-1 w-full bg-blue-500/10 overflow-hidden">
          <div className="h-full bg-blue-500 w-1/3 animate-[progress_3s_infinite_linear]" />
        </div>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Compute Core</p>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-blue-500" /> System Processor
              </h3>
            </div>
            <div className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${getSystemStatusColor(systemMetrics.cpu.status).bg} ${getSystemStatusColor(systemMetrics.cpu.status).text} border border-current/20`}>
              {systemMetrics.cpu.status}
            </div>
          </div>

          <div className="flex items-center gap-6 mb-4">
            <div className="flex-1">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tighter text-foreground">{systemMetrics.cpu.usage}</span>
                <span className="text-lg font-bold text-muted-foreground">%</span>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{systemMetrics.cpu.cores} THREADS ACTIVE</p>
            </div>
            <div className="h-12 w-[1px] bg-border/40" />
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5 text-blue-600 font-black">
                <Thermometer className="w-4 h-4" />
                <span className="text-xl tracking-tight">{systemMetrics.cpu.temp}°</span>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">THERMAL PKG</p>
            </div>
          </div>

          <div className="w-full bg-secondary/50 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${getSystemStatusColor(systemMetrics.cpu.status).bar} ${getSystemStatusColor(systemMetrics.cpu.status).glow}`}
              style={{ width: `${systemMetrics.cpu.usage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Memory Module */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden group hover:border-primary/40 transition-all duration-300">
        <div className="h-1 w-full bg-purple-500/10 overflow-hidden">
          <div className="h-full bg-purple-500 w-1/4 animate-[progress_5s_infinite_linear]" />
        </div>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Volatile Pool</p>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <MemoryStick className="w-3.5 h-3.5 text-purple-500" /> Random Access
              </h3>
            </div>
            <div className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${getSystemStatusColor(systemMetrics.memory.status).bg} ${getSystemStatusColor(systemMetrics.memory.status).text} border border-current/20`}>
              {systemMetrics.memory.status}
            </div>
          </div>

          <div className="flex items-center gap-6 mb-4">
            <div className="flex-1">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tighter text-foreground">{systemMetrics.memory.usage}</span>
                <span className="text-lg font-bold text-muted-foreground">%</span>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{systemMetrics.memory.used}GB OF {systemMetrics.memory.total}GB</p>
            </div>
            <div className="h-12 w-[1px] bg-border/40" />
            <div className="text-right">
              <div className="text-xl font-black tracking-tight text-purple-600 uppercase italic">Active</div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">SWAP ENABLED</p>
            </div>
          </div>

          <div className="w-full bg-secondary/50 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${getSystemStatusColor(systemMetrics.memory.status).bar} ${getSystemStatusColor(systemMetrics.memory.status).glow}`}
              style={{ width: `${systemMetrics.memory.usage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Persistence Module */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden group hover:border-primary/40 transition-all duration-300">
        <div className="h-1 w-full bg-emerald-500/10 overflow-hidden">
          <div className="h-full bg-emerald-500 w-1/2 animate-[progress_8s_infinite_linear]" />
        </div>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Storage Array</p>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <HardDrive className="w-3.5 h-3.5 text-emerald-500" /> Non-Volatile Space
              </h3>
            </div>
            <div className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${getSystemStatusColor(systemMetrics.storage.status).bg} ${getSystemStatusColor(systemMetrics.storage.status).text} border border-current/20`}>
              {systemMetrics.storage.status}
            </div>
          </div>

          <div className="flex items-center gap-6 mb-4">
            <div className="flex-1">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tighter text-foreground">{systemMetrics.storage.usage}</span>
                <span className="text-lg font-bold text-muted-foreground">%</span>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">NVME SSD CAPACITY</p>
            </div>
            <div className="h-12 w-[1px] bg-border/40" />
            <div className="text-right">
              <div className="text-xl font-black tracking-tight text-emerald-600 uppercase italic underline decoration-2 underline-offset-4">R-Safe</div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Redundancy OK</p>
            </div>
          </div>

          <div className="w-full bg-secondary/50 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${getSystemStatusColor(systemMetrics.storage.status).bar} ${getSystemStatusColor(systemMetrics.storage.status).glow}`}
              style={{ width: `${systemMetrics.storage.usage}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

