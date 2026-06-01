"use client";

import { Loader2 } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { useUpdatePrivacy } from "@/lib/hooks";
import type { PrivacyInput } from "@/lib/schemas";
import type { Privacy } from "@/lib/types";

// Per-field privacy toggles (plan §4.6). Always-public fields aren't listed.
// Toggling saves immediately (optimistic).
const ROWS: { key: keyof PrivacyInput; label: string; group: "contact" | "links" }[] = [
  { key: "showPhone", label: "Phone number", group: "contact" },
  { key: "showPersonalEmail", label: "Personal email", group: "contact" },
  { key: "showLabEmail", label: "Lab email", group: "contact" },
  { key: "showWebsite", label: "Personal website", group: "links" },
  { key: "showPortfolio", label: "Portfolio", group: "links" },
  { key: "showLinkedin", label: "LinkedIn", group: "links" },
  { key: "showGithub", label: "GitHub", group: "links" },
  { key: "showInstagram", label: "Instagram", group: "links" },
  { key: "showLinks", label: "Other links", group: "links" },
];

const DEFAULTS: PrivacyInput = {
  showLabEmail: true,
  showWebsite: true,
  showPortfolio: true,
  showLinkedin: true,
  showGithub: true,
  showInstagram: true,
  showLinks: true,
  showPhone: false,
  showPersonalEmail: false,
};

export function PrivacyCard({ privacy }: { privacy: Privacy | null }) {
  const mutation = useUpdatePrivacy();
  const current: PrivacyInput = { ...DEFAULTS, ...(privacy ?? {}) };

  function toggle(key: keyof PrivacyInput, value: boolean) {
    mutation.mutate({ ...current, [key]: value });
  }

  return (
    <section className="border-line bg-surface shadow-1 rounded-lg border p-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-h3 text-ink">Privacy</h2>
          <p className="text-caption text-ink-3 mt-0.5">
            Choose what&apos;s visible publicly. Your profile always appears in the directory.
          </p>
        </div>
        {mutation.isPending && (
          <Loader2 className="text-ink-3 animate-spin" size={16} strokeWidth={2.25} />
        )}
      </header>

      <ul className="divide-line divide-y">
        {ROWS.map((row) => (
          <li key={row.key} className="flex items-center justify-between py-3">
            <span className="text-body-sm text-ink-2">{row.label}</span>
            <Switch checked={current[row.key]} onCheckedChange={(v) => toggle(row.key, v)} />
          </li>
        ))}
      </ul>
    </section>
  );
}
