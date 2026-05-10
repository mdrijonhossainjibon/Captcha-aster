import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir, readFile } from "fs/promises"
import path from "path"

async function getBotEndpoint(endpointId: string) {
    const { default: BotEndpoint } = await import("@/lib/models/BotEndpoint")
    const connectDB = (await import("@/lib/mongodb")).default
    await connectDB()
    return BotEndpoint.findById(endpointId).lean()
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ type: string }> }
) {
    const { type } = await params
    const validTypes = ["aws", "kbs"]
    if (!validTypes.includes(type)) {
        return NextResponse.json({ success: false, error: "Invalid model type" }, { status: 400 })
    }

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

        const uploadDir = path.join(process.cwd(), "public", "uploads", "models", type)
        await mkdir(uploadDir, { recursive: true })

        const fileName = `${Date.now()}-${file.name}`
        const filePath = path.join(uploadDir, fileName)

        const buffer = Buffer.from(await file.arrayBuffer())
        await writeFile(filePath, buffer)

        const sizeMb = (file.size / 1024 / 1024).toFixed(2)
        console.log(`✅ ${type.toUpperCase()} model saved: ${fileName} (${sizeMb} MB)`)

        // Forward to bot endpoint for real processing
        let botResult = null
        if (botEndpointId) {
            try {
                const endpoint: any = await getBotEndpoint(botEndpointId)
                if (endpoint && endpoint.isActive) {
                    const botUrl = `${endpoint.protocol}://${endpoint.endpoint}:${endpoint.port}/upload-model`
                    console.log(`→ Forwarding to bot: ${botUrl}`)

                    const fileBuffer = await readFile(filePath)
                    const fileForBot = new File([fileBuffer], fileName, { type: "application/octet-stream" })

                    const botForm = new FormData()
                    botForm.append("file", fileForBot)
                    botForm.append("botEndpointId", botEndpointId)
                    botForm.append("modelType", type)

                    const controller = new AbortController()
                    const timeout = setTimeout(() => controller.abort(), 300_000) // 5min timeout

                    try {
                        const botRes = await fetch(botUrl, {
                            method: "POST",
                            body: botForm,
                            signal: controller.signal,
                        })
                        botResult = await botRes.json()
                        console.log(`✓ Bot response:`, botResult)
                    } finally {
                        clearTimeout(timeout)
                    }
                } else {
                    console.log(`⚠ Bot endpoint ${endpointId} not found or inactive, skipping forward`)
                }
            } catch (forwardErr: any) {
                console.error(`⚠ Failed to forward to bot:`, forwardErr.message)
                botResult = { error: forwardErr.message, forwarded: false }
            }
        }

        return NextResponse.json({
            success: true,
            message: botResult?.success
                ? `Model uploaded & processed by ${type.toUpperCase()} successfully`
                : "Model saved locally",
            file: {
                name: fileName,
                size: file.size,
                path: `/uploads/models/${type}/${fileName}`,
            },
            processing: botResult,
        })
    } catch (error: any) {
        console.error(`${type.toUpperCase()} upload error:`, error)
        return NextResponse.json(
            { success: false, error: `Failed to upload model to ${type.toUpperCase()}`, message: error.message },
            { status: 500 }
        )
    }
}
