'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  BookOpen,
  Eye as EyeIcon,
  X,
  Archive,
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function DocumentationPage() {
  const [showModal, setShowModal] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const searchParams = useSearchParams()

  const docs = [
    {
      id: 1,
      title: 'Getting Started Guide',
      category: 'Getting Started',
      description: 'Learn how to get started with SparkAI',
      views: 5420,
      status: 'published',
      lastUpdated: '2024-01-18',
      author: 'Admin',
    },
    {
      id: 2,
      title: 'API Integration',
      category: 'API',
      description: 'Complete guide to API integration',
      views: 3210,
      status: 'published',
      lastUpdated: '2024-01-17',
      author: 'Admin',
    },
    {
      id: 3,
      title: 'Billing FAQ',
      category: 'Billing',
      description: 'Frequently asked questions about billing',
      views: 1840,
      status: 'published',
      lastUpdated: '2024-01-16',
      author: 'Admin',
    },
    {
      id: 4,
      title: 'Troubleshooting',
      category: 'Support',
      description: 'Common issues and solutions',
      views: 2670,
      status: 'draft',
      lastUpdated: '2024-01-15',
      author: 'Admin',
    },
    {
      id: 5,
      title: 'Account Settings',
      category: 'Account',
      description: 'Manage your account settings',
      views: 4120,
      status: 'published',
      lastUpdated: '2024-01-14',
      author: 'Admin',
    },
  ]

  const stats = [
    { label: 'Total Articles', value: '24', color: 'bg-blue-500/10', icon: FileText },
    { label: 'Published', value: '20', color: 'bg-green-500/10', icon: BookOpen },
    { label: 'Total Views', value: '17.3K', color: 'bg-purple-500/10', icon: EyeIcon },
    { label: 'Last Updated', value: 'Today', color: 'bg-amber-500/10', icon: Archive },
  ]

  const categories = [
    { name: 'Getting Started', count: 4 },
    { name: 'API', count: 6 },
    { name: 'Billing', count: 3 },
    { name: 'Support', count: 5 },
    { name: 'Account', count: 6 },
  ]

  const filteredDocs = docs.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedDocData = docs.find(d => d.id === selectedDoc)

  return (
    <AdminLayout>
      <Suspense fallback={<Loading />}>
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Documentation</h1>
                  <p className="text-muted-foreground">Manage help and support documentation</p>
                </div>
              </div>
              <Button
                onClick={() => setShowModal(true)}
                className="bg-primary hover:bg-primary/90 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Article
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.color}`}>
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((cat, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left px-4 py-2 rounded-lg hover:bg-secondary/50 transition-colors flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-foreground">{cat.name}</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{cat.count}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Documentation List */}
            <div className="lg:col-span-3">
              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Search documentation..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-0 bg-transparent"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-secondary/30 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">{doc.title}</h3>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  doc.status === 'published'
                                    ? 'bg-green-500/20 text-green-700'
                                    : 'bg-amber-500/20 text-amber-700'
                                }`}
                              >
                                {doc.status}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{doc.category}</span>
                              <span>{doc.views} views</span>
                              <span>Updated {doc.lastUpdated}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedDoc(doc.id)
                                setShowPreview(true)
                              }}
                            >
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Create Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Create New Article</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Article Title</Label>
                    <Input placeholder="Enter article title" />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/50">
                      <option>Getting Started</option>
                      <option>API</option>
                      <option>Billing</option>
                      <option>Support</option>
                      <option>Account</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <textarea
                      placeholder="Brief description of the article"
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/50"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowModal(false)}>
                      Cancel
                    </Button>
                    <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={() => setShowModal(false)}>
                      Create
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Preview Modal */}
          {showPreview && selectedDocData && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-2xl border-border max-h-[80vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-card">
                  <div>
                    <CardTitle>{selectedDocData.title}</CardTitle>
                    <CardDescription>Category: {selectedDocData.category}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground">{selectedDocData.description}</p>
                    <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border">
                      <p className="text-sm">
                        This is a preview of the documentation article. The full content would be displayed here with proper
                        formatting, code examples, and images.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Views: {selectedDocData.views}</span>
                      <span>Author: {selectedDocData.author}</span>
                      <span>Updated: {selectedDocData.lastUpdated}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </Suspense>
    </AdminLayout>
  )
}
