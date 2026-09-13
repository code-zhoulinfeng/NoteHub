import * as React from "react";
import { cn } from "@/lib/utils";

/** shadcn/ui Input —— 暗色主题定制 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full px-3.5 py-2.5 rounded-lg bg-ink-950 border border-ink-700/60 text-[13px] text-white font-mono placeholder:text-ink-400 focus:border-accent/50 transition-colors",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
