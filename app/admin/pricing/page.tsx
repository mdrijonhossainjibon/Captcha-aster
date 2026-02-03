'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, DollarSign, TrendingUp, CheckCircle2, X, ChevronDown, Users, Zap } from 'lucide-react'

const BILLING_CYCLES = ['Monthly', 'Quarterly', 'Annually']

export default function PricingPlansPage() {
  const [showModal, setShowModal] = useState(false)
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: 'Starter',
      billingCycle: 'Monthly',
      price: 9.99,
      credits: 10000,
      description: 'Perfect for getting started',
      subscribers: 2345,
      conversionRate: 8.5,
      churnRate: 2.1,
      active: true,
      popular: false,
    },
    {
      id: 2,
      name: 'Professional',
      billingCycle: 'Monthly',
      price: 49.99,
      credits: 100000,
      description: 'For growing businesses',
      subscribers: 1205,
      conversionRate: 12.3,
      churnRate: 1.5,
      active: true,
      popular: true,
    },
    {
      id: 3,
      name: 'Enterprise',
      billingCycle: 'Annually',
      price: 1999.99,
      credits: 5000000,
      description: 'For large organizations',
      subscribers: 156,
      conversionRate: 18.9,
      churnRate: 0.3,
      active: true,
      popular: false,
    },
    {
      id: 4,
      name: 'Business',
      billingCycle: 'Quarterly',
      price: 199.99,
      credits: 500000,
      description: 'For scaling teams',
      subscribers: 234,
      conversionRate: 14.2,
      churnRate: 1.2,
      active: true,
      popular: false,
    },
  ])

  const totalSubscribers = plans.reduce((acc, plan) => acc + plan.subscribers, 0)
  const avgConversion = (plans.reduce((acc, plan) => acc + plan.conversionRate, 0) / plans.length).toFixed(1)
  const avgChurn = (plans.reduce((acc, plan) => acc + plan.churnRate, 0) / plans.length).toFixed(1)

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-12">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Pricing Plans</h1>
              <p className="text-muted-foreground">Manage and monitor your pricing strategies</p>
            </div>
            <Button className="bg-amber-500 hover:bg-amber-600 gap-2" onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4" />
              New Plan
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-border/50 bg-secondary/50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active Plans</p>
                    <p className="text-3xl font-bold text-foreground">{plans.filter(p => p.active).length}</p>
                  </div>
                  <Zap className="w-8 h-8 text-amber-500/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-secondary/50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Subscribers</p>
                    <p className="text-3xl font-bold text-foreground">{(totalSubscribers / 1000).toFixed(1)}k</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-secondary/50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avg Conversion</p>
                    <p className="text-3xl font-bold text-foreground">{avgConversion}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-secondary/50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avg Churn Rate</p>
                    <p className="text-3xl font-bold text-foreground">{avgChurn}%</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-red-500/60" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <Card
              key={plan.id}
              className={`relative border transition-all duration-300 hover:shadow-lg hover:border-amber-500/50 ${
                plan.popular ? 'border-amber-500/50 md:col-span-2 lg:col-span-1 ring-2 ring-amber-500/30' : 'border-border/50'
              }`}
              style={{
                opacity: 0,
                animation: `slideInUp 0.5s ease-out ${index * 50}ms forwards`,
              }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500 text-white shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                  </div>
                  {plan.active && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-700">
                      Active
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Pricing */}
                <div className="py-3 border-t border-b border-border/50">
                  <p className="text-3xl font-bold text-foreground">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground ml-1">/{plan.billingCycle.toLowerCase()}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{plan.credits.toLocaleString()} credits</p>
                </div>

                {/* Key Metrics */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subscribers</span>
                    <span className="font-semibold text-foreground">{plan.subscribers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Conversion Rate</span>
                    <span className="font-semibold text-green-600">{plan.conversionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Churn Rate</span>
                    <span className="font-semibold text-red-600">{plan.churnRate}%</span>
                  </div>
                </div>

                {/* Billing Cycle */}
                <div className="rounded-lg bg-secondary/60 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Billing Cycle</p>
                  <p className="font-semibold text-foreground">{plan.billingCycle}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 text-destructive hover:text-destructive bg-transparent"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* New Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-border/50 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Create New Pricing Plan</CardTitle>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Plan Name</label>
                <input
                  type="text"
                  placeholder="e.g., Premium Plus"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Price</label>
                <input
                  type="number"
                  placeholder="99.99"
                  step="0.01"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Credits</label>
                <input
                  type="number"
                  placeholder="100000"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Billing Cycle</label>
                <select className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500">
                  {BILLING_CYCLES.map(cycle => (
                    <option key={cycle} value={cycle}>{cycle}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
                <input
                  type="text"
                  placeholder="Plan description"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-amber-500 hover:bg-amber-600"
                  onClick={() => setShowModal(false)}
                >
                  Create Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
