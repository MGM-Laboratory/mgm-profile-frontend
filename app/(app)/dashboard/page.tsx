"use client";

import { AlertCircle, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ProfileEditor } from "@/components/editor/profile-editor";
import { useMe } from "@/lib/hooks";

// Private dashboard: the full profile editor. First-time members (onboarding
// incomplete) are routed to the wizard.
export default function DashboardPage() {
  const router = useRouter();
  const { data: me, isLoading, isError, error } = useMe();

  useEffect(() => {
    if (me && !me.onboarding.completed) {
      router.replace("/onboarding");
    }
  }, [me, router]);

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

  if (!me || !me.onboarding.completed) {
    return (
      <div className="text-ink-3 flex items-center gap-2 py-20">
        <Loader2 className="animate-spin" size={18} strokeWidth={2.25} />
        <span className="text-body-sm">Redirecting to onboarding…</span>
      </div>
    );
  }

  const name =
    [me.identity.firstName, me.identity.lastName].filter(Boolean).join(" ") || me.identity.username;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-eyebrow text-ink-3 uppercase">Edit profile</span>
          <h1 className="font-display text-display-lg text-ink">{name}</h1>
        </div>
        <Link
          href="/"
          className="text-caption text-brand-blue inline-flex items-center gap-1 hover:underline"
        >
          View directory <ExternalLink size={14} strokeWidth={2.25} />
        </Link>
      </header>
      <ProfileEditor me={me} />
    </div>
  );
}
