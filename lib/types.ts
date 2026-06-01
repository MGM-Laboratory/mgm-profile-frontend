// Read-side types for the backend's GET /api/v1/me response (profile.Me).

export interface Identity {
  username: string;
  firstName: string;
  lastName: string;
  labEmail: string;
  emailVerified: boolean;
  personalEmail: string;
  phone: string;
  bio: string;
  website: string;
  portfolio: string;
  linkedin: string;
  github: string;
  nim: string;
  picture: string;
}

export interface Privacy {
  showLabEmail: boolean;
  showWebsite: boolean;
  showPortfolio: boolean;
  showLinkedin: boolean;
  showGithub: boolean;
  showInstagram: boolean;
  showLinks: boolean;
  showPhone: boolean;
  showPersonalEmail: boolean;
}

export interface Experience {
  id: number;
  position: number;
  title: string;
  employmentType: string;
  company: string;
  currentlyWorking: boolean;
  startMonth?: number | null;
  startYear?: number | null;
  endMonth?: number | null;
  endYear?: number | null;
  location: string;
  locationType: string;
  description: string;
  skills: string[];
}

export interface Education {
  id: number;
  position: number;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startYear?: number | null;
  endYear?: number | null;
  grade: string;
  activitiesAndSocieties: string;
  description: string;
}

export interface Certification {
  id: number;
  position: number;
  name: string;
  issuingOrganization: string;
  issueMonth?: number | null;
  issueYear?: number | null;
  expirationMonth?: number | null;
  expirationYear?: number | null;
  doesNotExpire: boolean;
  credentialId: string;
  credentialUrl: string;
}

export interface Volunteering {
  id: number;
  position: number;
  organization: string;
  role: string;
  cause: string;
  startMonth?: number | null;
  startYear?: number | null;
  endMonth?: number | null;
  endYear?: number | null;
  currentlyActive: boolean;
  description: string;
}

export interface OrganizationMembership {
  id: number;
  position: number;
  name: string;
  role: string;
  startMonth?: number | null;
  startYear?: number | null;
  endMonth?: number | null;
  endYear?: number | null;
  description: string;
}

export interface Skill {
  id: number;
  position: number;
  name: string;
}

export interface Language {
  id: number;
  position: number;
  language: string;
  proficiency: string;
}

export interface TechStackItem {
  id: number;
  position: number;
  domain: string;
  name: string;
  proficiency: string;
}

export interface WorkHour {
  id: number;
  weekday: number;
  startMinutes: number;
  endMinutes: number;
}

export interface SocialLink {
  id: number;
  position: number;
  kind: string;
  label: string;
  url: string;
}

export interface Profile {
  sub: string;
  nickname: string;
  headline: string;
  division: string;
  createdAt: string;
  updatedAt: string;
  privacy: Privacy | null;
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  volunteering: Volunteering[];
  organizations: OrganizationMembership[];
  skills: Skill[];
  languages: Language[];
  techStack: TechStackItem[];
  workHours: WorkHour[];
  socialLinks: SocialLink[];
}

export interface Onboarding {
  completed: boolean;
  completedAt?: string | null;
}

export interface Me {
  sub: string;
  identity: Identity;
  profile: Profile | null;
  onboarding: Onboarding;
}
