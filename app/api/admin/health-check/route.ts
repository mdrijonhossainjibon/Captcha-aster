import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import BotEndpoint from "@/lib/models/BotEndpoint"
import { requireAdmin } from "@/lib/auth"

// GET - Fetch all health check statuses (from active endpoints)
export async function GET(req: NextRequest) {
    try {
        const authUser = await requireAdmin()
        if (!authUser) {
            return NextResponse.json(
                { error: "Forbidden - Admin access required" },
                { status: 403 }
            )
        }

        await connectDB()

        // Fetch active bot endpoints to show in the monitoring dashboard
        const endpoints = await BotEndpoint.find({ isActive: true }).lean()

        // Map to the HealthStatus format expected by the frontend
        const healthStatuses = endpoints.map(ep => ({
            _id: ep._id,
            botName: ep.botName,
            endpoint: `${ep.protocol}://${ep.endpoint === 'localhost' ? '127.0.0.1' : ep.endpoint}:${ep.port}/health`,
            status: 'unknown',
            responseTime: 0,
            lastChecked: new Date().toISOString(),
            uptime: 100,
            healthData: null
        }))

        return NextResponse.json({
            success: true,
            healthStatuses
        })
    } catch (error: any) {
        console.error("Error fetching health statuses:", error)
        return NextResponse.json(
            { error: "Failed to fetch health statuses", message: error.message },
            { status: 500 }
        )
    }
}
