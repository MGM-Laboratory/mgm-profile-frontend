"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, ShieldAlert } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { BioEditor } from "@/components/editor/bio-editor";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { useAdminUpdateIdentity } from "@/lib/admin-hooks";
import { adminIdentitySchema, type AdminIdentityFormInput } from "@/lib/schemas";
import type { Identity } from "@/lib/types";

// AdminIdentityForm force-edits the full Keycloak identity of any member,
// including the admin-only lab email and NIM (which are read-only to members).
export function AdminIdentityForm({ sub, identity }: { sub: string; identity: Identity }) {
  const mutation = useAdminUpdateIdentity(sub);
  const form = useForm<AdminIdentityFormInput>({
    resolver: zodResolver(adminIdentitySchema),
    defaultValues: {
      firstName: identity.firstName,
      lastName: identity.lastName,
      labEmail: identity.labEmail,
      nim: identity.nim,
      personalEmail: identity.personalEmail,
      phone: identity.phone,
      bio: identity.bio,
      website: identity.website,
      portfolio: identity.portfolio,
      linkedin: identity.linkedin,
      github: identity.github,
    },
  });

  const submit = form.handleSubmit((values) => mutation.mutate(values));

  return (
    <section className="border-line bg-surface shadow-1 rounded-xl border p-6">
      <header className="mb-4">
        <h2 className="font-display text-h3 text-ink">Identity & contact</h2>
        <p className="text-caption text-ink-3 mt-0.5">
          Written back to Keycloak. As an admin you can edit the lab email and NIM.
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
            label="First name"
            htmlFor="firstName"
            required
            error={form.formState.errors.firstName?.message}
          >
            <Input id="firstName" {...form.register("firstName")} />
          </Field>
          <Field
            label="Last name"
            htmlFor="lastName"
            error={form.formState.errors.lastName?.message}
          >
            <Input id="lastName" {...form.register("lastName")} />
          </Field>
        </div>

        {/* Admin-only, KC source-of-truth fields, visually set apart. */}
        <div className="border-brand-yellow-50 bg-brand-yellow-50/40 flex flex-col gap-4 rounded-lg border p-4">
          <p className="text-eyebrow text-ink-3 inline-flex items-center gap-1.5 uppercase">
            <ShieldAlert className="text-ink-3" size={14} strokeWidth={2.25} />
            Admin-only fields
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Lab email (@labmgm.org)"
              htmlFor="labEmail"
              error={form.formState.errors.labEmail?.message}
            >
              <Input id="labEmail" {...form.register("labEmail")} />
            </Field>
            <Field label="NIM" htmlFor="nim" error={form.formState.errors.nim?.message}>
              <Input id="nim" {...form.register("nim")} />
            </Field>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Personal email"
            htmlFor="personalEmail"
            error={form.formState.errors.personalEmail?.message}
          >
            <Input id="personalEmail" {...form.register("personalEmail")} />
          </Field>
          <Field label="Phone" htmlFor="phone" error={form.formState.errors.phone?.message}>
            <Input id="phone" {...form.register("phone")} />
          </Field>
        </div>

        <Controller
          control={form.control}
          name="bio"
          render={({ field }) => (
            <Field label="Bio">
              <BioEditor value={field.value} onChange={field.onChange} />
            </Field>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Personal website"
            htmlFor="website"
            error={form.formState.errors.website?.message}
          >
            <Input id="website" placeholder="https://" {...form.register("website")} />
          </Field>
          <Field
            label="Portfolio"
            htmlFor="portfolio"
            error={form.formState.errors.portfolio?.message}
          >
            <Input id="portfolio" placeholder="https://" {...form.register("portfolio")} />
          </Field>
          <Field
            label="LinkedIn"
            htmlFor="linkedin"
            error={form.formState.errors.linkedin?.message}
          >
            <Input id="linkedin" placeholder="https://" {...form.register("linkedin")} />
          </Field>
          <Field label="GitHub" htmlFor="github" error={form.formState.errors.github?.message}>
            <Input id="github" placeholder="https://" {...form.register("github")} />
          </Field>
        </div>

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
            Save identity
          </Button>
        </div>
      </form>
    </section>
  );
}
