// Map API read shapes (lib/types) into the editor's input shapes (lib/schemas).
// The backend re-stamps id/position on replace, so those are dropped here.
import type {
  CertificationInput,
  EducationInput,
  ExperienceInput,
  LanguageInput,
  OrganizationInput,
  SocialLinkInput,
  TechStackInput,
  VolunteeringInput,
} from "@/lib/schemas";
import type {
  Certification,
  Education,
  Experience,
  Language,
  OrganizationMembership,
  SocialLink,
  TechStackItem,
  Volunteering,
} from "@/lib/types";

export const toExperienceInput = (e: Experience): ExperienceInput => ({
  title: e.title,
  employmentType: (e.employmentType as ExperienceInput["employmentType"]) ?? "",
  company: e.company,
  currentlyWorking: e.currentlyWorking,
  startMonth: e.startMonth ?? null,
  startYear: e.startYear ?? null,
  endMonth: e.endMonth ?? null,
  endYear: e.endYear ?? null,
  location: e.location,
  locationType: (e.locationType as ExperienceInput["locationType"]) ?? "",
  description: e.description,
  skills: e.skills ?? [],
});

export const toEducationInput = (e: Education): EducationInput => ({
  school: e.school,
  degree: e.degree,
  fieldOfStudy: e.fieldOfStudy,
  startYear: e.startYear ?? null,
  endYear: e.endYear ?? null,
  grade: e.grade,
  activitiesAndSocieties: e.activitiesAndSocieties,
  description: e.description,
});

export const toCertificationInput = (c: Certification): CertificationInput => ({
  name: c.name,
  issuingOrganization: c.issuingOrganization,
  issueMonth: c.issueMonth ?? null,
  issueYear: c.issueYear ?? null,
  expirationMonth: c.expirationMonth ?? null,
  expirationYear: c.expirationYear ?? null,
  doesNotExpire: c.doesNotExpire,
  credentialId: c.credentialId,
  credentialUrl: c.credentialUrl,
});

export const toVolunteeringInput = (v: Volunteering): VolunteeringInput => ({
  organization: v.organization,
  role: v.role,
  cause: (v.cause as VolunteeringInput["cause"]) ?? "",
  startMonth: v.startMonth ?? null,
  startYear: v.startYear ?? null,
  endMonth: v.endMonth ?? null,
  endYear: v.endYear ?? null,
  currentlyActive: v.currentlyActive,
  description: v.description,
});

export const toOrganizationInput = (o: OrganizationMembership): OrganizationInput => ({
  name: o.name,
  role: o.role,
  startMonth: o.startMonth ?? null,
  startYear: o.startYear ?? null,
  endMonth: o.endMonth ?? null,
  endYear: o.endYear ?? null,
  description: o.description,
});

export const toLanguageInput = (l: Language): LanguageInput => ({
  language: l.language,
  proficiency: (l.proficiency as LanguageInput["proficiency"]) ?? "Professional working",
});

export const toTechStackInput = (t: TechStackItem): TechStackInput => ({
  domain: t.domain,
  name: t.name,
  proficiency: (t.proficiency as TechStackInput["proficiency"]) ?? "Intermediate",
});

export const toSocialLinkInput = (s: SocialLink): SocialLinkInput => ({
  kind: s.kind,
  label: s.label,
  url: s.url,
});
