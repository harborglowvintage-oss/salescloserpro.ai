# salescloserpro.ai — Deployment notes

> **This repository is the single source for the live site** (since 10.14.26 / October 14, 2026).

The public site at [salescloserpro.ai](https://salescloserpro.ai) is a React 18 + Vite app deployed to **Cloudflare Pages**, which runs `npm run build` on every push to `main` and serves `dist/`.

## Active vs. retired

| Repository | Status | Notes |
|---|---|---|
| `harborglowvintage-oss/salescloserpro.ai` (this repo) | **ACTIVE** | Connected to the Cloudflare Pages project that owns the `salescloserpro.ai` custom domain. |
| `harborglowvintage-oss/salescloserprohomepage.ai` | **RETIRED** 2026-10-14 | Was an identical copy intended for a second site (`salescloserprohomepage.ai`) that was never set up; the Pages project had been building from it. Archived read-only on GitHub. Do not push there. |

Cloudflare Pages project: `salescloserprohomepage-ai` (name kept; only the connected repository changed). Preview hostname: `salescloserprohomepage-ai.pages.dev`. The worker `robots-txt-handler` is not attached to `*.pages.dev`, so that hostname shows true origin output.

## Routes (React Router, BrowserRouter)

| Route | File |
|---|---|
| `/` | `src/components/landing/LandingPage.jsx` |
| `/about` | `src/components/landing/AboutPage.jsx` |
| `/services` | `src/components/landing/ServicesPage.jsx` |
| `/legal` | `src/components/landing/LegalPage.jsx` |
| `/dashboard`, `/quotes`, `/clients`, … | App routes rendered inside `src/components/layout/Layout.jsx` (`noindex` via `public/_headers`) |

Deep links work because Cloudflare Pages serves `index.html` for unknown paths. `public/_redirects` 301s retired pages (`/whitepaper`) and `/security.txt` → `/.well-known/security.txt`.

## Policy files

`public/robots.txt`, `public/llms.txt`, and `public/.well-known/security.txt` are served by Pages. Vite copies `public/` (dot-directories included) into `dist/`. AI-crawler rules are **not** kept in `robots.txt`; Cloudflare's managed robots.txt prepends them. `security.txt` `Expires` is **2027-03-15** — renew before then. Details in the README's Cloudflare section.

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
npm run preview
```

## Regenerate the social card

`public/og-cover-v2.png` (1200×630) is committed. After logo or copy changes:

```bash
npm run generate-og
```

Source: `scripts/generate-og.mjs`.

## SEO

All meta tags, Open Graph, Twitter Card, and JSON-LD structured data live in `index.html`. Canonical URL: `https://salescloserpro.ai/`.

## Versioning

The version is the release date, `MM.DD.YY` (e.g. `10.14.26`), set once in `package.json`. Vite exposes it as `__APP_VERSION__` for the Help footer and Legal page; `index.html` JSON-LD `softwareVersion` is updated by hand to match.

## License

Apache 2.0 — © 2026 LLMadvisor ai LLC · [llmadvisor.ai](https://llmadvisor.ai)
