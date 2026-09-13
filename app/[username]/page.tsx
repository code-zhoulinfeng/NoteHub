import { notFound } from "next/navigation";
import { GithubIcon, LogoIcon, NotesIcon } from "@/components/icons";
import { Avatar } from "@/features/user/components/avatar";
import { VisitorNav } from "@/features/profile/components/visitor-nav";
import { RowScroller } from "@/features/note/components/row-scroller";
import { NOTES, REPO, USER } from "@/lib/mock/data";

/** 个人公开主页 —— Netflix 式内容发现界面，仅展示 public: true 的笔记 */
export default async function ProfilePage({
  params,
}: PageProps<"/[username]">) {
  const { username } = await params;

  // 后端阶段：按 username 查 RepositoryConfig（SQLite），再经 GitHub API 拉取公开笔记
  if (username !== USER.username) notFound();

  const pub = NOTES.filter((n) => n.public);
  const byTag = (t: string) => pub.filter((n) => n.tags.includes(t));

  const frontend = [
    ...new Set([...byTag("frontend"), ...byTag("react"), ...byTag("css"), ...byTag("nextjs")]),
  ];
  const devops = [...new Set([...byTag("docker"), ...byTag("devops"), ...byTag("ops")])];

  return (
    <div className="min-h-screen bg-ink-950">
      <VisitorNav username={username} name={USER.name} />

      {/* Hero */}
      <section className="relative h-[58vh] min-h-[420px] max-h-[580px] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(110% 100% at 22% 15%, #5a0e18 0%, #24080e 38%, #0a0a0c 72%)",
          }}
        />
        <div className="absolute inset-0 grid-noise opacity-40" />
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 hidden lg:block select-none pointer-events-none">
          <span className="text-[200px] font-bold tracking-tighter leading-none text-white/[0.022]">
            NOTES
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink-950 via-ink-950/70 to-transparent" />

        <div className="relative h-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col justify-end pb-16">
          <div className="flex items-end gap-5">
            <Avatar size={84} className="ring-2 ring-white/15 shadow-card" />
            <div className="min-w-0 pb-1">
              <div className="anim-down flex items-center gap-2.5 mb-2">
                <span className="px-2 py-[3px] rounded bg-accent text-white text-[10.5px] font-bold tracking-wider">
                  PUBLIC PROFILE
                </span>
              </div>
              <h1 className="anim-up text-[34px] sm:text-[44px] font-bold tracking-tight text-white leading-none">
                {USER.name}
              </h1>
              <div
                className="anim-up mt-2.5 flex items-center gap-3 text-[13px] text-zinc-400 font-mono"
                style={{ animationDelay: ".06s" }}
              >
                <span>@{USER.username}</span>
                <span className="text-ink-500">·</span>
                <span>{USER.joined}</span>
              </div>
            </div>
          </div>

          <p
            className="anim-up mt-5 text-[14.5px] text-zinc-400 leading-relaxed max-w-xl"
            style={{ animationDelay: ".12s" }}
          >
            {USER.bio}
          </p>

          <div
            className="anim-up mt-7 flex flex-wrap items-center gap-3"
            style={{ animationDelay: ".18s" }}
          >
            <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/12 text-[13px] text-white">
              <NotesIcon className="w-3.5 h-3.5 text-accent-400" />
              <span>
                <span className="font-bold">{pub.length}</span> 篇公开笔记
              </span>
            </span>
            <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/12 text-[13px] text-white">
              <GithubIcon className="w-3.5 h-3.5 text-accent-400" />
              <span className="font-mono">
                {REPO.owner}/{REPO.repo}
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* 分类行 */}
      <div className="pb-20 -mt-6 relative z-10">
        <RowScroller
          title="最新"
          notes={[...pub].sort((a, b) => b.ts - a.ts)}
          accent
          count
          base={`/${username}`}
          offset={0}
        />
        <RowScroller title="前端" notes={frontend} base={`/${username}`} offset={1} />
        <RowScroller title="工程与运维" notes={devops} base={`/${username}`} offset={3} />
      </div>

      <footer className="border-t border-ink-700/50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-9 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-accent grid place-items-center text-white">
              <LogoIcon className="w-3.5 h-3.5" />
            </div>
            <span className="text-[13px] text-zinc-300">NoteHub</span>
          </div>
          <div className="text-[12px] text-ink-400">
            内容托管于 GitHub · {REPO.owner}/{REPO.repo}
          </div>
        </div>
      </footer>
    </div>
  );
}
