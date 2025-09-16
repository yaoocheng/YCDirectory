
export type Startup = {
  _id: string;
  _type: "startup";
  _createdAt: Date;
  _updatedAt: string;
  _rev: string;
  title?: string;
  slug?: Slug;
  author?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "author";
  };
  views?: number;
  description?: string;
  category?: string;
  image?: string;
  pitch?: string;
};


export type Author = {
  _id: string;
  _type: "author";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  image?: string;
  bio?: string;
};


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
