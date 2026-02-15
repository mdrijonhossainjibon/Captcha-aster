import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ObjectClass from "@/lib/models/ObjectClasses"
import { requireAdmin } from "@/lib/auth"

// PUT - Update object class
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
        const { name } = body

        if (!name  ) {
            return NextResponse.json(
                { error: "Name and descriptive label are required" },
                { status: 400 }
            )
        }

        await connectDB()

        // Check if another object class with the same name exists
        const existing = await ObjectClass.findOne({
            name: name.toLowerCase().trim(),
            _id: { $ne: params.id }
        })

        if (existing) {
            return NextResponse.json(
                { error: "Object class with this name already exists" },
                { status: 409 }
            )
        }

        const objectClass = await ObjectClass.findByIdAndUpdate(
            params.id,
            {
                name: name.toLowerCase().trim(),
                descriptive_label: name.trim()
            },
            { new: true, runValidators: true }
        )

        if (!objectClass) {
            return NextResponse.json(
                { error: "Object class not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            objectClass
        })
    } catch (error: any) {
        console.error("Error updating object class:", error)
        return NextResponse.json(
            { error: "Failed to update object class", message: error.message },
            { status: 500 }
        )
    }
}

// DELETE - Delete object class
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

        const objectClass = await ObjectClass.findByIdAndDelete(params.id)

        if (!objectClass) {
            return NextResponse.json(
                { error: "Object class not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: "Object class deleted successfully"
        })
    } catch (error: any) {
        console.error("Error deleting object class:", error)
        return NextResponse.json(
            { error: "Failed to delete object class", message: error.message },
            { status: 500 }
        )
    }
}
