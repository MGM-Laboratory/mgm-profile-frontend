"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { MediaUploader } from "@/components/editor/media-uploader";
import { PatternGrid } from "@/components/pattern";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { DIVISIONS } from "@/lib/constants";
import { useCompleteOnboarding, useMe, useUpdateCore, useUpdateIdentity } from "@/lib/hooks";
import { coreSchema, identitySchema, type CoreInput, type IdentityInput } from "@/lib/schemas";

// Multi-step onboarding wizard shown to first-time members. Each step persists
// through the same mutation hooks as the editor; the final step marks
// onboarding complete and routes to the dashboard.

const STEPS = ["Welcome", "About you", "Division", "Photo", "Done"] as const;

export function OnboardingWizard() {
  const router = useRouter();
  const { data: me } = useMe();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);

  const updateIdentity = useUpdateIdentity();
  const updateCore = useUpdateCore();
  const complete = useCompleteOnboarding();

  const identityForm = useForm<Pick<IdentityInput, "firstName" | "lastName">>({
    resolver: zodResolver(identitySchema.pick({ firstName: true, lastName: true })),
    defaultValues: {
      firstName: me?.identity.firstName ?? "",
      lastName: me?.identity.lastName ?? "",
    },
  });
  const coreForm = useForm<Pick<CoreInput, "headline" | "division">>({
    resolver: zodResolver(coreSchema.pick({ headline: true, division: true })),
    defaultValues: {
      headline: me?.profile?.headline ?? "",
      division: (me?.profile?.division as CoreInput["division"]) || DIVISIONS[0],
    },
  });

  function go(next: number) {
    setDir(next > step ? 1 : -1);
    setStep(next);
  }

  async function next() {
    if (step === 1) {
      const ok = await identityForm.trigger();
      if (!ok) return;
      const v = identityForm.getValues();
      await updateIdentity.mutateAsync({
        firstName: v.firstName,
        lastName: v.lastName,
        personalEmail: me?.identity.personalEmail ?? "",
        phone: me?.identity.phone ?? "",
        bio: me?.identity.bio ?? "",
        website: me?.identity.website ?? "",
        portfolio: me?.identity.portfolio ?? "",
        linkedin: me?.identity.linkedin ?? "",
        github: me?.identity.github ?? "",
      });
    }
    if (step === 2) {
      const ok = await coreForm.trigger();
      if (!ok) return;
      const v = coreForm.getValues();
      await updateCore.mutateAsync({
        nickname: me?.profile?.nickname ?? "",
        headline: v.headline,
        division: v.division,
      });
    }
    go(step + 1);
  }

  async function finish() {
    await complete.mutateAsync();
    router.replace("/dashboard");
  }

  const busy = updateIdentity.isPending || updateCore.isPending || complete.isPending;

  return (
    <main className="relative mx-auto flex min-h-[80vh] w-full max-w-2xl flex-col px-6 py-12">
      <PatternGrid
        cols={5}
        rows={5}
        seed={23}
        tile={48}
        className="pointer-events-none absolute -top-6 -right-6 -z-10 opacity-[0.05]"
      />

      {/* Progress */}
      <ol className="mb-10 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col gap-1.5">
            <span
              className={
                "h-1 rounded-full transition-colors duration-300 " +
                (i <= step ? "bg-brand-blue" : "bg-line")
              }
            />
            <span className={"text-caption " + (i === step ? "text-ink" : "text-ink-4")}>
              {label}
            </span>
          </li>
        ))}
      </ol>

      <div className="relative flex-1">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -24 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 0 && (
              <div className="flex flex-col gap-4">
                <Sparkles className="text-brand-yellow" size={28} strokeWidth={2.25} />
                <h1 className="font-display text-display-lg text-ink">Welcome to MGM Profile</h1>
                <p className="text-body text-ink-2 prose-measure">
                  Let&apos;s set up your member profile. It takes a minute — you can refine
                  everything later.
                </p>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-4">
                <h1 className="font-display text-h1 text-ink">About you</h1>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="First name"
                    htmlFor="firstName"
                    required
                    error={identityForm.formState.errors.firstName?.message}
                  >
                    <Input id="firstName" {...identityForm.register("firstName")} />
                  </Field>
                  <Field
                    label="Last name"
                    htmlFor="lastName"
                    error={identityForm.formState.errors.lastName?.message}
                  >
                    <Input id="lastName" {...identityForm.register("lastName")} />
                  </Field>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-4">
                <h1 className="font-display text-h1 text-ink">Your division & headline</h1>
                <Field
                  label="Division"
                  htmlFor="division"
                  error={coreForm.formState.errors.division?.message}
                >
                  <Select id="division" {...coreForm.register("division")}>
                    {DIVISIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field
                  label="Headline"
                  htmlFor="headline"
                  hint="A short line under your name."
                  error={coreForm.formState.errors.headline?.message}
                >
                  <Input
                    id="headline"
                    placeholder="e.g. Mobile developer"
                    {...coreForm.register("headline")}
                  />
                </Field>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-4">
                <h1 className="font-display text-h1 text-ink">Add a photo</h1>
                <p className="text-body-sm text-ink-3">
                  Optional — you can add or change it anytime.
                </p>
                <MediaUploader
                  kind="avatar"
                  sub={me?.sub}
                  stableUrl={
                    me?.identity.picture ||
                    (me?.sub
                      ? `${(process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1").replace(/\/$/, "")}/users/${me.sub}/avatar`
                      : null)
                  }
                />
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col gap-4">
                <Check className="text-brand-green" size={28} strokeWidth={2.25} />
                <h1 className="font-display text-display-lg text-ink">You&apos;re all set</h1>
                <p className="text-body text-ink-2 prose-measure">
                  Your profile is ready. Head to the dashboard to add experience, skills, your tech
                  stack, and more.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => go(Math.max(0, step - 1))}
          disabled={step === 0 || busy}
        >
          <ArrowLeft size={16} strokeWidth={2.25} /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={next} disabled={busy}>
            {busy ? <Loader2 className="animate-spin" size={16} strokeWidth={2.25} /> : null}
            Continue <ArrowRight size={16} strokeWidth={2.25} />
          </Button>
        ) : (
          <Button onClick={finish} disabled={busy}>
            {busy ? <Loader2 className="animate-spin" size={16} strokeWidth={2.25} /> : null}
            Go to dashboard
          </Button>
        )}
      </div>
    </main>
  );
}
