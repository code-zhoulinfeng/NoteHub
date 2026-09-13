import type { Metadata } from "next";
import { EditorShell } from "@/features/note/components/editor-shell";
import { HistoryView } from "@/features/note/components/history-view";
import { CompareView } from "@/features/note/components/compare-view";
import { findNote } from "@/lib/mock/data";

/**
 * 笔记详情路由（/app/notes/[...path]）。
 * Next 16 不允许 catch-all 后跟子段，因此 history / compare 视图
 * 在本页内按路径末段分发（与 design.html 的 hash 路由逻辑一致）：
 *   /app/notes/a/b            → 编辑器（全屏）
 *   /app/notes/a/b/history    → 版本历史
 *   /app/notes/a/b/compare    → 版本对比
 */
export async function generateMetadata({
  params,
}: PageProps<"/app/notes/[...path]">): Promise<Metadata> {
  const { path } = await params;
  const last = path[path.length - 1];
  if (last === "history") return { title: "版本历史" };
  if (last === "compare") return { title: "版本对比" };
  return { title: "编辑笔记" };
}

export default async function NoteDetailPage({
  params,
}: PageProps<"/app/notes/[...path]">) {
  const { path: segments } = await params;
  const last = segments[segments.length - 1];

  if (last === "history") {
    const notePath = segments.slice(0, -1).join("/");
    return <HistoryView notePath={notePath} />;
  }

  if (last === "compare") {
    const notePath = segments.slice(0, -1).join("/");
    return <CompareView notePath={notePath} />;
  }

  const notePath = segments.join("/");
  const note = findNote(notePath);

  return (
    <EditorShell
      path={notePath}
      title={note?.title ?? "新笔记"}
      description={note?.description ?? ""}
      tags={note?.tags ?? []}
      isPublic={note?.public ?? false}
      dirty={note?.dirty ?? false}
    />
  );
}
