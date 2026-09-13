"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { HomeIcon, LogoIcon, NotesIcon } from "@/components/icons";
import { USER } from "@/lib/mock/data";

/** 访客顶部导航 —— 与 design.html 的 VisitorNav 一致（滚动后变实底） */
export function VisitorNav({ username = USER.username, name = USER.name }: { username?: string; name?: string }) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => {
      if (window.scrollY > 24) nav.classList.add("solid");
      else nav.classList.remove("solid");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header ref={navRef} className="nf-nav fixed top-0 left-0 right-0 z-50 h-[68px]">
      <div className="h-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-7 h-7 rounded-lg bg-accent grid place-items-center text-white shadow-glow transition-transform group-hover:scale-105">
            <LogoIcon className="w-4 h-4" />
          </div>
          <span className="text-[18px] font-semibold tracking-tight text-white">NoteHub</span>
        </Link>

        <span className="w-px h-5 bg-white/10 hidden sm:block" />

        <Link
          href={`/${username}`}
          className="text-[14px] text-white font-medium hover:text-white/80 transition"
        >
          {name}
        </Link>

        <div className="ml-auto flex items-center gap-4">
          <Link
            href={`/${username}`}
            className="hidden sm:flex items-center gap-1.5 text-[12.5px] text-zinc-400 hover:text-white transition"
          >
            <NotesIcon className="w-3.5 h-3.5" />
            <span>全部笔记</span>
          </Link>
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-[12.5px] text-zinc-400 hover:text-white transition"
          >
            <HomeIcon className="w-3.5 h-3.5" />
            <span>首页</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
