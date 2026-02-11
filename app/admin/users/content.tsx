'use client'

import { useState, useEffect } from "react"
import { Modal, message } from "antd"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, MoreVertical, Ban, Unlock, Edit, Trash2, Loader2, Eye } from "lucide-react"
import { Suspense } from "react"
import { useRouter } from "next/navigation"
import Loading from "./loading"

interface User {
  id: string
  name: string
  email: string
  plan: string
  status: string
  balance: string
  joined: string
  twoFactorEnabled?: boolean
  isAdmin?: boolean
}

export default function AdminUsersContent() {
  const router = useRouter()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState({ name: "", balance: "", status: "" })
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  // Fetch users from API
  useEffect(() => {
    fetchUsers()
  }, [currentPage, itemsPerPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  // Fetch when page resets
  useEffect(() => {
    if (currentPage === 1) {
      fetchUsers()
    }
  }, [currentPage])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter) params.append('status', statusFilter)
      params.append('page', currentPage.toString())
      params.append('limit', itemsPerPage.toString())

      const response = await fetch(`/api/admin/users?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setUsers(data.users)
        setPagination(data.pagination)
      } else {
        message.error(data.error || 'Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      message.error('Failed to fetch users')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUser = async () => {
    if (!selectedUser) return

    try {
      setIsSaving(true)
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          name: editForm.name,
          balance: editForm.balance,
          status: editForm.status
        })
      })

      const data = await response.json()

      if (data.success) {
        message.success('User updated successfully')
        setIsEditModalOpen(false)
        fetchUsers() // Refresh the list
      } else {
        message.error(data.error || 'Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      message.error('Failed to update user')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    Modal.confirm({
      title: 'Delete User',
      content: 'Are you sure you want to delete this user? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await fetch(`/api/admin/users?userId=${userId}`, {
            method: 'DELETE'
          })

          const data = await response.json()

          if (data.success) {
            message.success('User deleted successfully')
            fetchUsers() // Refresh the list
          } else {
            message.error(data.error || 'Failed to delete user')
          }
        } catch (error) {
          console.error('Error deleting user:', error)
          message.error('Failed to delete user')
        }
      }
    })
  }

  return (
    <>
      <Suspense fallback={<Loading />}>
        <div>
          {/* Search and filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Users table */}
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>{pagination.total} total users</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No users found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Balance</th>
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
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            {user.name}
                          </td>
                          <td className="py-4 px-4 text-sm text-muted-foreground">{user.email}</td>
                          <td className="py-4 px-4">
                            <span className="font-semibold text-foreground">{user.balance}</span>
                            <span className="text-xs text-muted-foreground ml-1">USD</span>
                          </td>

                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full ${user.status === "Active"
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
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-transparent border-blue-500/50 text-blue-500 hover:bg-blue-500 hover:text-white text-xs gap-1 h-8 px-3"
                                onClick={() => router.push(`/admin/users/${user.id}`)}
                              >
                                <Eye className="w-3 h-3" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-transparent border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-white text-xs gap-1 h-8 px-3"
                                onClick={() => {
                                  setSelectedUser(user)
                                  setEditForm({ name: user.name, balance: user.balance, status: user.status })
                                  setIsEditModalOpen(true)
                                }}
                              >
                                <Edit className="w-3 h-3" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-transparent border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white text-xs gap-1 h-8 px-3"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {!isLoading && users.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} users
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Items per page selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Rows per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="px-3 py-1.5 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                {/* Page navigation */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={!pagination.hasPrevPage}
                    className="h-8 px-3"
                  >
                    Previous
                  </Button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="h-8 w-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                    disabled={!pagination.hasNextPage}
                    className="h-8 px-3"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edit User Modal */}
        <Modal
          title={
            <div>
              <h2 className="text-xl font-bold text-foreground">Edit User</h2>
              <p className="text-sm text-muted-foreground">Update user information</p>
            </div>
          }
          open={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          footer={[
            <Button
              key="cancel"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="bg-transparent"
              disabled={isSaving}
            >
              Cancel
            </Button>,
            <Button
              key="submit"
              className="bg-amber-500 hover:bg-amber-600"
              onClick={handleEditUser}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>,
          ]}
          width={500}
          centered
        >
          {selectedUser && (
            <div className="space-y-4 py-4">
              {/* Name */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-foreground outline-none transition-all"
                />
              </div>

              {/* Balance */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Balance (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input
                    type="text"
                    value={editForm.balance.replace('$', '')}
                    onChange={(e) => setEditForm({ ...editForm, balance: `$${e.target.value.replace('$', '')}` })}
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-foreground outline-none transition-all"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-foreground outline-none transition-all"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Banned">Banned</option>
                </select>
              </div>

              {/* User Info Display */}
              <div className="mt-6 p-4 rounded-xl bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-semibold text-foreground">{selectedUser.email}</p>
                <p className="text-sm text-muted-foreground mt-3 mb-1">Plan</p>
                <p className="font-semibold text-foreground">{selectedUser.plan}</p>
              </div>
            </div>
          )}
        </Modal>
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
    </>
  )
}
