import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { EmailTemplate } from '@/lib/models/EmailTemplate'
import { requireAuth } from '@/lib/auth'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB()

        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const template = await EmailTemplate.findById(id)
        if (!template) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            template
        })
    } catch (error) {
        console.error('Email template fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch email template' }, { status: 500 })
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB()

        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()
        const { name, description, subject, content, status } = body

        const template = await EmailTemplate.findByIdAndUpdate(
            id,
            {
                ...(name && { name }),
                ...(description && { description }),
                ...(subject && { subject }),
                ...(content && { content }),
                ...(status && { status }),
                lastModifiedAt: new Date()
            },
            { new: true }
        )

        if (!template) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            template
        })
    } catch (error: any) {
        console.error('Email template update error:', error)
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Template name already exists' }, { status: 400 })
        }
        return NextResponse.json({ error: 'Failed to update email template' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB()

        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const template = await EmailTemplate.findByIdAndDelete(id)
        if (!template) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: 'Template deleted'
        })
    } catch (error) {
        console.error('Email template delete error:', error)
        return NextResponse.json({ error: 'Failed to delete email template' }, { status: 500 })
    }
}
