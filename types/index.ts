export interface Author {
  _id: string;
  name: string;
  username: string;
  email: string;
  image: string;
  bio: string;
}

export interface Startup {
  _id: string;
  title: string;
  description: string;
  category: string;
  author: Author;
  image: string;
  pitch: string;
  views: number;
  _createdAt: string;
  _updatedAt?: string;
}