# NoteHub 产品需求文档（PRD）

> 版本：v2.0（重写）
> 日期：2026-09-12
> 状态：MVP 范围已收敛

---

## 1. 产品概述

### 1.1 产品名称

**NoteHub**

### 1.2 产品定位

一个 **GitHub 驱动的个人笔记博客系统**。

用户用自己的 GitHub 仓库（Repository）存放 Markdown 笔记，NoteHub 通过 **GitHub API** 提供：

- Web 端可视化阅读（渲染 Markdown、目录、版本历史）
- Markdown 在线编辑
- 笔记级的公开 / 私密控制
- 个人公开主页
- 提交写回 GitHub（含版本历史与 Diff）

### 1.3 核心原则（一句话）

> **GitHub 仓库是笔记内容的唯一数据源（Source of Truth）。**

NoteHub 不把笔记正文复制进自己的数据库，只保存「谁是用户、他配置了哪个仓库」这类应用层元数据。笔记的正文、版本、历史全部来自 GitHub。

### 1.4 与普通 Markdown 编辑器 / 博客的区别

| 维度 | 普通编辑器/博客 | NoteHub |
|------|----------------|---------|
| 内容存储 | 自己的数据库 | 用户的 GitHub 仓库 |
| 版本管理 | 无或自建 | 原生 Git 历史 + Diff |
| 数据归属 | 平台 | 用户（数据始终在自己仓库） |
| 迁移成本 | 高 | 零（克隆仓库即备份） |

---

## 2. 产品目标与非目标

### 2.1 核心目标

让用户能够：

1. **用 GitHub 管理笔记**——笔记即仓库里的 `.md` 文件。
2. **用 NoteHub 阅读与编辑**——Web 可视化界面读写这些文件。
3. **选择性公开分享**——按「单篇笔记」粒度决定公开或私密，公开笔记通过个人主页被互联网访问。

### 2.2 非目标（首版明确不做）

以下能力**不在首版范围**，避免范围蔓延：

- ❌ Explore（全局发现 / 广场）
- ❌ 全局搜索（跨用户全文检索）
- ❌ 标签聚合 / 推荐系统
- ❌ 评论、点赞、关注、RSS
- ❌ 多人协作、实时协同编辑
- ❌ 笔记正文存储到自有数据库

> 公开分享的入口是「个人公开主页 + 可分享的独立 URL」，而非全局发现。

---

## 3. 用户角色

### 3.1 Owner（笔记所有者）

通过 **GitHub OAuth 登录**的用户。

**可以：**

- 配置自己的笔记仓库（owner / repo / branch / 根路径）
- 查看自己的全部笔记（公开 + 私密）
- 创建、编辑、删除笔记
- 切换单篇笔记的 `public` / `private` 状态
- 查看笔记的 Git 版本历史与 Diff
- 将修改 Commit 写回 GitHub
- 查看自己的公开主页

### 3.2 Visitor（匿名访客）

无需登录的普通互联网用户。

**可以：**

- 访问某个用户的公开主页
- 阅读该用户的公开笔记
- 查看公开笔记的版本历史（若笔记允许展示）

**不能：**

- 查看任何私密笔记（即使知道完整 URL）
- 修改任何内容
- 访问仓库配置等私有数据

---

## 4. 核心用户流程

```
                       ┌─────────────────────────────┐
                       │        GitHub OAuth 登录      │
                       └──────────────┬──────────────┘
                                      ▼
                       ┌─────────────────────────────┐
                       │     配置笔记仓库 (Repo/Branch) │
                       └──────────────┬──────────────┘
                                      ▼
                       ┌─────────────────────────────┐
                       │  GitHub API 读取 Markdown 文件 │
                       └──────────────┬──────────────┘
                                      ▼
              ┌───────────────────────┴───────────────────────┐
              │                                               │
              ▼                                               ▼
     ┌─────────────────┐                            ┌─────────────────┐
     │   My Notes（私密区）│                            │  Public Site     │
     │   创建/编辑/删除    │                            │  公开主页/笔记    │
     │   可见性控制       │                            │  （访客可访问）   │
     │   历史/Diff      │                            │                 │
     └────────┬────────┘                            └─────────────────┘
              │
              ▼
     ┌─────────────────┐
     │ Commit 写回 GitHub │
     └─────────────────┘
```

