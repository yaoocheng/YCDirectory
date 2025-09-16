import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { auth } from '@/auth';
import type { Session } from 'next-auth';

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
  _type: string;
  _createdAt: string;
  _updatedAt?: string;
  _rev?: string;
  views: number;
  author: Author;
  category: string;
  title: string;
  description: string;
  image: string;
  pitch: string;
}

// 生成随机ID
function generateId(): string {
  return Math.floor(Math.random() * 1000000).toString();
}

// 生成作者数据（基于session中的用户信息）
function generateAuthor(session: Session | null): Author {
  if (!session?.user?.id) {
    throw new Error('User not authenticated or missing user ID');
  }

  const userEmail = session.user.email || "anonymous@example.com";
  const userName = session.user.name || "Anonymous User";
  const authorId = session.user.id; // 直接使用session中的用户ID
  const username = session.user.username || `user${authorId}`;
  const bio = session.user.bio || "Startup enthusiast";

  return {
    _id: authorId,
    name: userName,
    username: username,
    email: userEmail,
    image: session.user.image || "https://picsum.photos/400/300?random=1",
    bio: bio
  };
}

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

    const author = generateAuthor(session);

    // 验证必填字段
    if (!title || !description || !category || !link || !pitch) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // 读取现有数据
    const filePath = path.join(process.cwd(), 'public', 'startup.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const existingStartups: Startup[] = JSON.parse(fileContents);

    // 生成新的ID，确保不重复
    let newId: string;
    do {
      newId = generateId();
    } while (existingStartups.some(startup => startup._id === newId));



    // 创建新的startup对象
    const newStartup: Startup = {
      _id: newId,
      _type: "startup",
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: generateId(),
      views: 0,
      author: author,
      category,
      title,
      description,
      image: link,
      pitch
    };

    // 添加到现有数据中
    existingStartups.push(newStartup);

    // 写回文件
    fs.writeFileSync(filePath, JSON.stringify(existingStartups, null, 2));

    return NextResponse.json({
      success: true,
      startup: newStartup,
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