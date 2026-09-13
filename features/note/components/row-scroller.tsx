"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/note";
import { NoteCard } from "@/features/note/components/note-card";

interface RowScrollerProps {
  title: string;
  notes: Note[];
  accent?: boolean;
  count?: boolean;
  base?: string;
  /** 卡片封面起始索引（避免多行封面重复） */
  offset?: number;
  className?: string;
  children?: ReactNode;
}

/** 横向滚动分类行 —— 与 design.html 的 VisitorRow 一致（含左右箭头） */
export function RowScroller({
  title,
  notes,
  accent,
  count,
  base,
  offset = 0,
  className,
}: RowScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (!notes.length) return null;

  const scroll = (dir: number) => {
    const el = scrollerRef.current;
    if (el) el.scrollBy({ left: dir * (el.clientWidth * 0.82), behavior: "smooth" });
  };

  return (
    <section className={cn("row-wrap relative mb-9 sm:mb-11", className)}>
      <div className="flex items-baseline justify-between px-4 sm:px-8 lg:px-12 mb-3.5">
        <h2 className="text-[17px] sm:text-[19px] font-semibold text-white tracking-tight flex items-center gap-2.5">
          {accent ? <span className="w-[3px] h-[18px] rounded-full bg-accent" /> : null}
          {title}
        </h2>
        {count ? (
          <span className="text-[12px] text-ink-400 font-mono">{notes.length} 篇</span>
        ) : null}
      </div>

      <div className="relative">
        <button
          type="button"
          aria-label="向左滚动"
          onClick={() => scroll(-1)}
          className="row-arrow absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-black/70 border border-white/10 text-white grid place-items-center p-2.5 backdrop-blur-md"
        >
          <ChevronLeftIcon />
        </button>

        <div
          ref={scrollerRef}
          className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth px-4 sm:px-8 lg:px-12 py-5 -my-5"
        >
          {notes.map((n, i) => (
            <NoteCard key={n.path} note={n} idx={i + offset} base={base} />
          ))}
        </div>

        <button
          type="button"
          aria-label="向右滚动"
          onClick={() => scroll(1)}
          className="row-arrow absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-black/70 border border-white/10 text-white grid place-items-center p-2.5 backdrop-blur-md"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </section>
  );
}
