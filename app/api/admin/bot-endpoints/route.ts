import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import BotEndpoint from "@/lib/models/BotEndpoint"
import { requireAdmin } from "@/lib/auth"

// GET - Fetch all bot endpoints
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

        const endpoints = await BotEndpoint.find({})
            .sort({ createdAt: -1 })
            .lean()

        return NextResponse.json({
            success: true,
            endpoints
        })
    } catch (error: any) {
        console.error("Error fetching bot endpoints:", error)
        return NextResponse.json(
            { error: "Failed to fetch bot endpoints", message: error.message },
            { status: 500 }
        )
    }
}

// POST - Create new bot endpoint
export async function POST(req: NextRequest) {
    try {
        const authUser = await requireAdmin()
        if (!authUser) {
            return NextResponse.json(
                { error: "Forbidden - Admin access required" },
                { status: 403 }
            )
        }

        const body = await req.json()
        const { botName, endpoint, port, protocol, isActive } = body

        if (!botName || !endpoint) {
            return NextResponse.json(
                { error: "Bot name and endpoint are required" },
                { status: 400 }
            )
        }

        await connectDB()

        const newEndpoint = await BotEndpoint.create({
            botName: botName.trim(),
            endpoint: endpoint.trim(),
            port: port || 80,
            protocol: protocol || "http",
            isActive: isActive !== undefined ? isActive : true
        })

        return NextResponse.json({
            success: true,
            endpoint: newEndpoint
        }, { status: 201 })
    } catch (error: any) {
        console.error("Error creating bot endpoint:", error)
        return NextResponse.json(
            { error: "Failed to create bot endpoint", message: error.message },
            { status: 500 }
        )
    }
}
