import { NextResponse } from 'next/server';
import { getAuthorById } from '@/lib/db-operations';

interface Author {
  _id: string;
  name: string;
  username: string;
  email: string;
  image: string;
  bio: string;
}

// Startup interface removed as it's not used in this file

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const user = await getAuthorById(id);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error reading user data:', error);
        return NextResponse.json(
            { error: 'Failed to load user data' },
            { status: 500 }
        );
    }
}