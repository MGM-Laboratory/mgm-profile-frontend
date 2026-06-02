"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { useAdminUpdateCore } from "@/lib/admin-hooks";
import { DIVISIONS } from "@/lib/constants";
import { coreSchema, type CoreInput } from "@/lib/schemas";
import type { Profile } from "@/lib/types";

// AdminCoreForm sets a member's nickname/headline and assigns their division
// (division management, plan §8).
export function AdminCoreForm({ sub, profile }: { sub: string; profile: Profile | null }) {
  const mutation = useAdminUpdateCore(sub);
  const form = useForm<CoreInput>({
    resolver: zodResolver(coreSchema),
    defaultValues: {
      nickname: profile?.nickname ?? "",
      headline: profile?.headline ?? "",
      division: (profile?.division as CoreInput["division"]) || DIVISIONS[0],
    },
  });

  const submit = form.handleSubmit((values) => mutation.mutate(values));

  return (
    <section className="border-line bg-surface shadow-1 rounded-xl border p-6">
      <header className="mb-4">
        <h2 className="font-display text-h3 text-ink">Basics & division</h2>
        <p className="text-caption text-ink-3 mt-0.5">
          Nickname, headline, and division assignment.
        </p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit(e);
        }}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Nickname"
            htmlFor="nickname"
            error={form.formState.errors.nickname?.message}
          >
            <Input id="nickname" {...form.register("nickname")} />
          </Field>
          <Field
            label="Division"
            htmlFor="division"
            error={form.formState.errors.division?.message}
          >
            <Select id="division" {...form.register("division")}>
              {DIVISIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Headline" htmlFor="headline" error={form.formState.errors.headline?.message}>
          <Input
            id="headline"
            {...form.register("headline")}
            placeholder="e.g. Frontend engineer"
          />
        </Field>

        <div className="flex items-center justify-end gap-3">
          {mutation.isError && (
            <span className="text-caption text-brand-red">
              {(mutation.error as Error)?.message ?? "Save failed"}
            </span>
          )}
          {mutation.isSuccess && !form.formState.isDirty && (
            <span className="text-caption text-brand-green inline-flex items-center gap-1">
              <Check size={15} strokeWidth={2.25} /> Saved
            </span>
          )}
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && (
              <Loader2 className="animate-spin" size={16} strokeWidth={2.25} />
            )}
            Save basics
          </Button>
        </div>
      </form>
    </section>
  );
}
