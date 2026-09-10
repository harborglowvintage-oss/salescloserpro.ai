# salescloserpro.ai — Homepage deployment notes

> Notes for the second deployment of this codebase, `salescloserprohomepage.ai`.

The public site at [salescloserpro.ai](https://salescloserpro.ai) and the homepage repo are built from the **same source**. Both are React 18 + Vite apps deployed to **Cloudflare Pages**, which runs `npm run build` on every push to `main` and serves `dist/`.

## Keeping the two repos in sync

| Path | Rule |
|---|---|
| `src/`, `public/`, `index.html`, `package.json`, `vite.config.js` | Keep **byte-identical** across both repos |
| `README.md` | The homepage copy omits the homepage screenshot row and the local zip-backup section |

Make changes in one repo, build, copy the shared paths to the other, and build again before pushing.

## Routes (React Router, BrowserRouter)

| Route | File |
|---|---|
| `/` | `src/components/landing/LandingPage.jsx` |
| `/about` | `src/components/landing/AboutPage.jsx` |
| `/services` | `src/components/landing/ServicesPage.jsx` |
| `/legal` | `src/components/landing/LegalPage.jsx` |
| `/dashboard`, `/quotes`, `/clients`, … | App routes rendered inside `src/components/layout/Layout.jsx` |

Deep links work because Cloudflare Pages serves `index.html` for unknown paths. `public/_redirects` also 301s retired pages (for example `/whitepaper`).

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

## License

Apache 2.0 — © 2026 LLMadvisor ai LLC · [llmadvisor.ai](https://llmadvisor.ai)
