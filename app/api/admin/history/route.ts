import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Package from '@/lib/models/Package'
import Deposit from '@/lib/models/Deposit'
import RedeemCode from '@/lib/models/RedeemCode'
import Usage from '@/lib/models/Usage'
import { requireAdmin } from '@/lib/auth'


export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const authUser = await requireAdmin()
    if (!authUser) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const typeFilter = searchParams.get('type') || ''
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const skip = (page - 1) * limit
    let userIds = []
    if (search) {
      const users = await User.find({ $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }).select('_id name email').lean()
      userIds = users.map(u => u._id)
      if (userIds.length === 0) return NextResponse.json({ success: true, data: [], stats: { total:0, page, limit, totalPages:0 } })
    }
    const match = userIds.length ? { userId: { $in: userIds } } : {}
    const all = []
    const pkgs = await Package.find(match).populate('userId', 'name email').sort({ createdAt: -1 }).lean()
    for (const p of pkgs) all.push({ id: 'pkg-'+p._id, _id: p._id, userId: p.userId, userName: (p.userId as any)?.name||'N/A', userEmail: (p.userId as any)?.email||'', type: 'purchase', credits: p.credits, amount: p.price, date: new Date(p.createdAt).toISOString().split('T')[0], time: new Date(p.createdAt).toTimeString().slice(0,5), status: (p.status==='active'||p.status==='expired')?'success':'cancelled', label: p.name||'Package', meta: p.packageCode||'' })
    const deps = await Deposit.find(match).populate('userId', 'name email').sort({ createdAt: -1 }).lean()
    for (const d of deps) all.push({ id: 'dep-'+d._id, _id: d._id, userId: d.userId, userName: (d.userId as any)?.name||'N/A', userEmail: (d.userId as any)?.email||'', type: 'deposit', credits: Math.round((d.amountUSD||0)*1000), amount: d.amountUSD||0, date: new Date(d.createdAt).toISOString().split('T')[0], time: new Date(d.createdAt).toTimeString().slice(0,5), status: d.status==='completed'?'success':'pending', label: (d.cryptoName||'Unknown')+' ('+(d.networkName||'')+')', meta: d.txHash?d.txHash.slice(0,12)+'...':'' })
    const codes = await RedeemCode.find({ 'usedBy.0': { $exists: true } }).sort({ createdAt: -1 }).lean()
    for (const c of codes) {
      for (const u of (c.usedBy||[])) {
        const user = await User.findById(u.userId).select('name email').lean()
        all.push({ id: 'redeem-'+c._id+'-'+u.userId, _id: c._id, userId: u.userId, userName: user?.name||'N/A', userEmail: user?.email||'', type: 'redeem', credits: c.credits, amount: 0, date: new Date(u.usedAt).toISOString().split('T')[0], time: new Date(u.usedAt).toTimeString().slice(0,5), status: 'success', label: 'Promo Code', meta: c.code })
      }
    }
    const uses = await Usage.find(match).populate('userId', 'name email').sort({ date: -1 }).lean()
    for (const u of uses) { if((u.creditsUsed||0)>0) all.push({ id: 'use-'+u._id, _id: u._id, userId: u.userId, userName: (u.userId as any)?.name||'N/A', userEmail: (u.userId as any)?.email||'', type: 'usage', credits: -(u.creditsUsed||0), amount: 0, date: new Date(u.date).toISOString().split('T')[0], time: '00:00', status: 'success', label: (u.totalRequests||0)+' requests', meta: (u.successfulRequests||0)+' OK · '+(u.failedRequests||0)+' fail' })
    }
    all.sort((a,b)=>{const c=b.date.localeCompare(a.date); return c!==0?c:b.time.localeCompare(a.time)})
    const filtered = typeFilter ? all.filter(t=>t.type===typeFilter) : all
    const total = filtered.length
    const totalPages = Math.ceil(total/limit)||1
    const paginated = filtered.slice(skip, skip+limit)
    return NextResponse.json({ success: true, data: paginated, stats: { total, page, limit, totalPages } })
  } catch(e) { console.error(e); return NextResponse.json({ success: false, error: 'Internal server error' }, { status:500 }) }
}