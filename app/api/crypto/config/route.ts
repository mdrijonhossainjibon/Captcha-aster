import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import CryptoConfig from '@/lib/models/CryptoConfig'

/**
 * GET /api/crypto/config
 * Fetch all active cryptocurrency configurations
 */
export async function GET() {
    try {
        await connectDB()

        const cryptoConfigs = await CryptoConfig.find({ isActive: true })
            .select('-__v')
            .lean()

        // Filter to only include active networks
        const filteredConfigs = cryptoConfigs.map(crypto => ({
            ...crypto,
            networks: crypto.networks.filter(network => network.isActive)
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
