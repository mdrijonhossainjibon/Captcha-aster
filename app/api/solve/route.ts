import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Solution from '@/lib/models/Solution'
import { requireAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const authUser = await requireAuth()
        if (!authUser) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
        }

        const body = await request.json()
        const { 
            hash, 
            question, 
            type, 
            service = 'awswaf', 
            imageData, 
            examples
        } = body

        if (!hash || !type) {
            return NextResponse.json({ 
                error: 'hash and type are required' 
            }, { status: 400 })
        }

        // Check if solution already exists
        const existingSolution = await Solution.findOne({ hash })
        if (existingSolution) {
            return NextResponse.json({
                success: true,
                solution: existingSolution.solution,
                classNames: existingSolution.classNames,
                cached: true
            })
        }

        // Generate solution
        const solution = generateDefaultSolution(type)
        const classNames = extractClassNames(solution, type)

        // Save solution to database
        const newSolution = new Solution({
            hash,
            question: question || '',
            type,
            service,
            solution,
            imageData: imageData || [],
            examples: examples || [],
            classNames,
            userId: authUser.userId,
            apiKeyId: null
        })

        await newSolution.save()

        return NextResponse.json({
            success: true,
            solution,
            classNames,
            cached: false
        })

    } catch (error) {
        console.error('Solve captcha error:', error)
        return NextResponse.json({ 
            error: 'Internal server error' 
        }, { status: 500 })
    }
}

// Extract class names from solution
function extractClassNames(solution: any, type: string): string[] {
    switch (type) {
        case 'objectTag':
            return Array.isArray(solution) ? solution : []
        case 'objectClassify':
            return solution ? ['selected'] : []
        default:
            return []
    }
}

// Default fallback solution
function generateDefaultSolution(type: string): any {
    switch (type) {
        case 'objectClassify':
            return [true, false, true, false, true]
        case 'objectClick':
            return [{ x: 100, y: 100 }]
        case 'objectDrag':
            return [{ start: 'A', end: 'B' }]
        case 'objectTag':
            return ['example', 'tag']
        case 'grid':
            return [0, 1, 2]
        default:
            return null
    }
}
