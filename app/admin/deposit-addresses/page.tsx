"use client"

import { useEffect, useState } from "react"
import {
    Search,
    Wallet,
    Shield,
    Lock,
    Key,
    ToggleLeft,
    ToggleRight,
    RefreshCw,
    ExternalLink,
    Copy,
    CheckCircle2,
    Loader2,
    Eye,
    EyeOff,
    Trash2,
    AlertTriangle,
    ArrowDownToLine,
    Zap,
    AlertCircle as AlertIcon,
    Plus
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input, Switch, Table, Tag, message, Space, Modal, Tooltip, Pagination, Form } from "antd"

interface DepositAddress {
    _id: string
    userId: {
        _id: string
        name: string
        email: string
    }
    cryptoId: string
    networkId: string
    address: string
    privateKey: string
    isActive: boolean
    lastBalance: number
    createdAt: string
    lastUsedAt?: string
}

export default function AdminDepositAddresses() {
    const [addresses, setAddresses] = useState<DepositAddress[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [limit] = useState(20)
    const [showKeyId, setShowKeyId] = useState<string | null>(null)
    const [showKeyModal, setShowKeyModal] = useState(false)
    const [selectedKey, setSelectedKey] = useState<string>("")
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const [sweeping, setSweeping] = useState(false)
    const [sweepResults, setSweepResults] = useState<any[] | null>(null)
    const [showResultsModal, setShowResultsModal] = useState(false)
    const [isMasterModalOpen, setIsMasterModalOpen] = useState(false)
    const [missingNetwork, setMissingNetwork] = useState<string>("")
    const [masterForm] = Form.useForm()

    const fetchAddresses = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/deposit-addresses?page=${page}&limit=${limit}&search=${search}`)
            const result = await res.json()
            if (result.success) {
                setAddresses(result.data)
                setTotal(result.pagination.total)
            }
        } catch (error) {
            message.error("Failed to fetch addresses")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAddresses()
        }, 500)
        return () => clearTimeout(timer)
    }, [search, page])

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch('/api/admin/deposit-addresses', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isActive: !currentStatus })
            })
            const result = await res.json()
            if (result.success) {
                message.success("Address status updated")
                setAddresses(addresses.map(addr => addr._id === id ? { ...addr, isActive: !currentStatus } : addr))
            }
        } catch (error) {
            message.error("Failed to update status")
        }
    }

    const handleSweep = async () => {
        if (selectedRowKeys.length === 0) return

        Modal.confirm({
            title: 'Withdraw funds from selected wallets?',
            icon: <ArrowDownToLine className="text-primary w-5 h-5 mr-2" />,
            content: `This will attempt to transfer all funds from ${selectedRowKeys.length} selected wallets to the Master Admin Wallet.`,
            okText: 'Initiate Withdrawal',
            cancelText: 'Cancel',
            async onOk() {
                setSweeping(true)
                try {
                    const res = await fetch('/api/admin/crypto/sweep', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ addressIds: selectedRowKeys })
                    })
                    const result = await res.json()
                    if (result.success) {
                        setSweepResults(result.results)
                        setShowResultsModal(true)
                        fetchAddresses()
                    } else {
                        message.error(result.error)
                    }
                } catch (error) {
                    message.error("Failed to initiate withdrawal")
                } finally {
                    setSweeping(false)
                }
            }
        })
    }

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Delete Deposit Address?',
            icon: <AlertTriangle className="text-destructive w-5 h-5 mr-2" />,
            content: 'This will permanently delete this deposit address tracking. This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            async onOk() {
                try {
                    const res = await fetch(`/api/admin/deposit-addresses?id=${id}`, {
                        method: 'DELETE'
                    })
                    const result = await res.json()
                    if (result.success) {
                        message.success("Address deleted successfully")
                        setAddresses(addresses.filter(addr => addr._id !== id))
                    } else {
                        message.error(result.error)
                    }
                } catch (error) {
                    message.error("Failed to delete address")
                }
            }
        })
    }

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        message.success(`${label} copied to clipboard`)
    }

    const columns = [
        {
            title: 'User',
            key: 'user',
            render: (_: any, record: DepositAddress) => (
                <div className="flex flex-col">
                    <span className="font-bold text-sm text-foreground">{record.userId?.name || 'Unknown'}</span>
                    <span className="text-xs text-muted-foreground">{record.userId?.email || 'N/A'}</span>
                </div>
            )
        },
        {
            title: 'Asset',
            key: 'asset',
            render: (_: any, record: DepositAddress) => (
                <div className="flex items-center gap-2">
                    <Tag color="gold" className="uppercase font-bold text-[10px]">{record.cryptoId}</Tag>
                    <Tag className="uppercase text-[10px]">{record.networkId}</Tag>
                </div>
            )
        },
        {
            title: 'Address',
            key: 'address',
            render: (_: any, record: DepositAddress) => (
                <div className="flex items-center gap-2">
                    <code className="text-xs font-mono bg-secondary/50 px-2 py-1 rounded select-all max-w-[200px] truncate">
                        {record.address}
                    </code>
                    <Tooltip title="Copy Address">
                        <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => copyToClipboard(record.address, 'Address')}>
                            <Copy className="w-3 h-3" />
                        </Button>
                    </Tooltip>
                </div>
            )
        },
        {
            title: 'Current Balance',
            key: 'balance',
            render: (_: any, record: DepositAddress) => (
                <div className="flex flex-col">
                    <span className="font-bold text-sm text-primary">
                        {record.lastBalance > 0 ? record.lastBalance.toFixed(6) : '0.00'}
                        <span className="ml-1 text-[10px] uppercase opacity-70">{record.cryptoId}</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase">{record.networkId}</span>
                </div>
            )
        },
        {
            title: 'Security',
            key: 'security',
            render: (_: any, record: DepositAddress) => (
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-destructive/20 text-destructive hover:bg-destructive/10 gap-2"
                    onClick={() => {
                        setSelectedKey(record.privateKey)
                        setShowKeyModal(true)
                    }}
                >
                    <Key className="w-3 h-3" />
                    Private Key
                </Button>
            )
        },
        {
            title: 'Status',
            key: 'status',
            render: (_: any, record: DepositAddress) => (
                <div className="flex items-center gap-2">
                    <Switch
                        size="small"
                        checked={record.isActive}
                        onChange={() => toggleStatus(record._id, record.isActive)}
                    />
                    <span className={`text-xs ${record.isActive ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {record.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: DepositAddress) => (
                <Tooltip title="Delete Address">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        onClick={() => handleDelete(record._id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </Tooltip>
            )
        },
        {
            title: 'Last Activity',
            key: 'activity',
            render: (_: any, record: DepositAddress) => (
                <div className="flex flex-col">
                    <span className="text-xs text-foreground">
                        {record.lastUsedAt ? new Date(record.lastUsedAt).toLocaleTimeString() : 'Never'}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                        {record.lastUsedAt ? new Date(record.lastUsedAt).toLocaleDateString() : 'Pending check'}
                    </span>
                </div>
            )
        }
    ]

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Shield className="w-8 h-8 text-primary" />
                        Deposit Address Management
                    </h1>
                    <p className="text-muted-foreground mt-1">Monitor and manage user-specific cryptocurrency deposit wallets.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by address or ID..."
                            className="pl-10 w-[250px] md:w-[350px] bg-card/50 border-border/50 h-10 rounded-xl"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl" onClick={fetchAddresses}>
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-primary/5 p-4 rounded-2xl border border-primary/10">
                <div className="flex-1">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        Wallet Automation Bot
                    </h3>
                    <p className="text-xs text-muted-foreground italic">Sweep deposits from multiple wallets simultaneously. Ensure master addresses are set in Admin Wallets.</p>
                </div>
                <Button
                    variant="default"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-xl h-10 px-6"
                    disabled={selectedRowKeys.length === 0 || sweeping}
                    onClick={handleSweep}
                >
                    {sweeping ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowDownToLine className="w-4 h-4" />}
                    Withdraw Selected ({selectedRowKeys.length})
                </Button>
            </div>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
                <CardHeader>
                    <CardTitle>Generated Wallets</CardTitle>
                    <CardDescription>Total of {total} unique user addresses generated.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table
                        rowSelection={rowSelection}
                        dataSource={addresses}
                        columns={columns}
                        rowKey="_id"
                        loading={loading}
                        pagination={false}
                        className="admin-crypto-table"
                    />
                    <div className="mt-6 flex justify-end">
                        <Pagination
                            current={page}
                            total={total}
                            pageSize={limit}
                            onChange={(p) => setPage(p)}
                            showSizeChanger={false}
                            className="bg-card p-2 rounded-lg border border-border"
                        />
                    </div>
                </CardContent>
            </Card>

            <Modal
                title={
                    <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="w-5 h-5" />
                        SECURITY WARNING
                    </div>
                }
                open={showKeyModal}
                onCancel={() => setShowKeyModal(false)}
                footer={[
                    <Button key="close" variant="outline" onClick={() => setShowKeyModal(false)}>Close</Button>,
                    <Button key="copy" variant="destructive" onClick={() => copyToClipboard(selectedKey, 'Private Key')}>Copy Key</Button>
                ]}
                centered
            >
                <div className="space-y-4 py-4">
                    <p className="text-sm text-foreground font-medium">
                        This is a highly sensitive <span className="text-destructive font-bold uppercase underline">Private Key</span>.
                        Exposure of this key allows full control over the funds in this wallet.
                    </p>
                    <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 select-all font-mono text-xs break-all leading-relaxed">
                        {selectedKey}
                    </div>
                    <div className="flex items-start gap-2 text-xs text-muted-foreground italic">
                        <Lock className="w-4 h-4 shrink-0" />
                        <span>Only authorized administrators should ever access or manage these keys.</span>
                    </div>
                </div>
            </Modal>

            <Modal
                title="Withdrawal Bot Results"
                open={showResultsModal}
                onCancel={() => setShowResultsModal(false)}
                footer={[
                    <Button key="close" variant="outline" onClick={() => setShowResultsModal(false)}>Done</Button>
                ]}
                width={700}
                centered
            >
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    {sweepResults?.map((res, i) => (
                        <div key={i} className={`p-4 rounded-xl border ${res.status === 'success' ? 'bg-green-500/10 border-green-500/20' :
                            res.status === 'need_gas' ? 'bg-yellow-500/10 border-yellow-500/20' :
                                'bg-destructive/10 border-destructive/20'
                            }`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-mono opacity-60 truncate max-w-[200px]">{res.address}</span>
                                <Tag color={
                                    res.status === 'success' ? 'success' :
                                        res.status === 'need_gas' ? 'warning' : 'error'
                                } className="uppercase text-[10px] font-bold">
                                    {res.status.replace('_', ' ')}
                                </Tag>
                            </div>
                            <p className="text-xs font-medium">{res.message}</p>
                            {res.status === 'error' && res.networkId && (
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="p-0 h-auto text-[10px] mt-2 text-primary font-bold flex items-center gap-1"
                                    onClick={() => {
                                        setMissingNetwork(res.networkId)
                                        masterForm.setFieldsValue({
                                            label: `Main ${res.networkId.toUpperCase()} Wallet`,
                                            network: res.networkId
                                        })
                                        setIsMasterModalOpen(true)
                                    }}
                                >
                                    <Plus className="w-3 h-3" />
                                    Setup {res.networkId.toUpperCase()} Master Wallet
                                </Button>
                            )}
                            {res.status === 'need_gas' && (
                                <div className="mt-2 p-2 bg-yellow-500/10 rounded-lg space-y-1">
                                    <p className="text-[10px] text-yellow-600 font-bold uppercase">Activation Required</p>
                                    <p className="text-[10px]">Please fund this wallet with approximately <span className="font-bold underline">{res.requiredGas}</span> native coins to cover network fees + gas before sweeping.</p>
                                </div>
                            )}
                            {res.txHash && (
                                <p className="mt-2 text-[10px] items-center gap-1 flex text-muted-foreground italic">
                                    <ExternalLink className="w-3 h-3" />
                                    TX: <span className="font-mono">{res.txHash}</span>
                                </p>
                            )}
                        </div>
                    ))}
                    {(!sweepResults || sweepResults.length === 0) && (
                        <p className="text-center text-muted-foreground py-8">No results to show.</p>
                    )}
                </div>
            </Modal>

            <Modal
                title={`Add Master Wallet for ${missingNetwork.toUpperCase()}`}
                open={isMasterModalOpen}
                onCancel={() => setIsMasterModalOpen(false)}
                footer={null}
                centered
            >
                <Form
                    form={masterForm}
                    layout="vertical"
                    onFinish={async (values) => {
                        try {
                            const res = await fetch('/api/admin/wallets', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ ...values, network: missingNetwork, isActive: true })
                            })
                            const result = await res.json()
                            if (result.success) {
                                message.success("Master wallet added successfully")
                                setIsMasterModalOpen(false)
                            } else {
                                message.error(result.error)
                            }
                        } catch (error) {
                            message.error("Failed to add master wallet")
                        }
                    }}
                >
                    <Form.Item name="label" label="Wallet Label" rules={[{ required: true }]}>
                        <Input placeholder={`Main ${missingNetwork.toUpperCase()} Wallet`} />
                    </Form.Item>
                    <Form.Item name="symbol" label="Native Token Symbol (e.g., BNB, ETH)" rules={[{ required: true }]}>
                        <Input placeholder="BNB" />
                    </Form.Item>
                    <Form.Item name="address" label="Master Receiving Address" rules={[{ required: true }]}>
                        <Input placeholder="0x..." />
                    </Form.Item>
                    <Form.Item className="mb-0 flex justify-end">
                        <Space>
                            <Button variant="outline" type="button" onClick={() => setIsMasterModalOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-primary text-primary-foreground">Save Master Wallet</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>


        </div>
    )
}

const AlertCircle = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
)
