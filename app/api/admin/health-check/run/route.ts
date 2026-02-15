import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import BotEndpoint from "@/lib/models/BotEndpoint"
import { requireAdmin } from "@/lib/auth";
import { API_CALL } from "auth-fingerprint";

// POST - Run health check on all active bot endpoints
export async function POST(req: NextRequest) {
    try {
        const authUser = await requireAdmin()
        if (!authUser) {
            return NextResponse.json(
                { error: "Forbidden - Admin access required" },
                { status: 403 }
            )
        }

        await connectDB()

        // Parse endpointId from body to check single bot if provided
        let endpointId: string | null = null;
        try {
            const body = await req.json();
            endpointId = body.endpointId;
        } catch (e) {
            // No body provided, check all
        }

        // Get active bot endpoints (all or specific)
        const query: any = { isActive: true };
        if (endpointId) {
            query._id = endpointId;
        }

        const endpoints = await BotEndpoint.find(query).lean()

        if (endpoints.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No active endpoints to check",
                healthStatuses: []
            })
        }

        const healthResults = []

        // Check each endpoint
        for (const endpoint of endpoints) {
            // Convert localhost to 127.0.0.1 for better compatibility
            const host = endpoint.endpoint === 'localhost' ? '127.0.0.1' : endpoint.endpoint
            const fullUrl = `${endpoint.protocol}://${host}:${endpoint.port}/health`
            const startTime = Date.now()

            let status: 'healthy' | 'unhealthy' | 'unknown' = 'unknown'
            let responseTime = 0
            let errorMessage: string | undefined
            let healthData: any = null

            console.log(`[Health Check] Checking ${endpoint.botName} via API_CALL at ${fullUrl}`)

            try {
                // Use API_CALL as requested
                const result: any = await API_CALL({
                    method: 'GET',
                    url: fullUrl
                })

                // Debug: Log the result structure
                console.log(`[Health Check] ${endpoint.botName} raw result:`, JSON.stringify(result).substring(0, 100))

                const data = result?.response || result?.data || result
                const apiStatus = result?.status || 200

                responseTime = Date.now() - startTime

                if ((apiStatus === 200 || apiStatus === 'success' || result?.success) && data) {
                    status = 'healthy'
                    healthData = data
                    console.log(`[Health Check] ${endpoint.botName} health data received successfully`)
                } else {
                    status = 'unhealthy'
                    errorMessage = result?.message || result?.error || `HTTP ${apiStatus}`
                    console.error(`[Health Check] ${endpoint.botName} unhealthy response:`, errorMessage)
                }
            } catch (error: any) {
                responseTime = Date.now() - startTime
                status = 'unhealthy'

                // Enhanced error logging to understand "fetch failed"
                console.error(`[Health Check] ${endpoint.botName} EXCEPTION:`, {
                    message: error.message,
                    stack: error.stack?.split('\n')[0],
                    code: error.code
                })

                if (error.message === 'fetch failed') {
                    errorMessage = 'Network Error (Check if Python Server is running at ' + fullUrl + ')'
                } else {
                    errorMessage = error.message || 'Connection failed'
                }
            }

            // Push live result directly without saving to Mongo
            healthResults.push({
                botName: endpoint.botName,
                endpoint: fullUrl,
                status,
                responseTime,
                lastChecked: new Date(),
                uptime: status === 'healthy' ? 100 : 0, // Simplified for live display
                errorMessage,
                healthData
            })
        }

        return NextResponse.json({
            success: true,
            message: `Health check completed for ${healthResults.length} endpoints`,
            healthStatuses: healthResults
        })
    } catch (error: any) {
        console.error("Error running health check:", error)
        return NextResponse.json(
            { error: "Failed to run health check", message: error.message },
            { status: 500 }
        )
    }
}
