"use client";

// TanStack Query hooks for the private profile editor. The /me query is the
// single source of truth; section mutations optimistically patch it and then
// reconcile from the server response.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { CoreInput, IdentityInput, PrivacyInput } from "@/lib/schemas";
import type { Me } from "@/lib/types";

export const meKey = ["me"] as const;

export function useMe() {
  return useQuery({ queryKey: meKey, queryFn: () => api.get<Me>("me") });
}

// useSectionMutation builds a mutation that PUTs a section array and patches the
// cached /me.profile field optimistically.
function useMeMutation<TVars>(
  mutate: (vars: TVars) => Promise<void>,
  patch: (prev: Me, vars: TVars) => Me,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: mutate,
    onMutate: async (vars: TVars) => {
      await qc.cancelQueries({ queryKey: meKey });
      const prev = qc.getQueryData<Me>(meKey);
      if (prev) qc.setQueryData<Me>(meKey, patch(prev, vars));
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(meKey, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: meKey }),
  });
}

export function useUpdateIdentity() {
  return useMeMutation<IdentityInput>(
    (v) => api.put("me/identity", v),
    (prev, v) => ({ ...prev, identity: { ...prev.identity, ...v } }),
  );
}

export function useUpdateCore() {
  return useMeMutation<CoreInput>(
    (v) => api.put("me/core", v),
    (prev, v) => ({ ...prev, profile: prev.profile ? { ...prev.profile, ...v } : prev.profile }),
  );
}

export function useUpdatePrivacy() {
  return useMeMutation<PrivacyInput>(
    (v) => api.put("me/privacy", v),
    (prev, v) => ({
      ...prev,
      profile: prev.profile ? { ...prev.profile, privacy: v } : prev.profile,
    }),
  );
}

export function useCompleteOnboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post("me/onboarding/complete"),
    onSettled: () => qc.invalidateQueries({ queryKey: meKey }),
  });
}

// useReplaceSection PUTs a repeatable section array (experiences, education, …).
type ProfileArrayKey =
  | "experiences"
  | "education"
  | "certifications"
  | "volunteering"
  | "organizations"
  | "skills"
  | "languages"
  | "techStack"
  | "workHours"
  | "socialLinks";

const SECTION_PATHS: Record<ProfileArrayKey, string> = {
  experiences: "me/experiences",
  education: "me/education",
  certifications: "me/certifications",
  volunteering: "me/volunteering",
  organizations: "me/organizations",
  skills: "me/skills",
  languages: "me/languages",
  techStack: "me/tech-stack",
  workHours: "me/work-hours",
  socialLinks: "me/social-links",
};

export function useReplaceSection<T>(field: ProfileArrayKey) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: T[]) => api.put(SECTION_PATHS[field], items),
    onMutate: async (items: T[]) => {
      await qc.cancelQueries({ queryKey: meKey });
      const prev = qc.getQueryData<Me>(meKey);
      if (prev?.profile) {
        qc.setQueryData<Me>(meKey, {
          ...prev,
          profile: { ...prev.profile, [field]: items },
        });
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(meKey, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: meKey }),
  });
}
