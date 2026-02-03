'use client'

import { AdminLayout } from '@/components/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Check, AlertCircle, Clock, Zap } from 'lucide-react'

export default function UpdatesPage() {
  const updates = [
    {
      id: 1,
      title: 'Chrome Extension v2.5.1',
      version: '2.5.1',
      status: 'scheduled',
      releaseDate: '2024-02-01',
      changes: ['Bug fixes', 'Performance improvements', 'UI tweaks'],
      progress: 45,
    },
    {
      id: 2,
      title: 'API Server v1.8.0',
      version: '1.8.0',
      status: 'deployed',
      releaseDate: '2024-01-28',
      changes: ['New endpoints', 'Better error handling', 'Rate limiting'],
      progress: 100,
    },
    {
      id: 3,
      title: 'Firefox Extension v2.5.0',
      version: '2.5.0',
      status: 'testing',
      releaseDate: '2024-02-05',
      changes: ['Support for new captcha types', 'Enhanced reliability'],
      progress: 75,
    },
    {
      id: 4,
      title: 'Mobile App v1.2.0',
      version: '1.2.0',
      status: 'reviewing',
      releaseDate: '2024-02-10',
      changes: ['iOS support', 'Offline mode', 'New UI'],
      progress: 20,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'bg-green-500/20 text-green-700'
      case 'testing':
        return 'bg-blue-500/20 text-blue-700'
      case 'scheduled':
        return 'bg-purple-500/20 text-purple-700'
      case 'reviewing':
        return 'bg-orange-500/20 text-orange-700'
      default:
        return 'bg-gray-500/20 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed':
        return <Check className="w-4 h-4" />
      case 'testing':
        return <Zap className="w-4 h-4" />
      case 'scheduled':
        return <Clock className="w-4 h-4" />
      case 'reviewing':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <RefreshCw className="w-4 h-4" />
    }
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Updates & Releases</h1>
          <p className="text-muted-foreground">Monitor and manage system updates</p>
        </div>

        <div className="space-y-4">
          {updates.map((update, index) => (
            <Card
              key={update.id}
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
                      <div className="p-2 rounded-lg bg-primary/10">
                        <RefreshCw className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{update.title}</h3>
                        <p className="text-sm text-muted-foreground">Release: {update.releaseDate}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(update.status)}`}>
                      {getStatusIcon(update.status)}
                      {update.status.charAt(0).toUpperCase() + update.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="mb-4 pb-4 border-b border-border">
                  <p className="text-sm font-medium text-foreground mb-2">Changes:</p>
                  <div className="flex flex-wrap gap-2">
                    {update.changes.map((change, i) => (
                      <span key={i} className="px-2 py-1 text-xs rounded bg-secondary text-foreground">
                        {change}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-semibold text-foreground">{update.progress}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${update.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {update.status === 'scheduled' && (
                    <>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Postpone
                      </Button>
                      <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                        Deploy Now
                      </Button>
                    </>
                  )}
                  {update.status === 'testing' && (
                    <>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Cancel
                      </Button>
                      <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                        Approve
                      </Button>
                    </>
                  )}
                  {update.status === 'deployed' && (
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      View Details
                    </Button>
                  )}
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
