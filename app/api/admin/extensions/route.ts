import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { requireAdmin } from '@/lib/auth'
import Extension, { IExtension } from '@/lib/models/Extension'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'extensions')

// Ensure upload directory exists
async function ensureUploadDir() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true })
    }
}

// GET - List all extensions
export async function GET(request: NextRequest) {
    try {
        await connectDB()
        const { searchParams } = new URL(request.url)
        const activeOnly = searchParams.get('activeOnly') === 'true'

        const query: any = {}
        if (activeOnly) query.isActive = true

        const extensions = await Extension.find(query).sort({ createdAt: -1 })

        const stats = {
            total: await Extension.countDocuments(),
            active: await Extension.countDocuments({ isActive: true }),
            totalDownloads: extensions.reduce((sum: number, ext: any) => sum + (ext.downloads || 0), 0),
        }

        return NextResponse.json({ success: true, extensions, stats })
    } catch (error) {
        console.error('GET extensions error:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch extensions' }, { status: 500 })
    }
}

// POST - Upload new extension
export async function POST(request: NextRequest) {
    try {
        const admin = await requireAdmin()
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()
        await ensureUploadDir()

        const formData = await request.formData()
        const file = formData.get('file') as File | null
        let name = formData.get('name') as string
        const description = formData.get('description') as string
        let version = formData.get('version') as string
        const platform = formData.get('platform') as string
        const changelog = formData.get('changelog') as string
        const icon = formData.get('icon') as string // base64

        if (!file) {
            return NextResponse.json({ success: false, error: 'File is required' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // AUTO-DETECTION LOGIC
        let detectedVersion = ''
        let detectedName = ''
        let detectedPlatform = 'All'

        const fileExt = path.extname(file.name).toLowerCase()
        const lowerFileName = file.name.toLowerCase()

        // Keyword based detection
        if (lowerFileName.includes('firefox') || lowerFileName.includes('mozilla') || fileExt === '.xpi') {
            detectedPlatform = 'Firefox'
        } else if (lowerFileName.includes('chrome') || lowerFileName.includes('chromium') || fileExt === '.crx') {
            detectedPlatform = 'Chrome'
        }

        if (fileExt === '.zip' || fileExt === '.crx' || fileExt === '.xpi') {
            try {
                const zip = new AdmZip(buffer)
                const manifestEntry = zip.getEntry('manifest.json')
                if (manifestEntry) {
                    const manifestContent = manifestEntry.getData().toString('utf8')
                    const manifest = JSON.parse(manifestContent)
                    detectedVersion = manifest.version || ''
                    detectedName = manifest.name || ''

                    if (manifest.browser_specific_settings?.gecko || manifest.applications?.gecko || manifest.update_url?.includes('mozilla')) {
                        detectedPlatform = 'Firefox'
                    } else if (detectedPlatform === 'All') {
                        detectedPlatform = 'Chrome'
                    }
                }
            } catch (err) {
                console.warn('Failed to parse manifest.json:', err)
            }
        }

        // Use detected if user didn't provide
        if (!version && detectedVersion) version = detectedVersion
        if (!name && detectedName) name = detectedName
        const finalPlatform = platform && platform !== 'All' ? platform : (detectedPlatform !== 'All' ? detectedPlatform : 'All')


        if (!name || !version) {
            return NextResponse.json({
                success: false,
                error: 'Name and version are required (and could not be auto-detected)',
                detectedName,
                detectedVersion
            }, { status: 400 })
        }

        // Validate file type
        const allowedExtensions = ['.zip', '.crx', '.xpi', '.exe', '.dmg', '.deb']
        if (!allowedExtensions.includes(fileExt)) {
            return NextResponse.json({ success: false, error: `Invalid file type. Allowed: ${allowedExtensions.join(', ')}` }, { status: 400 })
        }

        // Save file
        const safeFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
        const filePath = path.join(UPLOAD_DIR, safeFileName)
        await writeFile(filePath, buffer)

        // Save to DB
        const extension = await Extension.create({
            name,
            description: description || '',
            version,
            platform: finalPlatform,
            changelog: changelog || (detectedVersion ? `Initial release (v${detectedVersion})` : ''),
            fileName: safeFileName,
            originalName: file.name,
            fileSize: file.size,
            fileType: fileExt,
            downloadUrl: `/extensions/${safeFileName}`,
            iconUrl: icon || '',
            downloads: 0,
            isActive: true,
        })


        return NextResponse.json({
            success: true,
            extension,
            message: 'Extension uploaded successfully',
            detected: { version: detectedVersion, name: detectedName }
        })
    } catch (error) {
        console.error('POST extension error:', error)
        return NextResponse.json({ success: false, error: 'Failed to upload extension' }, { status: 500 })
    }
}


// PATCH - Toggle active / update extension
export async function PATCH(request: NextRequest) {
    try {
        const admin = await requireAdmin()
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()
        const body = await request.json()
        const { id, ...updates } = body

        if (!id) {
            return NextResponse.json({ success: false, error: 'Extension ID required' }, { status: 400 })
        }

        const updatedExtension = await Extension.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        )

        if (!updatedExtension) {
            return NextResponse.json({ success: false, error: 'Extension not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: 'Extension updated successfully', extension: updatedExtension })
    } catch (error) {
        console.error('PATCH extension error:', error)
        return NextResponse.json({ success: false, error: 'Failed to update extension' }, { status: 500 })
    }
}

// DELETE - Remove extension
export async function DELETE(request: NextRequest) {
    try {
        const admin = await requireAdmin()
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ success: false, error: 'Extension ID required' }, { status: 400 })
        }

        const extension = await Extension.findById(id)

        if (!extension) {
            return NextResponse.json({ success: false, error: 'Extension not found' }, { status: 404 })
        }

        // Delete file from disk
        const filePath = path.join(UPLOAD_DIR, extension.fileName)
        if (existsSync(filePath)) {
            await unlink(filePath)
        }

        await Extension.findByIdAndDelete(id)

        return NextResponse.json({ success: true, message: 'Extension deleted successfully' })
    } catch (error) {
        console.error('DELETE extension error:', error)
        return NextResponse.json({ success: false, error: 'Failed to delete extension' }, { status: 500 })
    }
}
