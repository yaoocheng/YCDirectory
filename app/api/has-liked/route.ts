import { NextResponse } from 'next/server';
import { hasLiked, getLikesCount } from '@/lib/db-operations';
import { auth } from '@/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { startupId } = body;

        // 获取点赞数
        const likesNum = await getLikesCount(startupId);

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

        const liked = await hasLiked(session.user.id,startupId);
        
        return NextResponse.json(
            { liked, likesNum },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
