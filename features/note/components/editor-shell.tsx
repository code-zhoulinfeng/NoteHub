"use client";

import { useState } from "react";
import {
  ArrowLeftIcon,
  BranchIcon,
  CheckIcon,
  CloseIcon,
  GithubIcon,
  GlobeIcon,
  HistoryIcon,
  LockIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/toast";
import { REPO } from "@/lib/mock/data";
import { cn, esc } from "@/lib/utils";

type ViewMode = "edit" | "split" | "preview";

interface EditorShellProps {
  path: string;
  title: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  dirty: boolean;
}

/**
 * Markdown 编辑器外壳。
 * 按需求：编辑器本体（textarea / 实时预览）暂不实现，仅交付页面框架。
 * 后端阶段接入 @uiw/react-md-editor 或 CodeMirror 分屏编辑。
 */
export function EditorShell({ path, title, description, tags, isPublic: initialPublic, dirty: initialDirty }: EditorShellProps) {
  const [view, setView] = useState<ViewMode>("split");
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [dirty, setDirty] = useState(initialDirty);

  const views: [ViewMode, string][] = [
    ["edit", "编辑"],
    ["split", "分屏"],
    ["preview", "预览"],
  ];

  return (
    <div className="h-screen flex flex-col bg-ink-950 overflow-hidden">
      {/* 顶栏 */}
      <header className="h-14 shrink-0 border-b border-ink-700/60 bg-ink-900/60 flex items-center gap-3 px-4 lg:px-5 z-40">
        <a
          href="/app/notes"
          className="flex items-center gap-1.5 text-[13px] text-ink-300 hover:text-white transition shrink-0"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="hidden sm:inline">全部笔记</span>
        </a>
        <span className="w-px h-4 bg-ink-700" />

        <div className="flex items-center gap-1.5 min-w-0 text-[12.5px] font-mono">
          <span className="text-ink-400 hidden sm:inline">{REPO.rootPath}</span>
          <span className="text-white truncate">{esc(path)}.md</span>
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full bg-amber shrink-0 transition-opacity",
              dirty ? "opacity-100" : "opacity-0",
            )}
            title="有未保存的修改"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={`/app/notes/${path}/history`}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-ink-700/60 text-[12.5px] text-ink-300 hover:text-white hover:bg-white/[0.05] transition"
          >
            <HistoryIcon className="w-3.5 h-3.5" />
            历史
          </a>

          <button
            type="button"
            onClick={() => {
              const next = !isPublic;
              setIsPublic(next);
              setDirty(true);
              toast(
                next
                  ? `已设为公开 · notehub.dev/zhoulinfeng/${path}`
                  : "已设为私密 · 访客将无法访问",
              );
            }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all text-[12.5px] font-medium",
              isPublic
                ? "border-mint/30 bg-mint/10 text-mint"
                : "border-ink-700/60 text-ink-300 hover:text-white hover:bg-white/[0.05]",
            )}
          >
            {isPublic ? <GlobeIcon className="w-3.5 h-3.5" /> : <LockIcon className="w-3.5 h-3.5" />}
            {isPublic ? "公开" : "私密"}
          </button>

          <button
            type="button"
            onClick={() => {
              // 后端阶段：Server Action → 暂存到 SQLite 草稿表
              setDirty(false);
              toast("已保存到本地暂存，尚未提交 GitHub");
            }}
            className="px-3.5 py-2 rounded-lg border border-ink-700/60 text-[12.5px] text-ink-300 hover:text-white hover:bg-white/[0.05] transition"
          >
            保存
          </button>

          <CommitDialog path={path} />
        </div>
      </header>

      {/* 元信息条 */}
      <div className="shrink-0 border-b border-ink-700/60 bg-ink-950 px-4 lg:px-5 py-2.5 flex flex-wrap items-center gap-3">
        <input
          type="text"
          defaultValue={title}
          placeholder="标题"
          className="flex-1 min-w-[160px] bg-transparent text-[14px] font-medium text-white placeholder:text-ink-400 border-b border-transparent focus:border-accent/50 pb-0.5 transition-colors outline-none"
        />

        <input
          type="text"
          defaultValue={description}
          placeholder="简介（列表与 SEO）"
          className="flex-[2] min-w-[180px] bg-transparent text-[13px] text-zinc-400 placeholder:text-ink-400 border-b border-transparent focus:border-accent/50 pb-0.5 transition-colors outline-none"
        />

        <div className="flex items-center gap-1.5 text-[11px]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-ink-400">
            <path d="M3.5 12.5 12 4h8v8l-8.5 8.5a2 2 0 0 1-2.8 0L3.5 15.3a2 2 0 0 1 0-2.8Z" />
            <circle cx="16" cy="8" r="1.4" />
          </svg>
          {tags.map((t) => (
            <span
              key={t}
              className="px-1.5 py-[2px] rounded bg-white/[0.06] text-[10.5px] text-zinc-400 font-mono"
            >
              #{esc(t)}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-ink-850 border border-ink-700/60 ml-auto">
          {views.map(([k, l]) => (
            <button
              key={k}
              type="button"
              onClick={() => setView(k)}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11.5px] transition",
                view === k ? "tab-active font-medium" : "text-ink-300 hover:text-white",
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* 分屏区域 —— 编辑器本体留空（后续补充） */}
      <div className="flex-1 min-h-0 flex">
        <div
          className={cn(
            "flex-1 min-w-0 flex-col border-r border-ink-700/60",
            view === "preview" ? "hidden" : "flex",
          )}
        >
          <div className="h-8 shrink-0 px-4 flex items-center gap-2 border-b border-ink-700/50 bg-white/[0.015]">
            <span className="text-[10.5px] font-mono text-ink-400 tracking-wider">MARKDOWN</span>
            <span className="ml-auto text-[10.5px] font-mono text-ink-400">—</span>
          </div>
          {/* 编辑器本体（textarea / CodeMirror）—— 后续补充 */}
          <div className="flex-1 min-h-0 grid place-items-center p-5">
            <div className="text-center">
              <div className="text-[13px] text-ink-400 font-mono">编辑器本体 · 待实现</div>
              <div className="mt-1.5 text-[12px] text-ink-500">
                此区域将接入 Markdown 编辑器（分屏 + 实时预览）
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex-1 min-w-0 flex-col bg-ink-900/30",
            view === "edit" ? "hidden" : "flex",
          )}
        >
          <div className="h-8 shrink-0 px-4 flex items-center gap-2 border-b border-ink-700/50 bg-white/[0.015]">
            <span className="text-[10.5px] font-mono text-ink-400 tracking-wider">PREVIEW</span>
            <span className="ml-auto flex items-center gap-1.5 text-[10.5px] text-ink-400">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              实时渲染
            </span>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {/* 实时预览 —— 随编辑器一起实现 */}
            <div className="md max-w-[680px] mx-auto px-8 py-8">
              <div className="text-center py-16">
                <div className="text-[13px] text-ink-400 font-mono">实时预览 · 待实现</div>
                <div className="mt-1.5 text-[12px] text-ink-500">将随左侧 Markdown 输入实时渲染</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部状态栏 */}
      <footer className="h-8 shrink-0 border-t border-ink-700/60 bg-ink-900/60 px-4 flex items-center gap-4 text-[11px] font-mono text-ink-400">
        <span className="flex items-center gap-1.5">
          <span className={cn("w-1.5 h-1.5 rounded-full", isPublic ? "bg-mint" : "bg-ink-500")} />
          <span>{isPublic ? "public: true" : "public: false"}</span>
        </span>
        <span className="text-ink-600">|</span>
        <span className="truncate">
          {REPO.owner}/{REPO.repo} · {REPO.branch}
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <BranchIcon className="w-3 h-3" />
          <span>{dirty ? "未提交" : "已同步"}</span>
        </span>
      </footer>
    </div>
  );
}

