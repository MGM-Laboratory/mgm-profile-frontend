"use client";

import { Controller } from "react-hook-form";

import {
  MonthYearField,
  SelectField,
  SwitchField,
  TextAreaField,
  TextField,
} from "@/components/editor/fields";
import { RepeatableSection } from "@/components/editor/section";
import { Field, Input } from "@/components/ui/field";
import {
  EMPLOYMENT_TYPES,
  LANGUAGE_PROFICIENCY,
  LOCATION_TYPES,
  VOLUNTEER_CAUSES,
} from "@/lib/constants";
import {
  certificationSchema,
  educationSchema,
  experienceSchema,
  languageSchema,
  organizationSchema,
  socialLinkSchema,
  volunteeringSchema,
  type CertificationInput,
  type EducationInput,
  type ExperienceInput,
  type LanguageInput,
  type OrganizationInput,
  type SocialLinkInput,
  type VolunteeringInput,
} from "@/lib/schemas";

type SectionProps<T> = { items: T[]; onChange: (next: T[]) => void; saving?: boolean };

const yearText = (y?: number | null) => (y ? String(y) : "");
const dateRange = (a?: number | null, b?: number | null, current?: boolean) => {
  const start = yearText(a);
  const end = current ? "Present" : yearText(b);
  if (!start && !end) return undefined;
  return [start, end].filter(Boolean).join(" – ");
};

export function ExperienceSection({ items, onChange, saving }: SectionProps<ExperienceInput>) {
  return (
    <RepeatableSection<ExperienceInput>
      title="Experience"
      addLabel="Add experience"
      items={items}
      onChange={onChange}
      schema={experienceSchema}
      saving={saving}
      emptyValue={{
        title: "",
        employmentType: "",
        company: "",
        currentlyWorking: false,
        startMonth: null,
        startYear: null,
        endMonth: null,
        endYear: null,
        location: "",
        locationType: "",
        description: "",
        skills: [],
      }}
      summary={(e) => ({
        primary: [e.title, e.company].filter(Boolean).join(" · "),
        secondary: dateRange(e.startYear, e.endYear, e.currentlyWorking),
      })}
      renderFields={(form) => (
        <>
          <TextField form={form} name="title" label="Title" required />
          <SelectField
            form={form}
            name="employmentType"
            label="Employment type"
            options={EMPLOYMENT_TYPES}
          />
          <TextField form={form} name="company" label="Company or organization" />
          <SwitchField form={form} name="currentlyWorking" label="I currently work here" />
          <div className="grid grid-cols-2 gap-3">
            <MonthYearField form={form} monthName="startMonth" yearName="startYear" label="Start" />
            <MonthYearField form={form} monthName="endMonth" yearName="endYear" label="End" />
          </div>
          <TextField form={form} name="location" label="Location" />
          <SelectField
            form={form}
            name="locationType"
            label="Location type"
            options={LOCATION_TYPES}
          />
          <TextAreaField form={form} name="description" label="Description" />
          <Controller
            control={form.control}
            name="skills"
            render={({ field }) => (
              <Field label="Associated skills" hint="Comma-separated">
                <Input
                  value={(field.value ?? []).join(", ")}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    )
                  }
                />
              </Field>
            )}
          />
        </>
      )}
    />
  );
}

export function EducationSection({ items, onChange, saving }: SectionProps<EducationInput>) {
  return (
    <RepeatableSection<EducationInput>
      title="Education"
      addLabel="Add education"
      items={items}
      onChange={onChange}
      schema={educationSchema}
      saving={saving}
      emptyValue={{
        school: "",
        degree: "",
        fieldOfStudy: "",
        startYear: null,
        endYear: null,
        grade: "",
        activitiesAndSocieties: "",
        description: "",
      }}
      summary={(e) => ({
        primary: e.school,
        secondary: [e.degree, dateRange(e.startYear, e.endYear)].filter(Boolean).join(" · "),
      })}
      renderFields={(form) => (
        <>
          <TextField form={form} name="school" label="School" required />
          <TextField form={form} name="degree" label="Degree" />
          <TextField form={form} name="fieldOfStudy" label="Field of study" />
          <div className="grid grid-cols-2 gap-3">
            <MonthYearField form={form} yearName="startYear" label="Start year" />
            <MonthYearField form={form} yearName="endYear" label="End year (or expected)" />
          </div>
          <TextField form={form} name="grade" label="Grade" />
          <TextAreaField form={form} name="activitiesAndSocieties" label="Activities & societies" />
          <TextAreaField form={form} name="description" label="Description" />
        </>
      )}
    />
  );
}

