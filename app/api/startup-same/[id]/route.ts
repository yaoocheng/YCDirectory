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

        // 读取 startup.json 文件
        const filePath = path.join(process.cwd(), 'public', 'startup.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const allStartups: Startup[] = JSON.parse(fileContents);
        
        // 找到当前 startup
        const currentStartup = allStartups.find(startup => startup._id === id);

        if (!currentStartup) {
            return NextResponse.json(
                { error: 'Startup not found' },
                { status: 404 }
            );
        }

        // 查找相同作者的其他 startup（排除当前的）
        const sameAuthorStartups = allStartups.filter(startup => 
            startup.author._id === currentStartup.author._id && startup._id !== id
        );

        return NextResponse.json(sameAuthorStartups);
    } catch (error) {
        console.error('Error reading startup data:', error);
        return NextResponse.json(
            { error: 'Failed to load startup data' },
            { status: 500 }
        );
    }
}