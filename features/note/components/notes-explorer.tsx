"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  EditIcon,
  FileIcon,
  HistoryIcon,
  SearchIcon,
  TrashIcon,
} from "@/components/icons";
import { NewNoteDialog } from "@/features/note/components/new-note-dialog";
import { VisibilityBadge } from "@/features/note/components/visibility-badge";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/lib/toast";
import { REPO } from "@/lib/mock/data";
import { cn } from "@/lib/utils";
import { esc } from "@/lib/utils";
import type { Note } from "@/types/note";

const FILTERS = [
  ["all", "全部"],
  ["public", "公开"],
  ["private", "私密"],
  ["dirty", "待提交"],
] as const;

type FilterKey = (typeof FILTERS)[number][0];

interface NotesExplorerProps {
  notes: Note[];
}

/** 笔记列表主体（搜索 + 筛选 + 表格 + 行操作），与 design.html 的 OwnerNotes 一致 */
export function NotesExplorer({ notes }: NotesExplorerProps) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);
  const router = useRouter();

  const list = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return notes
      .filter((n) => {
        if (filter === "public") return n.public;
        if (filter === "private") return !n.public;
        if (filter === "dirty") return n.dirty;
        return true;
      })
      .filter(
        (n) =>
          !kw ||
          n.title.toLowerCase().includes(kw) ||
          n.path.toLowerCase().includes(kw),
      )
      .sort((a, b) => b.ts - a.ts);
  }, [notes, q, filter]);

  return (
    <div className="max-w-[1200px] mx-auto px-5 lg:px-8 py-8">
      {/* 工具栏 */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400">
            <SearchIcon className="w-full h-full" />
          </span>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索标题或路径…"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-ink-850 border border-ink-700/60 text-[13px] text-zinc-200 placeholder:text-ink-400 focus:border-accent/40 transition-all"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-lg bg-ink-850 border border-ink-700/60">
          {FILTERS.map(([k, l]) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              className={cn(
                "px-3 py-1.5 rounded-md text-[12.5px] transition-all",
                filter === k
                  ? "bg-white/[0.08] text-white"
                  : "text-ink-300 hover:text-zinc-200",
              )}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-[12px] text-ink-400 hidden sm:block">
            {list.length} / {notes.length} 篇
          </span>
          <NewNoteDialog size="sm" />
        </div>
      </div>

      {/* 列表 */}
      <div className="rounded-xl border border-ink-700/60 bg-ink-850/30 overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_100px_100px_110px] gap-4 px-5 py-3 border-b border-ink-700/50 bg-white/[0.015] text-[11px] font-mono tracking-wider text-ink-400">
          <span>笔记</span>
          <span>可见性</span>
          <span>更新时间</span>
          <span className="text-right">操作</span>
        </div>

        <div className="divide-y divide-ink-700/40">
          {list.length ? (
            list.map((n, i) => (
              <div
                key={n.path}
                className="anim-up group grid grid-cols-1 md:grid-cols-[1fr_100px_100px_110px] gap-3 md:gap-4 px-5 py-3.5 hover:bg-white/[0.025] transition-all items-center"
                style={{ animationDelay: `${Math.min(i * 0.03, 0.28)}s` }}
              >
                <Link href={`/app/notes/${n.path}`} className="min-w-0 flex items-center gap-3">
                  <span className="relative shrink-0">
                    <span className="block w-7 h-7 rounded-lg bg-white/[0.04] border border-ink-700/60 grid place-items-center text-ink-300 group-hover:text-accent-400 transition-colors">
                      <FileIcon className="w-3 h-3" />
                    </span>
                    {n.dirty ? (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber ring-2 ring-ink-950" />
                    ) : null}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13.5px] text-white font-medium truncate">
                      {esc(n.title)}
                    </span>
                    <span className="block text-[11px] text-ink-400 font-mono truncate mt-0.5">
                      {REPO.rootPath}
                      {esc(n.path)}.md
                    </span>
                  </span>
                </Link>

                <div className="hidden md:block">
                  <VisibilityBadge isPublic={n.public} />
                </div>

                <div className="hidden md:block text-[11.5px] text-ink-400">{n.updated}</div>

                <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/app/notes/${n.path}`}
                    title="编辑"
                    className="w-7 h-7 rounded-md grid place-items-center text-ink-300 hover:text-white hover:bg-white/[0.08] transition"
                  >
                    <EditIcon className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/app/notes/${n.path}/history`}
                    title="版本历史"
                    className="w-7 h-7 rounded-md grid place-items-center text-ink-300 hover:text-white hover:bg-white/[0.08] transition"
                  >
                    <HistoryIcon className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    title="删除"
                    onClick={() => setDeleteTarget(n)}
                    className="w-7 h-7 rounded-md grid place-items-center text-ink-300 hover:text-accent-400 hover:bg-accent/10 transition"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <div className="mx-auto w-12 h-12 rounded-xl bg-white/[0.03] grid place-items-center text-ink-400 mb-4">
                <SearchIcon className="w-5 h-5" />
              </div>
              <div className="text-zinc-400 text-sm">没有匹配的笔记</div>
              <div className="text-ink-400 text-[12.5px] mt-1.5">换个关键词，或新建一篇</div>
            </div>
          )}
        </div>
      </div>

      {/* 删除确认弹窗 */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogBody>
            <div className="flex items-start gap-4">
              <span className="w-11 h-11 rounded-lg bg-accent/12 text-accent-400 grid place-items-center p-2.5 shrink-0">
                <TrashIcon className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-[16px] font-semibold text-white">删除这篇笔记？</h3>
                <p className="mt-2 text-[13px] text-zinc-400 leading-relaxed">
                  将从 GitHub 仓库中删除{" "}
                  <span className="font-mono text-white">
                    {REPO.rootPath}
                    {esc(deleteTarget?.path ?? "")}.md
                  </span>
                  。历史记录仍可通过 Git 找回。
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-ink-700 text-[13px] text-zinc-400 hover:text-white hover:bg-white/[0.05] transition"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  // 后端阶段：Server Action → 队列 → GitHub Contents API DELETE
                  toast("已删除并提交到 GitHub");
                  setDeleteTarget(null);
                  router.refresh();
                }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-400 text-white text-[13px] font-medium transition active:scale-[.97]"
              >
                确认删除
              </button>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  );
}
