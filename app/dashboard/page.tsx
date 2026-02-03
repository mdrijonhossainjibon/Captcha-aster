"use client"

import { Suspense, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Shield, Zap, Clock, TrendingUp, CheckCircle2, AlertCircle, ArrowUpRight, Sparkles, Bell, Puzzle, Download, Code, Zap as Plugin, User, BarChart3, Package, Key, Copy, RefreshCw, ToggleLeft, ToggleRight, Trash2, Gift, Star, Github, Eye, Wallet, Plus, X, Activity } from "lucide-react"
import Link from "next/link"
import { SkeletonStats, SkeletonGrid } from "@/components/skeletons"


const onboardingTasks = [
  { id: 1, label: "Setup Profile", completed: false, reward: "50" },
  { id: 2, label: "Get API Key", completed: true, reward: "100" },
  { id: 3, label: "Test Solve", completed: false, reward: "75" },
  { id: 4, label: "Install Extension", completed: false, reward: "100" },
  { id: 5, label: "Follow on X", completed: false, reward: "+50 • +200 • +500" },
  { id: 6, label: "Star Github", completed: false, reward: "+100 • +500 • +1000" },
  { id: 7, label: "Review Store", completed: false, reward: "+1000 • +5000 • +10000" },
]

const dailyUsage = {
  used: 847,
  total: 1000,
  percentage: 84.7,
  resetsIn: "4h 23m",
  totalRequests: 847,
  requestsLeft: 153
}

const packageInfo = {
  name: "Premium Plan",
  price: "$49.99/month",
  features: ["10,000 credits/month", "Priority support", "All captcha types", "99.9% uptime"],
  renewDate: "2024-03-15"
}

const apiKeys = [
  { name: "Master Key", key: "pk_live_51H2K3...abc123", status: "active", lastUsed: "2 hours ago" },
  { name: "Slot 2", key: "", status: "empty", lastUsed: "" },
  { name: "Slot 3", key: "", status: "empty", lastUsed: "" },
]

const extensions = [
  { label: "Chrome Extension", href: "/extensions/chrome", icon: Download, description: "Browser extension for Chrome" },
  { label: "Firefox Add-on", href: "/extensions/firefox", icon: Download, description: "Browser extension for Firefox" },
]

const tasks = [
  { id: 1, label: "Create API Key", reward: "+$0.10", completed: true },
  { id: 2, label: "Solve First Captcha", reward: "+$0.05", completed: true },
  { id: 3, label: "Add Funds", reward: "+$0.15", completed: false },
  { id: 4, label: "Get Package", reward: "+$0.20", completed: false },
]

