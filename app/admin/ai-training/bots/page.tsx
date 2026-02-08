'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal, message } from "antd"
import {
    Search,
    Trash2,
    Loader2,
    Eye,
    Edit,
    Hash,
    Calendar,
    Database,
    RefreshCw
} from "lucide-react"

interface KolotiCacheRecord {
    id: string
    imageHash: string
    imageData: string
    question: string
    answer: number[]
    rawResponse: any
    createdAt: string
}

export default function KolotiCachePage() {
    const [records, setRecords] = useState<KolotiCacheRecord[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
    })
    const [selectedRecord, setSelectedRecord] = useState<KolotiCacheRecord | null>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingRecord, setEditingRecord] = useState<KolotiCacheRecord | null>(null)
    const [answerInput, setAnswerInput] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    // Fetch records from API
    useEffect(() => {
        fetchRecords()
    }, [currentPage, itemsPerPage])

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm])

    // Fetch when page resets
    useEffect(() => {
        if (currentPage === 1) {
            fetchRecords()
        }
    }, [currentPage])

    const fetchRecords = async () => {
        try {
            setIsLoading(true)
            const params = new URLSearchParams()
            if (searchTerm) params.append('search', searchTerm)
            params.append('page', currentPage.toString())
            params.append('limit', itemsPerPage.toString())

            const response = await fetch(`/api/admin/ai-training/koloti-cache?${params.toString()}`)
            const data = await response.json()

            if (data.success) {
                setRecords(data.records)
                setPagination(data.pagination)
            } else {
                message.error(data.error || 'Failed to fetch records')
            }
        } catch (error) {
            console.error('Error fetching records:', error)
            message.error('Failed to fetch records')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteRecord = async (recordId: string) => {
        Modal.confirm({
            title: 'Delete Record',
            content: 'Are you sure you want to delete this cache record? This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    const response = await fetch(`/api/admin/ai-training/koloti-cache?recordId=${recordId}`, {
                        method: 'DELETE'
                    })

                    const data = await response.json()

                    if (data.success) {
                        message.success('Record deleted successfully')
                        fetchRecords()
                    } else {
                        message.error(data.error || 'Failed to delete record')
                    }
                } catch (error) {
                    console.error('Error deleting record:', error)
                    message.error('Failed to delete record')
                }
            }
        })
    }

    const viewDetails = (record: KolotiCacheRecord) => {
        setSelectedRecord(record)
        setIsDetailModalOpen(true)
    }

    const openEditModal = (record: KolotiCacheRecord) => {
        setEditingRecord(record)
        setAnswerInput(record.answer.join(', '))
        setIsEditModalOpen(true)
    }

    const handleEditAnswer = async () => {
        if (!editingRecord) return

        try {
            setIsSaving(true)

            // Parse the answer input
            const answerArray = answerInput
                .split(',')
                .map(item => item.trim())
                .filter(item => item !== '')
                .map(item => {
                    const num = parseFloat(item)
                    if (isNaN(num)) {
                        throw new Error(`Invalid number: ${item}`)
                    }
                    return num
                })

            if (answerArray.length === 0) {
                message.error('Answer cannot be empty')
                return
            }

            const response = await fetch('/api/admin/ai-training/koloti-cache', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recordId: editingRecord.id,
                    answer: answerArray
                })
            })

            const data = await response.json()

            if (data.success) {
                message.success('Answer updated successfully')
                setIsEditModalOpen(false)
                fetchRecords()
            } else {
                message.error(data.error || 'Failed to update answer')
            }
        } catch (error: any) {
            console.error('Error updating answer:', error)
            message.error(error.message || 'Failed to update answer')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">Koloti Cache</h1>
                        <p className="text-muted-foreground">AI training cache records and responses</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchRecords}
                            disabled={isLoading}
                            className="gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total Records</p>
                            <p className="text-2xl font-bold text-foreground">{pagination.total}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Cache</p>
                                <p className="text-2xl font-bold text-foreground">{pagination.total}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-blue-500/10">
                                <Database className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Current Page</p>
                                <p className="text-2xl font-bold text-foreground">{currentPage}/{pagination.totalPages}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-purple-500/10">
                                <Hash className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Records/Page</p>
                                <p className="text-2xl font-bold text-foreground">{itemsPerPage}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-green-500/10">
                                <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by image hash or question..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Records Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Cache Records</CardTitle>
                    <CardDescription>{pagination.total} total records</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : records.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No records found
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Image</th>
                                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Image Hash</th>
                                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Question</th>
                                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Answer</th>
                                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Created At</th>
                                        <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((record, index) => (
                                        <tr
                                            key={record.id}
                                            className="border-b border-border hover:bg-secondary/50 transition-colors"
                                            style={{
                                                opacity: 0,
                                                animation: `slideInUp 0.5s ease-out ${index * 50}ms forwards`,
                                            }}
                                        >
                                            <td className="py-4 px-4">
                                                <img
                                                    src={record.imageData}
                                                    alt="Captcha"
                                                    className="w-16 h-16 object-cover rounded-lg border border-border cursor-pointer hover:scale-105 transition-transform"
                                                    onClick={() => viewDetails(record)}
                                                />
                                            </td>
                                            <td className="py-4 px-4">
                                                <code className="text-xs bg-secondary px-2 py-1 rounded">
                                                    {record.imageHash.substring(0, 12)}...
                                                </code>
                                            </td>
                                            <td className="py-4 px-4 max-w-xs">
                                                <p className="text-sm text-foreground truncate">{record.question}</p>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-sm font-mono text-foreground">
                                                    [{record.answer.join(', ')}]
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-muted-foreground">
                                                {record.createdAt}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="bg-transparent border-blue-500/50 text-blue-500 hover:bg-blue-500 hover:text-white text-xs gap-1 h-8 px-3"
                                                        onClick={() => viewDetails(record)}
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                        View
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="bg-transparent border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-white text-xs gap-1 h-8 px-3"
                                                        onClick={() => openEditModal(record)}
                                                    >
                                                        <Edit className="w-3 h-3" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="bg-transparent border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white text-xs gap-1 h-8 px-3"
                                                        onClick={() => handleDeleteRecord(record.id)}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {!isLoading && records.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} records
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Items per page selector */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Rows per page:</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value))
                                    setCurrentPage(1)
                                }}
                                className="px-3 py-1.5 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>

                        {/* Page navigation */}
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={!pagination.hasPrevPage}
                                className="h-8 px-3"
                            >
                                Previous
                            </Button>

                            {/* Page numbers */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    let pageNum
                                    if (pagination.totalPages <= 5) {
                                        pageNum = i + 1
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1
                                    } else if (currentPage >= pagination.totalPages - 2) {
                                        pageNum = pagination.totalPages - 4 + i
                                    } else {
                                        pageNum = currentPage - 2 + i
                                    }

                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(pageNum)}
                                            className="h-8 w-8 p-0"
                                        >
                                            {pageNum}
                                        </Button>
                                    )
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                                disabled={!pagination.hasNextPage}
                                className="h-8 px-3"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            <Modal
                title="Cache Record Details"
                open={isDetailModalOpen}
                onCancel={() => setIsDetailModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsDetailModalOpen(false)}>
                        Close
                    </Button>
                ]}
                width={700}
            >
                {selectedRecord && (
                    <div className="space-y-4 py-4">
                        <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">Image</label>
                            <div className="flex justify-center p-4 bg-secondary/50 rounded-xl border border-border">
                                <img
                                    src={selectedRecord.imageData}
                                    alt="Captcha"
                                    className="max-w-full h-auto rounded-lg"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">Image Hash</label>
                            <code className="block w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground text-xs break-all">
                                {selectedRecord.imageHash}
                            </code>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">Question</label>
                            <p className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground">
                                {selectedRecord.question}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">Answer</label>
                            <code className="block w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground font-mono">
                                [{selectedRecord.answer.join(', ')}]
                            </code>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">Raw Response</label>
                            <pre className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground text-xs overflow-auto max-h-64">
                                {JSON.stringify(selectedRecord.rawResponse, null, 2)}
                            </pre>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">Created At</label>
                            <p className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground">
                                {selectedRecord.createdAt}
                            </p>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Edit Answer Modal */}
            <Modal
                title="Edit Answer"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={[
                    <Button
                        key="cancel"
                        variant="outline"
                        onClick={() => setIsEditModalOpen(false)}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        className="bg-amber-500 hover:bg-amber-600"
                        onClick={handleEditAnswer}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                ]}
                width={600}
            >
                {editingRecord && (
                    <div className="space-y-4 py-4">
                        <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">Image</label>
                            <div className="flex justify-center p-4 bg-secondary/50 rounded-xl border border-border">
                                <img
                                    src={editingRecord.imageData}
                                    alt="Captcha"
                                    className="max-w-full h-auto rounded-lg"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">
                                Image Hash
                            </label>
                            <code className="block w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground text-xs break-all">
                                {editingRecord.imageHash}
                            </code>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">
                                Question
                            </label>
                            <p className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground">
                                {editingRecord.question}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">
                                Answer <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={answerInput}
                                onChange={(e) => setAnswerInput(e.target.value)}
                                placeholder="Enter numbers separated by commas (e.g., 1, 2, 3)"
                                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-foreground outline-none transition-all font-mono"
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                Enter numbers separated by commas. Example: 1, 2, 3, 4
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">
                                Current Answer
                            </label>
                            <code className="block w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground font-mono">
                                [{editingRecord.answer.join(', ')}]
                            </code>
                        </div>
                    </div>
                )}
            </Modal>

            <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    )
}
