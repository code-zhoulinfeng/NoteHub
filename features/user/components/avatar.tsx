import { cn } from "@/lib/utils";

interface AvatarProps {
  size?: number;
  className?: string;
  /** 头像字母（默认 Z） */
  letter?: string;
}

/** 用户头像 —— GitHub 渐变占位（后端阶段换真实头像 URL） */
export function Avatar({ size = 32, className, letter = "Z" }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full shrink-0 grid place-items-center font-semibold text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.42),
        background: "linear-gradient(140deg,#E50914 0%,#8c0f1a 55%,#2a0b12 100%)",
      }}
    >
      {letter}
    </div>
  );
}
