import Link from "next/link";
import {
  ArrowLeftIcon,
  DiffIcon,
  ExternalIcon,
  HistoryIcon,
} from "@/components/icons";
import { ToastButton } from "@/components/toast-buttons";
import { COMMITS, NOTES, REPO, findNote } from "@/lib/mock/data";
import { esc } from "@/lib/utils";

/** 版本历史视图 —— 与 design.html 的 OwnerHistory 一致 */
export function HistoryView({ notePath }: { notePath: string }) {
  const note = findNote(notePath) ?? NOTES[0]!;

  return (
    <div className="max-w-[1100px] mx-auto px-5 lg:px-8 py-8">
      <Link
        href={`/app/notes/${note.path}`}
        className="inline-flex items-center gap-1.5 text-[13px] text-ink-300 hover:text-white transition mb-6"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        返回编辑器
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-[24px] font-semibold text-white tracking-tight">版本历史</h2>
          <p className="mt-2 text-[13px] text-ink-300 font-mono">
            {REPO.rootPath}
            {esc(note.path)}.md
          </p>
        </div>
        <Link
          href={`/app/notes/${note.path}/compare`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-ink-700/60 bg-white/[0.03] text-white text-[13px] font-medium hover:bg-white/[0.06] transition"
        >
          <DiffIcon className="w-3.5 h-3.5" />
          对比版本
        </Link>
      </div>

      <div className="mt-8 rounded-xl border border-ink-700/60 bg-ink-850/40 overflow-hidden">
        <div className="px-5 py-3 border-b border-ink-700/50 flex items-center gap-3">
          <span className="w-3.5 h-3.5 text-ink-400">
            <HistoryIcon className="w-full h-full" />
          </span>
          <span className="text-[12px] font-mono tracking-wider text-ink-400">
            COMMITS · {REPO.branch}
          </span>
          <span className="ml-auto text-[11.5px] text-ink-400">{COMMITS.length} 次提交</span>
        </div>

        <div className="divide-y divide-ink-700/40">
          {COMMITS.map((c, i) => (
            <div
              key={c.sha}
              className="anim-up group flex items-center gap-4 px-5 py-4 hover:bg-white/[0.025] transition-colors"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex flex-col items-center gap-1 shrink-0">
                <span className={`w-2 h-2 rounded-full ${i === 0 ? "bg-accent" : "bg-ink-600"}`} />
                {i < COMMITS.length - 1 ? <span className="w-px h-6 bg-ink-700/60" /> : null}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-[14px] text-white font-medium">{esc(c.msg)}</span>
                  {i === 0 ? (
                    <span className="px-1.5 py-[2px] rounded bg-accent text-white text-[10px] font-semibold tracking-wide">
                      HEAD
                    </span>
                  ) : null}
                </div>
                <div className="mt-1.5 flex items-center gap-3 text-[11.5px] text-ink-400 font-mono">
                  <span className="text-accent-400">{c.sha}</span>
                  <span>{c.date}</span>
                  <span className="flex items-center gap-1">
                    <span className="text-mint">+{c.add}</span>
                    <span className="text-accent-400">−{c.del}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[12px] text-ink-400 hidden sm:block">{c.time}</span>
                <ToastButton
                  msg={`已打开 ${c.sha} 版本（原型演示）`}
                  className="px-3 py-1.5 rounded-lg border border-ink-700/60 text-[12px] text-ink-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  查看
                </ToastButton>
                <Link
                  href={`/app/notes/${note.path}/compare`}
                  className="px-3 py-1.5 rounded-lg border border-ink-700/60 text-[12px] text-ink-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  对比
                </Link>
                <ToastButton
                  msg="已跳转 GitHub（原型演示）"
                  title="在 GitHub 上查看"
                  className="w-7 h-7 rounded-lg border border-ink-700/60 grid place-items-center p-1.5 text-ink-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <ExternalIcon className="w-3.5 h-3.5" />
                </ToastButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
