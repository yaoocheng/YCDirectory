import { sql } from './db';
import { Comment } from '@/types';

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
  likes_count: number;
  _createdAt: string;
  _updatedAt: string;
  author: Author;
}

// 数据库查询结果类型
interface DbRow {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  pitch: string;
  views: number;
  likes_count: number;
  _createdAt: string;
  _updatedAt: string;
  author_id: string;
  author_name: string;
  author_username: string;
  author_email: string;
  author_image: string;
  author_bio: string;
  author_createdAt: string;
  author_updatedAt: string;
}

export async function deleteStartupById(id: string) {
  try {
    await sql`DELETE FROM startups WHERE id = ${id}`;
  } catch (error) {
    console.error("Error deleting startup:", error);
    throw error;
  }
}

// 获取所有startups，支持搜索和排序
export async function getStartups(
  searchQuery?: string,
  sortBy: 'latest' | 'views' | 'like' = 'latest'
): Promise<Startup[]> {
  try {
    // 生成 ORDER BY 子句字符串
    // let orderBy = 's.created_at DESC';
    // if (sortBy === 'views') orderBy = 's.views DESC';
    // if (sortBy === 'like') orderBy = 's.likes_count DESC';

    let query;

    if (searchQuery) {
      const searchTerm = `%${searchQuery.toLowerCase()}%`;

      if (sortBy === 'views') {
        query = sql`
          SELECT 
            s.id as "_id", s.title, s.description, s.category, s.image, s.pitch,
            s.views, s.likes_count,
            s.created_at as "_createdAt", s.updated_at as "_updatedAt",
            a.id as "author_id", a.name as "author_name", a.username as "author_username",
            a.email as "author_email", a.image as "author_image", a.bio as "author_bio",
            a.created_at as "author_createdAt", a.updated_at as "author_updatedAt"
          FROM startups s
          LEFT JOIN authors a ON s.author_id = a.id
          WHERE LOWER(s.title) LIKE ${searchTerm} OR
                LOWER(s.description) LIKE ${searchTerm} OR
                LOWER(s.category) LIKE ${searchTerm} OR
                LOWER(a.name) LIKE ${searchTerm}
          ORDER BY s.views DESC
        `;
      } else if (sortBy === 'like') {
        query = sql`
          SELECT 
            s.id as "_id", s.title, s.description, s.category, s.image, s.pitch,
            s.views, s.likes_count,
            s.created_at as "_createdAt", s.updated_at as "_updatedAt",
            a.id as "author_id", a.name as "author_name", a.username as "author_username",
            a.email as "author_email", a.image as "author_image", a.bio as "author_bio",
            a.created_at as "author_createdAt", a.updated_at as "author_updatedAt"
          FROM startups s
          LEFT JOIN authors a ON s.author_id = a.id
          WHERE LOWER(s.title) LIKE ${searchTerm} OR
                LOWER(s.description) LIKE ${searchTerm} OR
                LOWER(s.category) LIKE ${searchTerm} OR
                LOWER(a.name) LIKE ${searchTerm}
          ORDER BY s.likes_count DESC
        `;
      } else {
        query = sql`
          SELECT 
            s.id as "_id", s.title, s.description, s.category, s.image, s.pitch,
            s.views, s.likes_count,
            s.created_at as "_createdAt", s.updated_at as "_updatedAt",
            a.id as "author_id", a.name as "author_name", a.username as "author_username",
            a.email as "author_email", a.image as "author_image", a.bio as "author_bio",
            a.created_at as "author_createdAt", a.updated_at as "author_updatedAt"
          FROM startups s
          LEFT JOIN authors a ON s.author_id = a.id
          WHERE LOWER(s.title) LIKE ${searchTerm} OR
                LOWER(s.description) LIKE ${searchTerm} OR
                LOWER(s.category) LIKE ${searchTerm} OR
                LOWER(a.name) LIKE ${searchTerm}
          ORDER BY s.created_at DESC
        `;
      }
    } else {
      // 无搜索条件
      if (sortBy === 'views') {
        query = sql`
          SELECT 
            s.id as "_id", s.title, s.description, s.category, s.image, s.pitch,
            s.views, s.likes_count,
            s.created_at as "_createdAt", s.updated_at as "_updatedAt",
            a.id as "author_id", a.name as "author_name", a.username as "author_username",
            a.email as "author_email", a.image as "author_image", a.bio as "author_bio",
            a.created_at as "author_createdAt", a.updated_at as "author_updatedAt"
          FROM startups s
          LEFT JOIN authors a ON s.author_id = a.id
          ORDER BY s.views DESC
        `;
      } else if (sortBy === 'like') {
        query = sql`
          SELECT 
            s.id as "_id", s.title, s.description, s.category, s.image, s.pitch,
            s.views, s.likes_count,
            s.created_at as "_createdAt", s.updated_at as "_updatedAt",
            a.id as "author_id", a.name as "author_name", a.username as "author_username",
            a.email as "author_email", a.image as "author_image", a.bio as "author_bio",
            a.created_at as "author_createdAt", a.updated_at as "author_updatedAt"
          FROM startups s
          LEFT JOIN authors a ON s.author_id = a.id
          ORDER BY s.likes_count DESC
        `;
      } else {
        query = sql`
          SELECT 
            s.id as "_id", s.title, s.description, s.category, s.image, s.pitch,
            s.views, s.likes_count,
            s.created_at as "_createdAt", s.updated_at as "_updatedAt",
            a.id as "author_id", a.name as "author_name", a.username as "author_username",
            a.email as "author_email", a.image as "author_image", a.bio as "author_bio",
            a.created_at as "author_createdAt", a.updated_at as "author_updatedAt"
          FROM startups s
          LEFT JOIN authors a ON s.author_id = a.id
          ORDER BY s.created_at DESC
        `;
      }
    }

    const results = await query;

    return (results as DbRow[]).map((row) => ({
      _id: row._id,
      title: row.title,
      description: row.description,
      category: row.category,
      image: row.image,
      pitch: row.pitch,
      views: row.views,
      likes_count: row.likes_count,
      _createdAt: row._createdAt,
      _updatedAt: row._updatedAt,
      author: {
        _id: row.author_id,
        name: row.author_name,
        username: row.author_username,
        email: row.author_email,
        image: row.author_image,
        bio: row.author_bio,
        _createdAt: row.author_createdAt,
        _updatedAt: row.author_updatedAt
      }
    }));
  } catch (error) {
    console.error('获取startups数据失败:', error);
    throw new Error('Failed to fetch startups');
  }
}


