import type { Metadata } from "next";
import { NotesExplorer } from "@/features/note/components/notes-explorer";
import { NOTES } from "@/lib/mock/data";

export const metadata: Metadata = {
  title: "全部笔记",
};

/** 笔记列表（/app/notes）—— 后端阶段由 GitHub Contents API 拉取 .md 列表 */
export default function NotesPage() {
  return <NotesExplorer notes={NOTES} />;
}
