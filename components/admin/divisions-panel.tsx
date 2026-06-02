"use client";

import { Loader2 } from "lucide-react";

import { useAdminDivisions } from "@/lib/admin-hooks";

// DivisionsPanel shows the canonical divisions with live member counts — the
// admin's at-a-glance view of how the org is distributed.
export function DivisionsPanel() {
  const { data, isLoading } = useAdminDivisions();
  const divisions = data?.divisions ?? [];
  const max = divisions.reduce((m, d) => Math.max(m, d.count), 0) || 1;

  return (
    <aside className="border-line bg-surface shadow-1 rounded-xl border p-5">
      <h2 className="font-display text-h4 text-ink mb-4">Divisions</h2>
      {isLoading ? (
        <div className="text-ink-3 flex items-center gap-2 py-6">
          <Loader2 className="animate-spin" size={16} strokeWidth={2.25} />
          <span className="text-caption">Loading…</span>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {divisions.map((d) => (
            <li key={d.division || "unassigned"} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-caption text-ink-2 truncate">
                  {d.division || "Unassigned"}
                </span>
                <span className="text-caption text-ink-3 tabular-nums">{d.count}</span>
              </div>
              <div className="bg-surface-muted h-1.5 overflow-hidden rounded-full">
                <div
                  className="bg-brand-blue ease-out-soft h-full rounded-full transition-all duration-500"
                  style={{ width: `${(d.count / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
