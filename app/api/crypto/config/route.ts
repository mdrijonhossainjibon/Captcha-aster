import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import CryptoConfig, { INetwork } from '@/lib/models/CryptoConfig'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * GET /api/crypto/config
 * Fetch all cryptocurrency configurations (Admin gets all, users get active only)
 */
export async function GET() {
    try {
        await connectDB()
        const session = await getServerSession(authOptions)
        const isAdmin = session?.user?.role === 'admin'

        const query = isAdmin ? {} : { isActive: true }
        const cryptoConfigs = await CryptoConfig.find(query)
            .select('-__v')
            .lean()

        // Filter to only include active networks for non-admins
        const filteredConfigs = cryptoConfigs.map((crypto: any) => ({
            ...crypto,
            networks: isAdmin ? crypto.networks : crypto.networks.filter((network: INetwork) => network.isActive)
        }))

        return NextResponse.json({
            success: true,
            data: filteredConfigs,
        })
    } catch (error: any) {
        console.error('Error fetching crypto configs:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch cryptocurrency configurations',
            },
            { status: 500 }
        )
    }
}

/**
 * POST /api/crypto/config
 * Create or update cryptocurrency configuration (Admin only)
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (session?.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()

        const body = await request.json()
        const { id, name, fullName, icon, color, bg, borderGlow, networks, isActive } = body

        // Validate required fields
        if (!id || !name || !fullName || !networks || networks.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields',
                },
                { status: 400 }
            )
        }

        // Check if crypto config already exists
        const existingConfig = await CryptoConfig.findOne({ id })

        if (existingConfig) {
            // Update existing config
            existingConfig.name = name
            existingConfig.fullName = fullName
            existingConfig.icon = icon
            existingConfig.color = color
            existingConfig.bg = bg
            existingConfig.borderGlow = borderGlow
            existingConfig.networks = networks
            existingConfig.isActive = isActive ?? true

            await existingConfig.save()

            return NextResponse.json({
                success: true,
                message: 'Crypto configuration updated successfully',
                data: existingConfig,
            })
        } else {
            // Create new config
            const newConfig = await CryptoConfig.create({
                id,
                name,
                fullName,
                icon,
                color,
                bg,
                borderGlow,
                networks,
                isActive: isActive ?? true,
            })

            return NextResponse.json({
                success: true,
                message: 'Crypto configuration created successfully',
                data: newConfig,
            }, { status: 201 })
        }
    } catch (error: any) {
        console.error('Error creating/updating crypto config:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create/update cryptocurrency configuration',
            },
            { status: 500 }
        )
    }
}
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (session?.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id') // This is the 'id' field, e.g., 'usdt'

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 })
        }

        const deleted = await CryptoConfig.findOneAndDelete({ id })

        if (!deleted) {
            return NextResponse.json({ success: false, error: 'Configuration not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: 'Crypto configuration deleted successfully' })
    } catch (error: any) {
        console.error('Error deleting crypto config:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
