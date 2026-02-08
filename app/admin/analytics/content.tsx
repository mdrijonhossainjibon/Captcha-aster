'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Loader2, RefreshCw } from "lucide-react"
import { message } from "antd"

interface ChartDataPoint {
  date: string
  requests: number
  users: number
  successRate: string
}

interface Metric {
  value: string
  change: string
}

interface Metrics {
  totalCaptchas: Metric
  avgResponseTime: Metric
  successRate: Metric
  apiCalls: Metric
  totalRevenue: Metric
  activeApiKeys: Metric
}

interface Country {
  country: string
  requests: number
}

interface CaptchaType {
  type: string
  count: number
  color: string
}

export default function AdminAnalyticsContent() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [metrics, setMetrics] = useState<Metrics>({
    totalCaptchas: { value: '0', change: '+0%' },
    avgResponseTime: { value: '0s', change: '0s' },
    successRate: { value: '0%', change: '+0%' },
    apiCalls: { value: '0', change: '+0%' },
    totalRevenue: { value: '$0.00', change: '+0%' },
    activeApiKeys: { value: '0', change: '+0' }
  })
  const [topCountries, setTopCountries] = useState<Country[]>([])
  const [captchaTypes, setCaptchaTypes] = useState<CaptchaType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    fetchAnalytics()
  }, [days])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/analytics?days=${days}`)
      const data = await response.json()

      if (data.success) {
        setChartData(data.chartData)
        setMetrics(data.metrics)
        setTopCountries(data.topCountries)
        setCaptchaTypes(data.captchaTypes)
      } else {
        message.error(data.error || 'Failed to fetch analytics')
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      message.error('Failed to fetch analytics')
    } finally {
      setIsLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const metricsList = [
    { label: "Total Captchas Solved", data: metrics.totalCaptchas },
    { label: "Average Response Time", data: metrics.avgResponseTime },
    { label: "Success Rate", data: metrics.successRate },
    { label: "API Calls", data: metrics.apiCalls },
  ]

  return (
    <div>
      {/* Filter Controls */}
      <div className="flex items-center justify-end gap-3 mb-6">
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-3 py-2 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchAnalytics}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {metricsList.map((metric, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
                  <p className="text-2xl font-bold text-foreground mb-2">{metric.data.value}</p>
                  <p className={`text-xs font-semibold ${metric.data.change.startsWith('+') || metric.data.change.startsWith('-') && !metric.data.change.includes('s') ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {metric.data.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Growth Trends</CardTitle>
              <CardDescription>Performance over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="requests"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Requests"
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      name="New Users"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No data available for the selected period
                </div>
              )}
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
                  {captchaTypes.map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{item.type}</span>
                        <span className="text-sm font-bold text-foreground">{item.count}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full transition-all`}
                          style={{ width: `${item.count}%` }}
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
                  {topCountries.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="font-medium">{item.country}</span>
                      <span className="text-sm text-muted-foreground">{formatNumber(item.requests)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground mb-2">{metrics.totalRevenue.value}</p>
                <p className="text-xs text-green-600 font-semibold">{metrics.totalRevenue.change}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">Active API Keys</p>
                <p className="text-2xl font-bold text-foreground mb-2">{metrics.activeApiKeys.value}</p>
                <p className="text-xs text-green-600 font-semibold">{metrics.activeApiKeys.change}</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
