# salescloser.ai — Marketing Homepage

> The public-facing marketing site for [salescloser.ai](https://salescloser.ai) — a free, open-source sales CRM, quoting, and pipeline tool.

This repo contains **only the landing page** and its assets. The full application lives at [harborglowvintage-oss/salescloserpro.ai](https://github.com/harborglowvintage-oss/salescloserpro.ai).

---

## Stack

| Layer | Tech |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router (HashRouter) |
| Deployment | Netlify |
| OG Image | Generated via `sharp` (Node) |

---

## Pages

| Route | File | Purpose |
|---|---|---|
| `/` | `src/components/landing/LandingPage.jsx` | Main marketing page · hero, features, partner cards |
| `/about` | `src/components/landing/AboutPage.jsx` | About the project |
| `/legal` | `src/components/landing/LegalPage.jsx` | Terms & privacy |

---

## Local Development

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Build & Deploy

```bash
npm run build        # outputs to dist/
```

Netlify auto-deploys on push to `main`. Build command: `npm run build` · Publish directory: `dist`.

The `public/_redirects` file handles SPA routing on Netlify:
```
/*  /index.html  200
```

---

## Regenerate OG Social Card

The `public/og-cover.png` (1200×630) is pre-generated and committed. To regenerate after logo or copy changes:

```bash
npm run generate-og
```

Source: `scripts/generate-og.mjs`

---

## Static Assets

```
public/
  favicon.png
  og-cover.png          # Social card — 1200×630
  _redirects            # Netlify SPA routing
  logos/
    salescloserprologo.png
    gemini.png
    moonpay.png
    cloudflare.png
    namecheap.png
    google-workspace.png
    zohologo.jpg
    buymeacoffee.png
```

---

## Partner Cards (Landing Page)

Partner cards are rendered via the `<PartnerCard>` component in `LandingPage.jsx`. To add or edit a card:

1. Add the logo to `public/logos/`
2. Add a `<PartnerCard>` entry with `href`, `logo`, `title`, `body`, `cta` props
3. Optionally set `border`, `tint`, `ctaColor`, `glowColor` for theming

---

## SEO

All meta tags, Open Graph, Twitter Card, and JSON-LD structured data are in `index.html`.

- Canonical: `https://salescloser.ai/`
- OG image: `https://salescloser.ai/og-cover.png`
- Schema.org type: `SoftwareApplication`

---

## License

Apache 2.0 — © 2026 Brent Girolimon / [llmadvisor.ai](https://llmadvisor.ai)  
Powered by highsignal™
