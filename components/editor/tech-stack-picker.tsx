"use client";

import { Plus, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { TECH_PROFICIENCY, type TechProficiency } from "@/lib/constants";
import { TECH_DOMAINS, TECH_TAXONOMY } from "@/lib/taxonomy";
import type { TechStackItem } from "@/lib/types";
import { cn } from "@/lib/cn";

// Picker for the tech stack: choose from the grouped starter taxonomy or add a
// custom entry, each with a 4-level proficiency. Separate from skills (which
// have no proficiency). Emits TechStackItem[].

type Picked = Pick<TechStackItem, "domain" | "name" | "proficiency">;

const PROFICIENCY_TINT: Record<string, string> = {
  Beginner: "bg-surface-muted text-ink-2 border-line",
  Intermediate: "bg-brand-blue-50 text-brand-blue border-brand-blue/20",
  Advanced: "bg-brand-yellow-50 text-ink border-brand-yellow/40",
  Expert: "bg-brand-green-50 text-brand-green border-brand-green/30",
};

export function TechStackPicker({
  value,
  onChange,
}: {
  value: Picked[];
  onChange: (next: Picked[]) => void;
}) {
  const [domain, setDomain] = useState<string>(TECH_DOMAINS[0]);
  const [custom, setCustom] = useState("");

  const selectedNames = useMemo(() => new Set(value.map((v) => v.name.toLowerCase())), [value]);

  function add(name: string, dom: string) {
    const trimmed = name.trim();
    if (!trimmed || selectedNames.has(trimmed.toLowerCase())) return;
    onChange([...value, { domain: dom, name: trimmed, proficiency: "Intermediate" }]);
  }

  function remove(name: string) {
    onChange(value.filter((v) => v.name !== name));
  }

  function setProficiency(name: string, proficiency: TechProficiency) {
    onChange(value.map((v) => (v.name === name ? { ...v, proficiency } : v)));
  }

  const groupItems = TECH_TAXONOMY.find((g) => g.domain === domain)?.items ?? [];

  return (
    <div className="flex flex-col gap-4">
      {/* Selected items with proficiency controls. */}
      {value.length > 0 && (
        <ul className="flex flex-col gap-2">
          {value.map((item) => (
            <li
              key={item.name}
              className="border-line bg-surface flex items-center justify-between gap-3 rounded-md border px-3 py-2"
            >
              <div className="flex min-w-0 flex-col">
                <span className="text-body-sm text-ink truncate">{item.name}</span>
                <span className="text-caption text-ink-4">{item.domain}</span>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  aria-label={`${item.name} proficiency`}
                  value={item.proficiency}
                  onChange={(e) => setProficiency(item.name, e.target.value as TechProficiency)}
                  className="text-caption h-8 w-40"
                >
                  {TECH_PROFICIENCY.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
                <span
                  aria-hidden
                  className={cn(
                    "hidden h-2 w-2 rounded-full sm:block",
                    PROFICIENCY_TINT[item.proficiency],
                  )}
                />
                <button
                  type="button"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => remove(item.name)}
                  className="text-ink-3 hover:bg-surface-muted hover:text-brand-red rounded-md p-1 transition-colors duration-150"
                >
                  <X size={16} strokeWidth={2.25} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Browse the taxonomy by domain. */}
      <div className="border-line bg-surface-muted rounded-md border p-3">
        <Select
          aria-label="Tech domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="mb-3"
        >
          {TECH_DOMAINS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Select>
        <div className="flex flex-wrap gap-2">
          {groupItems.map((name) => {
            const picked = selectedNames.has(name.toLowerCase());
            return (
              <button
                key={name}
                type="button"
                disabled={picked}
                onClick={() => add(name, domain)}
                className={cn(
                  "text-caption ease-out-soft rounded-full border px-3 py-1 transition-colors duration-150",
                  picked
                    ? "border-line bg-surface text-ink-4 cursor-default"
                    : "border-line bg-surface text-ink-2 hover:border-brand-blue hover:text-brand-blue cursor-pointer",
                )}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom entry. */}
      <div className="flex items-end gap-2">
        <Input
          aria-label="Add custom technology"
          placeholder="Add something not listed…"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(custom, domain);
              setCustom("");
            }
          }}
        />
        <Button
          variant="secondary"
          onClick={() => {
            add(custom, domain);
            setCustom("");
          }}
        >
          <Plus size={16} strokeWidth={2.25} /> Add
        </Button>
      </div>
    </div>
  );
}
