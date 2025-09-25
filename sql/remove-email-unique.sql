-- 安全移除email唯一约束的迁移脚本
-- 此脚本不会删除任何现有数据，只是修改表结构

-- 1. 首先备份当前的authors表结构（可选，用于回滚）
-- CREATE TABLE authors_backup AS SELECT * FROM authors;

-- 2. 删除email字段的唯一约束
-- 注意：PostgreSQL中需要先找到约束名称
DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    -- 查找email字段的唯一约束名称
    SELECT conname INTO constraint_name
    FROM pg_constraint 
    WHERE conrelid = 'authors'::regclass 
    AND contype = 'u' 
    AND array_to_string(conkey, ',') = ANY(
        SELECT array_to_string(array_agg(attnum), ',')
        FROM pg_attribute 
        WHERE attrelid = 'authors'::regclass 
        AND attname = 'email'
        GROUP BY attrelid
    );
    
    -- 如果找到约束，则删除它
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE authors DROP CONSTRAINT ' || constraint_name;
        RAISE NOTICE '已删除email唯一约束: %', constraint_name;
    ELSE
        RAISE NOTICE 'email字段没有找到唯一约束';
    END IF;
END $$;

-- 3. 验证约束是否已删除
SELECT 
    conname as constraint_name,
    contype as constraint_type
FROM pg_constraint 
WHERE conrelid = 'authors'::regclass 
AND contype = 'u';

-- 4. 显示当前authors表的结构
\d authors;

-- 执行结果说明：
-- - 此脚本只会删除email字段的唯一约束
-- - 不会删除任何现有数据
-- - 不会影响表的其他结构
-- - 执行后同一个邮箱可以对应多个账户（不同的OAuth提供商）