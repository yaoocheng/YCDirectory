// auth.ts 放在项目根目录（或合适位置）
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github";
import { createOrUpdateAuthor } from "@/lib/db-operations";

// 基于用户信息生成固定的唯一ID
function generateUserBasedId(userEmail: string, userName: string): string {
    const combined = `${userEmail}-${userName}`.toLowerCase().replace(/[^a-z0-9]/g, '');
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash).toString();
}

// 保存用户信息到数据库
async function saveUserToDatabase(userInfo: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string;
    bio?: string;
}) {
    try {
        await createOrUpdateAuthor({
            id: userInfo.id,
            name: userInfo.name || '',
            username: userInfo.username || '',
            email: userInfo.email || '',
            image: userInfo.image || '',
            bio: userInfo.bio || ''
        });
    } catch (error) {
        console.error('保存用户信息失败:', error);
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [GitHub({
        authorization: {
            params: {
                scope: "user"
            }
        }
    })],
    callbacks: {
        async jwt({ token, user, profile }) {
            // 在首次登录时生成唯一ID
            if (user && user.email && user.name) {
                token.userId = generateUserBasedId(user.email, user.name);
                token.username = profile?.login;
                token.bio = profile?.bio;
            }
            return token;
        },
        async session({ session, token }) {
            // 将唯一ID添加到session中
            if (token.userId) {
                session.user.id = token.userId as string;
                session.user.username = token.username as string;
                session.user.bio = token.bio as string;
                
                // 保存用户信息到数据库
                await saveUserToDatabase({
                    id: token.userId as string,
                    name: session.user.name,
                    email: session.user.email,
                    image: session.user.image,
                    username: token.username as string,
                    bio: token.bio as string,
                });
            }
            return session;
        },
    },
})
