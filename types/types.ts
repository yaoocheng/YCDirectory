
// 定义数据类型接口
export interface Author {
  _id: string;
  name: string;
  username: string;
  email: string;
  image: string;
  bio: string;
  _createdAt: string;
  _updatedAt: string;
}

export interface Startup {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  pitch: string;
  views: number;
  _createdAt: string;
  _updatedAt: string;
  author: Author;
}


export type Slug = {
  _type: "slug";
  current?: string;
  source?: string;
};

export declare const internalGroqTypeReferenceTo: unique symbol;

// NextAuth类型扩展
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string;
      bio?: string;
    };
  }

  interface JWT {
    userId?: string;
    username?: string;
    bio?: string;
  }
}
