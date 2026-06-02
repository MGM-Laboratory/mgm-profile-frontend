"use client";

import { ShieldCheck } from "lucide-react";

import { DivisionsPanel } from "@/components/admin/divisions-panel";
import { UserList } from "@/components/admin/user-list";

// Admin console home: the searchable member list with a divisions overview.
export default function AdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <span className="text-eyebrow text-ink-3 inline-flex items-center gap-1.5 uppercase">
          <ShieldCheck size={14} strokeWidth={2.25} /> Admin console
        </span>
        <h1 className="font-display text-display-lg text-ink">Members</h1>
        <p className="text-body-sm text-ink-3">
          Search every member, force-edit profiles, manage divisions, and control directory
          visibility.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_18rem]">
        <UserList />
        <DivisionsPanel />
      </div>
    </div>
  );
}
