# NoteHub 项目长期记忆

## 项目概况
- GitHub 驱动的个人笔记博客：GitHub 仓库为唯一数据源，自有库只存元数据
- 设计基准：docs/design.html（暗色 Netflix 风格，ink 灰阶 + accent 红 #E50914 + mint/amber），1:1 还原
- PRD：docs/prd.md（页面清单、数据模型、安全要求）

## 分阶段开发约定（用户明确要求）
1. **阶段一（已完成 2026-09-13）**：纯前端 UI + mock 数据（lib/mock/data.ts），编辑器本体留空（editor-shell.tsx 仅外壳），后端按钮用 toast 占位
2. **阶段二（待做）**：后端数据流转——GitHub OAuth、SQLite（User/RepositoryConfig/队列）、GitHub 国内慢需经自有服务中转（保存先进队列，消费者调 GitHub API；暂存入自有存储）、Server Actions

## 技术约定
- Next.js 16 + React 19 + Tailwind 4 + shadcn/ui 组件（components/ui/）
- **components/ui/ 中 shadcn 拉取的组件一律不改源码**（用户明确要求）：保持 CLI 生成原样，主题定制只能通过 app/globals.css 的 Tailwind 颜色变量（@theme / CSS variables）覆盖实现
- Next 16 限制：catch-all 段后不能跟子段 → history/compare 在 [...path]/page.tsx 内按路径末段分发视图
- 编辑器页全屏无侧栏：由 components/layout/workbench-shell.tsx 按 usePathname 判断
- 颜色 token 在 app/globals.css @theme（ink/accent/mint/amber + shadow-glow/card/soft）

## 关键路径
- mock 数据：lib/mock/data.ts（USER/REPO/NOTES/COMMITS/COVERS）
- markdown 渲染：lib/markdown.ts（服务端安全渲染 + extractToc）
- 全局 toast：lib/toast.ts + components/toaster.tsx
