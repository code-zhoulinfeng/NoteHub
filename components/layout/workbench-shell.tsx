"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  EyeIcon,
  FileIcon,
  HomeIcon,
  LogoIcon,
  LogoutIcon,
  SettingsIcon,
} from "@/components/icons";
import { Avatar } from "@/features/user/components/avatar";
import { toast } from "@/lib/toast";
import { NOTES, REPO, USER } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "dash", label: "工作台", href: "/app", icon: HomeIcon },
  { id: "notes", label: "笔记", href: "/app/notes", icon: FileIcon },
  { id: "settings", label: "设置", href: "/app/settings", icon: SettingsIcon },
] as const;

/** 根据路径判断当前导航高亮项 */
function activeNav(pathname: string): string {
  if (pathname === "/app") return "dash";
  if (pathname.startsWith("/app/notes")) return "notes";
  if (pathname.startsWith("/app/settings")) return "settings";
  return "dash";
}

/** 顶栏标题映射（与 design.html 各 OwnerShell 调用一致） */
function headerTitle(pathname: string): string {
  if (pathname === "/app") return "工作台";
  if (pathname === "/app/notes") return "全部笔记";
  if (pathname === "/app/settings") return "设置";
  if (pathname.endsWith("/history")) return "版本历史";
  if (pathname.endsWith("/compare")) return "版本对比";
  return "全部笔记";
}

/** 编辑器页是否为全屏（不带侧栏 chrome） */
function isEditorFullscreen(pathname: string): boolean {
  return (
    /^\/app\/notes\/.+/.test(pathname) &&
    !pathname.endsWith("/history") &&
    !pathname.endsWith("/compare")
  );
}

/**
 * Owner 工作台外壳 —— 与 design.html 的 OwnerShell 一致。
 * 编辑器路由（/app/notes/[...path]）为全屏模式，不渲染侧栏。
 */
export function WorkbenchShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/app";
  const router = useRouter();

  const pub = NOTES.filter((n) => n.public).length;
  const priv = NOTES.length - pub;
  const dirty = NOTES.filter((n) => n.dirty).length;

  if (isEditorFullscreen(pathname)) return <>{children}</>;

  const active = activeNav(pathname);

  return (
    <div className="min-h-screen flex bg-ink-950">
      {/* 侧边栏 */}
      <aside className="hidden lg:flex w-[240px] shrink-0 flex-col border-r border-ink-700/60 bg-ink-900/40 sticky top-0 h-screen">
        <Link
          href="/app"
          className="h-16 flex items-center gap-2.5 px-5 border-b border-ink-700/50 hover:bg-white/[0.02] transition"
        >
          <div className="w-8 h-8 rounded-lg bg-accent grid place-items-center text-white">
            <LogoIcon className="w-[18px] h-[18px]" />
          </div>
          <span className="font-semibold tracking-tight">NoteHub</span>
          <span className="ml-auto text-[10px] font-mono text-ink-500 tracking-wider">OWNER</span>
        </Link>

        <nav className="p-3 space-y-0.5">
          {NAV.map((n) => {
            const on = n.id === active;
            const Icon = n.icon;
            return (
              <Link
                key={n.id}
                href={n.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] transition-all",
                  on
                    ? "side-active"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03]",
                )}
              >
                <Icon className={cn("w-[18px] h-[18px]", on ? "text-accent-400" : "text-ink-300")} />
                <span className={on ? "font-medium" : ""}>{n.label}</span>
                <span className="side-dot ml-auto w-1.5 h-1.5 rounded-full bg-accent opacity-0 transition-opacity" />
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 mt-2">
          <div className="text-[10px] tracking-[0.16em] text-ink-500 uppercase mb-3 px-1">概览</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] text-[12.5px]">
              <span className="text-ink-300">全部笔记</span>
              <span className="text-white font-mono">{NOTES.length}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] text-[12.5px]">
              <span className="text-ink-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-mint" />
                已公开
              </span>
              <span className="text-white font-mono">{pub}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] text-[12.5px]">
              <span className="text-ink-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-ink-500" />
                私密
              </span>
              <span className="text-white font-mono">{priv}</span>
            </div>
            {dirty ? (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-amber/10 border border-amber/25 text-[12.5px]">
                <span className="text-amber flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber" />
                  待提交
                </span>
                <span className="text-amber font-mono font-semibold">{dirty}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="px-4 mt-2">
          <div className="text-[10px] tracking-[0.16em] text-ink-500 uppercase mb-3 px-1">仓库</div>
          <Link
            href="/app/settings"
            className="block px-3 py-2.5 rounded-lg border border-ink-700/60 bg-white/[0.02] hover:bg-white/[0.04] transition"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-mint" />
              <span className="text-[12.5px] text-zinc-300 font-mono truncate">
                {REPO.owner}/{REPO.repo}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-ink-400 font-mono">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                <circle cx="7" cy="6" r="2.4" />
                <circle cx="7" cy="18" r="2.4" />
                <circle cx="17" cy="12" r="2.4" />
                <path d="M7 8.4v7.2M9.4 6h3.2a2 2 0 0 1 2 2v1.6" />
              </svg>
              <span>{REPO.branch}</span>
              <span className="text-ink-600">·</span>
              <span>{REPO.rootPath}</span>
            </div>
          </Link>
        </div>

        <div className="mt-auto p-3 border-t border-ink-700/50">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/[0.03] transition group">
            <Avatar size={30} />
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] text-white truncate">{USER.name}</div>
              <div className="text-[10.5px] text-ink-400 truncate font-mono">@{USER.username}</div>
            </div>
            <button
              type="button"
              title="退出登录"
              onClick={() => {
                toast("已退出登录");
                router.push("/");
              }}
              className="w-4 h-4 text-ink-500 hover:text-accent-400 transition opacity-0 group-hover:opacity-100"
            >
              <LogoutIcon className="w-full h-full" />
            </button>
          </div>
        </div>
      </aside>

      {/* 主区 */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 shrink-0 border-b border-ink-700/60 bg-ink-950/90 backdrop-blur-xl sticky top-0 z-30 flex items-center gap-4 px-5 lg:px-8">
          <h1 className="text-[15px] font-medium text-white">{headerTitle(pathname)}</h1>

          <div className="ml-auto flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-ink-700/60 bg-white/[0.025] text-[11.5px] text-ink-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-mint" />
              <span className="text-zinc-400">同步正常</span>
            </div>
            <Link
              href={`/${USER.username}`}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-ink-700/60 text-[12px] text-ink-300 hover:text-white hover:bg-white/[0.04] transition"
            >
              <EyeIcon className="w-3.5 h-3.5" />
              <span>以访客身份查看</span>
            </Link>
            <Avatar size={30} className="ring-1 ring-white/10" />
          </div>
        </header>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
