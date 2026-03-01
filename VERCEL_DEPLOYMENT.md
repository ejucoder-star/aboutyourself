# Vercel 部署指南

本文档说明如何将称骨算命应用部署到Vercel。

## 前置要求

1. Vercel账户（https://vercel.com）
2. GitHub账户和已连接的GitHub仓库
3. 必要的环境变量

## 部署步骤

### 1. 推送代码到GitHub

```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### 2. 在Vercel中导入项目

1. 访问 https://vercel.com/dashboard
2. 点击 "Add New..." → "Project"
3. 选择您的GitHub仓库 `ejucoder-star/aboutmyself`
4. Vercel会自动检测项目配置

### 3. 配置环境变量

在Vercel项目设置中添加以下环境变量：

#### 数据库
- `DATABASE_URL`: MySQL连接字符串（格式：`mysql://user:password@host:3306/database`）

#### 认证
- `JWT_SECRET`: JWT签名密钥
- `VITE_APP_ID`: OAuth应用ID
- `OAUTH_SERVER_URL`: OAuth服务器地址
- `VITE_OAUTH_PORTAL_URL`: OAuth门户地址

#### 所有者信息
- `OWNER_OPEN_ID`: 所有者的OpenID
- `OWNER_NAME`: 所有者名称

#### Manus APIs
- `BUILT_IN_FORGE_API_URL`: Forge API地址
- `BUILT_IN_FORGE_API_KEY`: Forge API密钥
- `VITE_FRONTEND_FORGE_API_URL`: 前端Forge API地址
- `VITE_FRONTEND_FORGE_API_KEY`: 前端Forge API密钥

#### 分析
- `VITE_ANALYTICS_ENDPOINT`: 分析端点
- `VITE_ANALYTICS_WEBSITE_ID`: 网站ID

#### 应用配置
- `VITE_APP_TITLE`: 应用标题（例如：称骨算命）
- `VITE_APP_LOGO`: 应用Logo URL

### 4. 部署

1. 完成环境变量配置后，点击 "Deploy"
2. Vercel会自动构建和部署您的应用
3. 部署完成后，您会获得一个 `.vercel.app` 域名

## 构建配置

项目已配置以下Vercel特定设置：

- **Build Command**: `pnpm run build`
- **Output Directory**: `dist/public`
- **Node Version**: 22.x

## 项目结构

```
├── client/              # React前端代码
├── server/              # Express后端代码
├── api/                 # Vercel Serverless Functions
├── drizzle/             # 数据库迁移和Schema
├── vercel.json          # Vercel配置
└── package.json         # 项目依赖和脚本
```

## 故障排除

### 问题：部署后显示源代码

**解决方案**：
1. 检查 `vercel.json` 配置是否正确
2. 确保 `package.json` 中的 `build` 脚本正确
3. 检查环境变量是否完整

### 问题：数据库连接失败

**解决方案**：
1. 确认 `DATABASE_URL` 环境变量设置正确
2. 检查数据库是否允许来自Vercel的连接
3. 如果使用云数据库，确保防火墙规则允许访问

### 问题：OAuth认证失败

**解决方案**：
1. 确认所有OAuth相关的环境变量都已设置
2. 检查OAuth应用的重定向URI是否包含Vercel域名
3. 验证 `OAUTH_SERVER_URL` 和 `VITE_OAUTH_PORTAL_URL` 是否正确

## 自定义域名

部署后，您可以在Vercel项目设置中添加自定义域名：

1. 进入项目设置 → Domains
2. 点击 "Add" 添加您的域名
3. 按照提示配置DNS记录
4. 等待DNS生效（通常需要几分钟到几小时）

## 监控和日志

在Vercel Dashboard中，您可以：

- 查看部署历史和日志
- 监控应用性能
- 设置部署通知
- 查看错误报告

## 本地测试

在推送到Vercel之前，建议在本地测试：

```bash
# 安装依赖
pnpm install

# 本地开发
pnpm run dev

# 本地构建
pnpm run build

# 本地预览构建结果
pnpm run start
```

## 更多信息

- [Vercel文档](https://vercel.com/docs)
- [Node.js部署指南](https://vercel.com/docs/concepts/functions/serverless-functions/node-js)
- [环境变量配置](https://vercel.com/docs/concepts/projects/environment-variables)
