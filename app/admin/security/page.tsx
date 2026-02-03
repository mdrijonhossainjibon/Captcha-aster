'use client'

import { AdminLayout } from '@/components/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, Lock, AlertTriangle, Eye, EyeOff, Plus, Trash2, RefreshCw, CheckCircle2 } from 'lucide-react'

export default function SecurityPage() {
  const securitySettings = [
    {
      title: 'SSL/TLS Configuration',
      description: 'Manage SSL certificates and encryption',
      status: 'Active',
      statusColor: 'bg-green-500/20 text-green-700',
      details: 'TLS 1.3 Enabled',
    },
    {
      title: 'IP Whitelist',
      description: 'Restrict access to specific IP addresses',
      status: 'Active',
      statusColor: 'bg-green-500/20 text-green-700',
      details: '5 IPs whitelisted',
    },
    {
      title: 'Rate Limiting',
      description: 'Protect against DDoS and brute force attacks',
      status: 'Active',
      statusColor: 'bg-green-500/20 text-green-700',
      details: '1000 req/min per IP',
    },
    {
      title: 'CORS Policy',
      description: 'Control cross-origin resource sharing',
      status: 'Configured',
      statusColor: 'bg-blue-500/20 text-blue-700',
      details: '3 domains allowed',
    },
  ]

  const threats = [
    { type: 'Brute Force Attempts', count: 12, severity: 'Low', timestamp: '2 hours ago' },
    { type: 'Suspicious API Usage', count: 3, severity: 'Medium', timestamp: '30 minutes ago' },
    { type: 'Failed 2FA Attempts', count: 5, severity: 'Low', timestamp: '1 hour ago' },
  ]

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Security</h1>
          <p className="text-muted-foreground">Manage system security settings and protocols</p>
        </div>

        {/* Security Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Security Score</p>
                  <p className="text-3xl font-bold text-foreground">94/100</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Threats Detected</p>
                  <p className="text-3xl font-bold text-foreground">20</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Sessions</p>
                  <p className="text-3xl font-bold text-foreground">847</p>
                </div>
                <Lock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Last Audit</p>
                  <p className="text-sm font-semibold text-foreground">2 hours ago</p>
                </div>
                <RefreshCw className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Security Settings */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security protocols and policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {securitySettings.map((setting, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{setting.title}</h3>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${setting.statusColor}`}>
                      {setting.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{setting.details}</span>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Configure
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Threats */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Threats</CardTitle>
              <CardDescription>Last 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {threats.map((threat, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-foreground text-sm">{threat.type}</h4>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        threat.severity === 'High'
                          ? 'bg-red-500/20 text-red-700'
                          : threat.severity === 'Medium'
                            ? 'bg-yellow-500/20 text-yellow-700'
                            : 'bg-blue-500/20 text-blue-700'
                      }`}
                    >
                      {threat.severity}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {threat.count} {threat.count > 1 ? 'attempts' : 'attempt'} detected
                  </p>
                  <p className="text-xs text-muted-foreground">{threat.timestamp}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Encryption Keys */}
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Encryption Keys</CardTitle>
              <CardDescription>Manage API and system encryption keys</CardDescription>
            </div>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus className="w-4 h-4" />
              Generate New Key
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Key ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Created</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Rotated</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(3)].map((_, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-4 text-sm text-foreground font-mono">key_prod_{idx + 1}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">RSA-2048</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">90 days ago</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">30 days ago</td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="hover:bg-secondary">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-destructive/10 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
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
    </AdminLayout>
  )
}
