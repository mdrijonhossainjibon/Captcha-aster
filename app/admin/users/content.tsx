'use client'

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, MoreVertical, Ban, Unlock } from "lucide-react"
import { Suspense } from "react"
import Loading from "./loading"

export default function AdminUsersContent() {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", plan: "Pro", status: "Active", solved: "1,245", joined: "2024-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", plan: "Free", status: "Active", solved: "342", joined: "2024-02-20" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", plan: "Enterprise", status: "Inactive", solved: "5,234", joined: "2023-12-01" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", plan: "Pro", status: "Active", solved: "892", joined: "2024-01-10" },
    { id: 5, name: "Charlie Davis", email: "charlie@example.com", plan: "Free", status: "Banned", solved: "12", joined: "2024-03-05" },
  ]

  return (
    <AdminLayout>
      <Suspense fallback={<Loading />}>
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">User Management</h1>
              <p className="text-muted-foreground">Manage and moderate user accounts</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">Add User</Button>
          </div>

          {/* Search and filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <select className="px-4 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option>All Plans</option>
                  <option>Free</option>
                  <option>Pro</option>
                  <option>Enterprise</option>
                </select>
                <select className="px-4 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Banned</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Users table */}
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>{users.length} total users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Plan</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Solved</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Joined</th>
                      <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr
                        key={user.id}
                        className="border-b border-border hover:bg-secondary/50 transition-colors"
                        style={{
                          opacity: 0,
                          animation: `slideInUp 0.5s ease-out ${index * 50}ms forwards`,
                        }}
                      >
                        <td className="py-4 px-4">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary mr-3 inline-flex">
                            {user.name.charAt(0)}
                          </div>
                          {user.name}
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">{user.email}</td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-700">
                            {user.plan}
                          </span>
                        </td>
                        <td className="py-4 px-4">{user.solved}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              user.status === "Active"
                                ? "bg-green-500/10 text-green-700"
                                : user.status === "Inactive"
                                  ? "bg-gray-500/10 text-gray-700"
                                  : "bg-red-500/10 text-red-700"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">{user.joined}</td>
                        <td className="py-4 px-4">
                          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </Suspense>

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
