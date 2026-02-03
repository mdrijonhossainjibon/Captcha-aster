'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, Download, Search, Filter, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function TopupHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const searchParams = useSearchParams()

  const transactions = [
    { id: 'TXN-001', user: 'john@example.com', amount: 50.00, credits: 10000, method: 'Card', status: 'completed', date: '2024-02-15', type: 'topup' },
    { id: 'TXN-002', user: 'sarah@example.com', amount: 100.00, credits: 25000, method: 'Bank Transfer', status: 'completed', date: '2024-02-14', type: 'topup' },
    { id: 'TXN-003', user: 'mike@example.com', amount: 25.00, credits: 5000, method: 'Card', status: 'failed', date: '2024-02-14', type: 'topup' },
    { id: 'TXN-004', user: 'emma@example.com', amount: 250.00, credits: 75000, method: 'Crypto', status: 'pending', date: '2024-02-13', type: 'topup' },
    { id: 'TXN-005', user: 'alex@example.com', amount: 150.00, credits: 35000, method: 'Card', status: 'completed', date: '2024-02-13', type: 'topup' },
    { id: 'TXN-006', user: 'lisa@example.com', amount: 75.00, credits: 15000, method: 'PayPal', status: 'completed', date: '2024-02-12', type: 'topup' },
  ]

  const stats = [
    { label: 'Total Topups', value: transactions.length, color: 'text-blue-600' },
    { label: 'Completed', value: transactions.filter(t => t.status === 'completed').length, color: 'text-green-600' },
    { label: 'Pending', value: transactions.filter(t => t.status === 'pending').length, color: 'text-yellow-600' },
    { label: 'Failed', value: transactions.filter(t => t.status === 'failed').length, color: 'text-red-600' },
  ]

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout>
      <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Topup Transaction History</h1>
                <p className="text-muted-foreground">View all user credit topup transactions</p>
              </div>
              <Button className="gap-2 bg-amber-500 hover:bg-amber-600">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="border-border/50 bg-secondary/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                      <CreditCard className={`w-8 h-8 ${stat.color}/60`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by user or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2 rounded-lg border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
              <CardDescription>All topup transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Transaction ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">User</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Credits</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Method</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-4">
                          <p className="text-sm font-medium text-foreground">{transaction.id}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-foreground">{transaction.user}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm font-semibold text-foreground">${transaction.amount.toFixed(2)}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-muted-foreground">{transaction.credits.toLocaleString()}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-700">
                            {transaction.method}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                            transaction.status === 'completed'
                              ? 'bg-green-500/20 text-green-700'
                              : transaction.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-700'
                              : 'bg-red-500/20 text-red-700'
                          }`}>
                            {transaction.status === 'completed' && <ArrowDownLeft className="w-3 h-3" />}
                            {transaction.status === 'pending' && <CreditCard className="w-3 h-3" />}
                            {transaction.status === 'failed' && <ArrowUpRight className="w-3 h-3" />}
                            {transaction.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    )
  }
