"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { CloseIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/** shadcn/ui Dialog —— 按 design.html 的 modal 样式定制 */
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

function DialogContent({
  className,
  children,
  hideDefaultClose,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { hideDefaultClose?: boolean }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm" />
      <DialogPrimitive.Content
        className={cn(
          "modal-in fixed left-1/2 top-1/2 z-[150] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-ink-700 bg-ink-850 shadow-card overflow-hidden",
          className,
        )}
        {...props}
      >
        {children}
        {!hideDefaultClose && (
          <DialogPrimitive.Close className="absolute right-5 top-5 w-4 h-4 text-ink-400 hover:text-white transition">
            <CloseIcon className="w-full h-full" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "px-6 py-5 border-b border-ink-700 flex items-center gap-3",
        className,
      )}
      {...props}
    />
  );
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-6", className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "px-6 py-4 border-t border-ink-700 flex items-center gap-3 bg-black/20",
        className,
      )}
      {...props}
    />
  );
}

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-[15px] font-semibold text-white", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-[13px] text-zinc-400 leading-relaxed", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
