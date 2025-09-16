import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

        const filePath = path.join(process.cwd(), 'public', 'startup.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const posts: Startup[] = JSON.parse(fileContents);
        
        const userStartups = posts.filter(item => item.author._id === id);

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