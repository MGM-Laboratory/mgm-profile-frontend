"use client";

import { AlertCircle, ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { use } from "react";

import { AdminCoreForm } from "@/components/admin/admin-core-form";
import { AdminIdentityForm } from "@/components/admin/admin-identity-form";
import { AuditTimeline } from "@/components/admin/audit-timeline";
import { FlagsPanel } from "@/components/admin/flags-panel";
import { StatusChip } from "@/components/admin/status-chip";
import { Avatar } from "@/components/public/avatar";
import { useAdminUser } from "@/lib/admin-hooks";

// Admin force-edit page for a single member: identity (incl. lab email + NIM),
// basics & division, directory flags, and the change log.
export default function AdminUserPage({ params }: { params: Promise<{ sub: string }> }) {
  const { sub } = use(params);
  const { data, isLoading, isError, error } = useAdminUser(sub);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin"
        className="text-caption text-ink-3 hover:text-ink inline-flex w-fit items-center gap-1 transition-colors duration-200"
      >
        <ArrowLeft size={14} strokeWidth={2.25} /> All members
      </Link>

      {isLoading ? (
        <div className="text-ink-3 flex items-center gap-2 py-20">
          <Loader2 className="animate-spin" size={18} strokeWidth={2.25} />
          <span className="text-body-sm">Loading member…</span>
        </div>
      ) : isError || !data ? (
        <div className="border-line bg-surface flex items-start gap-3 rounded-lg border p-5">
          <AlertCircle className="text-brand-red mt-0.5 shrink-0" size={20} strokeWidth={2.25} />
          <div>
            <p className="text-body-sm text-ink font-medium">Couldn&apos;t load this member</p>
            <p className="text-caption text-ink-3 mt-1">{(error as Error)?.message}</p>
          </div>
        </div>
      ) : (
        <MemberEditor sub={sub} data={data} />
      )}
    </div>
  );
}

function MemberEditor({
  sub,
  data,
}: {
  sub: string;
  data: NonNullable<ReturnType<typeof useAdminUser>["data"]>;
}) {
  const { member, hidden, featured } = data;
  const { identity } = member;
  const name =
    [identity.firstName, identity.lastName].filter(Boolean).join(" ") || identity.username;

  return (
    <>
      <header className="border-line bg-surface shadow-1 flex flex-wrap items-center gap-4 rounded-xl border p-5">
        <Avatar src={identity.picture} name={name} size={56} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-h2 text-ink truncate">{name}</h1>
            {featured && <StatusChip tone="blue">Featured</StatusChip>}
            {hidden && <StatusChip tone="red">Hidden</StatusChip>}
            {!member.onboarding.completed && <StatusChip tone="yellow">Pending</StatusChip>}
          </div>
          <p className="text-caption text-ink-3 mt-0.5">
            @{identity.username} · {identity.labEmail}
          </p>
        </div>
        {member.slug && (
          <Link
            href={`/${member.slug}`}
            className="text-caption text-brand-blue inline-flex items-center gap-1 hover:underline"
          >
            View public profile <ExternalLink size={14} strokeWidth={2.25} />
          </Link>
        )}
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-6">
          <AdminIdentityForm sub={sub} identity={identity} />
          <AdminCoreForm sub={sub} profile={member.profile} />
        </div>
        <div className="flex flex-col gap-6">
          <FlagsPanel sub={sub} hidden={hidden} featured={featured} />
          <AuditTimeline sub={sub} selfSub={sub} />
        </div>
      </div>
    </>
  );
}
