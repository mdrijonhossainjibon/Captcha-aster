"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, File, Loader2, Cloud, Database } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface BotEndpoint {
    _id: string
    botName: string
    endpoint: string
    port: number
    protocol: string
    isActive: boolean
}

function UploadCard({
    title,
    description,
    icon: Icon,
    accent,
    showEndpointSelect,
    endpoints,
    loadingEndpoints,
    selectedEndpoint,
    onEndpointChange,
    uploadTarget,
    file,
    onFileChange,
    onUpload,
    uploading,
}: {
    title: string
    description: string
    icon: any
    accent: string
    showEndpointSelect?: boolean
    endpoints?: BotEndpoint[]
    loadingEndpoints?: boolean
    selectedEndpoint?: string
    onEndpointChange?: (v: string) => void
    uploadTarget: string
    file: File | null
    onFileChange: (f: File | null) => void
    onUpload: () => void
    uploading: boolean
}) {
    return (
        <Card className="border-border/60 overflow-hidden">
            <div className={`h-1.5 w-full bg-gradient-to-r ${accent}`} />
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", accent.replace("from-", "bg-").replace("/80", "/10").split(" ")[0].replace("via-", "").replace("to-", ""))}>
                        <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                        <CardTitle className="text-base">{title}</CardTitle>
                        <CardDescription className="text-xs">{description}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {showEndpointSelect && endpoints && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Bot Endpoint</label>
                        {loadingEndpoints ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Loading...
                            </div>
                        ) : endpoints.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No endpoints found.{" "}
                                <a href="/admin/ai-training/bot-endpoints" className="text-primary hover:underline">
                                    Create one
                                </a>
                            </p>
                        ) : (
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const el = document.getElementById(`dd-${uploadTarget}`)
                                        const backdrop = document.getElementById(`dd-backdrop-${uploadTarget}`)
                                        const isHidden = el?.classList.contains("hidden")
                                        document.querySelectorAll("[id^='dd-']:not([id*='backdrop'])").forEach(e => e.classList.add("hidden"))
                                        if (isHidden) {
                                            el?.classList.remove("hidden")
                                            backdrop?.classList.remove("hidden")
                                        }
                                    }}
                                    className="w-full h-11 px-3 rounded-xl bg-secondary/50 border border-border text-sm flex items-center justify-between gap-2 hover:bg-secondary/80 transition-colors"
                                >
                                    <span className="truncate text-foreground">
                                        {endpoints.find((ep: BotEndpoint) => ep._id === selectedEndpoint)?.botName || "Select endpoint"}
                                    </span>
                                    <svg className="w-4 h-4 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                <div
                                    id={`dd-backdrop-${uploadTarget}`}
                                    className="hidden fixed inset-0 z-40"
                                    onClick={() => {
                                        document.getElementById(`dd-${uploadTarget}`)?.classList.add("hidden")
                                        document.getElementById(`dd-backdrop-${uploadTarget}`)?.classList.add("hidden")
                                    }}
                                />
                                <div
                                    id={`dd-${uploadTarget}`}
                                    className="hidden absolute top-full mt-1 left-0 right-0 z-50 rounded-xl bg-card border border-border shadow-xl overflow-hidden max-h-60 overflow-y-auto"
                                >
                                    {endpoints.map((ep: BotEndpoint) => {
                                        const isActive = ep.isActive
                                        const selected = ep._id === selectedEndpoint
                                        return (
                                            <button
                                                key={ep._id}
                                                type="button"
                                                onClick={() => {
                                                    onEndpointChange?.(ep._id)
                                                    document.getElementById(`dd-${uploadTarget}`)?.classList.add("hidden")
                                                    document.getElementById(`dd-backdrop-${uploadTarget}`)?.classList.add("hidden")
                                                }}
                                                className={`w-full px-3 py-2.5 text-left text-sm flex items-center justify-between gap-2 transition-colors ${
                                                    selected
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-foreground hover:bg-secondary/50"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? "bg-green-500" : "bg-gray-500"}`} />
                                                    <span className="truncate font-medium">{ep.botName}</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground shrink-0">{ep.protocol}://{ep.endpoint}:{ep.port}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Model File (.pt)</label>
                    <div
                        className="relative border-2 border-dashed border-border rounded-xl p-6 text-center transition-colors hover:border-primary/40 cursor-pointer"
                        onClick={() => document.getElementById(`upload-${uploadTarget}`)?.click()}
                    >
                        <input
                            id={`upload-${uploadTarget}`}
                            type="file"
                            accept=".pt"
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files?.[0]
                                if (f && f.name.endsWith(".pt")) {
                                    onFileChange(f)
                                } else {
                                    toast({ title: "Invalid File", description: "Only .pt files are allowed.", variant: "destructive" })
                                    e.target.value = ""
                                }
                            }}
                        />
                        {file ? (
                            <div className="flex flex-col items-center gap-2">
                                <File className="w-8 h-8 text-primary" />
                                <p className="text-sm font-medium text-foreground truncate max-w-full">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onFileChange(null) }}>
                                    Remove
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <Upload className="w-8 h-8 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Drop .pt file or click to browse</p>
                            </div>
                        )}
                    </div>
                </div>

                <Button
                    onClick={onUpload}
                    disabled={!file || uploading}
                    className="w-full h-11 rounded-xl font-semibold"
                >
                    {uploading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Upload to {title}
                        </div>
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}

export default function UploadModelContent() {
    const [endpoints, setEndpoints] = useState<BotEndpoint[]>([])
    const [loadingEndpoints, setLoadingEndpoints] = useState(true)
    const [isVisible, setIsVisible] = useState(false)

    const [awsEndpointId, setAwsEndpointId] = useState("")
    const [kbsEndpointId, setKbsEndpointId] = useState("")
    const [awsFile, setAwsFile] = useState<File | null>(null)
    const [uploadingAws, setUploadingAws] = useState(false)
    const [kbsFile, setKbsFile] = useState<File | null>(null)
    const [uploadingKbs, setUploadingKbs] = useState(false)

    useEffect(() => {
        setIsVisible(true)
        fetchEndpoints()
    }, [])

    const fetchEndpoints = async () => {
        try {
            const res = await fetch("/api/admin/bot-endpoints")
            const data = await res.json()
            if (data.success) {
                setEndpoints(data.endpoints)
                if (data.endpoints.length > 0) {
                    setAwsEndpointId(data.endpoints[0]._id)
                    setKbsEndpointId(data.endpoints[0]._id)
                }
            }
        } catch {
            console.error("Failed to fetch endpoints")
        } finally {
            setLoadingEndpoints(false)
        }
    }

    const doUpload = async (url: string, file: File, endpointId?: string, onDone?: () => void) => {
        const formData = new FormData()
        formData.append("file", file)
        if (endpointId) formData.append("botEndpointId", endpointId)

        try {
            const res = await fetch(url, { method: "POST", body: formData })
            const data = await res.json()
            if (data.success) {
                toast({ title: "Upload Successful", description: `${file.name} uploaded successfully.` })
                onDone?.()
            } else {
                toast({ title: "Upload Failed", description: data.error || "Something went wrong.", variant: "destructive" })
            }
        } catch {
            toast({ title: "Error", description: "Network error. Please try again.", variant: "destructive" })
        }
    }

    return (
        <div
            className="space-y-6 p-4 sm:p-6"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(12px)",
                transition: "all 0.5s ease-out",
            }}
        >
            <div>
                <h1 className="text-2xl font-bold text-foreground">Upload Model</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Upload .pt model files to AWS or KBS
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AWS Card */}
                <UploadCard
                    title="AWS"
                    description="Upload model to AWS cloud"
                    icon={Cloud}
                    accent="from-orange-500/80 via-orange-400/40 to-transparent"
                    showEndpointSelect
                    endpoints={endpoints}
                    loadingEndpoints={loadingEndpoints}
                    selectedEndpoint={awsEndpointId}
                    onEndpointChange={setAwsEndpointId}
                    uploadTarget="aws"
                    file={awsFile}
                    onFileChange={setAwsFile}
                    uploading={uploadingAws}
                    onUpload={async () => {
                        if (!awsFile) return
                        setUploadingAws(true)
                        await doUpload("/api/admin/upload-model/aws", awsFile, awsEndpointId, () => setAwsFile(null))
                        setUploadingAws(false)
                    }}
                />

                {/* KBS Card */}
                <UploadCard
                    title="KBS"
                    description="Upload model to KBS"
                    icon={Database}
                    accent="from-emerald-500/80 via-emerald-400/40 to-transparent"
                    showEndpointSelect
                    endpoints={endpoints}
                    loadingEndpoints={loadingEndpoints}
                    selectedEndpoint={kbsEndpointId}
                    onEndpointChange={setKbsEndpointId}
                    uploadTarget="kbs"
                    file={kbsFile}
                    onFileChange={setKbsFile}
                    uploading={uploadingKbs}
                    onUpload={async () => {
                        if (!kbsFile) return
                        setUploadingKbs(true)
                        await doUpload("/api/admin/upload-model/kbs", kbsFile, kbsEndpointId, () => setKbsFile(null))
                        setUploadingKbs(false)
                    }}
                />
            </div>
        </div>
    )
}
