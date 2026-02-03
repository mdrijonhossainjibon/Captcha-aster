'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Database, HardDrive, Activity, AlertTriangle, Plus, RefreshCw, Save, RotateCcw, Zap, Download, X } from 'lucide-react'

export default function DatabasePage() {
  const [showBackupModal, setShowBackupModal] = useState(false)
  const [showRestoreModal, setShowRestoreModal] = useState(false)

  const dbStats = [
    { title: 'Total Size', value: '245.5 GB', icon: HardDrive, color: 'bg-blue-500/10', iconColor: 'text-blue-600' },
    { title: 'Tables', value: '48', icon: Database, color: 'bg-purple-500/10', iconColor: 'text-purple-600' },
    { title: 'Active Connections', value: '127', icon: Activity, color: 'bg-green-500/10', iconColor: 'text-green-600' },
    { title: 'Alerts', value: '3', icon: AlertTriangle, color: 'bg-red-500/10', iconColor: 'text-red-600' },
  ]

  const databases = [
    {
      id: 1,
      name: 'production',
      type: 'PostgreSQL',
      host: 'db-prod-01.example.com',
      size: '189.3 GB',
      tables: 42,
      status: 'healthy',
      uptime: '99.99%',
      lastBackup: '2024-01-18 02:30 UTC',
    },
    {
      id: 2,
      name: 'staging',
      type: 'PostgreSQL',
      host: 'db-staging-01.example.com',
      size: '32.1 GB',
      tables: 42,
      status: 'healthy',
      uptime: '99.95%',
      lastBackup: '2024-01-17 14:15 UTC',
    },
    {
      id: 3,
      name: 'analytics',
      type: 'PostgreSQL',
      host: 'db-analytics-01.example.com',
      size: '24.1 GB',
      tables: 6,
      status: 'warning',
      uptime: '98.50%',
      lastBackup: '2024-01-16 03:00 UTC',
    },
  ]

  const recentBackups = [
    { id: 1, database: 'production', size: '187.2 GB', timestamp: '2024-01-18 02:30 UTC', status: 'completed', duration: '45 min' },
    { id: 2, database: 'production', size: '186.8 GB', timestamp: '2024-01-17 02:15 UTC', status: 'completed', duration: '42 min' },
    { id: 3, database: 'staging', size: '31.9 GB', timestamp: '2024-01-17 14:15 UTC', status: 'completed', duration: '12 min' },
    { id: 4, database: 'production', size: '186.5 GB', timestamp: '2024-01-16 02:00 UTC', status: 'completed', duration: '43 min' },
  ]

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 animate-in fade-in duration-500">
          <h1 className="text-4xl font-bold text-foreground mb-2">Database Management</h1>
          <p className="text-muted-foreground">Monitor and manage your database infrastructure</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {dbStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className="border-border hover:border-primary/50 transition-all duration-300 animate-in fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
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

        {/* Database Instances */}
        <Card className="mb-8 border-border animate-in fade-in duration-500" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Database Instances</CardTitle>
                <CardDescription>All connected database servers</CardDescription>
              </div>
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Plus className="w-4 h-4" />
                Add Instance
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Host</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Size</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Tables</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Uptime</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {databases.map((db, index) => (
                    <tr
                      key={db.id}
                      className="border-b border-border hover:bg-secondary/30 transition-colors animate-in fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="py-4 px-4">
                        <p className="font-medium text-foreground">{db.name}</p>
                        <p className="text-sm text-muted-foreground">Last backup: {db.lastBackup}</p>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{db.type}</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{db.host}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-secondary text-foreground">
                          {db.size}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-foreground font-medium">{db.tables}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            db.status === 'healthy'
                              ? 'bg-green-500/20 text-green-700'
                              : 'bg-yellow-500/20 text-yellow-700'
                          }`}
                        >
                          {db.status === 'healthy' ? '✓ Healthy' : '⚠ Warning'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-foreground">{db.uptime}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent"
                            onClick={() => setShowBackupModal(true)}
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent"
                            onClick={() => setShowRestoreModal(true)}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Zap className="w-4 h-4" />
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

        {/* Recent Backups */}
        <Card className="border-border animate-in fade-in duration-500" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Backups</CardTitle>
                <CardDescription>Latest database backups and snapshots</CardDescription>
              </div>
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Download className="w-4 h-4" />
                Create Backup
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBackups.map((backup, index) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors border border-border animate-in fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{backup.database} - {backup.timestamp}</p>
                    <p className="text-sm text-muted-foreground">
                      Size: {backup.size} • Duration: {backup.duration}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        backup.status === 'completed'
                          ? 'bg-green-500/20 text-green-700'
                          : 'bg-blue-500/20 text-blue-700'
                      }`}
                    >
                      {backup.status === 'completed' ? '✓ Completed' : 'In Progress'}
                    </span>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-border/50 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Create Backup</CardTitle>
              <button
                onClick={() => setShowBackupModal(false)}
                className="rounded-lg p-1 hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Database</label>
                <select className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>production</option>
                  <option>staging</option>
                  <option>analytics</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Backup Type</label>
                <select className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Full Backup</option>
                  <option>Incremental Backup</option>
                  <option>Differential Backup</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowBackupModal(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90">
                  Start Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Restore Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-border/50 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Restore Database</CardTitle>
              <button
                onClick={() => setShowRestoreModal(false)}
                className="rounded-lg p-1 hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Select Backup</label>
                <select className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>2024-01-18 02:30 UTC (187.2 GB)</option>
                  <option>2024-01-17 02:15 UTC (186.8 GB)</option>
                  <option>2024-01-16 02:00 UTC (186.5 GB)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Target Database</label>
                <select className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>production</option>
                  <option>staging</option>
                </select>
              </div>
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-700 font-medium">⚠ Warning: This will overwrite the target database</p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowRestoreModal(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1 bg-red-600 hover:bg-red-700">
                  Restore Database
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  )
}
