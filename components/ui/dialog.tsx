"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/cn";

// Modal dialog used for add/edit forms of repeatable sections and image crop.
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="data-[state=open]:animate-in bg-ink/30 fixed inset-0 z-40 backdrop-blur-sm" />
        <RadixDialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[min(92vw,640px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto",
            "border-line bg-surface shadow-3 rounded-xl border p-6",
            className,
          )}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <RadixDialog.Title className="font-display text-h3 text-ink">
                {title}
              </RadixDialog.Title>
              {description && (
                <RadixDialog.Description className="text-body-sm text-ink-3">
                  {description}
                </RadixDialog.Description>
              )}
            </div>
            <RadixDialog.Close
              aria-label="Close"
              className="text-ink-3 hover:bg-surface-muted hover:text-ink rounded-md p-1 transition-colors duration-200"
            >
              <X size={18} strokeWidth={2.25} />
            </RadixDialog.Close>
          </div>
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
