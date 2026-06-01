// Shared enums and option lists, mirroring the backend domain (plan §4).
// Labels are used verbatim where the spec requires it (divisions).

export const DIVISIONS = [
  "Curriculum",
  "Askor",
  "IT & Infrastructure",
  "RnD - Interactive Media",
  "RnD - Website",
  "RnD - Mobile",
  "RnD - UX",
  "Media",
  "Relation",
  "Human Resource",
  "Sekben",
] as const;
export type Division = (typeof DIVISIONS)[number];

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Self-employed",
  "Freelance",
  "Contract",
  "Internship",
  "Apprenticeship",
  "Seasonal",
] as const;

export const LOCATION_TYPES = ["On-site", "Hybrid", "Remote"] as const;

export const LANGUAGE_PROFICIENCY = [
  "Elementary",
  "Limited working",
  "Professional working",
  "Full professional",
  "Native or bilingual",
] as const;

export const TECH_PROFICIENCY = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;
export type TechProficiency = (typeof TECH_PROFICIENCY)[number];

export const VOLUNTEER_CAUSES = [
  "Education",
  "Science & Technology",
  "Arts & Culture",
  "Environment",
  "Health",
  "Social Services",
  "Human Rights",
  "Animal Welfare",
  "Economic Empowerment",
  "Disaster & Humanitarian Relief",
  "Politics",
  "Religion",
] as const;

// Weekday labels (0 = Sunday … 6 = Saturday) matching the backend WorkHour.weekday.
export const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;
