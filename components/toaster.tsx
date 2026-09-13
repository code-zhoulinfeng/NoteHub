"use client";

import { useEffect, useState } from "react";
import { subscribeToast, type ToastType } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface ToastItem {
  id: number;
  msg: string;
  type: ToastType;
}

let seq = 0;

/** 全局 Toast 容器 —— 挂载于根布局，样式与 design.html 一致 */
export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    return subscribeToast((msg, type) => {
      const id = ++seq;
      setItems((prev) => [...prev, { id, msg, type }]);
      setTimeout(() => {
        setItems((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)) as ToastItem[]);
        setTimeout(() => {
          setItems((prev) => prev.filter((t) => t.id !== id));
        }, 280);
      }, 2600);
    });
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2.5 pointer-events-none">
      {items.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-center gap-3 pl-4 pr-5 py-3 rounded-xl border border-ink-700 bg-ink-800/97 backdrop-blur-xl shadow-card text-[13.5px]",
            (t as ToastItem & { leaving?: boolean }).leaving ? "toast-out" : "toast-in",
            "pointer-events-auto",
          )}
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              t.type === "ok" ? "bg-accent" : t.type === "warn" ? "bg-amber" : "bg-white",
            )}
          />
          <span className="text-white">{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
