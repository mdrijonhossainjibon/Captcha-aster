'use client'

import { AdminLayout } from '@/components/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Zap, Plus, Download, Upload, ToggleLeft, Trash2, AlertCircle } from 'lucide-react'

export default function ExtensionsPage() {
  const extensions = [
    {
      id: 1,
      name: 'Chrome Extension',
      version: '2.5.0',
      status: 'active',
      downloads: 125430,
      users: 45230,
      rating: 4.8,
      lastUpdate: '2024-01-15',
    },
    {
      id: 2,
      name: 'Firefox Extension',
      version: '2.4.8',
      status: 'active',
      downloads: 78920,
      users: 28450,
      rating: 4.6,
      lastUpdate: '2024-01-12',
    },
    {
      id: 3,
      name: 'Edge Extension',
      version: '2.3.2',
      status: 'maintenance',
      downloads: 34560,
      users: 12340,
      rating: 4.5,
      lastUpdate: '2024-01-08',
    },
  ]

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Extension Management</h1>
            <p className="text-muted-foreground">Manage browser extensions and updates</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" />
            New Extension
          </Button>
        </div>

        <div className="grid gap-6">
          {extensions.map((ext, index) => (
            <Card
              key={ext.id}
              className="border-border hover:border-primary/50 transition-all duration-300"
              style={{
                opacity: 0,
                animation: `slideInUp 0.5s ease-out ${index * 100}ms forwards`,
              }}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-yellow-500/10">
                        <Zap className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{ext.name}</h3>
                        <p className="text-sm text-muted-foreground">v{ext.version}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        ext.status === 'active'
                          ? 'bg-green-500/20 text-green-700'
                          : 'bg-yellow-500/20 text-yellow-700'
                      }`}
                    >
                      {ext.status === 'active' ? 'Active' : 'Maintenance'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 py-4 border-y border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Downloads</p>
                    <p className="text-lg font-semibold text-foreground">{(ext.downloads / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Active Users</p>
                    <p className="text-lg font-semibold text-foreground">{(ext.users / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Rating</p>
                    <p className="text-lg font-semibold text-foreground">{ext.rating}/5.0</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Last Update</p>
                    <p className="text-sm text-foreground">{ext.lastUpdate}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2 flex-1 bg-transparent">
                    <Upload className="w-4 h-4" />
                    Upload Build
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 flex-1 bg-transparent">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <ToggleLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive bg-transparent">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <style>{`
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
    </AdminLayout>
  )
}
