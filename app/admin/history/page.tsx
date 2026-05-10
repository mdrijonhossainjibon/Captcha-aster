'use client'

import { useState, useEffect, useCallback } from "react"
import {
  Search, RefreshCw, ChevronLeft, ChevronRight,
  CreditCard, TrendingUp, Gift, ArrowUp, Coins, History,
  User, Calendar, FilterX, Loader2, FileText, ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Tx {
  id: string; type: string; credits: number;
  amount: number; date: string; time: string; status: string;
  label: string; meta: string; userName: string; userEmail: string;
}

interface Stats {
  total: number; page: number; limit: number; totalPages: number;
}
const typeIcons: Record<string, any> = {
  purchase: { icon: Coins, bg: "bg-primary/10", color: "text-primary", label: "Credit Purchase" },
  deposit: { icon: TrendingUp, bg: "bg-green-500/10", color: "text-green-500", label: "Crypto Deposit" },
  redeem: { icon: Gift, bg: "bg-purple-500/10", color: "text-purple-500", label: "Promo Redeem" },
  usage: { icon: ArrowUp, bg: "bg-orange-500/10", color: "text-orange-500", label: "API Usage" },
}

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'purchase', label: 'Purchase' },
  { value: 'deposit', label: 'Deposit' },
  { value: 'redeem', label: 'Redeem' },
  { value: 'usage', label: 'Usage' },
]
export default function AdminHistoryPage() {
  const [data, setData] = useState<Tx[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, page: 1, limit: 20, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [page, setPage] = useState(1)
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false)
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (typeFilter) params.set("type", typeFilter)
      params.set("page", String(page))
      params.set("limit", "20")
      params.set("t", String(Date.now()))
      const res = await fetch("/api/admin/history?" + params.toString())
      const json = await res.json()
      if (json.success) {
        setData(json.data)
        setStats(json.stats)
      }
    } catch (err) {
      console.error("Failed to fetch history:", err)
    } finally {
      setLoading(false)
    }
  }, [search, typeFilter, page])

  useEffect(() => { fetchData() }, [fetchData])

  const handleSearch = () => { setPage(1); setTimeout(fetchData, 0) }
  const clearFilters = () => { setSearch(""); setTypeFilter(""); setPage(1); setTimeout(fetchData, 0) }
  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: 'bg-green-500/15 text-green-400 border-green-500/25',
      completed: 'bg-green-500/15 text-green-400 border-green-500/25',
      success: 'bg-green-500/15 text-green-400 border-green-500/25',
      pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
      failed: 'bg-red-500/15 text-red-400 border-red-500/25',
      cancelled: 'bg-gray-500/15 text-gray-400 border-gray-500/25',
      expired: 'bg-gray-500/15 text-gray-400 border-gray-500/25',
    }
    return map[status] || 'bg-gray-500/15 text-gray-400 border-gray-500/25'
  }


  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-5 h-5 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">All History</h1>
          </div>
          <p className="text-sm text-muted-foreground">View all transactions across users</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm hover:bg-secondary/80 transition-colors">
          <RefreshCw className="w-4 h-4" /> Reload
        </button>
      </div>
      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search by user name or email..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:outline-none text-sm placeholder:text-muted-foreground/60"
          />
        </div>
        {/* Type Filter */}
        <div className="relative">
          <button
            onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm hover:bg-secondary/80 transition-colors"
          >
            <FileText className="w-4 h-4" />
            {typeOptions.find(o => o.value === typeFilter)?.label || 'All Types'}
            <ChevronDown className="w-4 h-4" />
          </button>
          {typeDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setTypeDropdownOpen(false)} />
              <div className="absolute top-full mt-1 left-0 z-20 w-44 rounded-xl bg-card border border-border shadow-xl overflow-hidden">
                {typeOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setTypeFilter(opt.value); setTypeDropdownOpen(false); setPage(1); setTimeout(fetchData, 0) }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-secondary/50 transition-colors ${typeFilter === opt.value ? 'text-primary bg-primary/5' : 'text-muted-foreground'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        {(search || typeFilter) && (
          <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors">
            <FilterX className="w-4 h-4" /> Clear
          </button>
        )}
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-card border border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Transactions</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{stats.total}</p>
        </div>
        <div className="rounded-xl bg-card border border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Page</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{stats.page} / {stats.totalPages}</p>
        </div>
        <div className="rounded-xl bg-card border border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Per Page</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{stats.limit}</p>
        </div>
        <div className="rounded-xl bg-card border border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Filtered</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{data.length}</p>
        </div>
      </div>
      {/* Table or States */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <History className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg font-medium">No transactions found</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left px-5 py-4 font-medium text-muted-foreground">User</th>
                  <th className="text-right px-5 py-4 font-medium text-muted-foreground">Credits</th>
                  <th className="text-right px-5 py-4 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left px-5 py-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-center px-5 py-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-5 py-4 font-medium text-muted-foreground">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((tx, idx) => {
                  const iconConfig = typeIcons[tx.type] || { icon: FileText, bg: 'bg-gray-500/10', color: 'text-gray-400', label: tx.label }
                  const Icon = iconConfig.icon
                  return (
                    <tr key={tx.id || idx} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconConfig.bg}`}>
                            <Icon className={`w-5 h-5 ${iconConfig.color}`} />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{iconConfig.label}</p>
                            <p className="text-xs text-muted-foreground">{tx.label}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground shrink-0" />
                          <div>
                            <p className="text-foreground">{tx.userName || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">{tx.userEmail || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="font-medium text-foreground">{tx.credits.toLocaleString()}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-muted-foreground">
                          {tx.amount > 0 ? '$' + tx.amount.toFixed(2) : '-'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-foreground">{tx.date}</p>
                          <p className="text-xs text-muted-foreground">{tx.time}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${statusBadge(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-muted-foreground text-xs max-w-[200px] truncate" title={tx.meta}>
                          {tx.meta || '-'}
                        </p>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Pagination */}
      {stats.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {stats.page} of {stats.totalPages} ({stats.total} total)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setPage(p => Math.max(1, p - 1)); setTimeout(fetchData, 0) }}
              disabled={stats.page <= 1}
              className="p-2.5 rounded-xl bg-secondary/50 border border-border hover:bg-secondary/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1.5 text-sm text-muted-foreground">{stats.page}</span>
            <button
              onClick={() => { setPage(p => Math.min(stats.totalPages, p + 1)); setTimeout(fetchData, 0) }}
              disabled={stats.page >= stats.totalPages}
              className="p-2.5 rounded-xl bg-secondary/50 border border-border hover:bg-secondary/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
