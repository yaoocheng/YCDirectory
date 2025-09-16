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
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        const filePath = path.join(process.cwd(), 'mock', 'startup.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const posts: Startup[] = JSON.parse(fileContents);
        
        const post = posts.find((post: Startup) => post._id === id);

        if (!post) {
            return NextResponse.json(
                { error: 'Startup not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error reading startup data:', error);
        return NextResponse.json(
            { error: 'Failed to load startup data' },
            { status: 500 }
        );
    }
}