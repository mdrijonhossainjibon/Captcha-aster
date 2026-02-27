'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Loader2, Eye, Trash2 } from "lucide-react"
import { Solution, Pagination, TYPE_ICONS, TYPE_COLORS, SERVICE_COLORS, b64ToSrc, formatSolution } from "./_types"

// ── Solutions Table ───────────────────────────────────────────────────────────
interface TableProps {
    solutions: Solution[]
    loading: boolean
    pagination: Pagination | null
    onRowClick: (sol: Solution) => void
    onDelete: (id: string, e: React.MouseEvent) => void
}

export function SolutionsTable({ solutions, loading, pagination, onRowClick, onDelete }: TableProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Solution Cache</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                    {pagination?.total ?? 0} cached solutions · Click a row to view images
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center py-14">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : solutions.length === 0 ? (
                    <div className="text-center py-14 text-muted-foreground">
                        <Database className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">No cached solutions found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <table className="w-full min-w-[640px]">
                            <thead>
                                <tr className="border-b border-border text-left">
                                    {["Hash", "Question", "Service", "Type", "Preview", "Images", "Cached At", ""].map(h => (
                                        <th key={h} className="py-2.5 px-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {solutions.map((sol, i) => {
                                    const TypeIcon = TYPE_ICONS[sol.type] || Database
                                    const hasImages = sol.imageData?.length > 0
                                    return (
                                        <tr key={sol.id}
                                            className="border-b border-border hover:bg-secondary/60 transition-colors cursor-pointer group"
                                            style={{ opacity: 0, animation: `slideInUp 0.4s ease-out ${i * 30}ms forwards` }}
                                            onClick={() => onRowClick(sol)}
                                        >
                                            <td className="py-2.5 px-3 font-mono text-[11px] text-muted-foreground">{sol.hash}</td>
                                            <td className="py-2.5 px-3 text-xs max-w-[160px]">
                                                <p className="truncate group-hover:text-primary transition-colors" title={sol.question}>{sol.question || '—'}</p>
                                            </td>
                                            <td className="py-2.5 px-3">
                                                <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${SERVICE_COLORS[sol.service] || 'bg-muted text-muted-foreground'}`}>
                                                    {sol.service}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${TYPE_COLORS[sol.type] || 'bg-muted/50 text-muted-foreground border-border'}`}>
                                                    <TypeIcon className="w-3 h-3" />
                                                    {sol.type?.replace('object', '') || '—'}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3 text-[11px] text-muted-foreground font-mono max-w-[140px] truncate" title={JSON.stringify(sol.solution)}>
                                                {formatSolution(sol.solution, sol.type)}
                                            </td>
                                            <td className="py-2.5 px-3">
                                                <div className="flex flex-col gap-1">
                                                    {hasImages ? (
                                                        <div className="flex items-center gap-1">
                                                            <div className="flex -space-x-1.5">
                                                                {sol.imageData.slice(0, 3).map((img, idx) => (
                                                                    <div key={idx} className="w-6 h-6 rounded overflow-hidden border-2 border-card ring-1 ring-border">
                                                                        <img src={b64ToSrc(img)} alt="" className="w-full h-full object-cover" />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            {sol.imageData.length > 3 && (
                                                                <span className="text-[11px] text-muted-foreground">+{sol.imageData.length - 3}</span>
                                                            )}
                                                            <Eye className="w-3 h-3 text-primary/70 ml-0.5" />
                                                        </div>
                                                    ) : (
                                                        <span className="text-[11px] text-muted-foreground/50">No images</span>
                                                    )}
                                                    {sol.examples?.length > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-6 h-6 rounded overflow-hidden border-2 border-teal-500/60">
                                                                <img src={b64ToSrc(sol.examples[0])} alt="ref" className="w-full h-full object-cover" />
                                                            </div>
                                                            <span className="text-[10px] font-bold text-teal-600 bg-teal-500/10 px-1 py-0.5 rounded">
                                                                REF{sol.examples.length > 1 ? ` ×${sol.examples.length}` : ''}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-3 text-[11px] text-muted-foreground whitespace-nowrap">
                                                {new Date(sol.createdAt).toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="py-2.5 px-3" onClick={e => e.stopPropagation()}>
                                                <Button size="sm" variant="outline"
                                                    className="bg-transparent border-red-500/40 text-red-500 hover:bg-red-500 hover:text-white h-7 w-7 p-0"
                                                    onClick={(e) => onDelete(sol.id, e)}>
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// ── Pagination ────────────────────────────────────────────────────────────────
interface PaginationBarProps {
    currentPage: number
    itemsPerPage: number
    pagination: Pagination
    loading: boolean
    solutionCount: number
    onPrev: () => void
    onNext: () => void
}

export function PaginationBar({ currentPage, itemsPerPage, pagination, loading, solutionCount, onPrev, onNext }: PaginationBarProps) {
    if (loading || solutionCount === 0) return null
    return (
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs sm:text-sm text-muted-foreground">
                {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total}
            </span>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onPrev} disabled={!pagination.hasPrevPage} className="text-xs">Previous</Button>
                <span className="text-xs sm:text-sm px-2">{currentPage} / {pagination.totalPages || 1}</span>
                <Button variant="outline" size="sm" onClick={onNext} disabled={!pagination.hasNextPage} className="text-xs">Next</Button>
            </div>
        </div>
    )
}
