import Link from "next/link";
import { ArrowLeftIcon, LogoIcon } from "@/components/icons";
import { VisitorNav } from "@/features/profile/components/visitor-nav";

/** 全局 404 —— 与 design.html 的 NotFoundPage 一致 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink-950 flex flex-col">
      <VisitorNav />
      <div className="flex-1 grid place-items-center px-6 pt-[68px]">
        <div className="text-center">
          <div className="text-[110px] font-bold tracking-tighter leading-none text-white/[0.07]">
            404
          </div>
          <h1 className="mt-2 text-[24px] font-bold text-white">页面不存在</h1>
          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-[13px] font-semibold hover:bg-accent-400 transition shadow-glow"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            回到首页
          </Link>
        </div>
      </div>
    </div>
  );
}
