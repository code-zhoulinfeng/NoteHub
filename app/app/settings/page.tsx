import Link from "next/link";
import {
  ExternalIcon,
  GithubIcon,
  SparkIcon,
} from "@/components/icons";
import { ToastButton } from "@/components/toast-buttons";
import { Avatar } from "@/features/user/components/avatar";
import { Input, Textarea } from "@/components/ui";
import { REPO, USER } from "@/lib/mock/data";
import { esc } from "@/lib/utils";

/** 设置（/app/settings）—— 仓库配置 / 公开形象 / 危险操作，与 design.html 的 OwnerSettings 一致 */
export default function SettingsPage() {
  const repoFields = [
    { l: "OWNER", v: REPO.owner },
    { l: "REPOSITORY", v: REPO.repo },
    { l: "BRANCH", v: REPO.branch },
    { l: "ROOT PATH", v: REPO.rootPath },
  ];

  return (
    <div className="max-w-[900px] mx-auto px-5 lg:px-8 py-8">
      <h2 className="text-[22px] font-semibold text-white tracking-tight">设置</h2>
      <p className="mt-1.5 text-[13.5px] text-ink-300">管理仓库连接与公开形象。</p>

      {/* 笔记仓库 */}
      <section className="mt-7 rounded-xl border border-ink-700/60 bg-ink-850/40 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-ink-700/50 flex items-center gap-3">
          <span className="w-4 h-4 text-accent-400">
            <GithubIcon className="w-full h-full" />
          </span>
          <h3 className="text-[14px] font-medium text-white">笔记仓库</h3>
          <span className="ml-auto flex items-center gap-1.5 text-[11.5px] text-mint">
            <span className="w-1.5 h-1.5 rounded-full bg-mint" />
            已连接
          </span>
        </div>

        <div className="p-5 grid sm:grid-cols-2 gap-4">
          {repoFields.map((f) => (
            <div key={f.l}>
              <label className="block text-[10px] font-mono tracking-[0.14em] text-ink-400 mb-2">
                {f.l}
              </label>
              <Input type="text" defaultValue={f.v} />
            </div>
          ))}

          <div className="sm:col-span-2 flex items-center gap-2.5 pt-1 flex-wrap">
            <ToastButton
              msg="仓库配置已保存并校验通过"
              className="px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-400 text-white text-[12.5px] font-medium transition active:scale-[.97]"
            >
              保存并校验
            </ToastButton>
            <ToastButton
              msg="权限校验通过：read / write"
              className="px-4 py-2.5 rounded-lg border border-ink-700/60 text-[12.5px] text-ink-300 hover:text-white hover:bg-white/[0.05] transition"
            >
              验证权限
            </ToastButton>
            <span className="text-[11.5px] text-ink-400">上次校验：2 分钟前</span>
          </div>
        </div>
      </section>

      {/* 公开形象 */}
      <section className="mt-5 rounded-xl border border-ink-700/60 bg-ink-850/40 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-ink-700/50 flex items-center gap-3">
          <span className="w-4 h-4 text-accent-400">
            <SparkIcon className="w-full h-full" />
          </span>
          <h3 className="text-[14px] font-medium text-white">公开形象</h3>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-4">
            <Avatar size={52} />
            <div>
              <div className="text-[14.5px] text-white font-medium">{USER.name}</div>
              <div className="text-[12px] text-ink-400 font-mono">@{USER.username}</div>
            </div>
            <ToastButton
              msg="头像由 GitHub 提供，不可单独修改"
              className="ml-auto px-3.5 py-2 rounded-lg border border-ink-700/60 text-[12.5px] text-ink-300 hover:text-white hover:bg-white/[0.05] transition"
            >
              更换头像
            </ToastButton>
          </div>

          <div className="mt-5">
            <label className="block text-[10px] font-mono tracking-[0.14em] text-ink-400 mb-2">
              BIO
            </label>
            <Textarea rows={3} defaultValue={USER.bio} />
          </div>

          <div className="mt-5 flex items-center justify-between p-4 rounded-lg bg-ink-950 border border-ink-700/60">
            <div>
              <div className="text-[13px] text-white font-medium">公开主页</div>
              <div className="text-[11.5px] text-ink-400 font-mono mt-1">
                notehub.dev/{USER.username}
              </div>
            </div>
            <Link
              href={`/${USER.username}`}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white text-ink-950 text-[12px] font-medium hover:bg-zinc-200 transition"
            >
              <ExternalIcon className="w-3.5 h-3.5" />
              访问
            </Link>
          </div>
        </div>
      </section>

      {/* 危险操作 */}
      <section className="mt-5 rounded-xl border border-accent/25 bg-accent/[0.04] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-accent/20">
          <h3 className="text-[14px] font-medium text-white">危险操作</h3>
        </div>
        <div className="p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[13px] text-white font-medium">断开仓库连接</div>
            <div className="text-[12px] text-ink-400 mt-1">
              不会删除 GitHub 上的任何文件，仅解除 NoteHub 的关联。
            </div>
          </div>
          <ToastButton
            msg="已解除仓库连接（原型演示）"
            className="px-4 py-2.5 rounded-lg border border-accent/40 text-accent-400 text-[12.5px] font-medium hover:bg-accent/10 transition"
          >
            断开连接
          </ToastButton>
        </div>
      </section>
    </div>
  );
}
