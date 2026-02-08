/**
 * Database Seeder Script
 * 
 * This script creates a test user in the database for testing the login functionality.
 * 
 * Usage:
 *   node --loader ts-node/esm scripts/seed-db.ts
 *   or
 *   tsx scripts/seed-db.ts
 */

import mongoose from 'mongoose'
import User from '../lib/models/User'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/captchamaster'

async function seedDatabase() {
    try {
        console.log('🔌 Connecting to MongoDB...')
        await mongoose.connect(MONGODB_URI)
        console.log('✅ Connected to MongoDB')

        // Create test users
        const testUsers = [
            {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
                twoFactorEnabled: false,
                balance: 100,
                isActive: true,
                isAdmin: false,
            },
            {
                email: 'admin@example.com',
                password: 'admin123',
                name: 'Admin User',
                twoFactorEnabled: true,
                balance: 1000,
                isActive: true,
                isAdmin: true,
            },
            {
                email: 'user2fa@example.com',
                password: 'password123',
                name: 'User with 2FA',
                twoFactorEnabled: true,
                balance: 50,
                isActive: true,
                isAdmin: false,
            },
        ]

        console.log('\n📝 Creating test users...')

        for (const userData of testUsers) {
            // Check if user already exists
            const existingUser = await User.findOne({ email: userData.email })

            if (existingUser) {
                console.log(`⚠️  User ${userData.email} already exists, skipping...`)
                continue
            }

            // Create new user
            const user = await User.create(userData)
            console.log(`✅ Created user: ${user.email} (2FA: ${user.twoFactorEnabled ? 'ON' : 'OFF'})`)
        }

        console.log('\n✨ Database seeding completed!')
        console.log('\n📋 Test Credentials:')
        console.log('━'.repeat(50))
        console.log('Without 2FA:')
        console.log('  Email: test@example.com')
        console.log('  Password: password123')
        console.log('\nWith 2FA:')
        console.log('  Email: user2fa@example.com')
        console.log('  Password: password123')
        console.log('\nAdmin (with 2FA):')
        console.log('  Email: admin@example.com')
        console.log('  Password: admin123')
        console.log('━'.repeat(50))
    } catch (error) {
        console.error('❌ Error seeding database:', error)
        process.exit(1)
    } finally {
        await mongoose.disconnect()
        console.log('\n🔌 Disconnected from MongoDB')
        process.exit(0)
    }
}

seedDatabase()
