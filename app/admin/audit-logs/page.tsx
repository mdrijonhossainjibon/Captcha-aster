'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Activity, Search, Filter, Download, Eye } from 'lucide-react'

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLog, setSelectedLog] = useState<typeof logs[0] | null>(null)

  const logs = [
    {
      id: 'log_001',
      timestamp: '2024-01-18 14:32:45',
      user: 'admin@example.com',
      action: 'User Created',
      resource: 'User: user_123',
      status: 'Success',
      ipAddress: '192.168.1.100',
      details: 'New user account created with email user@example.com',
    },
    {
      id: 'log_002',
      timestamp: '2024-01-18 14:28:12',
      user: 'admin@example.com',
      action: 'API Key Generated',
      resource: 'API Key: key_prod_456',
      status: 'Success',
      ipAddress: '192.168.1.100',
      details: 'Production API key generated with read/write permissions',
    },
    {
      id: 'log_003',
      timestamp: '2024-01-18 14:15:33',
      user: 'support@example.com',
      action: 'User Modified',
      resource: 'User: user_789',
      status: 'Success',
      ipAddress: '192.168.1.101',
      details: 'User plan upgraded from Professional to Enterprise',
    },
    {
      id: 'log_004',
      timestamp: '2024-01-18 14:00:21',
      user: 'admin@example.com',
      action: 'Security Policy Updated',
      resource: 'Policy: Rate Limiting',
      status: 'Success',
      ipAddress: '192.168.1.100',
      details: 'Rate limit changed from 1000 to 2000 requests per minute',
    },
    {
      id: 'log_005',
      timestamp: '2024-01-18 13:45:55',
      user: 'unknown',
      action: 'Failed Login',
      resource: 'Login Attempt',
      status: 'Failed',
      ipAddress: '203.0.113.45',
      details: 'Multiple failed login attempts detected - potential brute force attack',
    },
    {
      id: 'log_006',
      timestamp: '2024-01-18 13:30:12',
      user: 'admin@example.com',
      action: 'Database Backup',
      resource: 'Database: Production',
      status: 'Success',
      ipAddress: '192.168.1.100',
      details: 'Full database backup completed successfully',
    },
  ]

  const filteredLogs = logs.filter(
    (log) =>
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    return status === 'Success'
      ? 'bg-green-500/20 text-green-700'
      : 'bg-red-500/20 text-red-700'
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Audit Logs</h1>
          <p className="text-muted-foreground">Track all system activities and changes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Events</p>
                <p className="text-3xl font-bold text-foreground">15,234</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                <p className="text-3xl font-bold text-green-500">99.8%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Failed Events</p>
                <p className="text-3xl font-bold text-red-500">28</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Today's Events</p>
                <p className="text-3xl font-bold text-foreground">342</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Audit Log Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by user, action, or resource..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
              <Button variant="outline" className="bg-transparent gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline" className="bg-transparent gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Showing {filteredLogs.length} of {logs.length} events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Timestamp</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Action</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Resource</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-4 text-sm text-muted-foreground font-mono">{log.timestamp}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{log.user}</td>
                      <td className="py-3 px-4 text-sm text-foreground font-medium">{log.action}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{log.resource}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                          className="hover:bg-secondary"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Detail Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Audit Log Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">LOG ID</p>
                    <p className="text-sm font-mono text-foreground">{selectedLog.id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">TIMESTAMP</p>
                    <p className="text-sm text-foreground">{selectedLog.timestamp}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">USER</p>
                    <p className="text-sm text-foreground">{selectedLog.user}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">IP ADDRESS</p>
                    <p className="text-sm font-mono text-foreground">{selectedLog.ipAddress}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">ACTION</p>
                    <p className="text-sm text-foreground">{selectedLog.action}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">RESOURCE</p>
                    <p className="text-sm text-foreground">{selectedLog.resource}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">DETAILS</p>
                    <p className="text-sm text-foreground bg-secondary/50 p-3 rounded-lg">{selectedLog.details}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">STATUS</p>
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedLog.status)}`}>
                      {selectedLog.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setSelectedLog(null)}
                  >
                    Close
                  </Button>
                  <Button className="flex-1 bg-primary hover:bg-primary/90">
                    Export Log
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
