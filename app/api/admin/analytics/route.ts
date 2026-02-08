import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Usage from '@/lib/models/Usage'
import User from '@/lib/models/User'
import Deposit from '@/lib/models/Deposit'
import ApiKey from '@/lib/models/ApiKey'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        await connectDB()

        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const days = parseInt(searchParams.get('days') || '30')

        // Calculate date range
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        // Aggregate usage data for chart
        const usageData = await Usage.aggregate([
            {
                $match: {
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$date" }
                    },
                    totalRequests: { $sum: "$totalRequests" },
                    successfulRequests: { $sum: "$successfulRequests" },
                    failedRequests: { $sum: "$failedRequests" },
                    creditsUsed: { $sum: "$creditsUsed" }
                }
            },
            {
                $sort: { _id: 1 }
            },
            {
                $limit: 30
            }
        ])

        // Get total users count over time
        const userGrowth = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ])

        // Merge usage and user data for chart
        const chartData = usageData.map((usage: any) => {
            const userCount = userGrowth.find((u: any) => u._id === usage._id)?.count || 0
            return {
                date: new Date(usage._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                requests: usage.totalRequests,
                users: userCount,
                successRate: usage.totalRequests > 0
                    ? ((usage.successfulRequests / usage.totalRequests) * 100).toFixed(1)
                    : 0
            }
        })

        // Calculate metrics
        const totalUsage = await Usage.aggregate([
            {
                $group: {
                    _id: null,
                    totalRequests: { $sum: "$totalRequests" },
                    successfulRequests: { $sum: "$successfulRequests" },
                    failedRequests: { $sum: "$failedRequests" },
                    creditsUsed: { $sum: "$creditsUsed" }
                }
            }
        ])

        const usage = totalUsage[0] || {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            creditsUsed: 0
        }

        const successRate = usage.totalRequests > 0
            ? ((usage.successfulRequests / usage.totalRequests) * 100).toFixed(1)
            : 0

        // Get average response time (simulated for now)
        const avgResponseTime = "2.3s"

        // Get total revenue from deposits
        const revenueData = await Deposit.aggregate([
            {
                $match: {
                    status: 'completed'
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$amountUSD" }
                }
            }
        ])

        const totalRevenue = revenueData[0]?.totalRevenue || 0

        // Get active API keys count
        const activeApiKeys = await ApiKey.countDocuments({ status: 'active' })

        // Get user count by country (simulated distribution)
        const topCountries = [
            { country: "United States", requests: Math.floor(usage.totalRequests * 0.35) },
            { country: "United Kingdom", requests: Math.floor(usage.totalRequests * 0.18) },
            { country: "Canada", requests: Math.floor(usage.totalRequests * 0.12) },
            { country: "Germany", requests: Math.floor(usage.totalRequests * 0.10) },
            { country: "France", requests: Math.floor(usage.totalRequests * 0.08) }
        ]

        // Captcha types distribution (simulated)
        const captchaTypes = [
            { type: "reCAPTCHA v2", count: 42, color: "bg-blue-500" },
            { type: "reCAPTCHA v3", count: 28, color: "bg-purple-500" },
            { type: "hCaptcha", count: 18, color: "bg-green-500" },
            { type: "Others", count: 12, color: "bg-gray-500" }
        ]

        // Calculate previous period for comparison
        const prevStartDate = new Date(startDate)
        prevStartDate.setDate(prevStartDate.getDate() - days)

        const prevUsage = await Usage.aggregate([
            {
                $match: {
                    date: { $gte: prevStartDate, $lt: startDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRequests: { $sum: "$totalRequests" }
                }
            }
        ])

        const prevTotalRequests = prevUsage[0]?.totalRequests || 1
        const requestsChange = usage.totalRequests > 0
            ? (((usage.totalRequests - prevTotalRequests) / prevTotalRequests) * 100)
            : 0

        const metrics = {
            totalCaptchas: {
                value: usage.totalRequests >= 1000000
                    ? `${(usage.totalRequests / 1000000).toFixed(1)}M`
                    : usage.totalRequests >= 1000
                        ? `${(usage.totalRequests / 1000).toFixed(1)}K`
                        : usage.totalRequests.toString(),
                change: `${requestsChange >= 0 ? '+' : ''}${requestsChange.toFixed(1)}%`
            },
            avgResponseTime: {
                value: avgResponseTime,
                change: "-0.8s"
            },
            successRate: {
                value: `${successRate}%`,
                change: "+0.3%"
            },
            apiCalls: {
                value: usage.totalRequests >= 1000000
                    ? `${(usage.totalRequests / 1000000).toFixed(1)}M`
                    : usage.totalRequests >= 1000
                        ? `${(usage.totalRequests / 1000).toFixed(1)}K`
                        : usage.totalRequests.toString(),
                change: `${requestsChange >= 0 ? '+' : ''}${requestsChange.toFixed(1)}%`
            },
            totalRevenue: {
                value: `$${totalRevenue.toFixed(2)}`,
                change: "+12.5%"
            },
            activeApiKeys: {
                value: activeApiKeys.toString(),
                change: "+5"
            }
        }

        return NextResponse.json({
            success: true,
            chartData,
            metrics,
            topCountries,
            captchaTypes
        })
    } catch (error) {
        console.error('Analytics fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
    }
}
