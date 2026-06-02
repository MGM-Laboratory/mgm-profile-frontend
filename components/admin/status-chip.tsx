import { cn } from "@/lib/cn";

type Tone = "neutral" | "blue" | "green" | "yellow" | "red";

const tones: Record<Tone, string> = {
  neutral: "border-line bg-surface-muted text-ink-3",
  blue: "border-brand-blue-50 bg-brand-blue-50 text-brand-blue",
  green: "border-brand-green-50 bg-brand-green-50 text-brand-green",
  yellow: "border-brand-yellow-50 bg-brand-yellow-50 text-ink-2",
  red: "border-brand-red-50 bg-brand-red-50 text-brand-red",
};

// StatusChip is a small, uppercase status pill used across the admin console
// (featured / hidden / onboarded / disabled, etc.).
export function StatusChip({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-eyebrow inline-flex items-center gap-1 rounded-full border px-2 py-0.5 uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
