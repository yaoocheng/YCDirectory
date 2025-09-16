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

// Startup interface removed as it's not used in this file

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const filePath = path.join(process.cwd(), 'mock', 'user.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const users: Author[] = JSON.parse(fileContents);
        
        const user = users.find(item => item._id === id);

        if (!user) {
            return NextResponse.json(
                { error: 'No user found for this id' },
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