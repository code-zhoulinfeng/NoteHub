import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Button —— 暗色主题定制。
 * design.html 中的按钮均以 className 覆写为主，这里提供常用变体。
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-[13px] font-medium transition-all active:scale-[.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none",
  {
    variants: {
      variant: {
        default: "bg-accent hover:bg-accent-400 text-white",
        outline:
          "border border-ink-700/60 bg-white/[0.02] text-zinc-200 hover:bg-white/[0.05]",
        ghost: "text-ink-300 hover:text-white hover:bg-white/[0.05]",
        light: "bg-white text-ink-950 hover:bg-zinc-200",
      },
      size: {
        default: "px-4 py-2.5",
        sm: "px-3 py-2 text-[12.5px]",
        icon: "w-7 h-7 rounded-md p-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
