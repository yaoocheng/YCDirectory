import { NextResponse } from 'next/server';
import { getStartups } from '@/lib/db-operations';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    
    // 使用Neon数据库获取数据
    const posts = await getStartups(query || undefined);
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching startup data from database:', error);
    return NextResponse.json(
      { error: 'Failed to load startup data' },
      { status: 500 }
    );
  }
}