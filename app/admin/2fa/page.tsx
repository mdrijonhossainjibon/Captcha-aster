'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, Smartphone, Check, AlertCircle, ToggleLeft as Toggle2, RefreshCw, Trash2, Plus } from 'lucide-react'

export default function TwoFAManagementPage() {
  const [showModal, setShowModal] = useState(false)
  const [users2FA, setUsers2FA] = useState([
    {
      id: 1,
      user: 'John Doe',
      email: 'john@example.com',
      method: 'Authenticator App',
      status: 'enabled',
      enabledDate: '2024-01-15',
      lastUsed: '2024-01-18 10:30',
      backupCodes: 5,
    },
    {
      id: 2,
      user: 'Jane Smith',
      email: 'jane@example.com',
      method: 'SMS',
      status: 'enabled',
      enabledDate: '2024-01-10',
      lastUsed: '2024-01-17 15:45',
      backupCodes: 8,
    },
    {
      id: 3,
      user: 'Alex Johnson',
      email: 'alex@example.com',
      method: 'Email',
      status: 'enabled',
      enabledDate: '2024-01-05',
      lastUsed: '2024-01-18 09:15',
      backupCodes: 10,
    },
    {
      id: 4,
      user: 'Sarah Williams',
      email: 'sarah@example.com',
      method: 'None',
      status: 'disabled',
      enabledDate: null,
      lastUsed: null,
      backupCodes: 0,
    },
  ])

  const enabledCount = users2FA.filter((u) => u.status === 'enabled').length
  const disabledCount = users2FA.filter((u) => u.status === 'disabled').length
  const authenticatorCount = users2FA.filter((u) => u.method === 'Authenticator App').length

  const stats = [
    { label: '2FA Enabled', value: enabledCount, icon: Check, color: 'bg-green-500/10', iconColor: 'text-green-600' },
    { label: '2FA Disabled', value: disabledCount, icon: AlertCircle, color: 'bg-red-500/10', iconColor: 'text-red-600' },
    { label: 'Authenticator App', value: authenticatorCount, icon: Smartphone, color: 'bg-blue-500/10', iconColor: 'text-blue-600' },
    {
      label: 'Compliance',
      value: `${Math.round((enabledCount / users2FA.length) * 100)}%`,
      icon: Shield,
      color: 'bg-purple-500/10',
      iconColor: 'text-purple-600',
    },
  ]

  const getMethodBadge = (method: string) => {
    const colors: Record<string, string> = {
      'Authenticator App': 'bg-blue-500/20 text-blue-700',
      SMS: 'bg-green-500/20 text-green-700',
      Email: 'bg-amber-500/20 text-amber-700',
      None: 'bg-gray-500/20 text-gray-700',
    }
    return colors[method] || 'bg-gray-500/20 text-gray-700'
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">2FA Management</h1>
              <p className="text-muted-foreground">Manage two-factor authentication settings for users</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Plus className="w-4 h-4" />
              Enable 2FA Policy
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="border-border/50 bg-secondary/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
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
        </div>

        {/* Users 2FA Table */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>User 2FA Status</CardTitle>
            <CardDescription>View and manage 2FA settings for all users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Method</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Backup Codes</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Last Used</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users2FA.map((user, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-foreground">{user.user}</td>
                      <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getMethodBadge(user.method)}`}>
                          {user.method}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'enabled'
                              ? 'bg-green-500/20 text-green-700'
                              : 'bg-red-500/20 text-red-700'
                          }`}
                        >
                          {user.status === 'enabled' ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-foreground font-medium">{user.backupCodes}</td>
                      <td className="py-3 px-4 text-muted-foreground">{user.lastUsed || '-'}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 2FA Methods Configuration */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Authenticator App', enabled: true, users: authenticatorCount },
            { name: 'SMS', enabled: true, users: 2 },
            { name: 'Email', enabled: true, users: 1 },
          ].map((method, index) => (
            <Card key={index} className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">{method.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Active Users</p>
                  <p className="text-3xl font-bold text-foreground">{method.users}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Toggle2 className={`w-5 h-5 ${method.enabled ? 'text-green-600' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${method.enabled ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {method.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <Button variant="outline" className="w-full bg-transparent border-border hover:bg-secondary/50">
                  Configure
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
