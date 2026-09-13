import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  ClockIcon,
  ExternalIcon,
  CopyIcon,
  LogoIcon,
} from "@/components/icons";
import { CopyButton, ToastButton } from "@/components/toast-buttons";
import { Avatar } from "@/features/user/components/avatar";
import { VisitorNav } from "@/features/profile/components/visitor-nav";
import { VisibilityBadge } from "@/features/note/components/visibility-badge";
import { Markdown } from "@/features/note/components/markdown";
import { RowScroller } from "@/features/note/components/row-scroller";
import { extractToc } from "@/lib/markdown";
import { NOTES, REPO, USER, coverFor, findNote } from "@/lib/mock/data";
import { esc } from "@/lib/utils";

/** 公开笔记阅读页 —— 服务端校验可见性，私密笔记一律 404（不泄露存在性） */
export default async function PublicNotePage({
  params,
}: PageProps<"/[username]/[...notePath]">) {
  const { username, notePath } = await params;
  const path = notePath.join("/");

  // 后端阶段：服务端完成 Authentication → Authorization → Visibility Check
  if (username !== USER.username) notFound();
  const note = findNote(path);
  if (!note || !note.public) notFound();

  const idx = NOTES.indexOf(note);
  const toc = extractToc(note.content);
  const related = NOTES.filter((n) => n.public && n.path !== note.path).slice(0, 6);
  const publicUrl = `notehub.dev/${USER.username}/${note.path}`;

  return (
    <div className="min-h-screen bg-ink-950">
      <VisitorNav username={username} name={USER.name} />

      {/* 封面 Hero */}
      <section className="relative pt-[68px]">
        <div
          className="relative h-[46vh] min-h-[320px] max-h-[440px] overflow-hidden"
          style={{ background: coverFor(idx) }}
        >
          <div className="absolute inset-0 grid-noise opacity-40" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 via-ink-950/75 to-transparent" />

          <div className="relative h-full max-w-[1080px] mx-auto px-4 sm:px-8 flex flex-col justify-end pb-10">
            <div className="anim-down flex items-center gap-3 mb-4 flex-wrap">
              <VisibilityBadge isPublic size="lg" />
              <Link
                href={`/${username}`}
                className="flex items-center gap-2 text-[12.5px] text-zinc-300 hover:text-white transition-colors"
              >
                <Avatar size={20} />
                <span>@{USER.username}</span>
              </Link>
              <span className="text-ink-500">·</span>
              <span className="text-[12.5px] text-ink-300 flex items-center gap-1.5">
                <ClockIcon className="w-3 h-3" />
                {note.updated}更新
              </span>
            </div>

            <h1 className="anim-up text-[32px] sm:text-[44px] font-bold tracking-tight text-white leading-[1.1] drop-shadow-2xl">
              {esc(note.title)}
            </h1>

            <p
              className="anim-up mt-4 text-[15px] text-zinc-300 leading-relaxed max-w-2xl"
              style={{ animationDelay: ".08s" }}
            >
              {esc(note.description)}
            </p>

            <div className="anim-up mt-5 flex flex-wrap items-center gap-2" style={{ animationDelay: ".14s" }}>
              {note.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded bg-white/[0.07] backdrop-blur-sm border border-white/[0.07] text-[11.5px] text-zinc-300 font-mono"
                >
                  #{esc(t)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 正文 + TOC */}
      <div className="max-w-[1080px] mx-auto px-4 sm:px-8 pb-16">
        <div className="grid lg:grid-cols-[1fr_220px] gap-12">
          <article className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5 py-5 border-y border-ink-700/50 mb-8">
              <CopyButton
                text={`https://${publicUrl}`}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-ink-700/60 text-[12.5px] text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <CopyIcon className="w-3.5 h-3.5" />
                复制链接
              </CopyButton>
              <ToastButton
                msg="已跳转 GitHub 源文件（原型演示）"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-ink-700/60 text-[12.5px] text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <ExternalIcon className="w-3.5 h-3.5" />
                在 GitHub 上查看
              </ToastButton>
              <span className="ml-auto text-[11.5px] text-ink-400 font-mono hidden sm:block">
                {note.sha}
              </span>
            </div>

            <Markdown content={note.content} />
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-[92px]">
              <div className="text-[10.5px] font-mono tracking-[0.18em] text-ink-400 mb-3.5">目录</div>
              <nav className="space-y-1 border-l border-ink-700/60">
                {toc.length ? (
                  toc.map((t) => (
                    <a
                      key={t.id}
                      href={`#${t.id}`}
                      className="toc-link block text-[12.5px] leading-snug text-ink-300 hover:text-white transition-colors py-1"
                      style={{ paddingLeft: t.level === 3 ? 22 : 12 }}
                    >
                      {esc(t.text)}
                    </a>
                  ))
                ) : (
                  <div className="text-[12.5px] text-ink-400 pl-3">无小节</div>
                )}
              </nav>

              <div className="mt-8 pt-5 border-t border-ink-700/50">
                <div className="text-[10.5px] font-mono tracking-[0.18em] text-ink-400 mb-3">作者</div>
                <Link href={`/${username}`} className="flex items-center gap-3 group">
                  <Avatar size={36} />
                  <div className="min-w-0">
                    <div className="text-[13px] text-white group-hover:text-accent-400 transition-colors truncate">
                      {USER.name}
                    </div>
                    <div className="text-[11px] text-ink-400 font-mono">@{USER.username}</div>
                  </div>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* 继续阅读 */}
      <div className="border-t border-ink-700/50 pt-10 pb-20">
        <RowScroller title="继续阅读" notes={related} accent base={`/${username}`} offset={idx + 1} />
      </div>

      <footer className="border-t border-ink-700/50">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-8 py-9 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-accent grid place-items-center text-white">
              <LogoIcon className="w-3.5 h-3.5" />
            </div>
            <span className="text-[13px] text-zinc-300">NoteHub</span>
          </div>
          <div className="text-[12px] text-ink-400 font-mono">
            {REPO.rootPath}
            {esc(note.path)}.md
          </div>
        </div>
      </footer>
    </div>
  );
}
