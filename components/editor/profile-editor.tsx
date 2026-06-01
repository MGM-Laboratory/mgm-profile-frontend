"use client";

import { motion } from "motion/react";

import { BasicsCard } from "@/components/editor/basics-card";
import { IdentityCard } from "@/components/editor/identity-card";
import { PrivacyCard } from "@/components/editor/privacy-card";
import {
  CertificationSection,
  EducationSection,
  ExperienceSection,
  LanguageSection,
  OrganizationSection,
  SocialLinkSection,
  VolunteeringSection,
} from "@/components/editor/sections";
import { SkillsEditor } from "@/components/editor/skills-editor";
import { TechStackPicker } from "@/components/editor/tech-stack-picker";
import { WorkHoursGrid } from "@/components/editor/work-hours-grid";
import { useReplaceSection } from "@/lib/hooks";
import {
  toCertificationInput,
  toEducationInput,
  toExperienceInput,
  toLanguageInput,
  toOrganizationInput,
  toSocialLinkInput,
  toTechStackInput,
  toVolunteeringInput,
} from "@/lib/mappers";
import type {
  CertificationInput,
  EducationInput,
  ExperienceInput,
  LanguageInput,
  OrganizationInput,
  SocialLinkInput,
  VolunteeringInput,
} from "@/lib/schemas";
import type { Me, TechStackItem, WorkHour } from "@/lib/types";

type Picked = Pick<TechStackItem, "domain" | "name" | "proficiency">;

// The full LinkedIn-style profile editor (plan §5). Each card/section persists
// independently through the optimistic mutation hooks.
export function ProfileEditor({ me }: { me: Me }) {
  const profile = me.profile;

  const experiences = useReplaceSection<ExperienceInput>("experiences");
  const education = useReplaceSection<EducationInput>("education");
  const certifications = useReplaceSection<CertificationInput>("certifications");
  const volunteering = useReplaceSection<VolunteeringInput>("volunteering");
  const organizations = useReplaceSection<OrganizationInput>("organizations");
  const languages = useReplaceSection<LanguageInput>("languages");
  const socialLinks = useReplaceSection<SocialLinkInput>("socialLinks");
  const skills = useReplaceSection<{ name: string }>("skills");
  const techStack = useReplaceSection<Picked>("techStack");
  const workHours =
    useReplaceSection<Pick<WorkHour, "weekday" | "startMinutes" | "endMinutes">>("workHours");

  const card = (i: number, node: React.ReactNode) => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.2), ease: [0.22, 1, 0.36, 1] }}
    >
      {node}
    </motion.div>
  );

  return (
    <div className="flex flex-col gap-6">
      {card(0, <BasicsCard me={me} />)}
      {card(1, <IdentityCard identity={me.identity} />)}

      {card(
        2,
        <ExperienceSection
          items={(profile?.experiences ?? []).map(toExperienceInput)}
          onChange={(v) => experiences.mutate(v)}
          saving={experiences.isPending}
        />,
      )}
      {card(
        3,
        <EducationSection
          items={(profile?.education ?? []).map(toEducationInput)}
          onChange={(v) => education.mutate(v)}
          saving={education.isPending}
        />,
      )}
      {card(
        4,
        <CertificationSection
          items={(profile?.certifications ?? []).map(toCertificationInput)}
          onChange={(v) => certifications.mutate(v)}
          saving={certifications.isPending}
        />,
      )}
      {card(
        5,
        <VolunteeringSection
          items={(profile?.volunteering ?? []).map(toVolunteeringInput)}
          onChange={(v) => volunteering.mutate(v)}
          saving={volunteering.isPending}
        />,
      )}
      {card(
        6,
        <OrganizationSection
          items={(profile?.organizations ?? []).map(toOrganizationInput)}
          onChange={(v) => organizations.mutate(v)}
          saving={organizations.isPending}
        />,
      )}

      {card(
        7,
        <SkillsEditor
          value={(profile?.skills ?? []).map((s) => s.name)}
          onChange={(names) => skills.mutate(names.map((name) => ({ name })))}
          saving={skills.isPending}
        />,
      )}

      {card(
        8,
        <section className="border-line bg-surface shadow-1 rounded-lg border p-6">
          <header className="mb-4">
            <h2 className="font-display text-h3 text-ink">Tech stack</h2>
            <p className="text-caption text-ink-3 mt-0.5">
              Tools you use, grouped by domain, with proficiency.
            </p>
          </header>
          <TechStackPicker
            value={(profile?.techStack ?? []).map(toTechStackInput)}
            onChange={(items) => techStack.mutate(items)}
          />
        </section>,
      )}

      {card(
        9,
        <LanguageSection
          items={(profile?.languages ?? []).map(toLanguageInput)}
          onChange={(v) => languages.mutate(v)}
          saving={languages.isPending}
        />,
      )}

      {card(
        10,
        <section className="border-line bg-surface shadow-1 rounded-lg border p-6">
          <header className="mb-4">
            <h2 className="font-display text-h3 text-ink">Work hours</h2>
            <p className="text-caption text-ink-3 mt-0.5">
              When you&apos;re typically available (GMT+7).
            </p>
          </header>
          <WorkHoursGrid
            value={(profile?.workHours ?? []) as WorkHour[]}
            onChange={(items) =>
              workHours.mutate(
                items.map((w) => ({
                  weekday: w.weekday,
                  startMinutes: w.startMinutes,
                  endMinutes: w.endMinutes,
                })),
              )
            }
          />
        </section>,
      )}

      {card(
        11,
        <SocialLinkSection
          items={(profile?.socialLinks ?? []).map(toSocialLinkInput)}
          onChange={(v) => socialLinks.mutate(v)}
          saving={socialLinks.isPending}
        />,
      )}

      {card(12, <PrivacyCard privacy={profile?.privacy ?? null} />)}
    </div>
  );
}