// 根据ID获取单个startup
export async function getStartupById(id: string): Promise<Startup | null> {
  try {
    const result = await sql`
      SELECT 
        s.id as "_id",
        s.title,
        s.description,
        s.category,
        s.image,
        s.pitch,
        s.views,
        s.likes_count,
        s.created_at as "_createdAt",
        s.updated_at as "_updatedAt",
        a.id as "author_id",
        a.name as "author_name",
        a.username as "author_username",
        a.email as "author_email",
        a.image as "author_image",
        a.bio as "author_bio",
        a.created_at as "author_createdAt",
        a.updated_at as "author_updatedAt"
      FROM startups s
      LEFT JOIN authors a ON s.author_id = a.id
      WHERE s.id = ${id}
    `;

    if (result.length === 0) return null;

    const row = result[0];

    return {
      _id: row._id,
      title: row.title,
      description: row.description,
      category: row.category,
      image: row.image,
      pitch: row.pitch,
      views: row.views,
      likes_count: row.likes_count,
      _createdAt: row._createdAt,
      _updatedAt: row._updatedAt,
      author: {
        _id: row.author_id,
        name: row.author_name,
        username: row.author_username,
        email: row.author_email,
        image: row.author_image,
        bio: row.author_bio,
        _createdAt: row.author_createdAt,
        _updatedAt: row.author_updatedAt
      }
    };
  } catch (error) {
    console.error('获取startup详情失败:', error);
    throw new Error('Failed to fetch startup');
  }
}

