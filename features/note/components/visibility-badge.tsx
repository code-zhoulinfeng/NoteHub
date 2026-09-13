import { GlobeIcon, LockIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

interface VisibilityBadgeProps {
  isPublic: boolean;
  size?: "sm" | "lg";
}

/** 公开 / 私密 徽标 —— 与 design.html 的 visBadge 一致 */
export function VisibilityBadge({ isPublic, size = "sm" }: VisibilityBadgeProps) {
  const pad = size === "sm" ? "px-1.5 py-[3px] text-[10px]" : "px-2.5 py-1 text-[11.5px]";
  const ico = size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3";
  return isPublic ? (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded bg-white/10 backdrop-blur-md text-white font-medium tracking-wide",
        pad,
      )}
    >
      <GlobeIcon className={ico} />
      公开
    </span>
  ) : (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded bg-black/55 backdrop-blur-md text-zinc-400 font-medium tracking-wide",
        pad,
      )}
    >
      <LockIcon className={ico} />
      私密
    </span>
  );
}
