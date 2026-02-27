import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import AdmZip from 'adm-zip'
import path from 'path'

export async function POST(request: NextRequest) {
    try {
        const admin = await requireAdmin()
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json({ success: false, error: 'File is required' }, { status: 400 })
        }

        const fileExt = path.extname(file.name).toLowerCase()
        const lowerFileName = file.name.toLowerCase()
        let platform = 'All'

        // Extension based detection
        if (fileExt === '.crx') platform = 'Chrome'
        if (fileExt === '.xpi') platform = 'Firefox'
        if (fileExt === '.exe' || fileExt === '.msi') platform = 'Windows'
        if (fileExt === '.dmg') platform = 'macOS'
        if (fileExt === '.deb') platform = 'Linux'

        // Keyword based detection
        if (lowerFileName.includes('firefox') || lowerFileName.includes('mozilla')) platform = 'Firefox'
        if (lowerFileName.includes('chrome') || lowerFileName.includes('chromium')) platform = 'Chrome'

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        try {
            const zip = new AdmZip(buffer)
            const manifestEntry = zip.getEntry('manifest.json')
            if (manifestEntry) {
                const manifestContent = manifestEntry.getData().toString('utf8')
                const manifest = JSON.parse(manifestContent)

                // Better Firefox Detection
                if (manifest.browser_specific_settings?.gecko || manifest.applications?.gecko || manifest.update_url?.includes('mozilla')) {
                    platform = 'Firefox'
                } else if (platform === 'All') {
                    platform = 'Chrome'
                }


                const version = manifest.version || '1.0.0'
                const changelog = `Release version ${version} with latest improvements.`

                // ICON EXTRACTION
                let iconBase64 = ''
                const icons = manifest.icons || {}
                // Priority: 128 > 64 > 48 > 32 > 16
                const iconPath = icons['128'] || icons['96'] || icons['64'] || icons['48'] || icons['32'] || icons['16']

                if (iconPath) {
                    try {
                        const iconEntry = zip.getEntry(iconPath)
                        if (iconEntry) {
                            const iconBuffer = iconEntry.getData()
                            const mimeType = iconPath.endsWith('.png') ? 'image/png' : 'image/jpeg'
                            iconBase64 = `data:${mimeType};base64,${iconBuffer.toString('base64')}`
                        }
                    } catch (err) {
                        console.warn('Failed to extract icon:', err)
                    }
                }

                return NextResponse.json({
                    success: true,
                    data: {
                        version: version,
                        name: manifest.name || '',
                        description: manifest.description || '',
                        platform: platform,
                        changelog: changelog,
                        icon: iconBase64
                    }
                })

            } else {
                // Return platform even if no manifest found in scan
                const defaultName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')
                return NextResponse.json({
                    success: true,
                    data: {
                        name: defaultName,
                        platform: platform,
                        changelog: `Manual upload of ${defaultName}`
                    }
                })
            }
        } catch (err) {
            // ZIP parsing might fail for binary files like .exe, but we still send detected info
            const defaultName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')
            return NextResponse.json({
                success: true,
                data: {
                    name: defaultName,
                    platform: platform,
                    changelog: `Manual upload of ${defaultName}`
                }
            })
        }


    } catch (error) {
        console.error('Scan extensions error:', error)
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
    }
}
