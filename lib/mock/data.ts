import type { Commit, Note, RepoConfig, User } from "@/types/note";

/**
 * 前端阶段使用本地 mock 数据。
 * 后端阶段将替换为：Server Components 内调用 GitHub API（经 SQLite 缓存层）。
 */

export const USER: User = {
  username: "zhoulinfeng",
  name: "周林枫",
  bio: "前端工程师 · 把笔记写进 GitHub，把思考留在互联网上。",
  joined: "2026 年 3 月加入",
};

export const REPO: RepoConfig = {
  owner: "zhoulinfeng",
  repo: "notes",
  branch: "main",
  rootPath: "notes/",
};

export const NOTES: Note[] = [
  {
    path: "frontend/nextjs",
    title: "Next.js App Router",
    description: "App Router 学习笔记，涵盖 Server Components、数据获取与缓存策略。",
    public: true,
    tags: ["nextjs", "react", "frontend"],
    updated: "2 小时前",
    ts: Date.now() - 2 * 3600e3,
    sha: "a82f91c",
    commits: 12,
    dirty: false,
    content: `# Next.js App Router

App Router 是 Next.js 13 引入的新路由体系，以 **React Server Components** 为默认心智模型。

## 为什么是 Server Components

传统 SSR 会把组件在服务端渲染成 HTML，再在客户端 hydrate 一遍。App Router 把组件分成两类：

- **Server Component**：默认，在服务端执行，不打包进客户端 bundle
- **Client Component**：需要 \`"use client"\` 声明，可以访问浏览器 API

> 一个实用的判断标准：需要状态、事件、浏览器 API 时，才下沉成 Client Component。

## 数据获取

在 Server Component 里可以直接写 async：

\`\`\`tsx
const res = await fetch('https://api.example.com/notes', {
  next: { revalidate: 60 }
})
const notes = await res.json()
\`\`\`

配合 \`revalidate\` 可以做 ISR 级别的缓存。

## 小结

- 默认服务端，按需客户端
- 数据获取与组件同层，少一层 props drilling
- 缓存粒度到 fetch，比整页缓存更灵活`,
  },
  {
    path: "frontend/react-server-components",
    title: "React Server Components 笔记",
    description: "RSC 的渲染模型、序列化边界，以及和 Client Component 的协作方式。",
    public: true,
    tags: ["react", "rsc"],
    updated: "昨天",
    ts: Date.now() - 26 * 3600e3,
    sha: "b31a72e",
    commits: 8,
    dirty: true,
    content: `# React Server Components

RSC 的核心是把组件树分成「服务端部分」和「客户端部分」。

## 序列化边界

服务端组件传给客户端组件的 props 必须是 **可序列化** 的。

\`\`\`tsx
// 可以
<ClientCard title="hello" count={3} />

// 不行 —— 函数不可序列化
<ClientCard onClick={() => {}} />
\`\`\`

## 组合优于传参

把服务端组件作为 children 传给客户端组件，是绕开边界的常用手法。

> 记住一句话：**服务端组件可以渲染客户端组件，但反过来要通过 children 插槽。**

## 与 Suspense 配合

\`\`\`tsx
<Suspense fallback={<Skeleton />}>
  <SlowNotes />
</Suspense>
\`\`\`

流式渲染让首屏更快到达。`,
  },
  {
    path: "frontend/css-layout",
    title: "CSS 布局速查",
    description: "Flex / Grid 常用模式与踩坑记录。",
    public: true,
    tags: ["css", "layout"],
    updated: "3 天前",
    ts: Date.now() - 3 * 86400e3,
    sha: "5f0c2d1",
    commits: 5,
    dirty: false,
    content: `# CSS 布局速查

## Flex 常见模式

- 水平垂直居中：\`display:flex; align-items:center; justify-content:center;\`
- 两端对齐：\`justify-content: space-between;\`
- 等分：子元素 \`flex:1\`

## Grid 常见模式

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
\`\`\`

## 踩坑

> flex 子项默认 \`min-width:auto\`，会导致内容溢出，需要显式设置 \`min-width:0\`。`,
  },
  {
    path: "devops/docker",
    title: "Docker 从入门到够用",
    description: "镜像分层、多阶段构建与常用命令清单。",
    public: true,
    tags: ["docker", "devops"],
    updated: "5 天前",
    ts: Date.now() - 5 * 86400e3,
    sha: "9d2e77a",
    commits: 7,
    dirty: false,
    content: `# Docker 从入门到够用

## 镜像分层

每条 Dockerfile 指令都会生成一层，层会被缓存。

\`\`\`dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
CMD ["npm", "start"]
\`\`\`

## 常用命令

- \`docker ps -a\`：查看所有容器
- \`docker logs -f <id>\`：跟踪日志
- \`docker system prune -a\`：清理无用镜像

> 多阶段构建是减小镜像体积最有效的手段。`,
  },
  {
    path: "backend/nestjs",
    title: "NestJS 模块化实践",
    description: "Module / Provider / Guard 的职责边界梳理。",
    public: false,
    tags: ["nestjs", "backend"],
    updated: "1 周前",
    ts: Date.now() - 7 * 86400e3,
    sha: "3a1b90f",
    commits: 4,
    dirty: false,
    content: `# NestJS 模块化实践

## 三个核心概念

- **Module**：组织单元，声明 imports / providers / exports
- **Provider**：可注入的依赖
- **Guard**：请求进入前的守门人

## 一个典型的 Guard

\`\`\`ts
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest()
    return Boolean(req.user)
  }
}
\`\`\`

> 把「谁能访问」放在 Guard，「访问什么」放在 Service。`,
  },
  {
    path: "devops/nginx",
    title: "Nginx 反代配置片段",
    description: "个人服务器常用的反向代理与缓存配置。",
    public: false,
    tags: ["nginx", "ops"],
    updated: "2 周前",
    ts: Date.now() - 14 * 86400e3,
    sha: "c7f4d20",
    commits: 3,
    dirty: false,
    content: `# Nginx 反代配置片段

\`\`\`nginx
server {
  listen 443 ssl http2;
  server_name notehub.dev;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
\`\`\`

> WebSocket 需要额外加 Upgrade / Connection 头。`,
  },
  {
    path: "reading/2026-notes",
    title: "2026 读书清单",
    description: "今年读过的书与一句短评。",
    public: false,
    tags: ["reading"],
    updated: "3 周前",
    ts: Date.now() - 21 * 86400e3,
    sha: "1e8a3c4",
    commits: 2,
    dirty: false,
    content: `# 2026 读书清单

- 《设计数据密集型应用》—— 分布式系统的地图册
- 《重构》—— 每次翻都有新体会
- 《Unix 编程艺术》—— 简洁的力量`,
  },
];

