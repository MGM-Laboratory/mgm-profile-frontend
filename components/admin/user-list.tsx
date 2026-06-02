"use client";

import { AlertCircle, ChevronRight, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Avatar } from "@/components/public/avatar";
import { StatusChip } from "@/components/admin/status-chip";
import { useAdminUsers } from "@/lib/admin-hooks";
import type { AdminUserCard } from "@/lib/admin-types";
import { Input } from "@/components/ui/field";

// UserList is the admin member directory: a searchable, status-rich table that
// links each row to the force-edit detail page.
export function UserList() {
  const [q, setQ] = useState("");
  const { data, isLoading, isError, error, isFetching } = useAdminUsers(q);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search
          className="text-ink-4 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
          size={16}
          strokeWidth={2.25}
        />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, username, or email…"
          className="pl-9"
          aria-label="Search members"
        />
        {isFetching && (
          <Loader2
            className="text-ink-4 absolute top-1/2 right-3 -translate-y-1/2 animate-spin"
            size={16}
            strokeWidth={2.25}
          />
        )}
      </div>

      {isError ? (
        <ErrorState message={(error as Error)?.message} />
      ) : isLoading ? (
        <LoadingState />
      ) : !data || data.users.length === 0 ? (
        <EmptyState query={q} />
      ) : (
        <div className="border-line bg-surface shadow-1 overflow-hidden rounded-xl border">
          <div className="border-line text-eyebrow text-ink-3 hidden grid-cols-[1fr_auto] gap-4 border-b px-5 py-2.5 uppercase sm:grid">
            <span>Member</span>
            <span>{data.total} total</span>
          </div>
          <ul>
            {data.users.map((u) => (
              <UserRow key={u.sub} user={u} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function UserRow({ user }: { user: AdminUserCard }) {
  return (
    <li className="border-line not-last:border-b">
      <Link
        href={`/admin/${user.sub}`}
        className="hover:bg-surface-muted group flex items-center gap-4 px-5 py-3.5 transition-colors duration-200"
      >
        <Avatar src={user.avatarUrl} name={user.name} size={40} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-body-sm text-ink truncate font-medium">{user.name}</span>
            <span className="text-caption text-ink-4">@{user.username}</span>
          </div>
          <div className="text-caption text-ink-3 mt-0.5 flex flex-wrap items-center gap-x-2">
            <span className="truncate">{user.labEmail}</span>
            {user.division && (
              <>
                <span aria-hidden>·</span>
                <span>{user.division}</span>
              </>
            )}
          </div>
        </div>
        <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
          {user.featured && <StatusChip tone="blue">Featured</StatusChip>}
          {user.hidden && <StatusChip tone="red">Hidden</StatusChip>}
          {!user.onboarded && <StatusChip tone="yellow">Pending</StatusChip>}
          {!user.enabled && <StatusChip tone="neutral">Disabled</StatusChip>}
        </div>
        <ChevronRight
          className="text-ink-4 group-hover:text-ink-2 shrink-0 transition-colors duration-200"
          size={18}
          strokeWidth={2.25}
        />
      </Link>
    </li>
  );
}

function LoadingState() {
  return (
    <div className="text-ink-3 flex items-center justify-center gap-2 py-16">
      <Loader2 className="animate-spin" size={18} strokeWidth={2.25} />
      <span className="text-body-sm">Loading members…</span>
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="border-line text-ink-3 rounded-xl border border-dashed py-16 text-center">
      <p className="text-body-sm">{query ? `No members match "${query}".` : "No members found."}</p>
    </div>
  );
}

function ErrorState({ message }: { message?: string }) {
  return (
    <div className="border-line bg-surface flex items-start gap-3 rounded-lg border p-5">
      <AlertCircle className="text-brand-red mt-0.5 shrink-0" size={20} strokeWidth={2.25} />
      <div>
        <p className="text-body-sm text-ink font-medium">Couldn&apos;t load members</p>
        <p className="text-caption text-ink-3 mt-1">{message}</p>
      </div>
    </div>
  );
}