---

## 5. 功能需求

### 5.1 认证（GitHub OAuth）

- 用户点击「Sign in with GitHub」跳转到 GitHub 授权页。
- 授权成功后，NoteHub 服务端获取 **GitHub Access Token**。
- Token **只在服务端持有**，通过加密的 HTTP-only Cookie 会话下发，**绝不暴露给浏览器 JS / LocalStorage**。
- 后续所有 GitHub API 调用由服务端携带 Token 完成。
- 登录态失效（Token 被撤销 / Cookie 过期）时，跳回登录页。

**登录地址：**

```
/auth/github
/auth/callback
```

### 5.2 仓库配置

Owner 首次登录后需配置笔记仓库，字段：

| 字段 | 说明 | 示例 |
|------|------|------|
| `owner` | 仓库所有者 | `zhoulinfeng` |
| `repo` | 仓库名 | `notes` |
| `branch` | 分支 | `main` |
| `rootPath` | 笔记根目录（可空） | `notes/` |

配置校验：服务端调用 GitHub API 验证仓库存在且用户有读写权限，校验失败给出明确提示。

### 5.3 笔记管理

**笔记列表（/app/notes）：**

- 展示当前仓库根路径下的所有 `.md` 文件。
- 每项显示：标题、路径、`public`/`private` 徽标、更新时间。
- 支持按「最近修改」排序、按可见性筛选。

**创建 / 编辑 / 删除：**

- 创建：输入文件路径 + 初始内容，提交生成新文件。
- 编辑：修改正文与 frontmatter。
- 删除：删除仓库中的文件。

### 5.4 Markdown 编辑器

**URL：** `/app/notes/[...path]`

界面为**分屏（Split View）**：左侧编辑，右侧实时预览。

**支持：**

- Markdown 正文编辑
- frontmatter 可视化编辑（title / description / public / tags）
- 实时预览
- 可见性切换（见 5.5）
- 保存（仅暂存编辑状态）
- 提交到 GitHub（见 5.7）

### 5.5 可见性控制（笔记粒度）

每篇笔记通过 frontmatter 的 `public` 字段控制可见性：

- `public: false`（默认）→ 仅 Owner 可见，访客访问返回 404。
- `public: true` → 任何访客可访问。

切换为公开后，系统展示该笔记的公开 URL，并提供「复制链接 / 打开」操作。

> **可见性以「单篇笔记」为粒度，而非整个仓库。** 同一仓库可同时存在公开与私密笔记。

### 5.6 版本历史与 Diff

基于 GitHub 的文件 commit 历史，每篇笔记拥有独立的版本时间线：

```
a82f91c  Update routing section    2 hours ago
b31a72e  Add Server Components     yesterday
8c91f22  Initial note              Aug 20
```

- **View**：查看某个历史版本的内容。
- **Compare**：任意两个版本对比，展示统一 / 并排 Diff（新增、删除、修改高亮）。
- **Open on GitHub**：跳转到 GitHub 上对应文件/提交。

### 5.7 提交到 GitHub

- 「保存」仅暂存当前编辑，不写回 GitHub。
- 「Commit to GitHub」触发真实提交：填写 Commit Message → 调用 GitHub Contents API 创建/更新文件。
- 提交成功后更新本地缓存，列表与历史立即反映。

### 5.8 公开主页（Public Profile）

**URL：** `/:username`

展示 Owner 的公开形象与全部公开笔记：

- Avatar、Username、Bio
- 公开笔记数量
- 公开笔记列表（标题、简介、更新时间）

