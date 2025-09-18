import { neon } from '@neondatabase/serverless';

// 从环境变量获取数据库连接字符串
const sql = neon(process.env.DATABASE_URL!);

export { sql };

// 数据库连接测试函数
// export async function testConnection() {
//   try {
//     const result = await sql`SELECT 1 as test`;
//     console.log('数据库连接成功:', result);
//     return true;
//   } catch (error) {
//     console.error('数据库连接失败:', error);
//     return false;
//   }
// }

// // 数据库初始化函数
// export async function initDatabase() {
//   try {
//     // 创建authors表
//     await sql`
//       CREATE TABLE IF NOT EXISTS authors (
//         id VARCHAR(255) PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         username VARCHAR(255) UNIQUE NOT NULL,
//         email VARCHAR(255) UNIQUE NOT NULL,
//         image TEXT,
//         bio TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `;

//     // 创建startups表
//     await sql`
//       CREATE TABLE IF NOT EXISTS startups (
//         id VARCHAR(255) PRIMARY KEY,
//         title VARCHAR(255) NOT NULL,
//         description TEXT,
//         category VARCHAR(100),
//         author_id VARCHAR(255) REFERENCES authors(id),
//         image TEXT,
//         pitch TEXT,
//         views INTEGER DEFAULT 0,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `;

//     console.log('数据库表创建成功');
//     return true;
//   } catch (error) {
//     console.error('数据库初始化失败:', error);
//     return false;
//   }
// }