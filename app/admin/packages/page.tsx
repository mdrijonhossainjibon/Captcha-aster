'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, Plus, Edit, Trash2, DollarSign, Users, TrendingUp, CheckCircle2, X, ChevronDown } from 'lucide-react'

const AVAILABLE_FEATURES = [
  'API Access',
  'Basic API',
  'Advanced API',
  'Email Support',
  'Priority Support',
  '24/7 Support',
  'Monthly Reports',
  'Analytics',
  'Basic Analytics',
  'Advanced Analytics',
  'Real-time Analytics',
  'Webhooks',
  'Custom Webhooks',
  'Dedicated Account',
  'Team Access',
  'Custom Integrations',
  'SLA Guarantee',
  'White Label',
  'Unlimited Credits',
  '24/7 Premium Support',
  'Custom Solutions',
  'Reseller Program',
  'Development Only',
  'Limited Support',
]

export default function PackagesPage() {
  const [showModal, setShowModal] = useState(false)
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: 'Starter',
      price: 9.99,
      credits: 10000,
      features: ['API Access', 'Email Support', 'Monthly Reports'],
      users: 2345,
      mrr: 23450,
      active: true,
      growth: '+12%',
    },
    {
      id: 2,
      name: 'Professional',
      price: 49.99,
      credits: 100000,
      features: ['API Access', 'Priority Support', 'Real-time Analytics', 'Webhooks'],
      users: 1205,
      mrr: 60195,
      active: true,
      growth: '+8%',
      popular: true,
    },
    {
      id: 3,
      name: 'Enterprise',
      price: 199.99,
      credits: 500000,
      features: ['API Access', '24/7 Support', 'Custom Analytics', 'Webhooks', 'Dedicated Account'],
      users: 156,
      mrr: 31199,
      active: true,
      growth: '+24%',
    },
    {
      id: 4,
      name: 'Premium',
      price: 299.99,
      credits: 1000000,
      features: ['Everything in Enterprise', 'Custom Integrations', 'SLA Guarantee'],
      users: 45,
      mrr: 13500,
      active: false,
      growth: '+5%',
    },
    {
      id: 5,
      name: 'Growth',
      price: 29.99,
      credits: 50000,
      features: ['API Access', 'Priority Support', 'Analytics'],
      users: 567,
      mrr: 17000,
      active: true,
      growth: '+18%',
    },
    {
      id: 6,
      name: 'Business',
      price: 79.99,
      credits: 250000,
      features: ['Advanced API', '24/7 Support', 'Custom Webhooks', 'Team Access'],
      users: 89,
      mrr: 7120,
      active: true,
      growth: '+6%',
    },
    {
      id: 7,
      name: 'Lite',
      price: 4.99,
      credits: 5000,
      features: ['Basic API', 'Email Support'],
      users: 3421,
      mrr: 17070,
      active: true,
      growth: '+15%',
    },
    {
      id: 8,
      name: 'Plus',
      price: 149.99,
      credits: 300000,
      features: ['Advanced API', 'Priority Support', 'Advanced Analytics', 'Webhooks'],
      users: 234,
      mrr: 35100,
      active: true,
      growth: '+11%',
    },
    {
      id: 9,
      name: 'Team',
      price: 89.99,
      credits: 150000,
      features: ['Team Access', 'API Support', 'Analytics', 'Webhooks'],
      users: 123,
      mrr: 11060,
      active: true,
      growth: '+9%',
    },
    {
      id: 10,
      name: 'Agency',
      price: 399.99,
      credits: 2000000,
      features: ['Unlimited', 'White Label', 'API Support', 'Webhooks', 'Reseller Program'],
      users: 12,
      mrr: 4800,
      active: true,
      growth: '+22%',
    },
    {
      id: 11,
      name: 'Sandbox',
      price: 0,
      credits: 1000,
      features: ['Development Only', 'API Access', 'Limited Support'],
      users: 5234,
      mrr: 0,
      active: true,
      growth: '+35%',
    },
    {
      id: 12,
      name: 'Unlimited',
      price: 599.99,
      credits: 5000000,
      features: ['Everything', 'Unlimited Credits', '24/7 Premium Support', 'Custom Solutions'],
      users: 5,
      mrr: 3000,
      active: false,
      growth: '+2%',
    },
    {
      id: 13,
      name: 'Startup',
      price: 19.99,
      credits: 25000,
      features: ['API Access', 'Email Support', 'Basic Analytics', 'Monthly Reports'],
      users: 1876,
      mrr: 37500,
      active: true,
      growth: '+16%',
    },
  ])

  const handleAddPackage = () => {
    console.log('[v0] Add package modal opened')
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-12">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Package Management</h1>
              <p className="text-muted-foreground">Create and manage your pricing tiers</p>
            </div>
            <Button className="bg-amber-500 hover:bg-amber-600 gap-2" onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4" />
              New Package
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-border/50 bg-secondary/50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Packages</p>
                    <p className="text-3xl font-bold text-foreground">{packages.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-amber-500/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-secondary/50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Subscribers</p>
                    <p className="text-3xl font-bold text-foreground">
                      {(packages.reduce((acc, pkg) => acc + pkg.users, 0) / 1000).toFixed(1)}k
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-secondary/50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total MRR</p>
                    <p className="text-3xl font-bold text-foreground">
                      ${(packages.reduce((acc, pkg) => acc + pkg.mrr, 0) / 1000).toFixed(1)}k
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-secondary/50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active</p>
                    <p className="text-3xl font-bold text-foreground">
                      {packages.filter((p) => p.active).length}
                    </p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-emerald-500/60" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <Card
              key={pkg.id}
              className={`relative border transition-all duration-300 hover:shadow-lg hover:border-amber-500/50 ${
                pkg.popular ? 'border-amber-500/50 md:col-span-2 lg:col-span-1' : 'border-border/50'
              }`}
              style={{
                opacity: 0,
                animation: `slideInUp 0.5s ease-out ${index * 50}ms forwards`,
              }}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500 text-white shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {pkg.growth && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-sm font-semibold text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  {pkg.growth}
                </div>
              )}

              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${pkg.popular ? 'bg-amber-500/20' : 'bg-blue-500/20'}`}>
                    <Package className={`w-5 h-5 ${pkg.popular ? 'text-amber-600' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {pkg.credits.toLocaleString()} credits
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price */}
                <div className="py-3 border-t border-b border-border/50">
                  <p className="text-3xl font-bold text-foreground">
                    {pkg.price === 0 ? 'Free' : `$${pkg.price}`}
                    {pkg.price > 0 && <span className="text-sm font-normal text-muted-foreground">/month</span>}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-secondary/60 p-2">
                    <p className="text-muted-foreground text-xs mb-1">Subscribers</p>
                    <p className="font-semibold text-foreground">{pkg.users.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg bg-secondary/60 p-2">
                    <p className="text-muted-foreground text-xs mb-1">MRR</p>
                    <p className="font-semibold text-foreground">${(pkg.mrr / 1000).toFixed(1)}k</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Features</p>
                  <div className="space-y-1.5">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      pkg.active
                        ? 'bg-emerald-500/20 text-emerald-700'
                        : 'bg-red-500/20 text-red-700'
                    }`}
                  >
                    {pkg.active ? 'Active' : 'Inactive'}
                  </span>
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

      {/* New Package Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-border/50 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Create New Package</CardTitle>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Package Name</label>
                <input
                  type="text"
                  placeholder="e.g., Custom Package"
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
                <label className="text-sm font-medium text-foreground mb-2 block">Features</label>
                <div className="relative">
                  <button
                    onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-foreground text-left flex items-center justify-between hover:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  >
                    <span className="text-sm">
                      {selectedFeatures.length === 0
                        ? 'Select features'
                        : `${selectedFeatures.length} selected`}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${showFeaturesDropdown ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {showFeaturesDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-secondary border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {AVAILABLE_FEATURES.map((feature) => (
                        <label
                          key={feature}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-secondary/80 cursor-pointer border-b border-border/50 last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFeatures.includes(feature)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFeatures([...selectedFeatures, feature])
                              } else {
                                setSelectedFeatures(selectedFeatures.filter((f) => f !== feature))
                              }
                            }}
                            className="w-4 h-4 rounded border-border cursor-pointer accent-amber-500"
                          />
                          <span className="text-sm text-foreground">{feature}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {selectedFeatures.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedFeatures.map((feature) => (
                      <div
                        key={feature}
                        className="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-700 flex items-center gap-1"
                      >
                        {feature}
                        <button
                          onClick={() => setSelectedFeatures(selectedFeatures.filter((f) => f !== feature))}
                          className="ml-1 hover:opacity-70"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setShowModal(false)
                    setSelectedFeatures([])
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-amber-500 hover:bg-amber-600"
                  onClick={() => {
                    setShowModal(false)
                    setSelectedFeatures([])
                  }}
                >
                  Create Package
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
