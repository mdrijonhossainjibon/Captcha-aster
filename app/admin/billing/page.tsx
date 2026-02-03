'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, TrendingUp, CreditCard, Calendar, Download } from 'lucide-react'

export default function BillingPage() {
  const [selectedMonth, setSelectedMonth] = useState('2024-01')

  const stats = [
    { label: 'Total Revenue (MTD)', value: '$125,450', change: '+12.5%', icon: DollarSign, color: 'text-green-600' },
    { label: 'Average Order Value', value: '$245.67', change: '+5.2%', icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Total Transactions', value: '512', change: '+8.3%', icon: CreditCard, color: 'text-purple-600' },
    { label: 'Payment Success Rate', value: '99.8%', change: '+0.2%', icon: Calendar, color: 'text-amber-600' },
  ]

  const invoices = [
    { id: 'INV-2024-001', date: '2024-01-15', amount: '$4,250.00', status: 'paid', method: 'Card' },
    { id: 'INV-2024-002', date: '2024-01-20', amount: '$3,125.50', status: 'paid', method: 'Bank Transfer' },
    { id: 'INV-2024-003', date: '2024-01-25', amount: '$5,678.99', status: 'pending', method: 'Card' },
    { id: 'INV-2024-004', date: '2024-02-01', amount: '$2,450.00', status: 'paid', method: 'Crypto' },
  ]

  const payouts = [
    { id: 'PAYOUT-001', date: '2024-01-10', amount: '$50,000.00', status: 'completed', method: 'Bank Transfer' },
    { id: 'PAYOUT-002', date: '2024-02-10', amount: '$65,234.50', status: 'pending', method: 'Bank Transfer' },
  ]

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Billing & Revenue</h1>
          <p className="text-muted-foreground">Manage billing, invoices, and revenue analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="border-border/50 bg-secondary/50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}/60`} />
                  </div>
                  <p className="text-xs text-green-600">{stat.change} vs last month</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Invoices */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Invoices</CardTitle>
                  <CardDescription>Recent billing invoices</CardDescription>
                </div>
                <Button size="sm" className="gap-2 bg-amber-500 hover:bg-amber-600">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-secondary/30 transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{invoice.id}</p>
                      <p className="text-xs text-muted-foreground">{invoice.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{invoice.amount}</p>
                      <span className={`inline-block text-xs font-semibold rounded px-2 py-1 ${
                        invoice.status === 'paid'
                          ? 'bg-green-500/20 text-green-700'
                          : 'bg-yellow-500/20 text-yellow-700'
                      }`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payouts */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payouts</CardTitle>
                  <CardDescription>Earnings payouts to your account</CardDescription>
                </div>
                <Button size="sm" className="gap-2 bg-amber-500 hover:bg-amber-600">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payouts.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-secondary/30 transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{payout.id}</p>
                      <p className="text-xs text-muted-foreground">{payout.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{payout.amount}</p>
                      <span className={`inline-block text-xs font-semibold rounded px-2 py-1 ${
                        payout.status === 'completed'
                          ? 'bg-green-500/20 text-green-700'
                          : 'bg-blue-500/20 text-blue-700'
                      }`}>
                        {payout.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
