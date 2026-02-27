'use client'

import { useState, useEffect, useCallback, useRef } from "react"
import { Modal, message } from "antd"
import { Solution, Stats, Pagination } from "./_types"
import { ImageViewModal } from "./_image-modal"
import { StatsCards, FiltersBar } from "./_stats-filters"
import { SolutionsTable, PaginationBar } from "./_table"

/** Debounce: returns a value that updates only after `delay` ms of no changes */
function useDebounce<T>(value: T, delay = 450): T {
    const [debounced, setDebounced] = useState(value)
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(t)
    }, [value, delay])
    return debounced
}

export default function AdminSolutionsContent() {
    const [solutions, setSolutions] = useState<Solution[]>([])
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(false)

    // ── Filters ─────────────────────────────────────────────────────────────
    const [searchInput, setSearchInput] = useState("")   // live input value
    const [serviceFilter, setServiceFilter] = useState("")
    const [typeFilter, setTypeFilter] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(20)
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [viewSolution, setViewSolution] = useState<Solution | null>(null)

    // Debounced search — API only fires 450 ms after the user stops typing
    const debouncedSearch = useDebounce(searchInput, 450)

    // ── Fetch ────────────────────────────────────────────────────────────────
    const fetchSolutions = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (debouncedSearch) params.append('search', debouncedSearch)
            if (serviceFilter) params.append('service', serviceFilter)
            if (typeFilter) params.append('type', typeFilter)
            params.append('page', currentPage.toString())
            params.append('limit', itemsPerPage.toString())

            const res = await fetch(`/api/admin/solutions?${params}`)
            const data = await res.json()
            if (data.success) {
                setSolutions(data.solutions)
                setPagination(data.pagination)
                setStats(data.stats)
            } else {
                message.error(data.error || 'Failed to fetch solutions')
            }
        } catch {
            message.error('Network error')
        } finally {
            setLoading(false)
        }
    }, [debouncedSearch, serviceFilter, typeFilter, currentPage, itemsPerPage])

    useEffect(() => { fetchSolutions() }, [fetchSolutions])

    // Reset to page 1 whenever filters change
    useEffect(() => { setCurrentPage(1) }, [debouncedSearch, serviceFilter, typeFilter])

    // ── Actions ──────────────────────────────────────────────────────────────
    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        Modal.confirm({
            title: 'Delete Solution',
            content: 'Remove this cached solution?',
            okText: 'Delete', okType: 'danger',
            onOk: async () => {
                const res = await fetch(`/api/admin/solutions?solutionId=${id}`, { method: 'DELETE' })
                const d = await res.json()
                if (d.success) { message.success('Deleted'); fetchSolutions() }
                else message.error(d.error)
            },
        })
    }

    const handleClearAll = () => {
        Modal.confirm({
            title: 'Clear All Solutions',
            content: 'This will delete ALL cached solutions. This cannot be undone!',
            okText: 'Clear All', okType: 'danger',
            onOk: async () => {
                const res = await fetch('/api/admin/solutions?clearAll=true', { method: 'DELETE' })
                const d = await res.json()
                if (d.success) { message.success(d.message); fetchSolutions() }
                else message.error(d.error)
            },
        })
    }

    return (
        <>
            {viewSolution && (
                <ImageViewModal solution={viewSolution} onClose={() => setViewSolution(null)} />
            )}

            <StatsCards stats={stats} />

            <FiltersBar
                searchTerm={searchInput}          // show live value in input
                serviceFilter={serviceFilter}
                typeFilter={typeFilter}
                onSearch={setSearchInput}         // update live, debounce handles API
                onService={setServiceFilter}
                onType={setTypeFilter}
                onRefresh={fetchSolutions}
                onClearAll={handleClearAll}
                isSearching={searchInput !== debouncedSearch} // show spinner while waiting
            />

            <SolutionsTable
                solutions={solutions}
                loading={loading}
                pagination={pagination}
                onRowClick={setViewSolution}
                onDelete={handleDelete}
            />

            {pagination && (
                <PaginationBar
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    pagination={pagination}
                    loading={loading}
                    solutionCount={solutions.length}
                    onPrev={() => setCurrentPage(p => Math.max(1, p - 1))}
                    onNext={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                />
            )}

            <style>{`
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    )
}
