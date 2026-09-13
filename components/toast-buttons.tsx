"use client";

import type { ButtonHTMLAttributes } from "react";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface ToastButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** toast 文案；不传则点击无提示 */
  msg?: string;
  warn?: boolean;
}

/** 原型演示用按钮：点击弹 toast（后续接 Server Actions 时逐个替换） */
export function ToastButton({ msg, warn, className, onClick, ...rest }: ToastButtonProps) {
  return (
    <button
      {...rest}
      className={className}
      onClick={(e) => {
        onClick?.(e);
        if (msg) toast(msg, warn ? "warn" : "ok");
      }}
    />
  );
}

/** 复制到剪贴板 + toast */
export function CopyButton({
  text,
  msg = "链接已复制到剪贴板",
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { text: string; msg?: string }) {
  return (
    <button
      {...rest}
      className={cn(className)}
      onClick={() => {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          navigator.clipboard.writeText(text).catch(() => {});
        }
        toast(msg);
      }}
    >
      {children}
    </button>
  );
}
