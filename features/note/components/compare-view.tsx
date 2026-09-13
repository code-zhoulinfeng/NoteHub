import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import { COMMITS, NOTES, findNote } from "@/lib/mock/data";
import { esc } from "@/lib/utils";
import type { DiffLine } from "@/types/note";

/** 版本对比左右两栏的静态 Diff 数据（原型演示，与 design.html 一致） */
const LEFT: DiffLine[] = [
  { t: "  # Next.js App Router", k: "" },
  { t: "", k: "" },
  { t: "  App Router 是 Next.js 13 引入的新路由体系。", k: "del" },
  { t: "+ App Router 是 Next.js 13 引入的新路由体系，以 React Server Components 为默认心智模型。", k: "add" },
  { t: "", k: "" },
  { t: "  ## 数据获取", k: "" },
  { t: "- 在 Server Component 里可以使用 fetch。", k: "del" },
  { t: "+ 在 Server Component 里可以直接写 async：", k: "add" },
  { t: "", k: "" },
  { t: "  ```tsx", k: "" },
  { t: "  const res = await fetch(url, { next: { revalidate: 60 } })", k: "" },
  { t: "  ```", k: "" },
];

const RIGHT: DiffLine[] = [
  { t: "  # Next.js App Router", k: "" },
  { t: "", k: "" },
  { t: "  App Router 是 Next.js 13 引入的新路由体系，以 React Server Components 为默认心智模型。", k: "" },
  { t: "", k: "" },
  { t: "  ## 数据获取", k: "" },
  { t: "  在 Server Component 里可以直接写 async：", k: "" },
  { t: "", k: "" },
  { t: "  ```tsx", k: "" },
  { t: "  const res = await fetch(url, { next: { revalidate: 60 } })", k: "" },
  { t: "  ```", k: "" },
];

function DiffPane({
  sha,
  msg,
  time,
  lines,
  added,
}: {
  sha: string;
  msg: string;
  time: string;
  lines: DiffLine[];
  added: boolean;
}) {
  return (
    <div className="rounded-xl border border-ink-700/60 bg-ink-850/40 overflow-hidden">
      <div className="px-4 py-3 border-b border-ink-700/50 flex items-center gap-2.5 bg-black/20">
        <span className={`w-2 h-2 rounded-full ${added ? "bg-mint" : "bg-accent"}`} />
        <span className="text-[12px] font-mono text-zinc-400">{sha}</span>
        <span className="text-[12px] text-ink-400">· {msg}</span>
        <span className="ml-auto text-[11px] text-ink-400">{time}</span>
      </div>
      <div className="py-2 overflow-x-auto">
        {lines.map((l, i) => (
          <div
            key={i}
            className={`diff-line px-4 py-[3px] whitespace-pre ${
              l.k === "del"
                ? added
                  ? "opacity-30 text-ink-400"
                  : "diff-del text-red-300/85"
                : l.k === "add"
                  ? added
                    ? "diff-add text-emerald-300/85"
                    : "opacity-30 text-ink-400"
                  : "text-zinc-400"
            }`}
          >
            {esc(l.t)}
          </div>
        ))}
      </div>
    </div>
  );
}

/** 版本对比视图 —— 与 design.html 的 OwnerCompare 一致 */
export function CompareView({ notePath }: { notePath: string }) {
  const note = findNote(notePath) ?? NOTES[0]!;
  const [from, to] = [COMMITS[1]!, COMMITS[0]!];

  return (
    <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-8">
      <Link
        href={`/app/notes/${note.path}/history`}
        className="inline-flex items-center gap-1.5 text-[13px] text-ink-300 hover:text-white transition mb-6"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        返回历史
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-[24px] font-semibold text-white tracking-tight">版本对比</h2>
          <p className="mt-2 text-[13px] text-ink-300 font-mono">{esc(note.path)}.md</p>
        </div>

        <div className="flex items-center gap-2 text-[12px] font-mono">
          <span className="px-3 py-2 rounded-lg bg-ink-850 border border-ink-700/60 text-zinc-400">
            {from.sha}
          </span>
          <ArrowRightIcon className="w-4 h-4 text-ink-400" />
          <span className="px-3 py-2 rounded-lg bg-accent/12 border border-accent/30 text-accent-400">
            {to.sha}
          </span>
        </div>
      </div>

      <div className="mt-7 grid lg:grid-cols-2 gap-4">
        <DiffPane sha={from.sha} msg={from.msg} time={from.time} lines={LEFT} added={false} />
        <DiffPane sha={to.sha} msg={to.msg} time={to.time} lines={RIGHT} added={true} />
      </div>

      <div className="mt-6 flex items-center gap-4 text-[12.5px] text-ink-400">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-mint/25 border-l-2 border-mint/60" />
          新增
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-accent/25 border-l-2 border-accent/70" />
          删除
        </span>
        <span className="ml-auto">
          共 <span className="text-mint">+{to.add}</span> /{" "}
          <span className="text-accent-400">−{to.del}</span>
        </span>
      </div>
    </div>
  );
}
