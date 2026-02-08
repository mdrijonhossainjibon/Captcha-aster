import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { EmailTemplate } from '@/lib/models/EmailTemplate'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        await connectDB()

        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const templates = await EmailTemplate.find().sort({ updatedAt: -1 })

        return NextResponse.json({
            success: true,
            templates
        })
    } catch (error) {
        console.error('Email templates fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch email templates' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { name, description, subject, content } = body

        if (!name || !description || !subject || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const template = await EmailTemplate.create({
            name,
            description,
            subject,
            content,
            status: 'active',
            sent: 0,
            openRate: 0,
            lastModifiedAt: new Date()
        })

        return NextResponse.json({
            success: true,
            template
        })
    } catch (error: any) {
        console.error('Email template creation error:', error)
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Template name already exists' }, { status: 400 })
        }
        return NextResponse.json({ error: 'Failed to create email template' }, { status: 500 })
    }
}