export const COMMITS: Commit[] = [
  { sha: "a82f91c", msg: "Update routing section", time: "2 小时前", date: "2026-09-12 14:20", add: 12, del: 3 },
  { sha: "b31a72e", msg: "Add Server Components notes", time: "昨天", date: "2026-09-11 21:04", add: 64, del: 0 },
  { sha: "8c91f22", msg: "Initial note", time: "8 月 20 日", date: "2026-08-20 09:12", add: 38, del: 0 },
  { sha: "77d0a1b", msg: "Fix typo in code block", time: "8 月 18 日", date: "2026-08-18 16:45", add: 2, del: 2 },
];

/** 公开笔记卡片封面（径向渐变，循环取用） */
export const COVERS: string[] = [
  "radial-gradient(120% 120% at 20% 10%, #4a0d14 0%, #1a0a0d 50%, #0a0a0c 100%)",
  "radial-gradient(120% 120% at 80% 15%, #0f2438 0%, #0c1620 50%, #0a0a0c 100%)",
  "radial-gradient(120% 120% at 20% 85%, #2a1a4a 0%, #161028 50%, #0a0a0c 100%)",
  "radial-gradient(120% 120% at 80% 80%, #123322 0%, #0b1a13 50%, #0a0a0c 100%)",
  "radial-gradient(120% 120% at 50% 0%, #3a2a0d 0%, #1f180c 50%, #0a0a0c 100%)",
  "radial-gradient(120% 120% at 10% 50%, #38121c 0%, #1c0e14 50%, #0a0a0c 100%)",
  "radial-gradient(120% 120% at 90% 45%, #16283a 0%, #0d161f 50%, #0a0a0c 100%)",
];

export function coverFor(idx: number): string {
  return COVERS[idx % COVERS.length];
}

export function findNote(path: string): Note | undefined {
  return NOTES.find((n) => n.path === path);
}
