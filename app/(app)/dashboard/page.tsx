"use client";

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

import { PatternGrid } from "@/components/pattern";
import { useMe } from "@/lib/hooks";

// Private dashboard. In Phase 5A this is the authenticated landing that proves
// the auth + proxy + query stack end-to-end; Phase 5B replaces the body with the
// full LinkedIn-style editor.
export default function DashboardPage() {
  const { data: me, isLoading, isError, error } = useMe();

  if (isLoading) {
    return (
      <div className="text-ink-3 flex items-center gap-2 py-20">
        <Loader2 className="animate-spin" size={18} strokeWidth={2.25} />
        <span className="text-body-sm">Loading your profile…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border-line bg-surface flex items-start gap-3 rounded-lg border p-5">
        <AlertCircle className="text-brand-red mt-0.5 shrink-0" size={20} strokeWidth={2.25} />
        <div>
          <p className="text-body-sm text-ink font-medium">Couldn&apos;t load your profile</p>
          <p className="text-caption text-ink-3 mt-1">{(error as Error)?.message}</p>
        </div>
      </div>
    );
  }

  const name =
    [me?.identity.firstName, me?.identity.lastName].filter(Boolean).join(" ") ||
    me?.identity.username;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-eyebrow text-ink-3 uppercase">My profile</span>
          <h1 className="font-display text-display-lg text-ink">{name}</h1>
          {me?.profile?.headline && <p className="text-body text-ink-2">{me.profile.headline}</p>}
        </div>
        <PatternGrid
          cols={3}
          rows={3}
          seed={5}
          tile={28}
          className="hidden overflow-hidden rounded-md opacity-80 sm:block"
        />
      </header>

      <div
        className={
          "flex items-center gap-3 rounded-lg border p-4 " +
          (me?.onboarding.completed
            ? "border-brand-green/30 bg-brand-green-50"
            : "border-brand-yellow/40 bg-brand-yellow-50")
        }
      >
        {me?.onboarding.completed ? (
          <CheckCircle2 className="text-brand-green" size={20} strokeWidth={2.25} />
        ) : (
          <AlertCircle className="text-ink" size={20} strokeWidth={2.25} />
        )}
        <p className="text-body-sm text-ink">
          {me?.onboarding.completed
            ? "Your profile is set up. The full editor arrives next."
            : "Finish onboarding to publish your profile. The wizard arrives next."}
        </p>
      </div>

      <dl className="border-line bg-line grid grid-cols-1 gap-px overflow-hidden rounded-lg border sm:grid-cols-2">
        <Cell label="Lab email" value={me?.identity.labEmail} />
        <Cell label="NIM" value={me?.identity.nim} />
        <Cell label="Division" value={me?.profile?.division} />
        <Cell label="Nickname" value={me?.profile?.nickname} />
      </dl>
    </div>
  );
}

function Cell({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="bg-surface px-5 py-4">
      <dt className="text-caption text-ink-3">{label}</dt>
      <dd className="text-body-sm text-ink mt-0.5">
        {value || <span className="text-ink-4">—</span>}
      </dd>
    </div>
  );
}
