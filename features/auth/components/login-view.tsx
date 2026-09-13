"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogoIcon } from "@/components/icons";
import { toast } from "@/lib/toast";
import { USER } from "@/lib/mock/data";

/**
 * GitHub OAuth 登录页。
 * 当前为原型：模拟跳转动画后进入工作台。
 * 后端阶段：跳转 GitHub 授权页 → /auth/callback 换取 Token（仅服务端持有）。
 */
export function LoginView() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      toast(`已通过 GitHub 登录 · ${USER.username}`);
      router.push("/app");
    }, 900);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-screen grid place-items-center bg-ink-950">
      <div className="flex flex-col items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-accent grid place-items-center text-white shadow-glow">
          <LogoIcon className="w-7 h-7" />
        </div>
        <div className="text-zinc-400 text-sm">正在跳转 GitHub 授权…</div>
        <div className="w-44 h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <div className="h-full w-1/2 bg-white/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
