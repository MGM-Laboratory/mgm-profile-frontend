"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { WEEKDAYS } from "@/lib/constants";
import type { WorkHour } from "@/lib/types";
import { cn } from "@/lib/cn";

// Interactive weekly availability grid. Columns = weekdays (Sun–Sat to match
// WorkHour.weekday 0–6), rows = one-hour blocks. All times are GMT+7 (WIB).
// Click or drag to paint availability; the value is emitted as merged
// contiguous WorkHour ranges per day.

const START_HOUR = 6; // 06:00 WIB
const END_HOUR = 23; // last block is 22:00–23:00
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

function cellKey(day: number, hour: number) {
  return `${day}:${hour}`;
}

function toCells(value: WorkHour[]): Set<string> {
  const set = new Set<string>();
  for (const wh of value) {
    const from = Math.floor(wh.startMinutes / 60);
    const to = Math.ceil(wh.endMinutes / 60);
    for (let h = from; h < to; h++) {
      if (h >= START_HOUR && h < END_HOUR) set.add(cellKey(wh.weekday, h));
    }
  }
  return set;
}

function toRanges(cells: Set<string>): WorkHour[] {
  const out: WorkHour[] = [];
  for (let day = 0; day < 7; day++) {
    let runStart: number | null = null;
    for (let h = START_HOUR; h <= END_HOUR; h++) {
      const on = h < END_HOUR && cells.has(cellKey(day, h));
      if (on && runStart === null) runStart = h;
      if (!on && runStart !== null) {
        out.push({ id: 0, weekday: day, startMinutes: runStart * 60, endMinutes: h * 60 });
        runStart = null;
      }
    }
  }
  return out;
}

function label(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

export function WorkHoursGrid({
  value,
  onChange,
}: {
  value: WorkHour[];
  onChange: (next: WorkHour[]) => void;
}) {
  const [cells, setCells] = useState<Set<string>>(() => toCells(value));
  const painting = useRef<{ mode: "add" | "remove" } | null>(null);

  // Re-sync when the external value changes (e.g. form reset). Round-trips from
  // our own onChange resolve to an equal set, so this is a no-op then.
  const valueSig = JSON.stringify(value);
  useEffect(() => {
    if (painting.current === null) setCells(toCells(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueSig]);

  const apply = useCallback(
    (next: Set<string>) => {
      setCells(next);
      onChange(toRanges(next));
    },
    [onChange],
  );

  const paint = useCallback(
    (day: number, hour: number) => {
      const key = cellKey(day, hour);
      const mode = painting.current?.mode;
      if (!mode) return;
      const next = new Set(cells);
      if (mode === "add") next.add(key);
      else next.delete(key);
      apply(next);
    },
    [cells, apply],
  );

  function startPaint(day: number, hour: number) {
    const key = cellKey(day, hour);
    painting.current = { mode: cells.has(key) ? "remove" : "add" };
    paint(day, hour);
  }

  function stopPaint() {
    painting.current = null;
  }

  return (
    <div
      className="select-none"
      onPointerUp={stopPaint}
      onPointerLeave={stopPaint}
      role="group"
      aria-label="Weekly availability (GMT+7)"
    >
      <div className="flex items-center justify-between pb-2">
        <p className="text-caption text-ink-3">Tap or drag to set your available hours.</p>
        <span className="text-eyebrow text-ink-4 uppercase">WIB · GMT+7</span>
      </div>
      <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-1 overflow-x-auto">
        <div />
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-caption text-ink-3 pb-1 text-center">
            {d.slice(0, 3)}
          </div>
        ))}
        {HOURS.map((hour) => (
          <div key={hour} className="contents">
            <div className="text-caption text-ink-4 pr-2 text-right tabular-nums">
              {label(hour)}
            </div>
            {WEEKDAYS.map((_, day) => {
              const on = cells.has(cellKey(day, hour));
              return (
                <button
                  key={day}
                  type="button"
                  aria-pressed={on}
                  aria-label={`${WEEKDAYS[day]} ${label(hour)}`}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    startPaint(day, hour);
                  }}
                  onPointerEnter={() => paint(day, hour)}
                  className={cn(
                    "ease-out-soft h-7 rounded-sm border transition-colors duration-100",
                    on
                      ? "border-brand-green bg-brand-green/85 hover:bg-brand-green"
                      : "border-line bg-surface hover:bg-brand-green-50",
                  )}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
