// Client-side fetchers for the public directory (through the unauthenticated
// /api/public proxy).
import type { DirectoryFilters, MembersResponse } from "@/lib/public-types";

export const DIRECTORY_PAGE_SIZE = 24;

export async function fetchMembers(
  filters: DirectoryFilters,
  offset: number,
): Promise<MembersResponse> {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.division) params.set("division", filters.division);
  if (filters.skill) params.set("skill", filters.skill);
  if (filters.tech) params.set("tech", filters.tech);
  params.set("offset", String(offset));
  params.set("limit", String(DIRECTORY_PAGE_SIZE));

  const res = await fetch(`/api/public/members?${params.toString()}`);
  if (!res.ok) throw new Error(`Directory request failed (${res.status})`);
  return res.json();
}
