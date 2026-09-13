import Link from "next/link";
import {
  ArrowRightIcon,
  CheckIcon,
  EyeIcon,
  LayersIcon,
  LogoIcon,
} from "@/components/icons";

/** 公开首页 —— 双入口（Owner 工作台 / Visitor 公开主页），与 design.html 的 Landing 一致 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-950 relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-56 -left-52 w-[720px] h-[720px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(229,9,20,.20), transparent 68%)" }}
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-40 w-[560px] h-[560px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(90,40,180,.14), transparent 70%)" }}
      />

      <header className="relative z-20 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-accent grid place-items-center text-white shadow-glow">
            <LogoIcon className="w-5 h-5" />
          </div>
          <span className="font-semibold tracking-tight text-lg">NoteHub</span>
        </Link>
        <Link
          href="/zhoulinfeng"
          className="text-sm text-zinc-400 hover:text-white transition"
        >
          查看示例主页 →
        </Link>
      </header>

      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="anim-up text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] text-white">
            一个仓库，<span className="bg-gradient-to-br from-accent-400 to-accent bg-clip-text text-transparent">两种视角</span>。
          </h1>
          <p className="anim-up mt-6 text-[16px] text-zinc-400 leading-relaxed" style={{ animationDelay: ".08s" }}>
            笔记内容始终在 GitHub 上。你在工作台里写与管理，访客在公开主页里读与发现。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Owner 入口 */}
          <Link
            href="/login"
            className="anim-up group relative rounded-2xl border border-white/[0.08] bg-ink-850/60 p-8 hover:border-accent/40 hover:bg-ink-800/80 transition-all duration-300 overflow-hidden"
            style={{ animationDelay: ".14s" }}
          >
            <div
              className="pointer-events-none absolute -top-20 -right-20 w-[280px] h-[280px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "radial-gradient(circle, rgba(229,9,20,.22), transparent 70%)" }}
            />

            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-accent/12 border border-accent/25 text-accent-400 grid place-items-center">
                <LayersIcon className="w-5 h-5" />
              </div>

              <div className="mt-6 text-[11px] tracking-[0.2em] text-accent font-medium uppercase">
                Owner 视角
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-white tracking-tight">工作台</h2>
              <p className="mt-3 text-[14px] text-zinc-400 leading-relaxed">
                管理、编辑、提交。一个高效的工具型后台，看见全部笔记（公开 + 私密）。
              </p>

              <div className="mt-6 space-y-2 text-[13px] text-zinc-500">
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-3.5 h-3.5 text-mint" />
                  <span>笔记列表、批量操作、状态查看</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-3.5 h-3.5 text-mint" />
                  <span>Markdown 分屏编辑器 + 实时预览</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-3.5 h-3.5 text-mint" />
                  <span>Commit 写回 GitHub · 版本历史</span>
                </div>
              </div>

              <div className="mt-7 flex items-center gap-2 text-[13.5px] text-white font-medium">
                <span>用 GitHub 登录</span>
                <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Visitor 入口 */}
          <Link
            href="/zhoulinfeng"
            className="anim-up group relative rounded-2xl border border-white/[0.08] bg-ink-850/60 p-8 hover:border-white/25 hover:bg-ink-800/80 transition-all duration-300 overflow-hidden"
            style={{ animationDelay: ".2s" }}
          >
            <div
              className="pointer-events-none absolute -top-20 -right-20 w-[280px] h-[280px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "radial-gradient(circle, rgba(255,255,255,.10), transparent 70%)" }}
            />

            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] text-zinc-300 grid place-items-center">
                <EyeIcon className="w-5 h-5" />
              </div>

              <div className="mt-6 text-[11px] tracking-[0.2em] text-zinc-500 font-medium uppercase">
                Visitor 视角
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-white tracking-tight">公开主页</h2>
              <p className="mt-3 text-[14px] text-zinc-400 leading-relaxed">
                只读、沉浸、可分享。一个 Netflix 式的内容发现界面，只看见公开笔记。
              </p>

              <div className="mt-6 space-y-2 text-[13px] text-zinc-500">
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-3.5 h-3.5 text-mint" />
                  <span>横向滚动分类行 · 海报式卡片</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-3.5 h-3.5 text-mint" />
                  <span>阅读页含目录 / 相关推荐</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-3.5 h-3.5 text-mint" />
                  <span>无需登录，可直接分享</span>
                </div>
              </div>

              <div className="mt-7 flex items-center gap-2 text-[13.5px] text-white font-medium">
                <span>以访客身份浏览</span>
                <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-[12.5px] text-zinc-500">
            <span className="w-1.5 h-1.5 rounded-full bg-mint" />
            GitHub 仓库是笔记内容的唯一数据源
          </div>
        </div>
      </section>
    </div>
  );
}
