'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Webhook, Plus, Edit, Trash2, CheckCircle2, AlertCircle, RefreshCw, Copy, Eye, EyeOff } from 'lucide-react'

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState([
    {
      id: 1,
      url: 'https://api.example.com/webhooks/captcha',
      events: ['captcha.solved', 'captcha.failed'],
      status: 'active',
      requests: 5234,
      lastFired: '2 minutes ago',
      failures: 0,
    },
    {
      id: 2,
      url: 'https://app.example.com/api/webhooks',
      events: ['payment.completed', 'payment.failed'],
      status: 'active',
      requests: 1823,
      lastFired: '1 hour ago',
      failures: 2,
    },
    {
      id: 3,
      url: 'https://test.example.com/webhook',
      events: ['user.created', 'user.updated'],
      status: 'inactive',
      requests: 0,
      lastFired: 'Never',
      failures: 0,
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [showSecret, setShowSecret] = useState(false)

  const stats = [
    { label: 'Total Webhooks', value: webhooks.length, color: 'text-blue-600' },
    { label: 'Active', value: webhooks.filter(w => w.status === 'active').length, color: 'text-green-600' },
    { label: 'Failed Events', value: webhooks.reduce((sum, w) => sum + w.failures, 0), color: 'text-red-600' },
    { label: 'Total Requests', value: webhooks.reduce((sum, w) => sum + w.requests, 0).toLocaleString(), color: 'text-purple-600' },
  ]

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Webhooks</h1>
              <p className="text-muted-foreground">Manage webhook endpoints and event subscriptions</p>
            </div>
            <Button className="bg-amber-500 hover:bg-amber-600 gap-2" onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4" />
              Add Webhook
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="border-border/50 bg-secondary/50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <Webhook className={`w-8 h-8 ${stat.color}/60`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Webhooks Table */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Webhook Endpoints</CardTitle>
            <CardDescription>All registered webhook endpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">URL</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Events</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Requests</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Last Fired</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {webhooks.map((webhook) => (
                    <tr key={webhook.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-foreground truncate">{webhook.url}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 flex-wrap">
                          {webhook.events.map((event) => (
                            <span key={event} className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-700">
                              {event}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                          webhook.status === 'active'
                            ? 'bg-green-500/20 text-green-700'
                            : 'bg-gray-500/20 text-gray-700'
                        }`}>
                          {webhook.status === 'active' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {webhook.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-muted-foreground">{webhook.requests.toLocaleString()}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-muted-foreground">{webhook.lastFired}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1 text-destructive hover:text-destructive bg-transparent">
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Webhook Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl border-border/50 shadow-2xl">
            <CardHeader>
              <CardTitle>Add Webhook Endpoint</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Webhook URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/webhooks"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Events</label>
                <div className="grid grid-cols-2 gap-2">
                  {['captcha.solved', 'captcha.failed', 'payment.completed', 'payment.failed', 'user.created', 'user.updated'].map((event) => (
                    <label key={event} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-border" />
                      <span className="text-sm text-foreground">{event}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Webhook Secret</label>
                <div className="relative">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    value="sk_webhook_live_1234567890abcdef"
                    readOnly
                    className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <Button size="sm" variant="ghost" className="absolute right-12 top-1/2 -translate-y-1/2 gap-1 bg-transparent">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-amber-500 hover:bg-amber-600" onClick={() => setShowModal(false)}>
                  Create Webhook
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  )
}