> 只聚合 `public: true` 的笔记。即使用户有 100 篇私密笔记、20 篇公开笔记，主页也只显示这 20 篇。

### 5.9 公开笔记阅读页

**URL：** `/:username/:notePath`

`notePath` 对应该笔记在仓库根路径下的相对路径（不含 `.md` 后缀）。

页面包含：

- 标题、简介、标签
- Markdown 渲染正文
- 目录（TOC）
- 更新时间
- 「在 GitHub 上查看」链接
- 版本历史（若笔记开启公开展示）

---

## 6. Markdown 文件规范

### 6.1 仓库目录结构（推荐）

```
notes/
├── frontend/
│   ├── nextjs.md
│   └── react.md
├── backend/
│   └── nestjs.md
└── devops/
    └── docker.md
```

> 支持任意嵌套目录，`rootPath` 指定笔记根目录。

### 6.2 Frontmatter 规范

每篇笔记头部使用 YAML frontmatter 描述元数据：

```yaml
---
title: Next.js App Router
description: Next.js App Router 学习笔记
public: true
tags:
  - nextjs
  - react
  - frontend
---
```

字段说明：

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 否 | 笔记标题，缺省取文件名 |
| `description` | 否 | 简介，用于列表与 SEO |
| `public` | 否 | `true`/`false`，默认 `false` |
| `tags` | 否 | 标签数组 |

---

## 7. 数据模型

### 7.1 原则

- **GitHub 仓库是内容唯一数据源**，笔记正文、历史、Diff 均来自 GitHub。
- **自有数据库只存应用层元数据**，且尽可能少。

### 7.2 表结构（最小集）

```
User
 ├── id            (PK)
 ├── githubId      (unique)
 ├── username
 ├── avatar
 └── createdAt

RepositoryConfig
 ├── id            (PK)
 ├── userId        (FK -> User)
 ├── owner
 ├── repo
 ├── branch
 ├── rootPath
 └── updatedAt

Session（可选，视会话存储方案而定）
 ├── userId
 └── expiresAt
```

> 首版建议使用轻量数据库（SQLite 单文件即可，零运维；需要时迁移 Postgres）。

---

## 8. 系统架构

### 8.1 架构图

```
                          Browser
                             │
                             ▼
                         Next.js（全栈）
              ┌──────────────┼──────────────┐
              │              │              │
         Public Site    My Notes       Auth (OAuth)
         (SSR/ISR)     (Server Comp.)  (Token 服务端持有)
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                        GitHub API
                             │
                             ▼
                    GitHub Repository
                             │
                             ▼
                        Git History
```

### 8.2 技术选型

| 层 | 选型 | 说明 |
|----|------|------|
| 框架 | **Next.js（App Router）+ TypeScript** | 全栈，SSR/ISR 支撑公开页 SEO |
| 认证 | **Auth.js (next-auth)** 或自定义 GitHub OAuth | GitHub Provider，服务端持有 Token |
| 数据读取 | GitHub Contents API / Git Data API | 服务端调用，读文件、列表、历史 |
| 数据写入 | Server Actions / Route Handlers | 创建、更新、删除文件（Commit） |
| 数据库 | SQLite（起步）或 Postgres | 仅存 User / RepositoryConfig |
| Markdown 渲染 | `react-markdown` + `remark-gfm` + 语法高亮 | 服务端渲染，XSS 安全 |
| 编辑器 | `@uiw/react-md-editor` 或 CodeMirror | 分屏实时预览 |
| Diff | `diff` / `react-diff-viewer` | 统一 / 并排 Diff |

### 8.3 渲染策略

- **公开页**（主页 / 公开笔记）：Server Components + ISR（`revalidate`），必要时按 commit SHA 失效，兼顾 SEO 与新鲜度。
- **私密区**（/app）：依赖登录态，动态渲染，读取 GitHub API。
- **私密笔记**：服务端校验权限，返回 `noindex`，禁止被搜索引擎收录。

