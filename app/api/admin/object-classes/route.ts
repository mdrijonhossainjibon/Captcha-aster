import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ObjectClass from "@/lib/models/ObjectClasses"
import { requireAdmin } from "@/lib/auth"

// GET - Fetch all object classes
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

        const objectClasses = await ObjectClass.find({})
            .sort({ createdAt: -1 })
            .lean()

        return NextResponse.json({
            success: true,
            objectClasses
        })
    } catch (error: any) {
        console.error("Error fetching object classes:", error)
        return NextResponse.json(
            { error: "Failed to fetch object classes", message: error.message },
            { status: 500 }
        )
    }
}

// POST - Create new object class
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
        const { name  } = body

        if (!name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            )
        }

        

        await connectDB()

        // Check if object class already exists
        const existing = await ObjectClass.findOne({ name: name.toLowerCase().trim() })
        if (existing) {
            return NextResponse.json(
                { error: "Object class with this name already exists" },
                { status: 409 }
            )
        }

        const objectClass = await ObjectClass.create({
            name: name.toLowerCase().trim(),
            descriptive_label: name.trim()
        })
 
        return NextResponse.json({
            success: true,
            objectClass
        }, { status: 201 })
    } catch (error: any) {
        console.error("Error creating object class:", error)
        return NextResponse.json(
            { error: "Failed to create object class", message: error.message },
            { status: 500 }
        )
    }
}
