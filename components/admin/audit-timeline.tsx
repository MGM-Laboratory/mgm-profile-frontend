"use client";

import { History, Loader2 } from "lucide-react";

import { useAdminUserAudit } from "@/lib/admin-hooks";
import type { AuditEntry } from "@/lib/admin-types";

// Human-readable labels for the backend audit actions.
const ACTION_LABELS: Record<string, string> = {
  update_identity: "Updated identity",
  update_core: "Updated profile basics",
  update_privacy: "Updated privacy",
  complete_onboarding: "Completed onboarding",
  admin_update_identity: "Admin edited identity",
  admin_update_core: "Admin edited basics",
  admin_set_flags: "Admin changed directory flags",
};
const SECTION_PREFIX = "replace_";

function label(entry: AuditEntry): string {
  if (ACTION_LABELS[entry.action]) return ACTION_LABELS[entry.action];
  if (entry.action.startsWith(SECTION_PREFIX)) {
    return `Updated ${entry.action.slice(SECTION_PREFIX.length).replace(/_/g, " ")}`;
  }
  return entry.action.replace(/_/g, " ");
}

function when(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// AuditTimeline renders a member's change log, newest first, attributing each
// change to the actor (the member themselves or an admin).
export function AuditTimeline({ sub, selfSub }: { sub: string; selfSub: string }) {
  const { data, isLoading } = useAdminUserAudit(sub);
  const entries = data?.entries ?? [];

  return (
    <section className="border-line bg-surface shadow-1 rounded-xl border p-5">
      <h2 className="font-display text-h4 text-ink mb-4 flex items-center gap-2">
        <History className="text-ink-3" size={18} strokeWidth={2.25} />
        Activity
      </h2>

      {isLoading ? (
        <div className="text-ink-3 flex items-center gap-2 py-6">
          <Loader2 className="animate-spin" size={16} strokeWidth={2.25} />
          <span className="text-caption">Loading…</span>
        </div>
      ) : entries.length === 0 ? (
        <p className="text-caption text-ink-3 py-2">No recorded activity yet.</p>
      ) : (
        <ol className="relative flex flex-col gap-4 pl-4">
          <span className="bg-line absolute top-1 bottom-1 left-[3px] w-px" aria-hidden />
          {entries.map((e) => {
            const byAdmin = e.actorSub !== selfSub && e.action.startsWith("admin_");
            return (
              <li key={e.id} className="relative">
                <span
                  className={`absolute top-1 -left-4 h-1.5 w-1.5 rounded-full ${byAdmin ? "bg-brand-blue" : "bg-line-strong"}`}
                  aria-hidden
                />
                <p className="text-body-sm text-ink">{label(e)}</p>
                <p className="text-caption text-ink-3 mt-0.5">
                  {byAdmin ? "by an admin" : "by the member"}
                  {e.newValue ? ` · ${e.newValue}` : ""}
                  {" · "}
                  {when(e.createdAt)}
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