---

## 9. 页面清单

### 9.1 公开（无需登录）

```
/                         公开首页（产品介绍 + 登录入口）
/:username                个人公开主页
/:username/:notePath      公开笔记阅读页（含 TOC / 历史）
```

### 9.2 私密（需登录）

```
/app                      工作台（Overview）
/app/notes                笔记列表
/app/notes/[...path]      Markdown 编辑器（分屏 + 预览）
/app/notes/[...path]/history   版本历史
/app/notes/[...path]/compare   版本对比
/app/settings             仓库配置 / 个人资料 / 公开设置
```

### 9.3 认证

```
/auth/github              OAuth 发起
/auth/callback            OAuth 回调
```

---

## 10. 安全要求

### 10.1 私密数据保护

私密笔记的保护**不能只靠「前端不显示」**，必须服务端强制：

```
Authentication（已登录？）
      ↓
Authorization（是本人？）
      ↓
Visibility Check（public: true？）
      ↓
GitHub Data（才返回内容）
```

私密笔记对访客一律返回 404（不泄露存在性）。

### 10.2 Token 安全

- GitHub Token **不下发浏览器**、不存 LocalStorage、不暴露给客户端代码。
- 服务端加密存储于 HTTP-only + Secure + SameSite Cookie。
- Token 泄露或失效时立即要求重新登录。

### 10.3 内容安全

- Markdown 渲染禁用原始 HTML 注入，避免 XSS。
- GitHub API 调用失败时返回友好错误，不泄露 Token 或堆栈。

---

## 11. SEO（仅公开页）

公开笔记与主页需支持：

- SSR / ISR（保证可被爬虫抓取）
- Metadata（title / description）
- Open Graph + Twitter Card
- Canonical URL
- `sitemap.xml`、`robots.txt`

私密笔记：`noindex` 且服务端禁止访问。

---

## 12. 里程碑

### 12.1 P0 —— MVP（首版必做）

- [ ] GitHub OAuth 登录
- [ ] 仓库配置（owner/repo/branch/rootPath）
- [ ] Markdown 文件读取与笔记列表
- [ ] Markdown 渲染阅读（TOC）
- [ ] Markdown 编辑器（分屏 + 实时预览）
- [ ] 保存并 Commit 到 GitHub
- [ ] 笔记级 public/private 可见性
- [ ] 个人公开主页
- [ ] 公开笔记阅读页

### 12.2 P1 —— MVP 增强

- [ ] Git 版本历史
- [ ] Diff / Compare
- [ ] 公开页 SEO（SSR/ISR、Metadata、OG、sitemap）
- [ ] 「在 GitHub 上查看」链接

### 12.3 后续（明确不在首版）

- [ ] Explore / 全局搜索 / 标签聚合
- [ ] 评论、点赞、关注、RSS
- [ ] 全文搜索（自建索引）
- [ ] 多人协作、实时编辑

---

## 13. 验收标准

MVP（P0）完成需满足：

1. 用户能用 GitHub 账号登录，并配置自己的笔记仓库。
2. 系统能读取并可视化渲染仓库中的 Markdown 笔记（含目录）。
3. 用户能在网页上创建、编辑、删除笔记，并提交写回 GitHub。
4. 每篇笔记可独立设为公开或私密；私密笔记对访客返回 404。
5. 访客无需登录即可访问任一用户的公开主页与公开笔记。
6. GitHub Token 全程仅服务端持有，浏览器端无法获取。

---

## 14. 一句话 PRD

**NoteHub 是一个基于 GitHub 仓库的个人笔记博客系统：用户通过 GitHub OAuth 登录，用 GitHub API 在网页上阅读和编辑自己的 Markdown 笔记，并按单篇粒度控制公开 / 私密；公开笔记通过个人主页和独立 URL 被互联网访问，内容与版本历史始终以 GitHub 仓库为唯一数据源。**
