import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Package from '@/lib/models/Package'
import Deposit from '@/lib/models/Deposit'
import RedeemCode from '@/lib/models/RedeemCode'
import Usage from '@/lib/models/Usage'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    await connectDB()
    const authUser = await requireAuth()
    if (!authUser) return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
    const userId = authUser.userId
    const txns = []
    const pkgs = await Package.find({ userId }).sort({ createdAt: -1 }).lean()
    for (const p of pkgs) txns.push({ id: 'pkg-'+p._id, type: 'purchase', credits: p.credits, amount: p.price, date: new Date(p.createdAt).toISOString().split('T')[0], time: new Date(p.createdAt).toTimeString().slice(0,5), status: (p.status==='active'||p.status==='expired')?'success':'cancelled', label: p.name||'Package Purchase', meta: p.packageCode })
    const deps = await Deposit.find({ userId, status: 'completed' }).sort({ createdAt: -1 }).lean()
    for (const d of deps) txns.push({ id: 'dep-'+d._id, type: 'deposit', credits: Math.round(d.amountUSD*1000), amount: d.amountUSD, date: new Date(d.createdAt).toISOString().split('T')[0], time: new Date(d.createdAt).toTimeString().slice(0,5), status: 'success', label: d.cryptoName+' ('+d.networkName+')', meta: d.txHash?d.txHash.slice(0,12)+'...':'' })
    const codes = await RedeemCode.find({ 'usedBy.userId': userId }).sort({ createdAt: -1 }).lean()
    for (const c of codes) { const u = c.usedBy.find(x=>x.userId.toString()===userId); if(u) txns.push({ id: 'redeem-'+c._id, type: 'redeem', credits: c.credits, amount: null, date: new Date(u.usedAt).toISOString().split('T')[0], time: new Date(u.usedAt).toTimeString().slice(0,5), status: 'success', label: 'Promo Code', meta: c.code }) }
    const uses = await Usage.find({ userId }).sort({ date: -1 }).lean()
    for (const u of uses) { if(u.creditsUsed>0) txns.push({ id: 'use-'+u._id, type: 'usage', credits: -u.creditsUsed, amount: null, date: new Date(u.date).toISOString().split('T')[0], time: '00:00', status: 'success', label: u.totalRequests+' requests', meta: u.successfulRequests+' OK · '+u.failedRequests+' fail' }) }
    txns.sort((a,b)=>{const c=b.date.localeCompare(a.date); return c!==0?c:b.time.localeCompare(a.time)})
    const added = txns.filter(t=>t.credits>0).reduce((s,t)=>s+t.credits,0)
    const used = txns.filter(t=>t.credits<0).reduce((s,t)=>s+Math.abs(t.credits),0)
    const spent = txns.filter(t=>t.amount&&t.amount>0).reduce((s,t)=>s+t.amount,0)
    const now = new Date(); const ms = new Date(now.getFullYear(),now.getMonth(),1)
    const monthSpent = txns.filter(t=>new Date(t.date)>=ms&&t.amount&&t.amount>0).reduce((s,t)=>s+t.amount,0)
    const rc = txns.filter(t=>t.type==='redeem').length
    return NextResponse.json({ success: true, data: { stats: { totalSpent:spent, totalCreditsAdded:added, totalCreditsUsed:used, thisMonthSpent:monthSpent, transactionCount:txns.length, redeemCount:rc }, transactions: txns } })
  } catch(e) { console.error(e); return NextResponse.json({ success: false, error: 'Internal server error' }, { status:500 }) }
}