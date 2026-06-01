"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { MediaUploader } from "@/components/editor/media-uploader";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { DIVISIONS } from "@/lib/constants";
import { useUpdateCore } from "@/lib/hooks";
import { coreSchema, type CoreInput } from "@/lib/schemas";
import type { Me } from "@/lib/types";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1").replace(
  /\/$/,
  "",
);
const mediaUrl = (sub: string, kind: "avatar" | "banner") => `${API_BASE}/users/${sub}/${kind}`;

// Profile basics (Postgres-owned): nickname, headline, division + avatar/banner.
export function BasicsCard({ me }: { me: Me }) {
  const mutation = useUpdateCore();
  const sub = me.sub;
  const form = useForm<CoreInput>({
    resolver: zodResolver(coreSchema),
    defaultValues: {
      nickname: me.profile?.nickname ?? "",
      headline: me.profile?.headline ?? "",
      division: (me.profile?.division as CoreInput["division"]) || DIVISIONS[0],
    },
  });

  const submit = form.handleSubmit((values) => mutation.mutate(values));

  return (
    <section className="border-line bg-surface shadow-1 overflow-hidden rounded-lg border">
      <div className="bg-surface-muted relative">
        <MediaUploader kind="banner" sub={sub} stableUrl={sub ? mediaUrl(sub, "banner") : null} />
        <div className="absolute -bottom-10 left-6">
          <MediaUploader
            kind="avatar"
            sub={sub}
            stableUrl={me.identity.picture || (sub ? mediaUrl(sub, "avatar") : null)}
          />
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit(e);
        }}
        className="flex flex-col gap-4 px-6 pt-14 pb-6"
      >
        <h2 className="font-display text-h3 text-ink">Profile basics</h2>
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
        <Field
          label="Headline"
          htmlFor="headline"
          hint="A short line under your name."
          error={form.formState.errors.headline?.message}
        >
          <Input
            id="headline"
            placeholder="e.g. Frontend engineer & design-systems nerd"
            {...form.register("headline")}
          />
        </Field>

        <div className="flex items-center justify-end gap-3">
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
