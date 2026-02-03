'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock, Users, Shield, Edit, Trash2, Plus, CheckCircle2 } from 'lucide-react'

export default function PermissionsManagementPage() {
  const [showModal, setShowModal] = useState(false)
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Super Admin',
      description: 'Full system access',
      userCount: 2,
      permissions: ['read', 'write', 'delete', 'admin', 'users', 'system'],
      color: 'bg-red-500/20 text-red-700',
    },
    {
      id: 2,
      name: 'Admin',
      description: 'Administrative access',
      userCount: 5,
      permissions: ['read', 'write', 'delete', 'users'],
      color: 'bg-blue-500/20 text-blue-700',
    },
    {
      id: 3,
      name: 'Moderator',
      description: 'Moderation access',
      userCount: 12,
      permissions: ['read', 'write', 'users'],
      color: 'bg-amber-500/20 text-amber-700',
    },
    {
      id: 4,
      name: 'User',
      description: 'Basic user access',
      userCount: 5243,
      permissions: ['read'],
      color: 'bg-green-500/20 text-green-700',
    },
  ])

  const availablePermissions = [
    { id: 'read', name: 'Read', description: 'View data' },
    { id: 'write', name: 'Write', description: 'Create and edit data' },
    { id: 'delete', name: 'Delete', description: 'Remove data' },
    { id: 'users', name: 'Manage Users', description: 'Manage user accounts' },
    { id: 'system', name: 'System Settings', description: 'Access system configuration' },
    { id: 'admin', name: 'Admin Panel', description: 'Access admin dashboard' },
    { id: 'billing', name: 'Billing', description: 'Manage billing' },
    { id: 'support', name: 'Support', description: 'Manage support tickets' },
  ]

  const stats = [
    { label: 'Total Roles', value: roles.length, icon: Shield },
    { label: 'Total Users', value: roles.reduce((sum, r) => sum + r.userCount, 0), icon: Users },
    { label: 'Permissions', value: availablePermissions.length, icon: Lock },
  ]

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Permissions Management</h1>
              <p className="text-muted-foreground">Manage roles and permissions for system access</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4" />
              New Role
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="border-border/50 bg-secondary/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-500/10">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {roles.map((role, index) => (
            <Card
              key={index}
              className="border-border/50 hover:border-primary/50 transition-all duration-300"
              style={{
                opacity: 0,
                animation: `slideInUp 0.5s ease-out ${index * 100}ms forwards`,
              }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${role.color}`}>
                        {role.name}
                      </span>
                    </div>
                    <CardDescription>{role.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Users with this role</p>
                  <p className="text-2xl font-bold text-foreground">{role.userCount.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Permissions</p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((perm) => (
                      <span key={perm} className="px-3 py-1 text-xs rounded-full bg-secondary/60 text-foreground">
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Available Permissions */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Available Permissions</CardTitle>
            <CardDescription>All system permissions that can be assigned to roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {availablePermissions.map((perm, index) => (
                <div
                  key={perm.id}
                  className="p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-300"
                  style={{
                    opacity: 0,
                    animation: `slideInUp 0.5s ease-out ${index * 50}ms forwards`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{perm.name}</p>
                      <p className="text-sm text-muted-foreground">{perm.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Permission Matrix */}
        <Card className="border-border/50 mt-8">
          <CardHeader>
            <CardTitle>Permission Matrix</CardTitle>
            <CardDescription>Visual representation of role permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Permission</th>
                    {roles.map((role) => (
                      <th key={role.id} className="text-center py-3 px-4 font-semibold text-foreground">
                        {role.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {availablePermissions.map((perm) => (
                    <tr key={perm.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-foreground">{perm.name}</td>
                      {roles.map((role) => (
                        <td key={`${role.id}-${perm.id}`} className="text-center py-3 px-4">
                          {role.permissions.includes(perm.id) ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-border/50 mx-auto" />
                          )}
                        </td>
                      ))}
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
