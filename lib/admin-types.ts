// Types for the admin console (plan §8), mirroring the backend's /admin/*
// response shapes.
import type { Me } from "@/lib/types";

// One row in the admin user list (GET /admin/users).
export interface AdminUserCard {
  sub: string;
  username: string;
  name: string;
  labEmail: string;
  nim: string;
  enabled: boolean;
  division: string;
  slug: string;
  hidden: boolean;
  featured: boolean;
  hasProfile: boolean;
  onboarded: boolean;
  avatarUrl: string;
}

export interface AdminUsersResponse {
  users: AdminUserCard[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
  nextOffset: number | null;
}

// Full admin view of one member (GET /admin/users/:sub).
export interface AdminUserDetail {
  member: Me;
  hidden: boolean;
  featured: boolean;
}

// One audit-log entry (GET /admin/users/:sub/audit, GET /admin/audit).
export interface AuditEntry {
  id: number;
  sub: string;
  actorSub: string;
  action: string;
  field: string;
  oldValue: string;
  newValue: string;
  createdAt: string;
}

export interface DivisionCount {
  division: string;
  count: number;
}

// Force-edit identity payload (PUT /admin/users/:sub/identity). Includes the
// admin-only lab email + NIM alongside the user-editable fields.
export interface AdminIdentityInput {
  firstName: string;
  lastName: string;
  labEmail: string;
  nim: string;
  personalEmail: string;
  phone: string;
  bio: string;
  website: string;
  portfolio: string;
  linkedin: string;
  github: string;
}

export interface AdminFlagsInput {
  hidden: boolean;
  featured: boolean;
}
