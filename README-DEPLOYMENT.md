# Vercel 部署指南

本指南将帮助您将 YCDirectory 项目部署到 Vercel。

## 前置准备

1. **GitHub 账户** - 确保您的代码已推送到 GitHub 仓库
2. **Vercel 账户** - 在 [vercel.com](https://vercel.com) 注册账户
3. **GitHub OAuth 应用** - 用于用户登录功能

## 部署步骤

### 1. 创建 GitHub OAuth 应用

1. 访问 [GitHub Developer Settings](https://github.com/settings/applications/new)
2. 填写应用信息：
   - **Application name**: `YCDirectory`
   - **Homepage URL**: `https://your-app-name.vercel.app` (稍后替换)
   - **Authorization callback URL**: `https://your-app-name.vercel.app/api/auth/callback/github`
3. 创建应用后，记录 `Client ID` 和 `Client Secret`

### 2. 部署到 Vercel

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 导入您的 GitHub 仓库
4. 配置项目：
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (默认)
   - **Build Command**: `npm run build` (默认)
   - **Output Directory**: `.next` (默认)

### 3. 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

```bash
# 必需的环境变量
AUTH_SECRET=your-generated-secret
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret
NEXTAUTH_URL=https://your-app-name.vercel.app
```

#### 生成 AUTH_SECRET

在本地运行以下命令生成密钥：
```bash
npx auth secret
```

### 4. 更新 GitHub OAuth 应用

部署完成后，使用实际的 Vercel 域名更新 GitHub OAuth 应用的 URL：
- **Homepage URL**: `https://your-actual-domain.vercel.app`
- **Authorization callback URL**: `https://your-actual-domain.vercel.app/api/auth/callback/github`

### 5. 验证部署

1. 访问您的 Vercel 应用 URL
2. 测试以下功能：
   - 首页加载
   - GitHub 登录
   - 创建 startup
   - 查看用户页面
   - API 路由正常工作

## 项目特性

### 已配置的功能
- ✅ Next.js 15 with App Router
- ✅ NextAuth.js GitHub 登录
- ✅ TypeScript 支持
- ✅ Tailwind CSS 样式
- ✅ API 路由
- ✅ 文件系统数据存储 (mock/)
- ✅ 响应式设计

### API 端点
- `/api/auth/*` - NextAuth.js 认证
- `/api/startup-add` - 创建新 startup
- `/api/startup-data` - 获取 startup 数据
- `/api/startup-view/[id]` - 更新/获取 startup 浏览量
- `/api/user-query` - 用户查询

## 故障排除

### 常见问题

1. **登录失败**
   - 检查 GitHub OAuth 应用配置
   - 确认环境变量设置正确
   - 验证回调 URL 匹配

2. **API 路由错误**
   - 检查 Vercel 函数日志
   - 确认文件路径正确
   - 验证环境变量

3. **构建失败**
   - 检查 TypeScript 错误
   - 确认所有依赖已安装
   - 查看 Vercel 构建日志

### 查看日志

在 Vercel Dashboard 中：
1. 进入项目页面
2. 点击 "Functions" 标签
3. 查看函数执行日志

## 自定义域名 (可选)

1. 在 Vercel 项目设置中添加自定义域名
2. 配置 DNS 记录
3. 更新 GitHub OAuth 应用 URL
4. 更新 `NEXTAUTH_URL` 环境变量

## 性能优化

项目已包含以下优化：
- Next.js 图片优化
- 静态文件缓存
- API 路由优化
- Tailwind CSS 压缩

## 支持

如果遇到问题，请检查：
1. [Vercel 文档](https://vercel.com/docs)
2. [NextAuth.js 文档](https://next-auth.js.org)
3. [Next.js 文档](https://nextjs.org/docs)

---

部署成功后，您的 YCDirectory 应用将在 Vercel 上运行，支持用户注册、登录和 startup 管理功能！