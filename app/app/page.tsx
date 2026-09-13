import Link from "next/link";
import {
  ArrowRightIcon,
  ClockIcon,
  EditIcon,
  FileIcon,
  HistoryIcon,
} from "@/components/icons";
import { Avatar } from "@/features/user/components/avatar";
import { NewNoteDialog } from "@/features/note/components/new-note-dialog";
import { VisibilityBadge } from "@/features/note/components/visibility-badge";
import { COMMITS, NOTES, REPO, USER } from "@/lib/mock/data";
import { esc } from "@/lib/utils";

/** 工作台 Overview —— 与 design.html 的 OwnerDash 一致 */
export default function DashboardPage() {
  const pub = NOTES.filter((n) => n.public).length;
  const priv = NOTES.length - pub;
  const dirtyNotes = NOTES.filter((n) => n.dirty);
  const recent = [...NOTES].sort((a, b) => b.ts - a.ts).slice(0, 6);
  const hero = recent[0]!;

  const stats = [
    { label: "全部笔记", value: NOTES.length, accent: false },
    { label: "已公开", value: pub, accent: true },
    { label: "私密", value: priv, accent: false },
    { label: "本周提交", value: 9, accent: false },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-5 lg:px-8 py-8">
      {/* 欢迎区 */}
      <div className="anim-up">
        <h2 className="text-[22px] font-semibold text-white tracking-tight">
          欢迎回来，{USER.name}
        </h2>
        <p className="mt-1.5 text-[13.5px] text-ink-300">
          仓库 <span className="font-mono text-zinc-400">{REPO.owner}/{REPO.repo}</span> · 分支{" "}
          <span className="font-mono text-zinc-400">{REPO.branch}</span>
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <Link
            href={`/app/notes/${hero.path}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-400 text-white text-[13px] font-medium transition-all active:scale-[.97]"
          >
            <EditIcon className="w-4 h-4" />
            <span>继续编辑 · {esc(hero.title)}</span>
          </Link>
          <NewNoteDialog variant="outline" />
        </div>
      </div>

      {/* 待提交提醒 */}
      {dirtyNotes.length ? (
        <div
          className="anim-up mt-8 rounded-xl border border-amber/25 bg-amber/[0.05] p-4"
          style={{ animationDelay: ".08s" }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-4 h-4 text-amber">
              <ClockIcon className="w-full h-full" />
            </span>
            <span className="text-[13px] font-medium text-amber">
              {dirtyNotes.length} 篇笔记有未提交的修改
            </span>
            <span className="ml-auto text-[11.5px] text-amber/70 font-mono hidden sm:inline">
              本地草稿 · 尚未写回 GitHub
            </span>
          </div>
          <div className="space-y-1.5">
            {dirtyNotes.map((n) => (
              <Link
                key={n.path}
                href={`/app/notes/${n.path}`}
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-black/20 hover:bg-black/40 transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                <span className="text-[13px] text-white truncate">{esc(n.title)}</span>
                <span className="text-[11px] text-ink-400 font-mono truncate hidden sm:inline">
                  {esc(n.path)}.md
                </span>
                <span className="ml-auto text-[12px] text-amber whitespace-nowrap">打开编辑器 →</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {/* 统计卡 */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="anim-up rounded-xl border border-ink-700/60 bg-ink-850/50 p-4"
            style={{ animationDelay: `${0.12 + i * 0.05}s` }}
          >
            <div className="text-[11.5px] text-ink-300">{s.label}</div>
            <div
              className={`mt-1.5 text-[26px] font-semibold tracking-tight ${s.accent ? "text-accent-400" : "text-white"}`}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* 最近编辑 + 最近提交 */}
      <div className="mt-8 grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 rounded-xl border border-ink-700/60 bg-ink-850/40 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-ink-700/50 flex items-center gap-2.5">
            <span className="w-4 h-4 text-ink-300">
              <EditIcon className="w-full h-full" />
            </span>
            <span className="text-[13.5px] font-medium text-white">最近编辑</span>
            <Link
              href="/app/notes"
              className="ml-auto text-[11.5px] text-ink-400 hover:text-white transition flex items-center gap-1"
            >
              全部 <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-ink-700/40">
            {recent.map((n) => (
              <Link
                key={n.path}
                href={`/app/notes/${n.path}`}
                className="group flex items-center gap-3.5 px-5 py-3.5 hover:bg-white/[0.025] transition"
              >
                <span className="relative shrink-0">
                  <span className="block w-8 h-8 rounded-lg bg-white/[0.04] border border-ink-700/60 grid place-items-center text-ink-300 group-hover:text-accent-400 transition-colors">
                    <FileIcon className="w-3.5 h-3.5" />
                  </span>
                  {n.dirty ? (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber ring-2 ring-ink-850" />
                  ) : null}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-[13.5px] text-white font-medium truncate">
                      {esc(n.title)}
                    </span>
                    <VisibilityBadge isPublic={n.public} />
                  </span>
                  <span className="block text-[11px] text-ink-400 font-mono mt-0.5 truncate">
                    {REPO.rootPath}
                    {esc(n.path)}.md
                  </span>
                </span>

                <span className="hidden sm:block text-[11.5px] text-ink-400 shrink-0">
                  {n.updated}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-ink-700/60 bg-ink-850/40 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-ink-700/50 flex items-center gap-2.5">
            <span className="w-4 h-4 text-ink-300">
              <HistoryIcon className="w-full h-full" />
            </span>
            <span className="text-[13.5px] font-medium text-white">最近提交</span>
            <span className="ml-auto text-[11.5px] text-ink-400 transition font-mono">
              {REPO.branch}
            </span>
          </div>

          <div className="divide-y divide-ink-700/40">
            {COMMITS.slice(0, 5).map((c) => (
              <div key={c.sha} className="px-5 py-3.5 hover:bg-white/[0.02] transition">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  <span className="text-[12.5px] text-white truncate">{esc(c.msg)}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2.5 text-[11px] font-mono text-ink-400">
                  <span className="text-accent-400">{c.sha}</span>
                  <span>{c.time}</span>
                  <span className="ml-auto flex items-center gap-1.5">
                    <span className="text-mint">+{c.add}</span>
                    <span className="text-accent-400">−{c.del}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
