import Link from "next/link";
import { PlayIcon, PlusIcon } from "@/components/icons";
import { VisibilityBadge } from "@/features/note/components/visibility-badge";
import { coverFor } from "@/lib/mock/data";
import { esc } from "@/lib/utils";
import type { Note } from "@/types/note";

interface NoteCardProps {
  note: Note;
  /** 卡片序号（封面编号 & 封面渐变种子） */
  idx: number;
  /** 卡片链接前缀，默认 /zhoulinfeng */
  base?: string;
}

/** 公开主页的海报式笔记卡片 —— 与 design.html 的 VisitorNoteCard 一致 */
export function NoteCard({ note, idx, base = "/zhoulinfeng" }: NoteCardProps) {
  return (
    <Link
      href={`${base}/${note.path}`}
      className="note-card group/card relative shrink-0 w-[260px] sm:w-[300px] rounded-xl overflow-hidden bg-ink-850 border border-white/[0.06]"
    >
      <div className="relative aspect-[16/10] overflow-hidden" style={{ background: coverFor(idx) }}>
        <div className="absolute inset-0 grid-noise opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        <div className="absolute top-2.5 left-3">
          <VisibilityBadge isPublic />
        </div>

        <div className="absolute top-2.5 right-3 text-[10px] font-mono text-white/40 tracking-wider">
          {String(idx + 1).padStart(2, "0")}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3.5">
          <div className="text-[15.5px] font-semibold text-white leading-snug line-clamp-2 drop-shadow-lg">
            {note.title}
          </div>
        </div>

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2.5">
          <span className="w-10 h-10 rounded-full bg-white text-black grid place-items-center p-3 transition-transform duration-300 scale-90 group-hover/card:scale-100">
            <PlayIcon />
          </span>
          <span className="w-9 h-9 rounded-full border-2 border-white/50 text-white grid place-items-center p-2 hover:bg-white/15 transition">
            <PlusIcon />
          </span>
        </div>
      </div>

      <div className="px-3.5 py-3">
        <div className="flex items-center gap-2 text-[11px] text-ink-400 font-mono">
          <span className="text-ink-300">{note.updated}</span>
          <span>·</span>
          <span className="truncate">{esc(note.path)}.md</span>
        </div>
        <div className="card-desc">
          <p className="text-[12.5px] text-zinc-400 leading-relaxed line-clamp-3">{note.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {note.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="px-1.5 py-[2px] rounded bg-white/[0.06] text-[10px] text-zinc-400 font-mono"
              >
                #{esc(t)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
