# nodeheus

The landing page for **nodeheus** — a global technology conglomerate operating
across cloud, intelligence, silicon, robotics, finance, security, health, energy
and space.

Built as an institutional, editorial site around one signature element: an
interactive **node-graph** rendered as an engineering plate (*Fig. 01 — The
Nodeheus Network*), where each division orbits the holding-company core.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- React 19
- TypeScript
- CSS Modules
- Fonts: [Fraunces](https://fonts.google.com/specimen/Fraunces) (display serif) +
  [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) (technical labels)

## Development

```bash
npm install
npm run dev      # http://localhost:3000
```

> Don't run `npm run build` while `npm run dev` is live — both write to `.next/`
> and the dev server's chunk manifest gets corrupted ("Cannot find module
> './xxx.js'"). If that happens: stop the server, `rm -rf .next`, restart.

## Build

```bash
npm run build    # production build (fully static)
npm run start    # serve the production build
```

## Structure

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Landing page — hero, network, divisions ledger, doctrine, contact |
| `app/NetworkGraph.tsx` | Interactive node-graph (client component) |
| `app/layout.tsx` | Root layout, fonts, metadata |
| `app/globals.css` | Theme tokens, paper background, base styles |
| `app/studio/` | **studio.nodeheus.com** — the agency subsite (dark theme) |
| `middleware.ts` | Subdomain routing (`studio.*` → `/studio`) |

### Subdomains

`studio.nodeheus.com` is served from `app/studio/` via `middleware.ts`, which
rewrites the `studio.*` host onto the `/studio` route (the prefix never appears
in the URL). Locally, reach it at `http://localhost:3000/studio` or
`http://studio.localhost:3000`. The studio subsite is a self-contained, dark
"liquid-chrome" agency page — design + engineering arm of nodeheus — with its
own [Hanken Grotesk](https://fonts.google.com/specimen/Hanken+Grotesk) display
font and original SVG-filter artwork (`app/studio/FluidArt.tsx`, no image
assets).

Division data lives in the `divisions` array in `app/page.tsx` and the `NODES`
array in `app/NetworkGraph.tsx`.

## Deploy

Optimized for [Vercel](https://vercel.com) (zero-config for Next.js). Import the
repo, deploy, then add `nodeheus.com` under **Settings → Domains** and point the
DNS records at Vercel from your registrar.
