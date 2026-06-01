"use client";

import * as RadixSwitch from "@radix-ui/react-switch";

import { cn } from "@/lib/cn";

// On/off toggle (privacy settings, "currently working", "does not expire").
export function Switch({
  checked,
  onCheckedChange,
  id,
  disabled,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  id?: string;
  disabled?: boolean;
}) {
  return (
    <RadixSwitch.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        "ease-out-soft relative h-6 w-10 cursor-pointer rounded-full transition-colors duration-200",
        "data-[state=unchecked]:bg-line-strong data-[state=checked]:bg-brand-green",
        "focus-visible:outline-focus focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      <RadixSwitch.Thumb
        className={cn(
          "shadow-1 block h-5 w-5 translate-x-0.5 rounded-full bg-white",
          "ease-out-soft transition-transform duration-200 data-[state=checked]:translate-x-[18px]",
        )}
      />
    </RadixSwitch.Root>
  );
}