// 根据作者ID获取startups
export async function getStartupsByAuthor(authorId: string): Promise<Startup[]> {
  try {
    const result = await sql`
      SELECT 
        s.id as "_id",
        s.title,
        s.description,
        s.category,
        s.image,
        s.pitch,
        s.views,
        s.likes_count,
        s.created_at as "_createdAt",
        s.updated_at as "_updatedAt",
        a.id as "author_id",
        a.name as "author_name",
        a.username as "author_username",
        a.email as "author_email",
        a.image as "author_image",
        a.bio as "author_bio",
        a.created_at as "author_createdAt",
        a.updated_at as "author_updatedAt"
      FROM startups s
      LEFT JOIN authors a ON s.author_id = a.id
      WHERE s.author_id = ${authorId}
      ORDER BY s.created_at DESC
    `;

    return (result as DbRow[]).map((row) => ({
      _id: row._id,
      title: row.title,
      description: row.description,
      category: row.category,
      image: row.image,
      pitch: row.pitch,
      views: row.views,
      likes_count: row.likes_count,
      _createdAt: row._createdAt,
      _updatedAt: row._updatedAt,
      author: {
        _id: row.author_id,
        name: row.author_name,
        username: row.author_username,
        email: row.author_email,
        image: row.author_image,
        bio: row.author_bio,
        _createdAt: row.author_createdAt,
        _updatedAt: row.author_updatedAt
      }
    }));
  } catch (error) {
    console.error('获取作者startups失败:', error);
    throw new Error('Failed to fetch author startups');
  }
}

// 获取相似的startups（相同分类，排除当前startup）
export async function getSimilarStartups(id: string, category: string, limit: number = 3): Promise<Startup[]> {
  try {
    const result = await sql`
      SELECT 
        s.id as "_id",
        s.title,
        s.description,
        s.category,
        s.image,
        s.pitch,
        s.views,
        s.likes_count,
        s.created_at as "_createdAt",
        s.updated_at as "_updatedAt",
        a.id as "author_id",
        a.name as "author_name",
        a.username as "author_username",
        a.email as "author_email",
        a.image as "author_image",
        a.bio as "author_bio",
        a.created_at as "author_createdAt",
        a.updated_at as "author_updatedAt"
      FROM startups s
      LEFT JOIN authors a ON s.author_id = a.id
      WHERE s.category = ${category} AND s.id != ${id}
      ORDER BY s.created_at DESC
      LIMIT ${limit}
    `;
    
    return (result as DbRow[]).map((row) => ({
      _id: row._id,
      title: row.title,
      description: row.description,
      category: row.category,
      image: row.image,
      pitch: row.pitch,
      views: row.views,
      likes_count: row.likes_count,
      _createdAt: row._createdAt,
      _updatedAt: row._updatedAt,
      author: {
        _id: row.author_id,
        name: row.author_name,
        username: row.author_username,
        email: row.author_email,
        image: row.author_image,
        bio: row.author_bio,
        _createdAt: row.author_createdAt,
        _updatedAt: row.author_updatedAt
      }
    }));
  } catch (error) {
    console.error('获取相似startups失败:', error);
    throw new Error('Failed to fetch similar startups');
  }
}

// 根据ID获取作者信息
export async function getAuthorById(id: string): Promise<Author | null> {
  try {
    const result = await sql`
      SELECT 
        id as "_id",
        name,
        username,
        email,
        image,
        bio,
        created_at as "_createdAt",
        updated_at as "_updatedAt"
      FROM authors
      WHERE id = ${id}
    `;

    if (result.length === 0) return null;

    const row = result[0];
    return {
      _id: row._id,
      name: row.name,
      username: row.username,
      email: row.email,
      image: row.image,
      bio: row.bio,
      _createdAt: row._createdAt,
      _updatedAt: row._updatedAt
    };
  } catch (error) {
    console.error('获取作者信息失败:', error);
    throw new Error('Failed to fetch author');
  }
}

// 原子性更新浏览量
export async function updateStartupViews(id: string): Promise<boolean> {
  try {
    await sql`
      UPDATE startups
      SET views = views + 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id};
    `;
    return true;
  } catch (error) {
    console.error('更新浏览量失败:', error);
    return false;
  }
}


