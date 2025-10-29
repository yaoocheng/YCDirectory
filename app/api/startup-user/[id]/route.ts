import { NextResponse } from 'next/server';
import { getStartupsByAuthor } from '@/lib/db-operations';

// interface Author {
//   _id: string;
//   name: string;
//   username: string;
//   email: string;
//   image: string;
//   bio: string;
// }

// interface Startup {
//   _id: string;
//   title: string;
//   description: string;
//   category: string;
//   author: Author;
//   image: string;
//   pitch: string;
//   views: number;
//   _createdAt: string;
// }

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const userStartups = await getStartupsByAuthor(id);

        if (userStartups.length === 0) {
            return NextResponse.json(
                { error: 'No startups found for this user' },
                { status: 404 }
            );
        }

        return NextResponse.json(userStartups);
    } catch (error) {
        console.error('Error reading user data:', error);
        return NextResponse.json(
            { error: 'Failed to load user data' },
            { status: 500 }
        );
    }
}