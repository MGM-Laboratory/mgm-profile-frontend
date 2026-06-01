"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm, type DefaultValues, type UseFormReturn } from "react-hook-form";
import type { ZodType } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/cn";

export interface SectionSummary {
  primary: string;
  secondary?: string;
}

// RepeatableSection renders a card for one repeatable profile section
// (experience, education, …): an ordered list with reorder/edit/delete, plus an
// add/edit dialog whose body is a RHF form validated by the section's Zod schema.
export function RepeatableSection<TForm extends Record<string, unknown>>({
  title,
  description,
  addLabel,
  items,
  onChange,
  schema,
  emptyValue,
  summary,
  renderFields,
  saving,
}: {
  title: string;
  description?: string;
  addLabel: string;
  items: TForm[];
  onChange: (next: TForm[]) => void;
  schema: ZodType<TForm>;
  emptyValue: TForm;
  summary: (item: TForm) => SectionSummary;
  renderFields: (form: UseFormReturn<TForm>) => React.ReactNode;
  saving?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm<TForm>({
    // zod v4's inferred input type doesn't line up with RHF's generic FieldValues
    // under a parametric schema; the schema is ZodType<TForm>, so this is sound.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: emptyValue as DefaultValues<TForm>,
  });

  function openAdd() {
    setEditingIndex(null);
    form.reset(emptyValue as DefaultValues<TForm>);
    setOpen(true);
  }

  function openEdit(index: number) {
    setEditingIndex(index);
    form.reset(items[index] as DefaultValues<TForm>);
    setOpen(true);
  }

  const submit = form.handleSubmit((values) => {
    const next = [...items];
    if (editingIndex === null) next.push(values);
    else next[editingIndex] = values;
    onChange(next);
    setOpen(false);
  });

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <section className="border-line bg-surface shadow-1 rounded-lg border p-6">
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-h3 text-ink">{title}</h2>
          {description && <p className="text-caption text-ink-3 mt-0.5">{description}</p>}
        </div>
        <Button variant="secondary" size="sm" onClick={openAdd}>
          <Plus size={16} strokeWidth={2.25} /> {addLabel}
        </Button>
      </header>

      {items.length === 0 ? (
        <p className="text-body-sm text-ink-4 border-line rounded-md border border-dashed px-4 py-6 text-center">
          Nothing here yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {items.map((item, index) => {
              const s = summary(item);
              return (
                <motion.li
                  key={index}
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="border-line bg-surface flex items-center justify-between gap-3 rounded-md border px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-body-sm text-ink truncate font-medium">
                      {s.primary || "Untitled"}
                    </p>
                    {s.secondary && (
                      <p className="text-caption text-ink-3 truncate">{s.secondary}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <IconButton
                      label="Move up"
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                    >
                      <ChevronUp size={16} strokeWidth={2.25} />
                    </IconButton>
                    <IconButton
                      label="Move down"
                      disabled={index === items.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      <ChevronDown size={16} strokeWidth={2.25} />
                    </IconButton>
                    <IconButton label="Edit" onClick={() => openEdit(index)}>
                      <Pencil size={15} strokeWidth={2.25} />
                    </IconButton>
                    <IconButton label="Delete" danger onClick={() => remove(index)}>
                      <Trash2 size={15} strokeWidth={2.25} />
                    </IconButton>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={editingIndex === null ? `Add ${title.toLowerCase()}` : `Edit ${title.toLowerCase()}`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit(e);
          }}
          className="flex flex-col gap-4"
        >
          {renderFields(form)}
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              Save
            </Button>
          </div>
        </form>
      </Dialog>
    </section>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-md transition-colors duration-150 disabled:opacity-30",
        danger
          ? "text-ink-3 hover:bg-brand-red-50 hover:text-brand-red"
          : "text-ink-3 hover:bg-surface-muted hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
