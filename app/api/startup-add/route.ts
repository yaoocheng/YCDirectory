import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createStartup, updateStartup } from '@/lib/db-operations';
import { formSchema } from '@/lib/validat';

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

        const session = await auth();

        // 检查用户是否已登录
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // 使用 Zod 验证数据
        const validationResult = formSchema.safeParse(body);

        if (!validationResult.success) {
            const fieldErrors: Record<string, string> = {};
            validationResult.error.issues.forEach((issue) => {
                if (issue.path && issue.path.length > 0) {
                    fieldErrors[String(issue.path[0])] = issue.message;
                }
            });

            return NextResponse.json(
                {
                    error: 'Validation failed',
                    fieldErrors
                },
                { status: 400 }
            );
        }

        const { id, title, description, category, link, pitch } = validationResult.data;
        let startupId: string | null = id || null;
        // 使用SQL函数创建startup
        if (id) {
             await updateStartup({
                id,
                title,
                description,
                category,
                image: link,
                pitch
            });
        } else {
            startupId = await createStartup({
                title,
                description,
                category,
                author_id: session.user.id,
                image: link,
                pitch
            });
        }

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