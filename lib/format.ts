// Display formatting helpers for public profile rendering.
import { MONTHS, WEEKDAYS } from "@/lib/constants";

export function monthYear(month?: number | null, year?: number | null): string {
  if (!year && !month) return "";
  const m = month && month >= 1 && month <= 12 ? MONTHS[month - 1].slice(0, 3) : "";
  return [m, year ? String(year) : ""].filter(Boolean).join(" ");
}

export function dateRange(opts: {
  startMonth?: number | null;
  startYear?: number | null;
  endMonth?: number | null;
  endYear?: number | null;
  current?: boolean;
}): string {
  const start = monthYear(opts.startMonth, opts.startYear);
  const end = opts.current ? "Present" : monthYear(opts.endMonth, opts.endYear);
  if (!start && !end) return "";
  return [start || "—", end].filter(Boolean).join(" – ");
}

export function yearRange(start?: number | null, end?: number | null): string {
  if (!start && !end) return "";
  return [start ? String(start) : "—", end ? String(end) : ""].filter(Boolean).join(" – ");
}

function hhmm(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export interface WorkBlock {
  weekday: number;
  startMinutes: number;
  endMinutes: number;
}

// groupWorkHours returns, per weekday (Sun–Sat), the formatted time ranges.
export function groupWorkHours(blocks: WorkBlock[]): { day: string; ranges: string[] }[] {
  const byDay = new Map<number, string[]>();
  for (const b of [...blocks].sort((a, z) => a.startMinutes - z.startMinutes)) {
    const list = byDay.get(b.weekday) ?? [];
    list.push(`${hhmm(b.startMinutes)}–${hhmm(b.endMinutes)}`);
    byDay.set(b.weekday, list);
  }
  const out: { day: string; ranges: string[] }[] = [];
  for (let d = 0; d < 7; d++) {
    const ranges = byDay.get(d);
    if (ranges && ranges.length) out.push({ day: WEEKDAYS[d], ranges });
  }
  return out;
}
