// Zod schemas mirroring the backend write DTOs (plan §4). Used by React Hook
// Form in the editor (Phase 5B) and to validate mutation payloads. User content
// is never translated; these validate structure, not language.
import { z } from "zod";

import {
  DIVISIONS,
  EMPLOYMENT_TYPES,
  LANGUAGE_PROFICIENCY,
  LOCATION_TYPES,
  TECH_PROFICIENCY,
  VOLUNTEER_CAUSES,
} from "@/lib/constants";

const url = z.string().trim().url().max(512).or(z.literal(""));
const optionalYear = z.number().int().min(1950).max(2100).nullable().optional();
const optionalMonth = z.number().int().min(1).max(12).nullable().optional();

// Keycloak-owned, user-editable identity fields.
export const identitySchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(120),
  lastName: z.string().trim().max(120),
  personalEmail: z.string().trim().email().max(255).or(z.literal("")),
  phone: z.string().trim().max(32),
  bio: z.string().max(4000),
  website: url,
  portfolio: url,
  linkedin: url,
  github: url,
});
export type IdentityInput = z.infer<typeof identitySchema>;

// Admin force-edit identity: the editable fields PLUS the admin-only lab email
// (@labmgm.org) and NIM. Used by the admin console (plan §8).
export const adminIdentitySchema = identitySchema.extend({
  labEmail: z.string().trim().email("Must be a valid email").max(255).or(z.literal("")),
  nim: z.string().trim().max(32),
});
export type AdminIdentityFormInput = z.infer<typeof adminIdentitySchema>;

// Postgres-owned scalar profile fields.
export const coreSchema = z.object({
  nickname: z.string().trim().max(120),
  headline: z.string().trim().max(200),
  division: z.enum(DIVISIONS),
});
export type CoreInput = z.infer<typeof coreSchema>;

export const privacySchema = z.object({
  showLabEmail: z.boolean(),
  showWebsite: z.boolean(),
  showPortfolio: z.boolean(),
  showLinkedin: z.boolean(),
  showGithub: z.boolean(),
  showInstagram: z.boolean(),
  showLinks: z.boolean(),
  showPhone: z.boolean(),
  showPersonalEmail: z.boolean(),
});
export type PrivacyInput = z.infer<typeof privacySchema>;

export const experienceSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  employmentType: z.enum(EMPLOYMENT_TYPES).or(z.literal("")),
  company: z.string().trim().max(200),
  currentlyWorking: z.boolean().default(false),
  startMonth: optionalMonth,
  startYear: optionalYear,
  endMonth: optionalMonth,
  endYear: optionalYear,
  location: z.string().trim().max(200),
  locationType: z.enum(LOCATION_TYPES).or(z.literal("")),
  description: z.string().max(4000),
  skills: z.array(z.string().trim().max(100)).default([]),
});
export type ExperienceInput = z.infer<typeof experienceSchema>;

export const educationSchema = z.object({
  school: z.string().trim().min(1, "School is required").max(200),
  degree: z.string().trim().max(200),
  fieldOfStudy: z.string().trim().max(200),
  startYear: optionalYear,
  endYear: optionalYear,
  grade: z.string().trim().max(100),
  activitiesAndSocieties: z.string().max(2000),
  description: z.string().max(4000),
});
export type EducationInput = z.infer<typeof educationSchema>;

export const certificationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  issuingOrganization: z.string().trim().max(200),
  issueMonth: optionalMonth,
  issueYear: optionalYear,
  expirationMonth: optionalMonth,
  expirationYear: optionalYear,
  doesNotExpire: z.boolean().default(false),
  credentialId: z.string().trim().max(200),
  credentialUrl: url,
});
export type CertificationInput = z.infer<typeof certificationSchema>;

export const volunteeringSchema = z.object({
  organization: z.string().trim().min(1, "Organization is required").max(200),
  role: z.string().trim().max(200),
  cause: z.enum(VOLUNTEER_CAUSES).or(z.literal("")),
  startMonth: optionalMonth,
  startYear: optionalYear,
  endMonth: optionalMonth,
  endYear: optionalYear,
  currentlyActive: z.boolean().default(false),
  description: z.string().max(4000),
});
export type VolunteeringInput = z.infer<typeof volunteeringSchema>;

export const organizationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  role: z.string().trim().max(200),
  startMonth: optionalMonth,
  startYear: optionalYear,
  endMonth: optionalMonth,
  endYear: optionalYear,
  description: z.string().max(4000),
});
export type OrganizationInput = z.infer<typeof organizationSchema>;

export const skillSchema = z.object({ name: z.string().trim().min(1).max(100) });
export type SkillInput = z.infer<typeof skillSchema>;

export const languageSchema = z.object({
  language: z.string().trim().min(1, "Language is required").max(100),
  proficiency: z.enum(LANGUAGE_PROFICIENCY),
});
export type LanguageInput = z.infer<typeof languageSchema>;

export const techStackSchema = z.object({
  domain: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(100),
  proficiency: z.enum(TECH_PROFICIENCY),
});
export type TechStackInput = z.infer<typeof techStackSchema>;

export const workHourSchema = z
  .object({
    weekday: z.number().int().min(0).max(6),
    startMinutes: z.number().int().min(0).max(1440),
    endMinutes: z.number().int().min(0).max(1440),
  })
  .refine((v) => v.endMinutes > v.startMinutes, { message: "End must be after start" });
export type WorkHourInput = z.infer<typeof workHourSchema>;

export const socialLinkSchema = z.object({
  kind: z.string().trim().max(40),
  label: z.string().trim().max(100),
  url: url,
});
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
