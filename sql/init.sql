-- Neon数据库初始化脚本
-- 请在Neon SQL Editor中执行以下SQL语句

-- 1. 创建authors表
CREATE TABLE IF NOT EXISTS authors (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  image TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 创建startups表
CREATE TABLE IF NOT EXISTS startups (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  author_id VARCHAR(255) REFERENCES authors(id),
  image TEXT,
  pitch TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 插入示例作者数据
INSERT INTO authors (id, name, username, email, image, bio, created_at, updated_at) 
VALUES (
  '569663659',
  'yaocheng',
  'yaoocheng',
  '1766862282@qq.com',
  'https://avatars.githubusercontent.com/u/55966038?v=4',
  '一包茶，一根烟，一个BUG改一天',
  '2025-09-18T03:45:44.849Z',
  '2025-09-18T03:45:44.849Z'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  username = EXCLUDED.username,
  email = EXCLUDED.email,
  image = EXCLUDED.image,
  bio = EXCLUDED.bio,
  updated_at = EXCLUDED.updated_at;

-- 4. 插入示例startup数据
INSERT INTO startups (id, title, description, category, author_id, image, pitch, views, created_at, updated_at)
VALUES (
  '640037',
  '北京企查龙科技有限公司',
  'profile_imageprofile_imageprofile_imageprofile_image',
  'Tech',
  '569663659',
  'https://picsum.photos/200/200?random=1',
  '企查龙（北京）科技有限公司成立于2022-08-02，法定代表人为周春莲，注册资本为100万元，统一社会信用代码为91110117MABWGRQU85，企业注册地址位于北京市平谷区中关村科技园区平谷园峪口新能源产业基地峪阳路38号-220099（集群注册））），所属行业为科技推广和应用服务业，经营范围包含：一般项目：技术服务、技术开发、技术咨询、技术交流、技术转让、技术推广；企业管理咨询；企业信用管理咨询服务；市场调查（不含涉外调查）；社会经济咨询服务；企业信用评级服务；信息咨询服务（不含许可类信息咨询服务）；工业互联网数据服务；互联网数据服务；人工智能应用软件开发；教育咨询服务（不含涉许可审批的教育培训活动）；标准化服务；软件开发；信息技术咨询服务；信息系统集成服务；计算机软硬件及辅助设备零售；音响设备销售；电子产品销售；针纺织品销售；皮革制品销售；金属制品销售；五金产品零售；化工产品销售（不含许可类化工产品）；饲料原料销售；畜牧渔业饲料销售；仪器仪表销售；饲料添加剂销售；机械电气设备销售；通讯设备销售；机械设备销售；电子专用设备销售；汽车零配件零售；会议及展览服务；广告制作；广告发布；广告设计、代理；对外承包工程；商标代理；版权代理；计算机及办公设备维修；计算机系统服务；物联网应用服务；数据处理服务；翻译服务；图文设计制作；工程管理服务；专业设计服务；劳务服务（不含劳务派遣）。（除依法须经批准的项目外，凭营业执照依法自主开展经营活动）许可项目：互联网信息服务；建设工程施工；出版物零售；出版物互联网销售；认证服务；专利代理；建设工程设计。（依法须经批准的项目，经相关部门批准后方可开展经营活动，具体经营项目以相关部门批准文件或许可证件为准）（不得从事国家和本市产业政策禁止和限制类项目的经营活动。）。企业当前经营状态为存续。',
  4,
  '2025-09-16T03:32:11.246Z',
  '2025-09-16T11:37:35.991Z'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  author_id = EXCLUDED.author_id,
  image = EXCLUDED.image,
  pitch = EXCLUDED.pitch,
  views = EXCLUDED.views,
  updated_at = EXCLUDED.updated_at;

-- 5. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_startups_author_id ON startups(author_id);
CREATE INDEX IF NOT EXISTS idx_startups_category ON startups(category);
CREATE INDEX IF NOT EXISTS idx_startups_created_at ON startups(created_at);
CREATE INDEX IF NOT EXISTS idx_authors_username ON authors(username);
CREATE INDEX IF NOT EXISTS idx_authors_email ON authors(email);