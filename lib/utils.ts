import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** HTML 转义（与 design.html 的 esc 一致） */
export function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
    );
}

/** 相对时间格式化 */
export function relTime(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60e3);
  if (m < 1) return "刚刚";
  if (m < 60) return `${m} 分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时前`;
  if (h < 48) return "昨天";
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} 天前`;
  const w = Math.floor(d / 7);
  if (w < 5) return `${w} 周前`;
  return `${Math.floor(d / 30)} 个月前`;
}
