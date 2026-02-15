import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { API_CALL } from "auth-fingerprint"
 
// POST - Refresh bot classes
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
        const { protocol, endpoint, port } = body

        if (!protocol || !endpoint || !port) {
            return NextResponse.json(
                { error: "Protocol, endpoint, and port are required" },
                { status: 400 }
            )
        }

        // Call the external bot endpoint
        const baseURL = `${protocol}://${endpoint}:${port}`

        const { response , status } = await  API_CALL({ baseURL , method : 'POST' , url : '/refresh_classes' } )

        if ( status !== 200   ) {
            return NextResponse.json(
                { error: `Failed to refresh classes: ${response.statusText}` },
                { status: response.status }
            )
        }
 

        return NextResponse.json({
            success: true,
            data : response
        })
    } catch (error: any) {
        console.error("Error refreshing bot classes:", error)
        return NextResponse.json(
            { error: "Failed to refresh bot classes", message: error.message },
            { status: 500 }
        )
    }
}