// 创建或更新作者信息
export async function createOrUpdateAuthor(author: {
  id: string;
  name: string;
  username: string;
  email: string;
  image: string;
  bio: string;
}): Promise<void> {
  try {
    await sql`
      INSERT INTO authors (id, name, username, email, image, bio, created_at, updated_at)
      VALUES (${author.id}, ${author.name}, ${author.username}, ${author.email}, ${author.image}, ${author.bio}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (username) DO UPDATE
      SET name = EXCLUDED.name,
          email = EXCLUDED.email,
          image = EXCLUDED.image,
          bio = EXCLUDED.bio,
          updated_at = CURRENT_TIMESTAMP
    `;
  } catch (error) {
    console.error('创建或更新作者失败:', error);
    throw new Error('Failed to create or update author');
  }
}


// 创建新的startup
export async function createStartup(startup: {
  title: string;
  description: string;
  category: string;
  author_id: string;
  image: string;
  pitch: string;
}): Promise<string> {
  try {
    const id = Date.now().toString(); // 简单的ID生成
    
    await sql`
      INSERT INTO startups (id, title, description, category, author_id, image, pitch, views, created_at, updated_at)
      VALUES (${id}, ${startup.title}, ${startup.description}, ${startup.category}, ${startup.author_id}, ${startup.image}, ${startup.pitch}, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    
    return id;
  } catch (error) {
    console.error('创建startup失败:', error);
    throw new Error('Failed to create startup');
  }
}


// 点赞（如果已经点过就忽略）
export async function likeStartup(userId: string, startupId: string): Promise<void> {
  try {
    const id = Date.now().toString(); // 简单生成 id

    await sql`
      INSERT INTO likes (id, author_id, startup_id)
      VALUES (${id}, ${userId}, ${startupId})
      ON CONFLICT (author_id, startup_id) DO NOTHING
    `;
  } catch (error) {
    console.error('点赞失败:', error);
    throw new Error('Failed to like startup');
  }
}

// 取消点赞
export async function unlikeStartup(userId: string, startupId: string): Promise<void> {
  try {
    await sql`
      DELETE FROM likes
      WHERE author_id = ${userId} AND startup_id = ${startupId}
    `;
  } catch (error) {
    console.error('取消点赞失败:', error);
    throw new Error('Failed to unlike startup');
  }
}

// 检查当前用户是否已点赞
export async function hasLiked(userId: string, startupId: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT 1 FROM likes
      WHERE author_id = ${userId} AND startup_id = ${startupId}
      LIMIT 1
    `;
    return result.length > 0;
  } catch (error) {
    console.error('查询点赞状态失败:', error);
    throw new Error('Failed to check like status');
  }
}

// 获取 startup 的点赞总数
export async function getLikesCount(startupId: string): Promise<number> {
  try {
    const result = await sql`
      SELECT COUNT(*) AS count FROM likes
      WHERE startup_id = ${startupId}
    `;
    return Number(result[0].count);
  } catch (error) {
    console.error('获取点赞数量失败:', error);
    throw new Error('Failed to get likes count');
  }
}

// 获取 startup 的评论列表
export async function getCommentsByStartupId(startupId: string): Promise<Comment[]> {
  const result = await sql`
    SELECT 
      c.id, c.content, c.created_at,
      a.id as author_id, a.name as author_name, a.image as author_image
    FROM comments c
    JOIN authors a ON c.author_id = a.id
    WHERE c.startup_id = ${startupId}
    ORDER BY c.created_at DESC;
  `;
  return result.map((row) => ({
    id: row.id,
    author_id: row.author_id,
    author_name: row.author_name,
    author_image: row.author_image,
    content: row.content,
    created_at: row.created_at,
  }));
}

// 添加评论
export async function addComment(startupId: string, authorId: string, content: string) {
  await sql`
    INSERT INTO comments (startup_id, author_id, content)
    VALUES (${startupId}, ${authorId}, ${content});
  `;
}
