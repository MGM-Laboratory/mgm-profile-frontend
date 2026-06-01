"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";

// Avatar shows the member's image from the stable public endpoint, falling back
// to initials when no image exists (the endpoint 404s).
export function Avatar({
  src,
  name,
  size = 56,
  className,
}: {
  src: string;
  name: string;
  size?: number;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "·";

  if (!src || broken) {
    return (
      <span
        aria-hidden
        className={cn(
          "bg-brand-blue-50 text-brand-blue flex shrink-0 items-center justify-center rounded-full font-semibold",
          className,
        )}
        style={{ width: size, height: size, fontSize: size * 0.36 }}
      >
        {initials}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      onError={() => setBroken(true)}
      className={cn("bg-surface-muted shrink-0 rounded-full object-cover", className)}
      style={{ width: size, height: size }}
    />
  );
}
