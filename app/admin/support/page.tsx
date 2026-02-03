'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AlertCircle,
  Plus,
  Search,
  ChevronDown,
  CheckCircle2,
  Clock,
  X,
  MessageSquare,
  User,
  Calendar,
  Flag,
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const Loading = () => null

export default function SupportPage() {
  const [showModal, setShowModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const [tickets, setTickets] = useState([
    {
      id: 1,
      ticketId: 'TKT-2024-001',
      userEmail: 'john.doe@example.com',
      userName: 'John Doe',
      subject: 'API rate limit exceeded',
      message: 'I keep getting rate limit errors on my API calls. Can you help?',
      status: 'open',
      priority: 'high',
      created: '2024-01-18 10:30',
      updated: '2024-01-18 14:20',
      responses: 2,
    },
    {
      id: 2,
      ticketId: 'TKT-2024-002',
      userEmail: 'jane.smith@example.com',
      userName: 'Jane Smith',
      subject: 'Billing question',
      message: 'Questions about the Pro plan pricing',
      status: 'pending',
      priority: 'medium',
      created: '2024-01-17 15:45',
      updated: '2024-01-18 09:10',
      responses: 1,
    },
    {
      id: 3,
      ticketId: 'TKT-2024-003',
      userEmail: 'bob.wilson@example.com',
      userName: 'Bob Wilson',
      subject: 'Login issues',
      message: 'Cannot log into my account',
      status: 'resolved',
      priority: 'high',
      created: '2024-01-16 08:00',
      updated: '2024-01-17 11:30',
      responses: 3,
    },
    {
      id: 4,
      ticketId: 'TKT-2024-004',
      userEmail: 'alice.brown@example.com',
      userName: 'Alice Brown',
      subject: 'Feature request',
      message: 'Would love to see batch API support',
      status: 'open',
      priority: 'low',
      created: '2024-01-15 16:20',
      updated: '2024-01-18 13:00',
      responses: 1,
    },
    {
      id: 5,
      ticketId: 'TKT-2024-005',
      userEmail: 'charlie.lee@example.com',
      userName: 'Charlie Lee',
      subject: 'Extension not working',
      message: 'Chrome extension crashes on startup',
      status: 'pending',
      priority: 'high',
      created: '2024-01-18 09:15',
      updated: '2024-01-18 09:45',
      responses: 0,
    },
  ])

  const stats = [
    { title: 'Total Tickets', value: tickets.length, icon: AlertCircle, color: 'bg-blue-500/10', iconColor: 'text-blue-600' },
    { title: 'Open', value: tickets.filter((t) => t.status === 'open').length, icon: Clock, color: 'bg-orange-500/10', iconColor: 'text-orange-600' },
    { title: 'Pending', value: tickets.filter((t) => t.status === 'pending').length, icon: MessageSquare, color: 'bg-yellow-500/10', iconColor: 'text-yellow-600' },
    { title: 'Resolved', value: tickets.filter((t) => t.status === 'resolved').length, icon: CheckCircle2, color: 'bg-green-500/10', iconColor: 'text-green-600' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-orange-500/20 text-orange-700'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-700'
      case 'resolved':
        return 'bg-green-500/20 text-green-700'
      default:
        return 'bg-gray-500/20 text-gray-700'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-orange-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus

    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Support Tickets</h1>
              <p className="text-muted-foreground">Manage customer support requests</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus className="w-4 h-4" />
              Create Ticket
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card
                  key={index}
                  className="border-border hover:border-primary/50 transition-all duration-300 animate-in fade-in duration-500"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
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
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 animate-in fade-in duration-500" style={{ animationDelay: '200ms' }}>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by ticket ID, user, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-border"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              className="bg-transparent"
            >
              All
            </Button>
            <Button
              variant={filterStatus === 'open' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('open')}
              className="bg-transparent"
            >
              Open
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('pending')}
              className="bg-transparent"
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === 'resolved' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('resolved')}
              className="bg-transparent"
            >
              Resolved
            </Button>
          </div>
        </div>

        {/* Tickets Table */}
        <Card className="border-border animate-in fade-in duration-500" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle>Support Requests</CardTitle>
            <CardDescription>{filteredTickets.length} ticket(s) found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Ticket ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Subject</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Priority</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Created</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket, index) => (
                    <tr
                      key={ticket.id}
                      className="border-b border-border hover:bg-secondary/50 transition-colors animate-in fade-in duration-300"
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <td className="py-4 px-4 font-medium text-foreground">{ticket.ticketId}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{ticket.userName}</p>
                            <p className="text-xs text-muted-foreground">{ticket.userEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-foreground">{ticket.subject}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <Flag className={`w-4 h-4 ${getPriorityColor(ticket.priority)}`} />
                          <span className={`font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {ticket.created}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-transparent"
                            onClick={() => setSelectedTicket(ticket.id)}
                          >
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="bg-transparent text-primary hover:text-primary/80">
                            Reply
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

        {/* Ticket Detail Modal */}
        {selectedTicket !== null && (
          <Suspense fallback={<Loading />}>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-2xl border-border/50 shadow-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
                  <div>
                    <CardTitle>Ticket Details</CardTitle>
                    <CardDescription>{tickets.find((t) => t.id === selectedTicket)?.ticketId}</CardDescription>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="rounded-lg p-1 hover:bg-secondary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </CardHeader>

                <CardContent className="space-y-6 py-6">
                  {tickets.find((t) => t.id === selectedTicket) && (
                    <>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">User</p>
                            <p className="font-medium text-foreground">
                              {tickets.find((t) => t.id === selectedTicket)?.userName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {tickets.find((t) => t.id === selectedTicket)?.userEmail}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Priority</p>
                            <div className="flex items-center gap-1">
                              <Flag
                                className={`w-4 h-4 ${getPriorityColor(
                                  tickets.find((t) => t.id === selectedTicket)?.priority || ''
                                )}`}
                              />
                              <span className="font-medium text-foreground">
                                {tickets.find((t) => t.id === selectedTicket)?.priority?.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Subject</p>
                          <p className="font-medium text-foreground text-lg">
                            {tickets.find((t) => t.id === selectedTicket)?.subject}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Message</p>
                          <p className="text-foreground bg-secondary/50 p-4 rounded-lg">
                            {tickets.find((t) => t.id === selectedTicket)?.message}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground mb-1">Created</p>
                            <p className="font-medium text-foreground">
                              {tickets.find((t) => t.id === selectedTicket)?.created}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Status</p>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                tickets.find((t) => t.id === selectedTicket)?.status || ''
                              )}`}
                            >
                              {tickets.find((t) => t.id === selectedTicket)?.status?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-border pt-4">
                        <p className="text-sm text-muted-foreground mb-3">
                          {tickets.find((t) => t.id === selectedTicket)?.responses} response(s)
                        </p>
                        <div className="space-y-3">
                          {tickets.find((t) => t.id === selectedTicket)?.responses ? (
                            <div className="bg-secondary/50 p-4 rounded-lg">
                              <p className="text-sm font-medium text-foreground mb-2">Admin Response</p>
                              <p className="text-sm text-muted-foreground">
                                Thank you for reaching out. We're looking into this issue and will update you shortly.
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">2024-01-18 11:30</p>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No responses yet</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 bg-transparent">
                          Close Ticket
                        </Button>
                        <Button className="flex-1 bg-primary hover:bg-primary/90">
                          Send Response
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </Suspense>
        )}
      </div>
    </AdminLayout>
  )
}
