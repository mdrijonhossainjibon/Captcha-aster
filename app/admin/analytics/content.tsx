'use client'

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function AdminAnalyticsContent() {
  const chartData = [
    { date: "Jan 1", users: 1200, revenue: 2400 },
    { date: "Jan 8", users: 1900, revenue: 3200 },
    { date: "Jan 15", users: 2400, revenue: 4100 },
    { date: "Jan 22", users: 3200, revenue: 5800 },
    { date: "Jan 29", users: 3800, revenue: 6200 },
    { date: "Feb 5", users: 4500, revenue: 7100 },
    { date: "Feb 12", users: 5200, revenue: 8300 },
  ]

  const metrics = [
    { label: "Total Captchas Solved", value: "1.2M", change: "+12.5%" },
    { label: "Average Response Time", value: "2.3s", change: "-0.8s" },
    { label: "Success Rate", value: "98.5%", change: "+0.3%" },
    { label: "API Calls", value: "45.2M", change: "+18.2%" },
  ]

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground">System performance and usage statistics</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
                <p className="text-2xl font-bold text-foreground mb-2">{metric.value}</p>
                <p className="text-xs text-green-600 font-semibold">{metric.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Growth Trends</CardTitle>
            <CardDescription>Last 30 days performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }} />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="var(--color-primary)" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-chart-2)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Captcha Types Distribution</CardTitle>
              <CardDescription>Breakdown by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: "reCAPTCHA v2", count: "42%", color: "bg-blue-500" },
                  { type: "reCAPTCHA v3", count: "28%", color: "bg-purple-500" },
                  { type: "hCaptcha", count: "18%", color: "bg-green-500" },
                  { type: "Others", count: "12%", color: "bg-gray-500" },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{item.type}</span>
                      <span className="text-sm font-bold text-foreground">{item.count}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full`}
                        style={{ width: item.count }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Countries</CardTitle>
              <CardDescription>By number of requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { country: "United States", requests: "245K" },
                  { country: "United Kingdom", requests: "128K" },
                  { country: "Canada", requests: "95K" },
                  { country: "Germany", requests: "87K" },
                  { country: "France", requests: "72K" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="font-medium">{item.country}</span>
                    <span className="text-sm text-muted-foreground">{item.requests}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
