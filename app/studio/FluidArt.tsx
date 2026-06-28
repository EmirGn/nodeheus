/**
 * FluidArt — original black-and-white "liquid chrome" imagery, generated
 * entirely from SVG turbulence + lighting filters. No external assets.
 * Each instance varies by `seed` and `freq` so every section reads differently.
 */
export default function FluidArt({
  seed = 7,
  freq = "0.005 0.008",
  scale = 60,
  className,
}: {
  seed?: number;
  freq?: string;
  scale?: number;
  className?: string;
}) {
  const id = `fa${seed}`;
  return (
    <svg
      className={className}
      viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#15151a" />
          <stop offset="1" stopColor="#020203" />
        </linearGradient>
        <filter
          id={`${id}-f`}
          x="-15%"
          y="-15%"
          width="130%"
          height="130%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency={freq}
            numOctaves={2}
            seed={seed}
            stitchTiles="stitch"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2" result="smooth" />
          <feDiffuseLighting
            in="smooth"
            surfaceScale={scale}
            diffuseConstant="1.15"
            lightingColor="#9b9ba6"
            result="diff"
          >
            <feDistantLight azimuth="235" elevation="46" />
          </feDiffuseLighting>
          <feSpecularLighting
            in="smooth"
            surfaceScale={scale}
            specularConstant="0.95"
            specularExponent="22"
            lightingColor="#ffffff"
            result="spec"
          >
            <feDistantLight azimuth="235" elevation="60" />
          </feSpecularLighting>
          <feComposite
            in="spec"
            in2="diff"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="lit"
          />
          <feColorMatrix in="lit" type="saturate" values="0" result="gray" />
          <feComponentTransfer in="gray" result="graded">
            {/* lift contrast so valleys go near-black and crests near-white */}
            <feFuncR type="gamma" amplitude="1.15" exponent="1.35" offset="-0.04" />
            <feFuncG type="gamma" amplitude="1.15" exponent="1.35" offset="-0.04" />
            <feFuncB type="gamma" amplitude="1.15" exponent="1.35" offset="-0.04" />
          </feComponentTransfer>
        </filter>
      </defs>
      <rect width="600" height="600" fill={`url(#${id}-bg)`} />
      <rect width="600" height="600" filter={`url(#${id}-f)`} />
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
