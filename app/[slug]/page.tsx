import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { ProfileView } from "@/components/public/profile-view";
import { SiteHeader } from "@/components/site-header";
import type { PublicProfile } from "@/lib/public-types";

const API_BASE = (
  process.env.API_INTERNAL_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080/api/v1"
).replace(/\/$/, "");

type Fetched =
  | { kind: "ok"; profile: PublicProfile }
  | { kind: "redirect"; slug: string }
  | { kind: "notfound" };

// Fetch a public profile by slug directly from the backend (server-side, no
// auth). Historical slugs return 301 with a Location to the current slug.
async function getProfile(slug: string): Promise<Fetched> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/public/members/${encodeURIComponent(slug)}`, {
      redirect: "manual",
      cache: "no-store",
    });
  } catch {
    // Backend unreachable — treat as not found rather than a server error.
    return { kind: "notfound" };
  }
  if (res.status === 200) {
    return { kind: "ok", profile: (await res.json()) as PublicProfile };
  }
  if (res.status >= 300 && res.status < 400) {
    const loc = res.headers.get("location") ?? "";
    const current = loc.split("/").filter(Boolean).pop();
    if (current && current !== slug) return { kind: "redirect", slug: current };
  }
  return { kind: "notfound" };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProfile(slug);
  if (result.kind !== "ok") return { title: "Member" };
  const p = result.profile;
  return {
    title: p.name || p.nickname || p.slug,
    description: p.headline || `${p.name} — ${p.division}, MGM Laboratory`,
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getProfile(slug);

  if (result.kind === "redirect") permanentRedirect(`/${result.slug}`);
  if (result.kind === "notfound") notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <ProfileView profile={result.profile} />
      </main>
    </>
  );
}
