'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Mail,
  Plus,
  Edit,
  Trash2,
  Eye,
  Send,
  Copy,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'

export default function EmailPage() {
  const [showModal, setShowModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  const templates = [
    {
      id: 1,
      name: 'Welcome Email',
      description: 'Sent when a new user signs up',
      subject: 'Welcome to SparkAI!',
      status: 'active',
      lastModified: '2024-01-15',
      sent: 12543,
      openRate: 42.5,
    },
    {
      id: 2,
      name: 'Password Reset',
      description: 'Password recovery email',
      subject: 'Reset Your Password',
      status: 'active',
      lastModified: '2024-01-10',
      sent: 3421,
      openRate: 68.2,
    },
    {
      id: 3,
      name: 'OTP Verification',
      description: 'One-time password for 2FA',
      subject: 'Your Verification Code',
      status: 'active',
      lastModified: '2024-01-18',
      sent: 45230,
      openRate: 95.1,
    },
    {
      id: 4,
      name: 'Payment Confirmation',
      description: 'Sent after successful payment',
      subject: 'Payment Received',
      status: 'active',
      lastModified: '2024-01-12',
      sent: 8765,
      openRate: 71.3,
    },
    {
      id: 5,
      name: 'Invoice',
      description: 'Monthly billing invoice',
      subject: 'Your Invoice for January',
      status: 'active',
      lastModified: '2024-01-08',
      sent: 5432,
      openRate: 58.7,
    },
    {
      id: 6,
      name: 'Account Suspended',
      description: 'Notification of account suspension',
      subject: 'Account Suspended',
      status: 'inactive',
      lastModified: '2023-12-20',
      sent: 234,
      openRate: 89.2,
    },
  ]

  const handleCopyTemplate = (templateId: number) => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-4xl font-bold text-foreground">Email Templates</h1>
              </div>
              <p className="text-muted-foreground">Manage and customize your email templates</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 gap-2" onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4" />
              New Template
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-border/50 bg-secondary/50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Templates</p>
                    <p className="text-3xl font-bold text-foreground">{templates.length}</p>
                  </div>
                  <Mail className="w-8 h-8 text-primary/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-secondary/50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active</p>
                    <p className="text-3xl font-bold text-foreground">
                      {templates.filter((t) => t.status === 'active').length}
                    </p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-500/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-secondary/50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Sent</p>
                    <p className="text-3xl font-bold text-foreground">
                      {(templates.reduce((sum, t) => sum + t.sent, 0) / 1000).toFixed(1)}k
                    </p>
                  </div>
                  <Send className="w-8 h-8 text-blue-500/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-secondary/50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avg Open Rate</p>
                    <p className="text-3xl font-bold text-foreground">
                      {(templates.reduce((sum, t) => sum + t.openRate, 0) / templates.length).toFixed(1)}%
                    </p>
                  </div>
                  <Eye className="w-8 h-8 text-purple-500/60" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Templates Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Email Templates</CardTitle>
            <CardDescription>Manage your system email templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Description</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Sent</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Open Rate</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Last Modified</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((template, index) => (
                    <tr
                      key={template.id}
                      className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors animate-in fade-in duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-foreground">{template.name}</div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{template.description}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            template.status === 'active'
                              ? 'bg-green-500/20 text-green-700'
                              : 'bg-gray-500/20 text-gray-700'
                          }`}
                        >
                          {template.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-foreground font-medium">{template.sent.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 rounded-full bg-border overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all"
                              style={{ width: `${template.openRate}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-foreground">{template.openRate}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground text-sm">{template.lastModified}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent hover:bg-secondary/50 border-border gap-1"
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <Eye className="w-4 h-4" />
                            Preview
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent hover:bg-secondary/50 border-border gap-1"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent hover:bg-destructive/10 text-destructive border-border hover:text-destructive gap-1"
                          >
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

        {/* Preview Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl border-border/50 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Template Preview</CardTitle>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="rounded-lg p-1 hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="p-6 rounded-lg bg-secondary/50 border border-border space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-1 block">Subject</Label>
                    <p className="font-semibold text-foreground">
                      {templates.find((t) => t.id === selectedTemplate)?.subject}
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <Label className="text-sm font-medium text-muted-foreground mb-3 block">Content</Label>
                    <div className="prose prose-sm max-w-none bg-white rounded-lg p-6 text-foreground">
                      <p>Dear User,</p>
                      <p>
                        This is a preview of the{' '}
                        <strong>{templates.find((t) => t.id === selectedTemplate)?.name}</strong> template.
                      </p>
                      <p>You can customize this template to match your brand and communication style.</p>
                      <p>Best regards,<br />The SparkAI Team</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent border-border"
                    onClick={() => handleCopyTemplate(selectedTemplate)}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy HTML
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent border-border gap-2">
                    <Send className="w-4 h-4" />
                    Send Test
                  </Button>
                  <Button className="flex-1 bg-primary hover:bg-primary/90 gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* New Template Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md border-border/50 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Create New Template</CardTitle>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-lg p-1 hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">Template Name</Label>
                  <Input
                    placeholder="e.g., Welcome Email"
                    className="bg-secondary/50 border-border focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">Email Subject</Label>
                  <Input
                    placeholder="e.g., Welcome to SparkAI!"
                    className="bg-secondary/50 border-border focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">Description</Label>
                  <Input
                    placeholder="Brief description of this template"
                    className="bg-secondary/50 border-border focus:border-primary focus:ring-primary"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent border-border"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={() => setShowModal(false)}>
                    Create Template
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
