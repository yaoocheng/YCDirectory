import { NextResponse } from 'next/server';
import { likeStartup, unlikeStartup } from '@/lib/db-operations';
import { auth } from '@/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { startupId, liked } = body;
        if (!startupId) {
            return NextResponse.json(
                { error: 'Startup ID is required' },
                { status: 400 }
            );
        }
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }
        // 点赞或取消点赞
        if (liked) {
            await unlikeStartup(session.user.id, startupId);
        } else {
            await likeStartup(session.user.id, startupId);
        }

        return NextResponse.json(
            { message: liked ? 'Startup unliked successfully' : 'Startup liked successfully' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
