import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Activity from '@/lib/models/Activity';
import { requireAuth } from '@/lib/auth';

export async function GET() {
    try {
        await connectDB();

        const authUser = await requireAuth();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = authUser.userId;

        const activities = await Activity.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50);

        // Format activities for the UI
        const formattedActivities = activities.map(activity => ({
            id: activity._id.toString(),
            action: activity.action,
            type: activity.type,
            description: activity.description,
            ip: activity.ip,
            location: activity.location,
            status: activity.status,
            timestamp: activity.createdAt.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        }));

        return NextResponse.json({
            success: true,
            activities: formattedActivities
        });
    } catch (error: any) {
        console.error('Activities fetch error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch activities'
        }, { status: 500 });
    }
}
