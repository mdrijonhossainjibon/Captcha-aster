import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get("file") as File | null
        const botEndpointId = formData.get("botEndpointId") as string | null

        if (!file) {
            return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
        }

        if (!file.name.endsWith(".pt")) {
            return NextResponse.json({ success: false, error: "Only .pt files are allowed" }, { status: 400 })
        }

        const uploadDir = path.join(process.cwd(), "public", "uploads", "models", "aws")
        await mkdir(uploadDir, { recursive: true })

        const fileName = `${Date.now()}-${file.name}`
        const filePath = path.join(uploadDir, fileName)
        const buffer = Buffer.from(await file.arrayBuffer())
        await writeFile(filePath, buffer)

        console.log("✅ AWS model uploaded:", fileName, botEndpointId ? `(endpoint: ${botEndpointId})` : "")

        return NextResponse.json({
            success: true,
            message: "Model uploaded to AWS successfully",
            file: {
                name: fileName,
                size: file.size,
                path: `/uploads/models/aws/${fileName}`,
            },
        })
    } catch (error: any) {
        console.error("AWS upload error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to upload model to AWS", message: error.message },
            { status: 500 }
        )
    }
}
