'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Plus, Download } from 'lucide-react'

export default function AdminWalletPage() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)

  const stats = [
    { title: 'Total Balance', value: '$45,230.50', icon: Wallet, color: 'bg-blue-500/10', iconColor: 'text-blue-600', change: '+12.5%' },
    { title: 'Monthly Income', value: '$12,450.00', icon: TrendingUp, color: 'bg-green-500/10', iconColor: 'text-green-600', change: '+8.2%' },
    { title: 'Pending Payouts', value: '$3,200.00', icon: ArrowUpRight, color: 'bg-yellow-500/10', iconColor: 'text-yellow-600', change: '2 pending' },
    { title: 'Total Withdrawn', value: '$89,350.00', icon: TrendingDown, color: 'bg-purple-500/10', iconColor: 'text-purple-600', change: 'All time' },
  ]

  const transactions = [
    { id: 'TXN001', type: 'income', description: 'Captcha service revenue', amount: '+$2,500.00', date: '2024-01-18', status: 'completed' },
    { id: 'TXN002', type: 'withdrawal', description: 'Bank transfer', amount: '-$5,000.00', date: '2024-01-17', status: 'completed' },
    { id: 'TXN003', type: 'income', description: 'API usage fees', amount: '+$850.50', date: '2024-01-16', status: 'completed' },
    { id: 'TXN004', type: 'fee', description: 'Platform fee', amount: '-$50.00', date: '2024-01-15', status: 'completed' },
    { id: 'TXN005', type: 'income', description: 'Affiliate commission', amount: '+$1,200.00', date: '2024-01-14', status: 'pending' },
  ]

  const withdrawalRequests = [
    { id: 'WR001', amount: '$3,000.00', method: 'Bank Transfer', date: '2024-01-18', status: 'pending', bankAccount: '****1234' },
    { id: 'WR002', amount: '$2,000.00', method: 'PayPal', date: '2024-01-16', status: 'processing', account: 'user@...com' },
    { id: 'WR003', amount: '$5,000.00', method: 'Bank Transfer', date: '2024-01-10', status: 'completed', bankAccount: '****5678' },
  ]

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Wallet Management</h1>
          <p className="text-muted-foreground">Monitor platform finances and manage payouts</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className="border-border hover:border-primary/50 transition-all duration-300"
                style={{ animation: `slideInUp 0.5s ease-out ${index * 100}ms forwards` }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-600/10 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transactions */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest wallet activity</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${tx.type === 'income' ? 'bg-green-500/10' : tx.type === 'withdrawal' ? 'bg-blue-500/10' : 'bg-red-500/10'}`}>
                        {tx.type === 'income' ? (
                          <ArrowDownLeft className={`w-5 h-5 ${tx.type === 'income' ? 'text-green-600' : 'text-blue-600'}`} />
                        ) : (
                          <ArrowUpRight className={`w-5 h-5 text-${tx.type === 'withdrawal' ? 'blue' : 'red'}-600`} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{tx.description}</p>
                        <p className="text-sm text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{tx.amount}</p>
                      <span className="text-xs text-muted-foreground capitalize">{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full gap-2 bg-primary hover:bg-primary/90" onClick={() => setShowWithdrawModal(true)}>
                <ArrowUpRight className="w-4 h-4" />
                Process Withdrawal
              </Button>
              <Button variant="outline" className="w-full gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Download Statement
              </Button>
              <Button variant="outline" className="w-full gap-2 bg-transparent">
                <Plus className="w-4 h-4" />
                Manual Adjustment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Withdrawal Requests */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Pending Withdrawal Requests</CardTitle>
            <CardDescription>Manage user withdrawal requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Method</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Account</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawalRequests.map((req) => (
                    <tr key={req.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-4 text-foreground">{req.id}</td>
                      <td className="py-3 px-4 font-semibold text-foreground">{req.amount}</td>
                      <td className="py-3 px-4 text-foreground">{req.method}</td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">{req.bankAccount || req.account}</td>
                      <td className="py-3 px-4 text-muted-foreground">{req.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${req.status === 'completed' ? 'bg-green-500/20 text-green-700' : req.status === 'processing' ? 'bg-blue-500/20 text-blue-700' : 'bg-yellow-500/20 text-yellow-700'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {req.status === 'pending' && (
                          <Button size="sm" variant="outline" className="text-xs bg-transparent">
                            Approve
                          </Button>
                        )}
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
