import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/toaster";

export const metadata: Metadata = {
  title: {
    default: "NoteHub — GitHub 驱动的个人笔记博客",
    template: "%s · NoteHub",
  },
  description:
    "一个仓库，两种视角。笔记内容始终在 GitHub 上，工作台里写与管理，公开主页里读与发现。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-ink-950 text-zinc-200 font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
