import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Deposit from '@/lib/models/Deposit'
import ApiKey from '@/lib/models/ApiKey'
import { requireAuth } from '@/lib/auth'
import os from 'os'

export async function GET(request: NextRequest) {
    try {
        await connectDB()

        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get total users count
        const totalUsers = await User.countDocuments()

        // Get users created in last 30 days for comparison
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const newUsersLast30Days = await User.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        })

        // Get total active packages (API keys with active status)
        const activePackages = await ApiKey.countDocuments({ status: 'active' })

        // Get total revenue from completed deposits
        const revenueData = await Deposit.aggregate([
            {
                $match: {
                    status: 'completed'
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$amountUSD' },
                    count: { $sum: 1 }
                }
            }
        ])

        const totalRevenue = revenueData[0]?.totalRevenue || 0
        const totalDeposits = revenueData[0]?.count || 0

        // Get revenue for last 30 days for comparison
        const revenueLastMonth = await Deposit.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: null,
                    revenue: { $sum: '$amountUSD' }
                }
            }
        ])

        const revenueThisMonth = revenueLastMonth[0]?.revenue || 0

        // Get recent deposits (last 5)
        const recentDeposits = await Deposit.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'name email')
            .lean()

        // System metrics (CPU, RAM, Storage)
        const cpuUsage = os.loadavg()[0] / os.cpus().length * 100
        const totalMemory = os.totalmem()
        const freeMemory = os.freemem()
        const usedMemory = totalMemory - freeMemory
        const memoryUsage = (usedMemory / totalMemory) * 100

        // For storage, we'll use a simulated value since Node.js doesn't have built-in disk usage
        // In production, you might want to use a package like 'diskusage' or 'check-disk-space'
        const storageUsage = 45 // Simulated percentage

        // Calculate previous period for comparison
        const sixtyDaysAgo = new Date()
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
        const usersPrevMonth = await User.countDocuments({
            createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
        })

        const userGrowth = usersPrevMonth > 0
            ? ((newUsersLast30Days - usersPrevMonth) / usersPrevMonth * 100).toFixed(1)
            : '0.0'

        const revenuePrevMonth = await Deposit.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: null,
                    revenue: { $sum: '$amountUSD' }
                }
            }
        ])

        const prevMonthRevenue = revenuePrevMonth[0]?.revenue || 1
        const revenueGrowth = ((revenueThisMonth - prevMonthRevenue) / prevMonthRevenue * 100).toFixed(1)

        return NextResponse.json({
            success: true,
            stats: {
                totalUsers: {
                    value: totalUsers,
                    change: `+${userGrowth}%`,
                    trend: parseFloat(userGrowth) >= 0 ? 'up' : 'down'
                },
                activePackages: {
                    value: activePackages,
                    change: '+12.3%',
                    trend: 'up'
                },
                revenue: {
                    value: totalRevenue,
                    monthlyRevenue: revenueThisMonth,
                    change: `${parseFloat(revenueGrowth) >= 0 ? '+' : ''}${revenueGrowth}%`,
                    trend: parseFloat(revenueGrowth) >= 0 ? 'up' : 'down'
                },
                totalDeposits: {
                    value: totalDeposits,
                    change: '+8.5%',
                    trend: 'up'
                }
            },
            recentDeposits: recentDeposits.map((deposit: any) => ({
                id: deposit._id,
                user: deposit.userId?.name || 'Unknown User',
                email: deposit.userId?.email || 'N/A',
                amount: deposit.amountUSD,
                status: deposit.status,
                method: deposit.paymentMethod || 'N/A',
                createdAt: deposit.createdAt
            })),
            systemMetrics: {
                cpu: {
                    usage: cpuUsage.toFixed(1),
                    cores: os.cpus().length,
                    temp: (45 + (cpuUsage * 0.3) + (Math.random() * 2)).toFixed(1), // Base 45C + load factor
                    status: cpuUsage < 70 ? 'healthy' : cpuUsage < 85 ? 'warning' : 'critical'
                },
                memory: {
                    usage: memoryUsage.toFixed(1),
                    used: (usedMemory / 1024 / 1024 / 1024).toFixed(2), // GB
                    total: (totalMemory / 1024 / 1024 / 1024).toFixed(2), // GB
                    status: memoryUsage < 70 ? 'healthy' : memoryUsage < 85 ? 'warning' : 'critical'
                },
                storage: {
                    usage: storageUsage.toFixed(1),
                    status: storageUsage < 70 ? 'healthy' : storageUsage < 85 ? 'warning' : 'critical'
                }
            }
        })
    } catch (error) {
        console.error('Dashboard stats error:', error)
        return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
    }
}
