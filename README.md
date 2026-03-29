# 个人网站

> 基于 Next.js 14 + 飞书 Bitable 的个人品牌展示网站，支持后台管理。

## 技术栈

| 技术 | 说明 |
|------|------|
| Next.js 14 | React 框架 (App Router) |
| React 18 | UI 库 |
| Tailwind CSS | 样式框架 |
| 飞书 Bitable | 数据存储 (CMS) |

## 目录结构

```
personal-website/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 首页
│   │   ├── about/             # 关于页面
│   │   ├── portfolio/         # 作品集 (动态路由)
│   │   ├── blog/             # 博客 (动态路由)
│   │   ├── contact/           # 联系页面
│   │   ├── admin/            # 管理后台
│   │   │   ├── page.tsx      # 管理首页
│   │   │   ├── portfolio/    # 作品管理
│   │   │   └── blog/         # 博客管理
│   │   └── api/              # API 路由
│   │       ├── portfolio/    # 作品集 API
│   │       └── blog/         # 博客 API
│   ├── components/            # React 组件
│   │   ├── layout/          # 布局组件 (Navbar, Footer)
│   │   └── ui/              # UI 组件 (Button)
│   └── lib/
│       └── feishu.ts        # 飞书 API 封装
├── public/                    # 静态资源
├── tailwind.config.js         # Tailwind 配置
└── next.config.js             # Next.js 配置
```

## 功能

### 前台页面
- **首页** - Hero、能力展示、数据统计、精选项目、最新博客
- **关于** - 个人介绍、教育/工作经历、技能标签
- **作品集** - 项目列表、详情页
- **博客** - 文章列表、详情页
- **联系** - 联系表单

### 管理后台 (`/admin`)
- 密码保护 (默认: `admin123`)
- 作品集管理 - 增删改查
- 博客管理 - 增删改查

## 数据存储

使用飞书 Bitable 作为 CMS：

| 数据表 | App Token | 用途 |
|--------|-----------|------|
| 作品集 | `K43Nb94jSaQDMqsMpS2c1v6pn3M` | 存储项目案例 |
| 博客 | `PHJjbUKSga8Eg6sARtYcwU3knpd` | 存储技术文章 |

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 生产服务器
npm start
```

## 部署

本项目需要部署在有 Node.js 环境的服务器上：

```bash
# 构建
npm run build

# 使用 PM2 运行
pm2 start npm --name "personal-web" -- start
```

## 环境变量

| 变量 | 说明 |
|------|------|
| `NEXT_PUBLIC_BASE_URL` | 网站基础 URL (用于 API) |

## API 路由

| 路由 | 方法 | 说明 |
|------|------|------|
| `/api/portfolio` | GET, POST | 列表 / 创建 |
| `/api/portfolio/[id]` | GET, PUT, DELETE | 单项操作 |
| `/api/blog` | GET, POST | 列表 / 创建 |
| `/api/blog/[id]` | GET, PUT, DELETE | 单项操作 |

## 博客字段

| 字段 | 类型 | 说明 |
|------|------|------|
| title | 文本 | 文章标题 |
| slug | 文本 | URL 标识 |
| excerpt | 文本 | 摘要 |
| content | 文本 | 正文 (Markdown) |
| category | 单选 | 分类 |
| tags | 多选 | 标签 |
| cover_image | 文本 | 封面图 URL |
| published | 复选框 | 是否发布 |
| read_time | 数字 | 阅读时长 (分钟) |

## 作品集字段

| 字段 | 类型 | 说明 |
|------|------|------|
| title | 文本 | 项目名称 |
| slug | 文本 | URL 标识 |
| description | 文本 | 简短描述 |
| content | 文本 | 详细介绍 (Markdown) |
| category | 单选 | 项目类型 |
| tags | 多选 | 技术栈标签 |
| cover_image | 文本 | 封面图 URL |
| links | 文本 | 项目链接 |
| published | 复选框 | 是否发布 |

## License

MIT
