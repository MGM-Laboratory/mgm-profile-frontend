"use client";

import { Loader2, Search, SlidersHorizontal } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { MemberCard } from "@/components/public/member-card";
import { PatternGrid } from "@/components/pattern";
import { Input, Select } from "@/components/ui/field";
import { DIVISIONS } from "@/lib/constants";
import { fetchMembers } from "@/lib/public-api";
import type { DirectoryFilters, PublicMember } from "@/lib/public-types";

// Public directory: infinite-scroll list grouped by division, with free-text
// search and division/skill/tech filters. Members arrive ordered by division
// then name, so a header is rendered whenever the division changes.
export function Directory() {
  const [filters, setFilters] = useState<DirectoryFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [members, setMembers] = useState<PublicMember[]>([]);
  const [nextOffset, setNextOffset] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // A token that changes whenever filters change, to cancel stale loads.
  const reqToken = useRef(0);

  const load = useCallback(
    async (offset: number, reset: boolean, token: number) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchMembers(filters, offset);
        if (token !== reqToken.current) return; // stale
        setTotal(res.total);
        setMembers((prev) => (reset ? res.members : [...prev, ...res.members]));
        setNextOffset(res.nextOffset);
      } catch (e) {
        if (token === reqToken.current) setError((e as Error).message);
      } finally {
        if (token === reqToken.current) setLoading(false);
      }
    },
    [filters],
  );

  // Reset and reload when filters change (debounced for the text query).
  useEffect(() => {
    const token = ++reqToken.current;
    const t = setTimeout(() => {
      setMembers([]);
      setNextOffset(0);
      void load(0, true, token);
    }, 250);
    return () => clearTimeout(t);
  }, [filters, load]);

  // Infinite scroll sentinel.
  const sentinel = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && nextOffset !== null) {
        void load(nextOffset, false, reqToken.current);
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [load, loading, nextOffset]);

  function patch(p: Partial<DirectoryFilters>) {
    setFilters((f) => ({ ...f, ...p }));
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col items-start gap-4">
        <span className="text-eyebrow text-ink-3 uppercase">MGM Laboratory</span>
        <h1 className="font-display text-display-lg text-ink">Member directory</h1>
        <p className="text-body text-ink-2 prose-measure">
          Browse the lab by division. Search by name, or filter by division, skill, or tech.
        </p>
      </section>

      {/* Controls */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              className="text-ink-4 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
              size={16}
              strokeWidth={2.25}
            />
            <Input
              aria-label="Search members"
              placeholder="Search by name or headline…"
              value={filters.q ?? ""}
              onChange={(e) => patch({ q: e.target.value })}
              className="pl-9"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((s) => !s)}
            aria-expanded={showFilters}
            className="border-line bg-surface text-ink-2 hover:bg-surface-muted ease-out-soft text-body-sm flex h-10 items-center gap-2 rounded-md border px-3 transition-colors duration-200"
          >
            <SlidersHorizontal size={16} strokeWidth={2.25} /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="border-line bg-surface-muted grid grid-cols-1 gap-3 rounded-md border p-3 sm:grid-cols-3">
            <Select
              aria-label="Division"
              value={filters.division ?? ""}
              onChange={(e) => patch({ division: e.target.value })}
            >
              <option value="">All divisions</option>
              {DIVISIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
            <Input
              aria-label="Skill"
              placeholder="Skill (e.g. Design)"
              value={filters.skill ?? ""}
              onChange={(e) => patch({ skill: e.target.value })}
            />
            <Input
              aria-label="Tech"
              placeholder="Tech (e.g. Go)"
              value={filters.tech ?? ""}
              onChange={(e) => patch({ tech: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Results */}
      {error ? (
        <p className="text-body-sm text-brand-red">{error}</p>
      ) : members.length === 0 && !loading ? (
        <EmptyState />
      ) : (
        <GroupedList members={members} />
      )}

      <div ref={sentinel} className="h-8" />
      {loading && (
        <div className="text-ink-3 flex items-center justify-center gap-2 py-4">
          <Loader2 className="animate-spin" size={18} strokeWidth={2.25} />
          <span className="text-body-sm">Loading…</span>
        </div>
      )}
      {!loading && nextOffset === null && members.length > 0 && (
        <p className="text-caption text-ink-4 py-4 text-center tabular-nums">{total} members</p>
      )}
    </div>
  );
}

// GroupedList renders members with a division header whenever the division
// changes (the API returns them ordered by division then name).
function GroupedList({ members }: { members: PublicMember[] }) {
  const rows: React.ReactNode[] = [];
  let lastDivision = "";
  let grid: PublicMember[] = [];

  const flushGrid = (key: string) => {
    if (grid.length === 0) return;
    const items = grid;
    grid = [];
    rows.push(
      <div key={`grid-${key}`} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((m) => (
          <MemberCard key={m.sub} member={m} />
        ))}
      </div>,
    );
  };

  members.forEach((m, i) => {
    if (m.division !== lastDivision) {
      flushGrid(`${lastDivision}-${i}`);
      lastDivision = m.division;
      rows.push(
        <h2
          key={`h-${m.division}-${i}`}
          className="text-eyebrow text-ink-3 mt-4 flex items-center gap-3 uppercase"
        >
          {m.division || "Other"}
          <span className="bg-line h-px flex-1" />
        </h2>,
      );
    }
    grid.push(m);
  });
  flushGrid("last");

  return <div className="flex flex-col gap-3">{rows}</div>;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <PatternGrid
        cols={3}
        rows={3}
        seed={88}
        tile={40}
        className="overflow-hidden rounded-md opacity-70"
      />
      <p className="text-body-sm text-ink-3">No members match your search.</p>
    </div>
  );
}
