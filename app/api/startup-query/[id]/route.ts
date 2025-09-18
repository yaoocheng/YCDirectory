import { NextResponse } from 'next/server';
import { getStartupById } from '@/lib/db-operations';

interface Author {
  _id: string;
  name: string;
  username: string;
  email: string;
  image: string;
  bio: string;
}

interface Startup {
  _id: string;
  title: string;
  description: string;
  category: string;
  author: Author;
  image: string;
  pitch: string;
  views: number;
  _createdAt: string;
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const startup = await getStartupById(id);

        if (!startup) {
            return NextResponse.json(
                { error: 'Startup not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(startup);
    } catch (error) {
        console.error('Error reading startup data:', error);
        return NextResponse.json(
            { error: 'Failed to load startup data' },
            { status: 500 }
        );
    }
}