/** 提交到 GitHub 弹窗 —— 与 design.html 的 commit modal 一致 */
function CommitDialog({ path }: { path: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="px-4 py-2 text-[12.5px]">
          <GithubIcon className="w-3.5 h-3.5" />
          Commit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <span className="w-4 h-4 text-accent-400">
            <GithubIcon className="w-full h-full" />
          </span>
          <DialogTitle>提交到 GitHub</DialogTitle>
          <DialogTrigger asChild>
            <button className="ml-auto w-4 h-4 text-ink-400 hover:text-white transition">
              <CloseIcon className="w-full h-full" />
            </button>
          </DialogTrigger>
        </DialogHeader>

        <DialogBody>
          <div className="flex items-center gap-2.5 text-[12.5px] font-mono text-ink-300 mb-5 pb-5 border-b border-ink-700">
            <BranchIcon className="w-3.5 h-3.5 text-ink-400" />
            <span className="text-zinc-400">
              {REPO.owner}/{REPO.repo}
            </span>
            <span className="text-ink-500">·</span>
            <span className="text-accent-400">{REPO.branch}</span>
            <span className="ml-auto text-ink-400 truncate">
              {REPO.rootPath}
              {esc(path)}.md
            </span>
          </div>

          <label className="block text-[10.5px] font-mono tracking-[0.14em] text-ink-400 mb-2">
            COMMIT MESSAGE
          </label>
          <Input defaultValue={`Update ${path.split("/").pop()}`} />

          <div className="mt-5 flex items-center gap-2.5 text-[12px] text-ink-300">
            <span className="text-[11.5px] text-zinc-500">提交后列表与版本历史会立即更新</span>
          </div>
        </DialogBody>

        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-ink-700 text-zinc-400 hover:text-white">
              取消
            </Button>
          </DialogTrigger>
          <Button
            className="ml-auto"
            onClick={() => {
              // 后端阶段：Server Action → 写入队列 → 消费者调用 GitHub Contents API
              toast("已提交到 GitHub · Update note（原型演示）");
              setOpen(false);
            }}
          >
            <CheckIcon className="w-3.5 h-3.5" />
            提交
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
