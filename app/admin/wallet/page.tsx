'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, Plus, Settings, RefreshCcw, Trash2, Edit, Coins } from 'lucide-react'
import { message, Modal, Input, Switch } from 'antd'
import Image from 'next/image'

interface AdminWallet {
  _id?: string;
  address: string;
  network: string;
  label: string;
  symbol: string;
  balance: string;
  isActive: boolean;
}

interface CryptoConfig {
  id: string;
  name: string;
  fullName: string;
  networks: { id: string; name: string }[];
}

export default function AdminWalletPage() {
  const [wallets, setWallets] = useState<AdminWallet[]>([])
  const [loading, setLoading] = useState(true)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [editingWallet, setEditingWallet] = useState<AdminWallet | null>(null)
  const [cryptoConfigs, setCryptoConfigs] = useState<CryptoConfig[]>([])

  // Simplified form states - just address and label
  const [formAddress, setFormAddress] = useState('')
  const [formLabel, setFormLabel] = useState('')
  const [formIsActive, setFormIsActive] = useState(true)

  const fetchCryptoConfigs = async () => {
    try {
      const response = await fetch('/api/crypto/config')
      const data = await response.json()
      if (data.success) {
        setCryptoConfigs(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch crypto configs')
    }
  }

  const fetchWallets = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/wallet')
      const data = await response.json()
      if (data.success) {
        setWallets(data.wallets)
      } else {
        message.error(data.error || 'Failed to fetch wallets')
      }
    } catch (error) {
      message.error('An error occurred while fetching wallets')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWallets()
    fetchCryptoConfigs()
  }, [fetchWallets])

  const handleSaveWallet = async () => {
    if (!formAddress || !formLabel) {
      message.warning('Please fill in address and label')
      return
    }

    if (cryptoConfigs.length === 0) {
      message.error('No crypto configurations available')
      return
    }

    try {
      // Create wallet entries for ALL coins in crypto config
      const walletEntries = cryptoConfigs.map(config => ({
        address: formAddress,
        network: config.networks[0]?.id || 'ERC20',
        label: `${formLabel} - ${config.name}`,
        symbol: config.id.toUpperCase(),
        balance: '0',
        isActive: formIsActive
      }))

      // Save all entries
      const promises = walletEntries.map(entry =>
        fetch('/api/admin/wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry)
        }).then(res => res.json())
      )

      const results = await Promise.all(promises)
      const successCount = results.filter(r => r.success).length

      if (successCount > 0) {
        message.success(`Created ${successCount} wallet entries for all coins`)
        setShowWalletModal(false)
        setEditingWallet(null)
        setFormAddress('')
        setFormLabel('')
        setFormIsActive(true)
        fetchWallets()
      } else {
        message.error('Failed to create wallet entries')
      }
    } catch (error) {
      message.error('Error saving wallets')
    }
  }

  const handleDeleteWallet = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wallet?')) return

    try {
      const response = await fetch(`/api/admin/wallet?id=${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        message.success('Wallet deleted')
        fetchWallets()
      } else {
        message.error(data.error || 'Failed to delete wallet')
      }
    } catch (error) {
      message.error('Error deleting wallet')
    }
  }

  const openEditModal = (wallet: AdminWallet) => {
    setEditingWallet(wallet)
    setFormAddress(wallet.address)
    setFormLabel(wallet.label)
    setFormIsActive(wallet.isActive)
    setShowWalletModal(true)
  }

  const getCoinIcon = (symbol: string) => {
    try {
      const sym = symbol.toLowerCase()
      return require(`../../../node_modules/cryptocurrency-icons/svg/color/${sym}.svg`)
    } catch (e) {
      return null
    }
  }

  const stats = [
    {
      title: 'Total Balance (USD)',
      value: `$${wallets.reduce((acc, curr) => acc + parseFloat(curr.balance || '0'), 0).toLocaleString()}`,
      icon: Wallet,
      color: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
      change: '+12.5%'
    },
    { title: 'Monthly Income', value: '$12,450.00', icon: TrendingUp, color: 'bg-green-500/10', iconColor: 'text-green-600', change: '+8.2%' },
    { title: 'Pending Payouts', value: '$3,200.00', icon: ArrowUpRight, color: 'bg-yellow-500/10', iconColor: 'text-yellow-600', change: '2 pending' },
    { title: 'Total Withdrawn', value: '$89,350.00', icon: TrendingDown, color: 'bg-purple-500/10', iconColor: 'text-purple-600', change: 'All time' },
  ]

  return (
    <>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Wallet Management</h1>
            <p className="text-muted-foreground">Monitor platform finances and manage payouts</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-2 bg-transparent border-primary/20 hover:border-primary/50"
              onClick={() => {
                setEditingWallet(null)
                setFormAddress('')
                setFormLabel('')
                setFormIsActive(true)
                setShowWalletModal(true)
              }}
            >
              <Plus className="w-4 h-4" />
              Add Wallet
            </Button>
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={fetchWallets}
              disabled={loading}
            >
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
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

        {/* Wallets Configuration Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Admin Wallets
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && wallets.length === 0 ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse bg-secondary/20 h-[180px]" />
              ))
            ) : wallets.length === 0 ? (
              <Card className="col-span-full p-12 text-center border-dashed border-2">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Wallet className="w-12 h-12 opacity-20" />
                  <p>No admin wallets configured yet.</p>
                  <Button variant="link" onClick={() => setShowWalletModal(true)}>Add your first wallet</Button>
                </div>
              </Card>
            ) : (
              wallets.map((wallet) => {
                const coinIcon = getCoinIcon(wallet.symbol)
                return (
                  <Card key={wallet._id} className="group relative overflow-hidden border-primary/10 hover:border-primary/40 transition-all duration-300">
                    <CardContent className="pt-6 pb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                            {coinIcon ? (
                              <Image src={coinIcon} alt={wallet.symbol} width={28} height={28} />
                            ) : (
                              <Coins className="w-7 h-7 text-primary" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-base font-bold">{wallet.symbol}</CardTitle>
                            <CardDescription className="text-xs">{wallet.label.replace(/ - .*$/, '')}</CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10" onClick={() => openEditModal(wallet)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => handleDeleteWallet(wallet._id!)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Wallet Form Modal */}
      <Modal
        title={editingWallet ? 'Edit Admin Wallet' : 'Add Universal Wallet'}
        open={showWalletModal}
        onOk={handleSaveWallet}
        onCancel={() => {
          setShowWalletModal(false)
          setEditingWallet(null)
        }}
        okText="Save Wallet"
        cancelText="Cancel"
        className="dark-modal"
      >
        <div className="space-y-4 pt-4">
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2">
              <Coins className="w-4 h-4" />
              This will create wallet entries for ALL {cryptoConfigs.length} configured coins
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Label Prefix</label>
            <Input
              placeholder="e.g. Main Payout Wallet"
              value={formLabel}
              onChange={(e) => setFormLabel(e.target.value)}
            />
            <p className="text-[10px] text-muted-foreground mt-1">Will be saved as: Label - CoinName</p>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Universal Wallet Address</label>
            <Input
              placeholder="0x... or wallet address"
              value={formAddress}
              onChange={(e) => setFormAddress(e.target.value)}
            />
            <p className="text-[10px] text-muted-foreground mt-1">Same address will be used for all coins</p>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold">Active Status</label>
            <Switch
              checked={formIsActive}
              onChange={(checked) => setFormIsActive(checked)}
            />
          </div>
        </div>
      </Modal>

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
        
        .dark-modal .ant-modal-content {
          background-color: hsl(var(--card));
          color: hsl(var(--foreground));
          border: 1px solid hsl(var(--border));
        }
        .dark-modal .ant-modal-header {
          background-color: transparent;
          border-bottom: 1px solid hsl(var(--border));
        }
        .dark-modal .ant-modal-title {
          color: hsl(var(--foreground));
        }
        .dark-modal .ant-modal-close {
          color: hsl(var(--muted-foreground));
        }
        .dark-modal .ant-input, .dark-modal .ant-select-selector {
          background-color: hsl(var(--secondary) / 0.5) !important;
          border-color: hsl(var(--border)) !important;
          color: hsl(var(--foreground)) !important;
        }
        .dark-modal .ant-modal-footer .ant-btn-default {
          background: transparent;
          color: hsl(var(--foreground));
          border-color: hsl(var(--border));
        }
      `}</style>
    </>
  )
}
