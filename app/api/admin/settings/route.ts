import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { SystemSetting } from '@/lib/models/SystemSetting'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const authUser = await requireAuth()
        if (authUser?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()
        let settings = await SystemSetting.findOne()

        if (!settings) {
            // If no settings exist yet, create default one
            settings = await SystemSetting.create({})
        }

        return NextResponse.json(settings)
    } catch (error) {
        console.error('Error fetching settings:', error)
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const authUser = await requireAuth()
        if (authUser?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        await connectDB()

        let settings = await SystemSetting.findOne()

        if (settings) {
            // Update existing
            settings = await SystemSetting.findByIdAndUpdate(
                settings._id,
                { ...body, updatedAt: new Date() },
                { new: true }
            )
        } else {
            // Create new
            settings = await SystemSetting.create(body)
        }

        return NextResponse.json({ success: true, settings })
    } catch (error) {
        console.error('Error saving settings:', error)
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
    }
}
