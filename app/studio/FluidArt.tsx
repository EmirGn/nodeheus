/**
 * FluidArt — minimal monochrome gradient placeholders.
 *
 * Previously these were live SVG `feTurbulence` + lighting filters, which were
 * gorgeous but recomputed per-pixel on every paint and made the page janky.
 * This version is pure SVG gradients (a dark base + two soft grayscale light
 * blooms), varied deterministically by `seed`. It rasterizes once on the GPU,
 * costs ~nothing to render, ships no image assets, and keeps the B&W look.
 *
 * The `freq` / `scale` props are kept for API compatibility with existing call
 * sites; they're no longer used.
 */
export default function FluidArt({
  seed = 7,
  className,
}: {
  seed?: number;
  freq?: string;
  scale?: number;
  className?: string;
}) {
  // Deterministic pseudo-random in [0,1) from the seed. Integer-only math
  // (no Math.sin/transcendentals) so the server and client compute byte-for-byte
  // identical values — otherwise floating-point drift causes hydration mismatches.
  const r = (n: number) => {
    let h = ((seed * 374761393) + (n * 668265263)) >>> 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
    h = (h ^ (h >>> 16)) >>> 0;
    return h / 4294967296;
  };

  const id = `fa${seed}`;
  // round to whole percentages so SSR and client serialize the same string
  const a = { x: 10 + Math.round(r(1) * 45), y: 6 + Math.round(r(2) * 30), l: 36 + Math.round(r(3) * 20) };
  const b = { x: 48 + Math.round(r(4) * 44), y: 46 + Math.round(r(5) * 44), l: 44 + Math.round(r(6) * 14) };
  const baseL = 6 + Math.round(r(7) * 4);

  return (
    <svg
      className={className}
      viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${id}-a`} cx={`${a.x}%`} cy={`${a.y}%`} r="72%">
          <stop offset="0" stopColor={`hsl(240 4% ${a.l}%)`} stopOpacity="0.95" />
          <stop offset="100%" stopColor={`hsl(240 4% ${a.l}%)`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-b`} cx={`${b.x}%`} cy={`${b.y}%`} r="58%">
          <stop offset="0" stopColor={`hsl(240 3% ${b.l}%)`} stopOpacity="0.8" />
          <stop offset="100%" stopColor={`hsl(240 3% ${b.l}%)`} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="600" height="600" fill={`hsl(240 6% ${baseL}%)`} />
      <rect width="600" height="600" fill={`url(#${id}-a)`} />
      <rect width="600" height="600" fill={`url(#${id}-b)`} />
    </svg>
  );
}

/** Small 4-point sparkle used in tags and labels. */
export function Sparkle({
  size = 14,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 1.5c.9 5.4 4.2 8.7 9.6 9.6 0 .6-0 .6-0 .8-5.4.9-8.7 4.2-9.6 9.6-.9-5.4-4.2-8.7-9.6-9.6 5.4-.9 8.7-4.2 9.6-9.6Z"
        fill="currentColor"
      />
    </svg>
  );
}
