"use client";

export type ToastType = "ok" | "warn" | "info";

type Listener = (msg: string, type: ToastType) => void;

const listeners = new Set<Listener>();

/** 全局 toast —— 可在任意（含服务端组件中嵌入的客户端组件）调用 */
export function toast(msg: string, type: ToastType = "ok") {
  listeners.forEach((l) => l(msg, type));
}

export function subscribeToast(l: Listener): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
