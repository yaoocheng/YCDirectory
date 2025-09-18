-- Neon SQL Editor 查询示例
-- 以下是一些常用的SQL查询语句，可以在Neon SQL Editor中直接执行

-- ========================================
-- 1. 基础查询示例
-- ========================================

-- 查看所有表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- 查看表结构
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'startups';

-- ========================================
-- 2. 数据查询示例
-- ========================================

-- 查询所有startups（带作者信息）
SELECT 
  s.id,
  s.title,
  s.description,
  s.category,
  s.views,
  s.created_at,
  a.name as author_name,
  a.username as author_username
FROM startups s
LEFT JOIN authors a ON s.author_id = a.id
ORDER BY s.created_at DESC;

-- 按分类查询startups
SELECT 
  s.title,
  s.category,
  s.views,
  a.name as author_name
FROM startups s
LEFT JOIN authors a ON s.author_id = a.id
WHERE s.category = 'Tech'
ORDER BY s.views DESC;

-- 搜索功能（模糊查询）
SELECT 
  s.id,
  s.title,
  s.description,
  s.category,
  a.name as author_name
FROM startups s
LEFT JOIN authors a ON s.author_id = a.id
WHERE 
  LOWER(s.title) LIKE '%科技%' OR
  LOWER(s.description) LIKE '%科技%' OR
  LOWER(s.category) LIKE '%tech%' OR
  LOWER(a.name) LIKE '%yaocheng%'
ORDER BY s.created_at DESC;

-- 查询特定作者的所有startups
SELECT 
  s.title,
  s.category,
  s.views,
  s.created_at
FROM startups s
WHERE s.author_id = '569663659'
ORDER BY s.created_at DESC;

-- 查询浏览量最高的startups
SELECT 
  s.title,
  s.views,
  s.category,
  a.name as author_name
FROM startups s
LEFT JOIN authors a ON s.author_id = a.id
ORDER BY s.views DESC
LIMIT 10;

-- ========================================
-- 3. 统计查询示例
-- ========================================

-- 统计每个分类的startup数量
SELECT 
  category,
  COUNT(*) as startup_count
FROM startups
GROUP BY category
ORDER BY startup_count DESC;

-- 统计每个作者的startup数量
SELECT 
  a.name,
  a.username,
  COUNT(s.id) as startup_count
FROM authors a
LEFT JOIN startups s ON a.id = s.author_id
GROUP BY a.id, a.name, a.username
ORDER BY startup_count DESC;

-- 统计总浏览量
SELECT 
  COUNT(*) as total_startups,
  SUM(views) as total_views,
  AVG(views) as avg_views
FROM startups;

-- 按月统计创建的startup数量
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as startup_count
FROM startups
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- ========================================
-- 4. 数据更新示例
-- ========================================

-- 更新startup浏览量
UPDATE startups 
SET views = views + 1, updated_at = CURRENT_TIMESTAMP
WHERE id = '640037';

-- 更新作者信息
UPDATE authors 
SET bio = '新的个人简介', updated_at = CURRENT_TIMESTAMP
WHERE id = '569663659';

-- ========================================
-- 5. 数据插入示例
-- ========================================

-- 插入新作者
INSERT INTO authors (id, name, username, email, image, bio)
VALUES (
  'new_author_id',
  '新作者',
  'new_username',
  'new@email.com',
  'https://example.com/avatar.jpg',
  '这是新作者的简介'
);

-- 插入新startup
INSERT INTO startups (id, title, description, category, author_id, image, pitch, views)
VALUES (
  'new_startup_id',
  '新的创业项目',
  '这是一个创新的项目描述',
  'Tech',
  'new_author_id',
  'https://example.com/startup.jpg',
  '详细的项目介绍和商业计划...',
  0
);

-- ========================================
-- 6. 数据维护示例
-- ========================================

-- 删除测试数据
DELETE FROM startups WHERE title LIKE '%测试%';

-- 清理无效的作者关联
DELETE FROM startups 
WHERE author_id NOT IN (SELECT id FROM authors);

-- 重置所有startup的浏览量
UPDATE startups SET views = 0;

-- ========================================
-- 7. 性能优化查询
-- ========================================

-- 查看查询执行计划
EXPLAIN ANALYZE 
SELECT s.*, a.name 
FROM startups s 
LEFT JOIN authors a ON s.author_id = a.id 
WHERE s.category = 'Tech';

-- 查看索引使用情况
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE tablename IN ('startups', 'authors');

-- ========================================
-- 8. 备份和恢复相关
-- ========================================

-- 导出所有数据（用于备份）
SELECT 
  'INSERT INTO authors VALUES (' ||
  quote_literal(id) || ',' ||
  quote_literal(name) || ',' ||
  quote_literal(username) || ',' ||
  quote_literal(email) || ',' ||
  quote_literal(image) || ',' ||
  quote_literal(bio) || ',' ||
  quote_literal(created_at::text) || ',' ||
  quote_literal(updated_at::text) || ');'
FROM authors;

-- 检查数据完整性
SELECT 
  'startups' as table_name,
  COUNT(*) as record_count
FROM startups
UNION ALL
SELECT 
  'authors' as table_name,
  COUNT(*) as record_count
FROM authors;