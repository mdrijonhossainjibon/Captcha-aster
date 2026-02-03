'use client'

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, XCircle, Search } from "lucide-react"

export default function AdminModerationContent() {
  const reports = [
    { id: 1, type: "Abuse", user: "john_doe", reason: "Suspicious activity", status: "Pending", date: "2024-03-15" },
    { id: 2, type: "Spam", user: "spam_bot", reason: "Mass requests", status: "Reviewed", date: "2024-03-14" },
    { id: 3, type: "Account", user: "hacked_user", reason: "Account compromise", status: "Resolved", date: "2024-03-13" },
    { id: 4, type: "API", user: "api_abuse", reason: "Rate limit exceeded", status: "Pending", date: "2024-03-12" },
    { id: 5, type: "Fraud", user: "fraud_user", reason: "Payment fraud", status: "Banned", date: "2024-03-11" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/10 text-yellow-700"
      case "Reviewed":
        return "bg-blue-500/10 text-blue-700"
      case "Resolved":
        return "bg-green-500/10 text-green-700"
      case "Banned":
        return "bg-red-500/10 text-red-700"
      default:
        return "bg-gray-500/10 text-gray-700"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Abuse":
      case "Spam":
      case "Fraud":
        return <AlertTriangle className="w-4 h-4" />
      case "Account":
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Moderation</h1>
          <p className="text-muted-foreground">Review and manage reported content and users</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Pending Reports</p>
                  <p className="text-2xl font-bold text-foreground">12</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Banned Users</p>
                  <p className="text-2xl font-bold text-foreground">8</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Resolved (30d)</p>
                  <p className="text-2xl font-bold text-foreground">156</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Resolution Rate</p>
                  <p className="text-2xl font-bold text-foreground">94%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <select className="px-4 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option>All Types</option>
                <option>Abuse</option>
                <option>Spam</option>
                <option>Account</option>
                <option>Fraud</option>
              </select>
              <select className="px-4 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option>All Status</option>
                <option>Pending</option>
                <option>Reviewed</option>
                <option>Resolved</option>
                <option>Banned</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Reports table */}
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>{reports.length} total reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Reason</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Date</th>
                    <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) => (
                    <tr
                      key={report.id}
                      className="border-b border-border hover:bg-secondary/50 transition-colors"
                      style={{
                        opacity: 0,
                        animation: `slideInUp 0.5s ease-out ${index * 50}ms forwards`,
                      }}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-red-600">{getTypeIcon(report.type)}</span>
                          {report.type}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium">{report.user}</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{report.reason}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{report.date}</td>
                      <td className="py-4 px-4 flex gap-2 justify-center">
                        <Button size="sm" variant="outline" className="h-8 bg-transparent">
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
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
