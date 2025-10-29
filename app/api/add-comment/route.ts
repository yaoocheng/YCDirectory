import { NextResponse } from 'next/server';
import { addComment } from '@/lib/db-operations';

export async function POST(req: Request) {
    const { startupId, userId, content } = await req.json();

    if (!startupId || !userId || !content) {
        return NextResponse.json(
            { error: 'Startup ID, User ID, and Content are required' },
            { status: 400 }
        );
    }

    try {
        await addComment(startupId, userId, content);
        return NextResponse.json(
            { message: 'Comment added successfully' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