export function CertificationSection({
  items,
  onChange,
  saving,
}: SectionProps<CertificationInput>) {
  return (
    <RepeatableSection<CertificationInput>
      title="Licenses & certifications"
      addLabel="Add certification"
      items={items}
      onChange={onChange}
      schema={certificationSchema}
      saving={saving}
      emptyValue={{
        name: "",
        issuingOrganization: "",
        issueMonth: null,
        issueYear: null,
        expirationMonth: null,
        expirationYear: null,
        doesNotExpire: false,
        credentialId: "",
        credentialUrl: "",
      }}
      summary={(c) => ({ primary: c.name, secondary: c.issuingOrganization })}
      renderFields={(form) => (
        <>
          <TextField form={form} name="name" label="Name" required />
          <TextField form={form} name="issuingOrganization" label="Issuing organization" />
          <MonthYearField form={form} monthName="issueMonth" yearName="issueYear" label="Issued" />
          <SwitchField form={form} name="doesNotExpire" label="This credential does not expire" />
          <MonthYearField
            form={form}
            monthName="expirationMonth"
            yearName="expirationYear"
            label="Expires"
          />
          <TextField form={form} name="credentialId" label="Credential ID" />
          <TextField form={form} name="credentialUrl" label="Credential URL" />
        </>
      )}
    />
  );
}

export function VolunteeringSection({ items, onChange, saving }: SectionProps<VolunteeringInput>) {
  return (
    <RepeatableSection<VolunteeringInput>
      title="Volunteering"
      addLabel="Add volunteering"
      items={items}
      onChange={onChange}
      schema={volunteeringSchema}
      saving={saving}
      emptyValue={{
        organization: "",
        role: "",
        cause: "",
        startMonth: null,
        startYear: null,
        endMonth: null,
        endYear: null,
        currentlyActive: false,
        description: "",
      }}
      summary={(v) => ({
        primary: [v.role, v.organization].filter(Boolean).join(" · "),
        secondary: v.cause,
      })}
      renderFields={(form) => (
        <>
          <TextField form={form} name="organization" label="Organization" required />
          <TextField form={form} name="role" label="Role" />
          <SelectField form={form} name="cause" label="Cause" options={VOLUNTEER_CAUSES} />
          <SwitchField form={form} name="currentlyActive" label="I currently volunteer here" />
          <div className="grid grid-cols-2 gap-3">
            <MonthYearField form={form} monthName="startMonth" yearName="startYear" label="Start" />
            <MonthYearField form={form} monthName="endMonth" yearName="endYear" label="End" />
          </div>
          <TextAreaField form={form} name="description" label="Description" />
        </>
      )}
    />
  );
}

export function OrganizationSection({ items, onChange, saving }: SectionProps<OrganizationInput>) {
  return (
    <RepeatableSection<OrganizationInput>
      title="Organizations"
      addLabel="Add organization"
      items={items}
      onChange={onChange}
      schema={organizationSchema}
      saving={saving}
      emptyValue={{
        name: "",
        role: "",
        startMonth: null,
        startYear: null,
        endMonth: null,
        endYear: null,
        description: "",
      }}
      summary={(o) => ({ primary: [o.role, o.name].filter(Boolean).join(" · ") })}
      renderFields={(form) => (
        <>
          <TextField form={form} name="name" label="Organization" required />
          <TextField form={form} name="role" label="Position / role" />
          <div className="grid grid-cols-2 gap-3">
            <MonthYearField form={form} monthName="startMonth" yearName="startYear" label="Start" />
            <MonthYearField form={form} monthName="endMonth" yearName="endYear" label="End" />
          </div>
          <TextAreaField form={form} name="description" label="Description" />
        </>
      )}
    />
  );
}

export function LanguageSection({ items, onChange, saving }: SectionProps<LanguageInput>) {
  return (
    <RepeatableSection<LanguageInput>
      title="Languages"
      addLabel="Add language"
      items={items}
      onChange={onChange}
      schema={languageSchema}
      saving={saving}
      emptyValue={{ language: "", proficiency: "Professional working" }}
      summary={(l) => ({ primary: l.language, secondary: l.proficiency })}
      renderFields={(form) => (
        <>
          <TextField form={form} name="language" label="Language" required />
          <SelectField
            form={form}
            name="proficiency"
            label="Proficiency"
            options={LANGUAGE_PROFICIENCY}
            required
          />
        </>
      )}
    />
  );
}

export function SocialLinkSection({ items, onChange, saving }: SectionProps<SocialLinkInput>) {
  return (
    <RepeatableSection<SocialLinkInput>
      title="Other links"
      description="Instagram and any additional links."
      addLabel="Add link"
      items={items}
      onChange={onChange}
      schema={socialLinkSchema}
      saving={saving}
      emptyValue={{ kind: "other", label: "", url: "" }}
      summary={(s) => ({ primary: s.label || s.url, secondary: s.url })}
      renderFields={(form) => (
        <>
          <SelectField form={form} name="kind" label="Type" options={["instagram", "other"]} />
          <TextField form={form} name="label" label="Label" />
          <TextField form={form} name="url" label="URL" />
        </>
      )}
    />
  );
}
