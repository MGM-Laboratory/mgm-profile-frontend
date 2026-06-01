import Image from "next/image";

import { cn } from "@/lib/cn";

// The MGM Laboratory mark. The source SVG lives in /public/brand/logo.svg.
export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/brand/logo.svg"
      alt="MGM Laboratory"
      width={size}
      height={size}
      priority
      className={cn("select-none", className)}
    />
  );
}
