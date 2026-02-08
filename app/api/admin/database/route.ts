import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        await connectDB()

        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const db = mongoose.connection.db
        if (!db) {
            return NextResponse.json({ error: 'Database not connected' }, { status: 500 })
        }

        // Get all collections
        const collections = await db.listCollections().toArray()

        // Get stats for each collection
        const collectionStats = await Promise.all(
            collections.map(async (collection) => {
                try {
                    // Use db.command() with collStats to get collection statistics
                    const stats = await db.command({ collStats: collection.name })
                    const count = await db.collection(collection.name).countDocuments()

                    return {
                        name: collection.name,
                        count: count,
                        size: stats.size || 0,
                        storageSize: stats.storageSize || 0,
                        avgObjSize: stats.avgObjSize || 0,
                        indexes: stats.nindexes || 0,
                        totalIndexSize: stats.totalIndexSize || 0,
                    }
                } catch (error) {
                    console.error(`Error getting stats for ${collection.name}:`, error)
                    return {
                        name: collection.name,
                        count: 0,
                        size: 0,
                        storageSize: 0,
                        avgObjSize: 0,
                        indexes: 0,
                        totalIndexSize: 0,
                    }
                }
            })
        )

        // Calculate total stats
        const totalStats = collectionStats.reduce(
            (acc, col) => ({
                totalSize: acc.totalSize + col.size,
                totalStorageSize: acc.totalStorageSize + col.storageSize,
                totalDocuments: acc.totalDocuments + col.count,
                totalIndexSize: acc.totalIndexSize + col.totalIndexSize,
            }),
            { totalSize: 0, totalStorageSize: 0, totalDocuments: 0, totalIndexSize: 0 }
        )

        // Get database stats
        const dbStats = await db.stats()

        return NextResponse.json({
            success: true,
            collections: collectionStats,
            stats: {
                totalCollections: collections.length,
                totalDocuments: totalStats.totalDocuments,
                totalSize: totalStats.totalSize,
                totalStorageSize: totalStats.totalStorageSize,
                totalIndexSize: totalStats.totalIndexSize,
                databaseName: db.databaseName,
                avgObjSize: dbStats.avgObjSize || 0,
            },
        })
    } catch (error) {
        console.error('Database stats error:', error)
        return NextResponse.json({ error: 'Failed to fetch database stats' }, { status: 500 })
    }
}

// Export collection data as JSON for backup
export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { collectionName } = await request.json()

        if (!collectionName) {
            return NextResponse.json({ error: 'Collection name is required' }, { status: 400 })
        }

        const db = mongoose.connection.db
        if (!db) {
            return NextResponse.json({ error: 'Database not connected' }, { status: 500 })
        }

        // Get all documents from the collection
        const documents = await db.collection(collectionName).find({}).toArray()

        return NextResponse.json({
            success: true,
            collectionName,
            documentCount: documents.length,
            data: documents,
            exportedAt: new Date().toISOString(),
        })
    } catch (error) {
        console.error('Collection export error:', error)
        return NextResponse.json({ error: 'Failed to export collection' }, { status: 500 })
    }
}
