import { NextResponse } from 'next/server';
import { getStartupById, getSimilarStartups } from '@/lib/db-operations';

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

        // 找到当前 startup
        const currentStartup = await getStartupById(id);

        if (!currentStartup) {
            return NextResponse.json(
                { error: 'Startup not found' },
                { status: 404 }
            );
        }

        // 查找相同分类的其他 startup（排除当前的）
        const similarStartups = await getSimilarStartups(id, currentStartup.category, 5);

        return NextResponse.json(similarStartups);
    } catch (error) {
        console.error('Error reading startup data:', error);
        return NextResponse.json(
            { error: 'Failed to load startup data' },
            { status: 500 }
        );
    }
}