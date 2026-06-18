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

Division data lives in the `divisions` array in `app/page.tsx` and the `NODES`
array in `app/NetworkGraph.tsx`.

## Deploy

Optimized for [Vercel](https://vercel.com) (zero-config for Next.js). Import the
repo, deploy, then add `nodeheus.com` under **Settings → Domains** and point the
DNS records at Vercel from your registrar.
