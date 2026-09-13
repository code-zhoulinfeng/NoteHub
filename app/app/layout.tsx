import type { Metadata } from "next";
import { WorkbenchShell } from "@/components/layout/workbench-shell";

export const metadata: Metadata = {
  title: "工作台",
};

/** Owner 工作台（/app）布局：侧边栏 + 顶栏；编辑器页自动全屏 */
export default function AppLayout({ children }: LayoutProps<"/app">) {
  return <WorkbenchShell>{children}</WorkbenchShell>;
}
