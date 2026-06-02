"use client";

import { Eye, EyeOff, Loader2, Star } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { useAdminUpdateFlags } from "@/lib/admin-hooks";

// FlagsPanel toggles a member's directory visibility (hidden) and prominence
// (featured). Each toggle writes immediately.
export function FlagsPanel({
  sub,
  hidden,
  featured,
}: {
  sub: string;
  hidden: boolean;
  featured: boolean;
}) {
  const mutation = useAdminUpdateFlags(sub);

  const set = (next: { hidden?: boolean; featured?: boolean }) =>
    mutation.mutate({ hidden, featured, ...next });

  return (
    <section className="border-line bg-surface shadow-1 rounded-xl border p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-h4 text-ink">Directory</h2>
        {mutation.isPending && (
          <Loader2 className="text-ink-4 animate-spin" size={16} strokeWidth={2.25} />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <FlagRow
          icon={<Star size={16} strokeWidth={2.25} />}
          title="Featured"
          desc="Surface this member at the top of the public directory."
          checked={featured}
          onChange={(v) => set({ featured: v })}
          disabled={mutation.isPending}
        />
        <FlagRow
          icon={
            hidden ? <EyeOff size={16} strokeWidth={2.25} /> : <Eye size={16} strokeWidth={2.25} />
          }
          title="Hidden"
          desc="Remove from the public directory and profile pages."
          checked={hidden}
          onChange={(v) => set({ hidden: v })}
          disabled={mutation.isPending}
          danger
        />
      </div>

      {mutation.isError && (
        <p className="text-caption text-brand-red mt-3">
          {(mutation.error as Error)?.message ?? "Could not update flags"}
        </p>
      )}
    </section>
  );
}

function FlagRow({
  icon,
  title,
  desc,
  checked,
  onChange,
  disabled,
  danger,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-2.5">
        <span className={danger && checked ? "text-brand-red mt-0.5" : "text-ink-3 mt-0.5"}>
          {icon}
        </span>
        <div>
          <p className="text-body-sm text-ink font-medium">{title}</p>
          <p className="text-caption text-ink-3 mt-0.5">{desc}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}
