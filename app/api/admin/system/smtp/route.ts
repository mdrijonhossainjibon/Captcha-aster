import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { SmtpSetting } from '@/lib/models/SmtpSetting'
import { requireAuth } from '@/lib/auth'
import nodemailer from 'nodemailer'

export async function GET(request: NextRequest) {
    try {
        const authUser = await requireAuth()
        if (authUser?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()
        let settings = await SmtpSetting.findOne()

        if (!settings) {
            // Provide default structure if none exists
            settings = {
                host: process.env.SMTP_HOST || '',
                port: Number(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === 'true',
                user: process.env.SMTP_USER || '',
                pass: '', // Don't return password unless you really need to for editing
                from: process.env.SMTP_FROM || '',
                isActive: true
            }
        }

        return NextResponse.json(settings)
    } catch (error) {
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

        let settings = await SmtpSetting.findOne()

        if (settings) {
            // Update existing
            const updateData = { ...body, updatedAt: new Date() }
            // If password is empty string, don't update it (assuming UI sends empty if unchanged)
            if (!body.pass) delete updateData.pass

            settings = await SmtpSetting.findByIdAndUpdate(settings._id, updateData, { new: true })
        } else {
            // Create new
            settings = await SmtpSetting.create(body)
        }

        return NextResponse.json({ success: true, settings })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
    }
}

// Test SMTP connection
export async function PUT(request: NextRequest) {
    try {
        const authUser = await requireAuth()
        if (authUser?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const transporter = nodemailer.createTransport({
            host: body.host,
            port: body.port,
            secure: body.secure,
            auth: {
                user: body.user,
                pass: body.pass // Use provided pass for test
            }
        })

        await transporter.verify()
        return NextResponse.json({ success: true, message: 'SMTP connection successful' })
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Connection failed' }, { status: 500 })
    }
}
