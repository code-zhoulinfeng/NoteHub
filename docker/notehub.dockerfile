# syntax=docker/dockerfile:1
# NoteHub 生产镜像（Next.js standalone 输出）
#
# 前置要求：next.config.js 需开启 standalone 输出：
#   const nextConfig = { output: 'standalone' }
#
# 默认按 npm 构建；若用 pnpm/yarn，替换第 1 阶段的 COPY 与安装命令即可。

# ---------- 阶段 1：安装依赖 ----------
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 先复制依赖清单，最大化利用 Docker 层缓存
COPY package.json package-lock.json* ./
RUN npm ci

# ---------- 阶段 2：构建 ----------
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 若构建期需要 NEXT_PUBLIC_* 变量，在这里声明并注入：
# ARG NEXT_PUBLIC_SITE_URL
# ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

RUN npm run build

# ---------- 阶段 3：运行时 ----------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 以非 root 用户运行
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# standalone 产物（包含精简 node_modules 与 server.js）
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# 若项目无 public 目录，删除下面这行
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# SQLite 数据目录（挂持久卷，见 docker-compose.yml）
RUN mkdir -p /data && chown nextjs:nodejs /data

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