const walletBalance = 0.15

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function DashboardPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [regeneratingKey, setRegeneratingKey] = useState<string | null>(null)
  const [dashboardApiKeys, setDashboardApiKeys] = useState(apiKeys)
  const [autoRenew, setAutoRenew] = useState(true)
  const [activePackage, setActivePackage] = useState<typeof packageInfo | null>(packageInfo)
  const [generatingKey, setGeneratingKey] = useState<string | null>(null)
  const [showAlert, setShowAlert] = useState(true)
  const [walletBalance, setWalletBalance] = useState(0.00)
  const [tasks, setTasks] = useState(onboardingTasks)

  // Get current date and greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const getCurrentDate = () => {
    const date = new Date()
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  const handleCopyKey = async (key: string, keyName: string) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedKey(keyName)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (err) {
      console.error('Failed to copy key:', err)
    }
  }

  const handleRegenerateKey = async (keyName: string) => {
    if (regeneratingKey) return
    setRegeneratingKey(keyName)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Generate new random key
    const newKey = `pk_live_${Math.random().toString(36).substring(2, 15)}...${Math.random().toString(36).substring(2, 8)}`

    setDashboardApiKeys((prev) =>
      prev.map((key) =>
        key.name === keyName
          ? { ...key, key: newKey, lastUsed: "Just now" }
          : key
      )
    )

    setRegeneratingKey(null)
  }

  const handleGenerateKey = async (keyName: string) => {
    if (generatingKey) return
    setGeneratingKey(keyName)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Generate new key
    const newKey = `pk_live_${Math.random().toString(36).substring(2, 15)}...${Math.random().toString(36).substring(2, 8)}`

    setDashboardApiKeys((prev) =>
      prev.map((key) =>
        key.name === keyName
          ? { ...key, name: keyName === "Slot 2" ? "API Key 2" : "API Key 3", key: newKey, status: "active", lastUsed: "Just now" }
          : key
      )
    )

    setGeneratingKey(null)
  }

  const handleDeleteKey = (keyName: string) => {
    setDashboardApiKeys((prev) =>
      prev.map((key) =>
        key.name === keyName
          ? { ...key, name: key.name === "API Key 2" ? "Slot 2" : "Slot 3", key: "", status: "empty", lastUsed: "" }
          : key
      )
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Top Navigation Header */}
        <div className="flex items-center justify-between mb-6 p-4 rounded-2xl bg-card border border-border animate-in fade-in duration-500">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
              <p className="text-xs text-muted-foreground">Captcha Solving Service</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Extensions Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                <Puzzle className="w-4 h-4 text-foreground" />
                <span className="text-sm font-medium text-foreground">Extensions</span>
                <ArrowUpRight className="w-3 h-3 text-muted-foreground group-hover:rotate-45 transition-transform" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 w-64 p-2 rounded-xl bg-card border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                {extensions.map((extension, index: number) => {
                  const Icon = extension.icon
                  return (
                    <Link
                      key={extension.label}
                      href={extension.href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{extension.label}</p>
                        <p className="text-xs text-muted-foreground">{extension.description}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* API Library */}
            <Link href="/extensions/api" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
              <Code className="w-4 h-4 text-foreground" />
              <span className="text-sm font-medium text-foreground">API Library</span>
            </Link>

            {/* Wallet Balance */}
            <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 transition-colors">
              <Wallet className="w-4 h-4 text-foreground" />
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-medium text-foreground">${walletBalance.toFixed(2)}</span>
                <span className="text-xs text-muted-foreground">USD</span>
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Profile Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Greeting Header */}
        <div className="animate-in fade-in duration-500">
          <h1 className="text-3xl font-bold text-foreground mb-1">
            {getGreeting()}, <span className="text-primary">bdsonghd33</span>
          </h1>
          <p className="text-sm text-muted-foreground">{getCurrentDate()}</p>
        </div>

        {/* Onboarding Rewards Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 p-4 animate-in slide-in-from-top duration-500">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 rounded-bl-full"></div>
          <div className="absolute top-2 right-2 px-2 py-1 bg-primary rounded-lg text-xs font-bold text-white rotate-12">
            NEW
          </div>

          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/20">
              <Gift className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">ONBOARDING REWARDS</h3>
              <p className="text-xs text-muted-foreground">
                {tasks.filter(t => t.completed).length}/{tasks.length} • Rewards soon
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => {
                  if (!task.completed) {
                    setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: true } : t))
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${task.completed
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                  : 'bg-secondary/50 border border-border hover:border-primary/30 text-foreground hover:scale-105'
                  }`}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-muted-foreground"></div>
                )}
                <span className="text-sm font-medium">{task.label}</span>
                <span className="text-xs text-primary font-bold">
                  {task.completed ? '✓' : task.reward}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Low Balance Alert */}
        {showAlert && (
          <div className="relative rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 p-4 animate-in slide-in-from-top duration-500">
            <button
              onClick={() => setShowAlert(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            <div className="flex items-center justify-between pr-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    Low Balance Alert
                    <Star className="w-4 h-4 text-yellow-500" />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your balance is <span className="font-bold text-yellow-500">${walletBalance.toFixed(2)}</span>. Top up now to avoid service interruptions.
                  </p>
                </div>
              </div>

              <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold transition-all hover:scale-105 flex items-center gap-2">
                Add Funds
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Usage */}
          <Suspense fallback={<SkeletonGrid />}>
            <div
              className="p-6 rounded-2xl bg-card border border-border animate-in fade-in duration-500 hover:border-primary/30 transition-colors"
              style={{ animationDelay: '100ms' }}
            >
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-1">Daily Usage</h2>
              </div>

              <div className="space-y-6">
                {/* Circular Progress */}
                <div className="flex items-center justify-center">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-secondary"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - dailyUsage.percentage / 100)}`}
                        className="transition-all duration-1000"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="hsl(var(--primary))" />
                          <stop offset="100%" stopColor="hsl(var(--accent))" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Activity className="w-12 h-12 text-primary animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground uppercase tracking-wide">Total Requests</span>
                    <span className="text-lg font-bold text-foreground">{dailyUsage.totalRequests}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary uppercase tracking-wide">Requests Left</span>
                    <span className="text-lg font-bold text-primary">{dailyUsage.requestsLeft}</span>
                  </div>
                </div>
              </div>
            </div>
          </Suspense>

          {/* Package / Subscription */}
          <Suspense fallback={<SkeletonGrid />}>
            {activePackage ? (
              <div
                className="p-5 rounded-2xl bg-card border border-border animate-in fade-in duration-500 hover:border-primary/30 transition-colors"
                style={{ animationDelay: '200ms' }}
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-foreground">Package</h3>
                      <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAutoRenew(prev => !prev)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                        title={autoRenew ? 'Auto Renew: On' : 'Auto Renew: Off'}
                      >
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Auto Renew</span>
                        {autoRenew ? (
                          <ToggleRight className="w-4 h-4 text-green-500" />
                        ) : (
                          <ToggleLeft className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                      <button
                        onClick={() => setActivePackage(null)}
                        className="p-2 rounded-lg hover:bg-red-500/10 transition-colors group"
                        title="Delete Package"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-red-500" />
                      </button>
                    </div>
                  </div>

                  {/* Package Code and Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-foreground">D02C</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{activePackage.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">{activePackage.price.split('/')[0]}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">per month</p>
                    </div>
                  </div>

                  {/* Usage Stats Cards */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-lg bg-secondary/30 border border-border">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Zap className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs text-muted-foreground">Credits</span>
                      </div>
                      <p className="text-sm font-bold text-foreground">6,500</p>
                      <p className="text-xs text-muted-foreground">remaining</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-secondary/30 border border-border">
                      <div className="flex items-center gap-1.5 mb-1">
                        <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-xs text-muted-foreground">Used</span>
                      </div>
                      <p className="text-sm font-bold text-foreground">3,500</p>
                      <p className="text-xs text-muted-foreground">this month</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-secondary/30 border border-border">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Activity className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs text-muted-foreground">Uptime</span>
                      </div>
                      <p className="text-sm font-bold text-foreground">99.9%</p>
                      <p className="text-xs text-muted-foreground">guaranteed</p>
                    </div>
                  </div>

                  {/* Package Features */}
                  <div className="grid grid-cols-2 gap-2">
                    {activePackage.features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center gap-1.5 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground truncate">{feature}</span>
                      </div>
                    ))}
                  </div>

              
              

                  {/* Active Plan Progress */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">Usage This Month</span>
                      <span className="text-xs font-medium text-foreground">35% used</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-1">
                    <button className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/50 hover:bg-secondary text-foreground font-semibold transition-all hover:scale-[1.02]">
                      RENEW
                    </button>
                    <button className="flex-1 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all hover:scale-[1.02]">
                      UPGRADE
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="p-6 rounded-2xl bg-card border border-border animate-in fade-in duration-500 hover:border-primary/30 transition-colors flex items-center justify-center"
                style={{ animationDelay: '200ms' }}
              >
                <div className="text-center py-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-secondary/50">
                      <Package className="w-12 h-12 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Package Found</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                    You don't have an active subscription package yet.
                  </p>
                  <button
                    onClick={() => setActivePackage(packageInfo)}
                    className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all hover:scale-105"
                  >
                    Get Package
                  </button>
                </div>
              </div>
            )}
          </Suspense>

          {/* API Keys with Suspense */}
          <Suspense fallback={<SkeletonGrid />}>
            <div
              className="p-6 rounded-2xl bg-card border border-border animate-in fade-in duration-500"
              style={{ animationDelay: '400ms' }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10">
                    <Key className="w-5 h-5 text-blue-500" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">API Keys</h2>
                </div>
                <Link href="/dashboard/api-keys" className="text-sm text-primary hover:underline flex items-center gap-1">
                  Manage <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-3">
                {dashboardApiKeys.map((key, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl transition-colors ${key.status === 'empty' ? 'bg-secondary/30 border border-dashed border-border' : 'bg-secondary/50 hover:bg-secondary'}`}
                  >
                    {key.status === 'empty' ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Empty slot</p>
                        </div>
                        <button
                          onClick={() => handleGenerateKey(key.name)}
                          disabled={generatingKey === key.name}
                          className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {generatingKey === key.name ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Key className="w-3 h-3" />
                              Generate Key
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{key.name}</p>
                            {key.name === "Master Key" && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">Master</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${key.status === 'active'
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-gray-500/10 text-gray-500'
                              }`}>
                              {key.status}
                            </span>
                            <button
                              onClick={() => handleRegenerateKey(key.name)}
                              disabled={regeneratingKey === key.name}
                              className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors group disabled:opacity-50"
                              title="Regenerate API key"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground group-hover:text-primary ${regeneratingKey === key.name ? 'animate-spin' : ''}`} />
                            </button>
                            {key.name !== "Master Key" && (
                              <button
                                onClick={() => handleDeleteKey(key.name)}
                                className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors group"
                                title="Delete API key"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-muted-foreground group-hover:text-red-500" />
                              </button>
                            )}
                            <button
                              onClick={() => handleCopyKey(key.key, key.name)}
                              className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors group"
                              title="Copy API key"
                            >
                              {copiedKey === key.name ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
                              )}
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono mb-1">{key.key}</p>


                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Suspense>
        </div>


      </div>

      <style>{`
        /* Hide scrollbar but keep functionality */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

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
    </DashboardLayout>
  )
}
