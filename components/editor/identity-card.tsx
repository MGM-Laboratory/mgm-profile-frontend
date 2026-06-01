"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { BioEditor } from "@/components/editor/bio-editor";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { useUpdateIdentity } from "@/lib/hooks";
import { identitySchema, type IdentityInput } from "@/lib/schemas";
import type { Identity } from "@/lib/types";

// Keycloak-owned, user-editable identity + contact (plan §4.1). Submits the
// whole set via write-back; lab email and NIM are shown read-only.
export function IdentityCard({ identity }: { identity: Identity }) {
  const mutation = useUpdateIdentity();
  const form = useForm<IdentityInput>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      firstName: identity.firstName,
      lastName: identity.lastName,
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
    <section className="border-line bg-surface shadow-1 rounded-lg border p-6">
      <header className="mb-4">
        <h2 className="font-display text-h3 text-ink">Identity & contact</h2>
        <p className="text-caption text-ink-3 mt-0.5">
          Synced with Keycloak. Lab email and NIM are managed by admins.
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
          <Field label="Lab email">
            <Input value={identity.labEmail} disabled />
          </Field>
          <Field label="NIM">
            <Input value={identity.nim} disabled />
          </Field>
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
          {mutation.isSuccess && !form.formState.isDirty && (
            <span className="text-caption text-brand-green inline-flex items-center gap-1">
              <Check size={15} strokeWidth={2.25} /> Saved
            </span>
          )}
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && (
              <Loader2 className="animate-spin" size={16} strokeWidth={2.25} />
            )}
            Save changes
          </Button>
        </div>
      </form>
    </section>
  );
}
