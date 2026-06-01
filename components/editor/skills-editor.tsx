"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";

// Simple tag list for skills (plan §4.5): no proficiency, no endorsements.
export function SkillsEditor({
  value,
  onChange,
  saving,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  saving?: boolean;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const t = draft.trim();
    if (!t || value.some((s) => s.toLowerCase() === t.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...value, t]);
    setDraft("");
  }

  return (
    <section className="border-line bg-surface shadow-1 rounded-lg border p-6">
      <header className="mb-4">
        <h2 className="font-display text-h3 text-ink">Skills</h2>
        <p className="text-caption text-ink-3 mt-0.5">A simple list of what you do.</p>
      </header>

      {value.length > 0 && (
        <ul className="mb-4 flex flex-wrap gap-2">
          {value.map((skill) => (
            <li
              key={skill}
              className="border-line bg-surface-muted text-body-sm text-ink-2 flex items-center gap-1.5 rounded-full border py-1 pr-1.5 pl-3"
            >
              {skill}
              <button
                type="button"
                aria-label={`Remove ${skill}`}
                disabled={saving}
                onClick={() => onChange(value.filter((s) => s !== skill))}
                className="text-ink-3 hover:bg-surface hover:text-brand-red rounded-full p-0.5 transition-colors duration-150"
              >
                <X size={14} strokeWidth={2.25} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-end gap-2">
        <Input
          aria-label="Add a skill"
          placeholder="e.g. Project management"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button variant="secondary" onClick={add} disabled={saving}>
          <Plus size={16} strokeWidth={2.25} /> Add
        </Button>
      </div>
    </section>
  );
}
