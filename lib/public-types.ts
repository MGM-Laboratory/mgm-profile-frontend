// Types for the backend public endpoints (privacy-filtered).
import type {
  Certification,
  Education,
  Experience,
  Language,
  OrganizationMembership,
  Skill,
  SocialLink,
  TechStackItem,
  Volunteering,
  WorkHour,
} from "@/lib/types";

export interface PublicMember {
  sub: string;
  slug: string;
  name: string;
  nickname: string;
  headline: string;
  division: string;
  avatarUrl: string;
}

export interface PublicContact {
  labEmail?: string;
  personalEmail?: string;
  phone?: string;
  website?: string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
}

export interface PublicProfile extends PublicMember {
  bio: string;
  bannerUrl: string;
  contact: PublicContact;
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

export interface MembersResponse {
  members: PublicMember[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
  nextOffset: number | null;
}

export interface DirectoryFilters {
  q?: string;
  division?: string;
  skill?: string;
  tech?: string;
}
