import { cn } from "@/lib/cn";

// The MGM geometric pattern is "the spice, not the meal" (DESIGN_SYSTEM §1):
// a signature quoted in corners, dividers, empty states, and 404s — never
// wallpaper. This component tiles the square SVGs in /public/patterns.

const TOTAL_PATTERNS = 80;

// Deterministic PRNG (mulberry32) so the server and client pick the same tiles
// and hydration never mismatches.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickPatterns(count: number, seed: number): number[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => 1 + Math.floor(rand() * TOTAL_PATTERNS));
}

export interface PatternGridProps {
  /** Columns in the tile grid. */
  cols?: number;
  /** Rows in the tile grid. */
  rows?: number;
  /** Seed for deterministic tile selection. */
  seed?: number;
  /** Tile edge length in pixels. */
  tile?: number;
  /** Explicit pattern ids (1–80); overrides the seeded random pick. */
  patterns?: number[];
  className?: string;
}

/**
 * A grid of geometric pattern tiles. Decorative only (aria-hidden).
 *
 * @example
 * <PatternGrid cols={4} rows={2} seed={7} tile={56} />
 */
export function PatternGrid({
  cols = 3,
  rows = 3,
  seed = 1,
  tile = 48,
  patterns,
  className,
}: PatternGridProps) {
  const ids = patterns ?? pickPatterns(cols * rows, seed);

  return (
    <div
      aria-hidden
      className={cn("grid w-fit", className)}
      style={{ gridTemplateColumns: `repeat(${cols}, ${tile}px)` }}
    >
      {ids.slice(0, cols * rows).map((id, i) => (
        <span
          key={i}
          className="block select-none"
          style={{
            width: tile,
            height: tile,
            backgroundImage: `url(/patterns/p-${id}.svg)`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        />
      ))}
    </div>
  );
}
