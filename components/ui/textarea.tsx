import * as React from "react";
import { cn } from "@/lib/utils";

/** shadcn/ui Textarea —— 暗色主题定制 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full px-3.5 py-3 rounded-lg bg-ink-950 border border-ink-700/60 text-[13px] text-zinc-200 font-mono leading-relaxed focus:border-accent/50 transition-colors resize-none",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
