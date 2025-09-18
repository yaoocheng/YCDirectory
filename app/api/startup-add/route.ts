import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createStartup } from '@/lib/db-operations';

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
//   _type: string;
//   _createdAt: string;
//   _updatedAt?: string;
//   _rev?: string;
//   views: number;
//   author: Author;
//   category: string;
//   title: string;
//   description: string;
//   image: string;
//   pitch: string;
// }

// // 生成随机ID
// function generateId(): string {
//   return Math.floor(Math.random() * 1000000).toString();
// }



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, link, pitch } = body;

    const session = await auth();
    
    // 检查用户是否已登录
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 验证必填字段
    if (!title || !description || !category || !link || !pitch) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // 使用SQL函数创建startup
    const startupId = await createStartup({
      title,
      description,
      category,
      author_id: session.user.id,
      image: link,
      pitch
    });

    return NextResponse.json({
      success: true,
      startup: {
        _id: startupId,
        title,
        description,
        category,
        image: link,
        pitch,
        views: 0,
        author_id: session.user.id
      },
      message: 'Startup created successfully'
    });

  } catch (error) {
    console.error('Error creating startup:', error);
    return NextResponse.json(
      { error: 'Failed to create startup' },
      { status: 500 }
    );
  }
}