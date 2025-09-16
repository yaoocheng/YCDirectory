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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    console.log(query);
    
    
    const filePath = path.join(process.cwd(), 'mock', 'startup.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    let posts = JSON.parse(fileContents);
    
    // 如果有搜索查询，过滤数据
    if (query) {
      const searchTerm = query.toLowerCase();
      posts = posts.filter((post: Startup) => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.description.toLowerCase().includes(searchTerm) ||
        post.category.toLowerCase().includes(searchTerm) ||
        post.author.name.toLowerCase().includes(searchTerm)
      );
    }
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error reading startup data:', error);
    return NextResponse.json(
      { error: 'Failed to load startup data' },
      { status: 500 }
    );
  }
}