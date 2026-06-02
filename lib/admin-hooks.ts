"use client";

// TanStack Query hooks for the admin console. All calls go through the
// authenticated proxy; the backend enforces the `admin` role (this UI only
// gates what's offered).
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type {
  AdminFlagsInput,
  AdminIdentityInput,
  AdminUserDetail,
  AdminUsersResponse,
  AuditEntry,
  DivisionCount,
} from "@/lib/admin-types";
import type { CoreInput } from "@/lib/schemas";

const PAGE = 20;

export function adminUsersKey(q: string) {
  return ["admin", "users", q] as const;
}
export function adminUserKey(sub: string) {
  return ["admin", "user", sub] as const;
}

// useAdminUsers lists/searches users with offset pagination.
export function useAdminUsers(q: string) {
  return useQuery({
    queryKey: adminUsersKey(q),
    queryFn: () =>
      api.get<AdminUsersResponse>(`admin/users?q=${encodeURIComponent(q)}&offset=0&limit=${PAGE}`),
    placeholderData: (prev) => prev,
  });
}

export function useAdminUser(sub: string) {
  return useQuery({
    queryKey: adminUserKey(sub),
    queryFn: () => api.get<AdminUserDetail>(`admin/users/${sub}`),
    enabled: !!sub,
  });
}

export function useAdminUserAudit(sub: string) {
  return useQuery({
    queryKey: ["admin", "user", sub, "audit"] as const,
    queryFn: () => api.get<{ entries: AuditEntry[] }>(`admin/users/${sub}/audit`),
    enabled: !!sub,
  });
}

export function useAdminDivisions() {
  return useQuery({
    queryKey: ["admin", "divisions"] as const,
    queryFn: () => api.get<{ divisions: DivisionCount[] }>("admin/divisions"),
  });
}

// Mutations invalidate the affected user + list so the console reflects writes.
function useAdminUserMutation<TVars>(sub: string, fn: (vars: TVars) => Promise<unknown>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: adminUserKey(sub) });
      void qc.invalidateQueries({ queryKey: ["admin", "users"] });
      void qc.invalidateQueries({ queryKey: ["admin", "user", sub, "audit"] });
      void qc.invalidateQueries({ queryKey: ["admin", "divisions"] });
    },
  });
}

export function useAdminUpdateIdentity(sub: string) {
  return useAdminUserMutation<AdminIdentityInput>(sub, (v) =>
    api.put(`admin/users/${sub}/identity`, v),
  );
}

export function useAdminUpdateCore(sub: string) {
  return useAdminUserMutation<CoreInput>(sub, (v) => api.put(`admin/users/${sub}/core`, v));
}

export function useAdminUpdateFlags(sub: string) {
  return useAdminUserMutation<AdminFlagsInput>(sub, (v) => api.put(`admin/users/${sub}/flags`, v));
}
