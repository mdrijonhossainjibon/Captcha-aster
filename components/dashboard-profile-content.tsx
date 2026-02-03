"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Camera,
  Shield,
  Zap,
  Crown,
  Copy,
  Check,
  Key,
  Bell,
  Lock,
  Globe,
  CreditCard,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const tabs = ["Profile", "Security", "Notifications", "Billing"]

export function DashboardProfileContent() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("Profile")
  const [copied, setCopied] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    company: "SparkTech Inc.",
    timezone: "America/Los_Angeles",
    joinDate: "January 2024",
    plan: "Pro" as const,
    verified: true,
    apiKey: "sk-spark-xxxx-xxxx-xxxx-7d4f",
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    usageWarnings: true,
    weeklyReports: false,
    marketingEmails: false,
    securityAlerts: true,
    apiUpdates: true,
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const copyApiKey = () => {
    navigator.clipboard.writeText("sk-spark-a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setIsEditing(false)
    }, 1500)
  }

  const getPlanIcon = () => {
    switch (profile.plan) {
      case "Enterprise":
        return <Crown className="w-4 h-4" />
      case "Pro":
        return <Zap className="w-4 h-4" />
      default:
        return null
    }
  }

  const getPlanColor = () => {
    switch (profile.plan) {
      case "Enterprise":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      case "Pro":
        return "bg-primary text-primary-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div
          className="mb-8"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease-out",
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <User className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          </div>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-2 mb-8 p-1 bg-secondary/50 rounded-xl w-fit"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease-out",
            transitionDelay: "100ms",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div
            className="lg:col-span-1"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.5s ease-out",
              transitionDelay: "200ms",
            }}
          >
            <div className="relative bg-card border border-border rounded-2xl overflow-hidden">
              {/* Banner */}
              <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/30 to-accent/20 relative">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:200%_100%] animate-shimmer" />
              </div>

              {/* Avatar */}
              <div className="relative px-6">
                <div className="absolute -top-10 left-6">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent p-0.5">
                      <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                        <User className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <Camera className="w-3 h-3" />
                    </button>
                    {profile.verified && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-card">
                        <Shield className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="px-6 pt-14 pb-6">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
                  <Badge className={`${getPlanColor()} gap-1 text-xs`}>
                    {getPlanIcon()}
                    {profile.plan}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{profile.email}</p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {profile.joinDate}</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="p-3 rounded-xl bg-secondary/50 text-center">
                    <p className="text-lg font-bold text-foreground">12.8K</p>
                    <p className="text-xs text-muted-foreground">Requests</p>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/50 text-center">
                    <p className="text-lg font-bold text-foreground">99.2%</p>
                    <p className="text-xs text-muted-foreground">Success</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div
            className="lg:col-span-2 space-y-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.5s ease-out",
              transitionDelay: "300ms",
            }}
          >
            {activeTab === "Profile" && (
              <>
                {/* Personal Info */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                      disabled={isSaving}
                      className="gap-2"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : isEditing ? (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "Full Name", value: profile.name, icon: User },
                      { label: "Email Address", value: profile.email, icon: Mail },
                      { label: "Phone Number", value: profile.phone, icon: Phone },
                      { label: "Location", value: profile.location, icon: MapPin },
                      { label: "Company", value: profile.company, icon: Globe },
                      { label: "Timezone", value: profile.timezone, icon: Calendar },
                    ].map((field) => {
                      const Icon = field.icon
                      return (
                        <div key={field.label} className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">{field.label}</label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                              <Icon className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <input
                              type="text"
                              value={field.value}
                              disabled={!isEditing}
                              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 ${
                                isEditing
                                  ? "bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                                  : "bg-secondary/50 border-transparent"
                              } text-foreground outline-none`}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* API Key */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Key className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">API Key</h3>
                      <p className="text-sm text-muted-foreground">Use this key to authenticate API requests</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                    <code className="flex-1 font-mono text-sm text-foreground">
                      {showApiKey ? "sk-spark-a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6" : profile.apiKey}
                    </code>
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                      {showApiKey ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    <button onClick={copyApiKey} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <RefreshCw className="w-4 h-4" />
                      Regenerate Key
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Security" && (
              <>
                {/* Password */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Lock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Change Password</h3>
                      <p className="text-sm text-muted-foreground">Update your password regularly for security</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                      <div key={label} className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">{label}</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground outline-none transition-all"
                        />
                      </div>
                    ))}
                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                      <Save className="w-4 h-4" />
                      Update Password
                    </Button>
                  </div>
                </div>

                {/* 2FA */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-green-500/10">
                        <Shield className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/10 text-green-500">Enabled</Badge>
                  </div>
                </div>

                {/* Sessions */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <h3 className="font-semibold text-foreground mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    {[
                      { device: "Chrome on MacOS", location: "San Francisco, CA", current: true },
                      { device: "Safari on iPhone", location: "San Francisco, CA", current: false },
                    ].map((session, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground flex items-center gap-2">
                              {session.device}
                              {session.current && (
                                <Badge className="bg-green-500/10 text-green-500 text-xs">Current</Badge>
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">{session.location}</p>
                          </div>
                        </div>
                        {!session.current && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "Notifications" && (
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Notification Preferences</h3>
                    <p className="text-sm text-muted-foreground">Choose what notifications you receive</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: "emailAlerts",
                      label: "Email Alerts",
                      desc: "Get notified about important account activity",
                    },
                    { key: "usageWarnings", label: "Usage Warnings", desc: "Alert when credits are running low" },
                    { key: "weeklyReports", label: "Weekly Reports", desc: "Receive weekly usage summary" },
                    { key: "securityAlerts", label: "Security Alerts", desc: "Get notified about security events" },
                    { key: "apiUpdates", label: "API Updates", desc: "News about API changes and new features" },
                    { key: "marketingEmails", label: "Marketing Emails", desc: "Promotions and special offers" },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))
                        }
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                          notifications[item.key as keyof typeof notifications] ? "bg-primary" : "bg-border"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                            notifications[item.key as keyof typeof notifications] ? "left-7" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Billing" && (
              <>
                {/* Current Plan */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                        <Zap className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-foreground">Pro Plan</h3>
                          <Badge className="bg-primary text-primary-foreground">Active</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">50,000 credits/month - $29/month</p>
                      </div>
                    </div>
                    <Button variant="outline" className="gap-2 bg-transparent">
                      Upgrade Plan
                    </Button>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-card/50">
                      <p className="text-2xl font-bold text-foreground">42,153</p>
                      <p className="text-sm text-muted-foreground">Credits Used</p>
                    </div>
                    <div className="p-4 rounded-xl bg-card/50">
                      <p className="text-2xl font-bold text-foreground">7,847</p>
                      <p className="text-sm text-muted-foreground">Credits Left</p>
                    </div>
                    <div className="p-4 rounded-xl bg-card/50">
                      <p className="text-2xl font-bold text-foreground">15 days</p>
                      <p className="text-sm text-muted-foreground">Until Renewal</p>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Payment Method</h3>
                    <Button variant="outline" size="sm">
                      Add New
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/26</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/10 text-green-500">Default</Badge>
                  </div>
                </div>

                {/* Billing History */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Billing History</h3>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Download className="w-4 h-4" />
                      Export All
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {[
                      { date: "Jan 1, 2026", amount: "$29.00", status: "Paid" },
                      { date: "Dec 1, 2025", amount: "$29.00", status: "Paid" },
                      { date: "Nov 1, 2025", amount: "$29.00", status: "Paid" },
                    ].map((invoice, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Pro Plan - Monthly</p>
                            <p className="text-sm text-muted-foreground">{invoice.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-foreground">{invoice.amount}</span>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Download className="w-4 h-4" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <h3 className="font-semibold text-destructive">Danger Zone</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button
                    variant="outline"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-2 bg-transparent"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
