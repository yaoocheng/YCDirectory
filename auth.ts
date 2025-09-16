// auth.ts 放在项目根目录（或合适位置）
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github";
import fs from "fs";
import path from "path";
import { Author } from "@/types/types";

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

// 保存用户信息到mock/user.json
async function saveUserToMockData(userInfo: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string;
    bio?: string;
}) {
    try {
        const userFilePath = path.join(process.cwd(), 'mock', 'user.json');
        
        // 读取现有用户数据
        let users: Author[] = [];
        if (fs.existsSync(userFilePath)) {
            const fileContent = fs.readFileSync(userFilePath, 'utf-8');
            users = JSON.parse(fileContent);
        }
        
        // 检查用户是否已存在
        const existingUserIndex = users.findIndex(user => user._id === userInfo.id);
        
        // 创建用户对象
        const newUser: Author = {
            _id: userInfo.id,
            _type: "author",
            _createdAt: new Date().toISOString(),
            _updatedAt: new Date().toISOString(),
            _rev: `rev-${Date.now()}`,
            name: userInfo.name || undefined,
            username: userInfo.username || undefined,
            email: userInfo.email || undefined,
            image: userInfo.image || undefined,
            bio: userInfo.bio || undefined,
        };
        
        if (existingUserIndex >= 0) {
            // 更新现有用户
            users[existingUserIndex] = { ...users[existingUserIndex], ...newUser, _updatedAt: new Date().toISOString() };
        } else {
            // 添加新用户
            users.push(newUser);
        }
        
        // 保存到文件
        fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));
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
                
                // 保存用户信息到mock/user.json
                await saveUserToMockData({
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
