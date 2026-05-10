import connectDB from './mongodb'
import User from './models/User'
import Package from './models/Package'
import ApiKey from './models/ApiKey'
import bcrypt from 'bcryptjs'
import { headers } from 'next/headers'
import { logActivity } from './activity'
import { getAuthUser } from './jwt'

export interface AuthUser {
    userId: string
    email: string
    role: string;
    balance: number
}

/**
 * Helper to get the current session in Server Components or API Routes
 */
export async function getAuthSession() {
    const user = await getAuthUser()
    if (!user) return null
    
    return {
        user: {
            id: user.userId,
            email: user.email,
            role: user.role,
            balance: user.balance || 0
        }
    }
}

/**
 * Helper to require authentication in API routes (Server Side)
 */
export async function requireAuth(): Promise<AuthUser | null> {
    const session = await getAuthSession()

    if (!session || !session.user) {
        return null
    }

    return {
        userId: session.user.id,
        email: session.user.email!,
        role: session.user.role,
        balance: session.user.balance,
    }
}

/**
 * Helper to require admin access in API routes (Server Side)
 */
export async function requireAdmin(): Promise<AuthUser | null> {
    const user = await requireAuth()


    if (!user || user.role !== 'admin') {
        return null
    }

    return user
}
