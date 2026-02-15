import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import BotEndpoint from "@/lib/models/BotEndpoint"
import { requireAdmin } from "@/lib/auth"

// PUT - Update bot endpoint
export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const authUser = await requireAdmin()
        if (!authUser) {
            return NextResponse.json(
                { error: "Forbidden - Admin access required" },
                { status: 403 }
            )
        }

        const params = await context.params
        const body = await req.json()
        const { botName, endpoint, port, protocol, isActive } = body

        if (!botName || !endpoint) {
            return NextResponse.json(
                { error: "Bot name and endpoint are required" },
                { status: 400 }
            )
        }

        await connectDB()

        const updatedEndpoint = await BotEndpoint.findByIdAndUpdate(
            params.id,
            {
                botName: botName.trim(),
                endpoint: endpoint.trim(),
                port: port || 80,
                protocol: protocol || "http",
                isActive: isActive !== undefined ? isActive : true
            },
            { new: true, runValidators: true }
        )

        if (!updatedEndpoint) {
            return NextResponse.json(
                { error: "Bot endpoint not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            endpoint: updatedEndpoint
        })
    } catch (error: any) {
        console.error("Error updating bot endpoint:", error)
        return NextResponse.json(
            { error: "Failed to update bot endpoint", message: error.message },
            { status: 500 }
        )
    }
}

// DELETE - Delete bot endpoint
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const authUser = await requireAdmin()
        if (!authUser) {
            return NextResponse.json(
                { error: "Forbidden - Admin access required" },
                { status: 403 }
            )
        }

        const params = await context.params
        await connectDB()

        const endpoint = await BotEndpoint.findByIdAndDelete(params.id)

        if (!endpoint) {
            return NextResponse.json(
                { error: "Bot endpoint not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: "Bot endpoint deleted successfully"
        })
    } catch (error: any) {
        console.error("Error deleting bot endpoint:", error)
        return NextResponse.json(
            { error: "Failed to delete bot endpoint", message: error.message },
            { status: 500 }
        )
    }
}
