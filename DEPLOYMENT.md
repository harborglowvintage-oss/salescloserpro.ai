# Deployment

The live site at [salescloserpro.ai](https://salescloserpro.ai) is this repository, built by
**Cloudflare Pages** on every push to `main` (`npm run build` → `dist/`). There is no server
component.

| | |
|---|---|
| Repository | `harborglowvintage-oss/salescloserpro.ai` — the single source for the live site |
| Pages project | `salescloserprohomepage-ai` (the name predates the repository consolidation) |
| Preview host | `salescloserprohomepage-ai.pages.dev` — shows the build without zone-level edge rules |
| Build | Framework preset **Vite**, command `npm run build`, output `dist` |

## Host your own copy

1. Fork the repository and give your fork its own name and logo ([CONTRIBUTING.md](CONTRIBUTING.md)).
2. In Cloudflare Pages: *Create project → Connect to Git*, pick the fork, preset **Vite**.
3. Optional: add a custom domain under *Custom domains*.
4. In `index.html`, point `canonical`, `og:url`, `og:image` and `twitter:image` at your domain,
   and update `public/sitemap.xml`, `public/llms.txt` and `public/.well-known/security.txt`.

Any static host works; it only needs to serve `index.html` for unknown paths.

## Routes

| Route | Indexed | Purpose |
|---|---|---|
| `/`, `/about`, `/services`, `/legal` | yes | Public pages |
| `/dashboard`, `/quotes`, `/contacts`, `/pipeline`, `/purchase-orders`, `/settings`, `/backup`, `/export`, `/help`, `/accept` | no | The app |
| `/p` | no | A client's view of a proposal; the content is in the URL fragment |
| `/clients`, `/go-live` | — | Client-side redirects to `/contacts` and `/dashboard` |

`noindex` is applied with `X-Robots-Tag` in `public/_headers`. `public/_redirects` handles the
retired `/whitepaper` page and `/security.txt`.

## Edge configuration

- **Headers.** `public/_headers` sets caching, `nosniff`, frame and referrer policies. The
  **Content-Security-Policy is set by a Cloudflare Response Header Transform Rule**, not by this
  repository. It must allow: scripts and styles from the site itself, including inline `style` attributes; stylesheets from
  `fonts.googleapis.com` and fonts from `fonts.gstatic.com`; images from `'self'` and `data:`
  (logos and attachments are stored as data URLs); and `blob:` for downloads. After changing the
  rule, load the site and check the browser console for CSP errors.
- **Policy files.** `public/robots.txt` (allow-all plus the sitemap), `public/llms.txt` and
  `public/.well-known/security.txt` are served from this repository. Do not add AI-crawler rules
  to `robots.txt`; Cloudflare's managed robots.txt prepends them.
- **`security.txt` expires 2027-03-15.** Renew it before then.
- Keep account IDs, zone IDs, API tokens and full rule expressions out of this repository.

## Search and social signals

These values are what search engines and link previews have indexed. Changing any of them
triggers re-evaluation, so change them together and deliberately.

| Signal | Value | Where |
|---|---|---|
| `<title>` | `salescloserpro.ai \| The Free CRM. Designed for simplicity.` | `index.html` |
| H1 | `The Free CRM. Designed for simplicity.` | `src/components/landing/LandingPage.jsx` |
| Meta description | "Build professional quotes, track deals, issue POs…" | `index.html` |
| Canonical | `https://salescloserpro.ai/` | `index.html` |
| Social card | `/og-cover-v3.png` | `index.html`, generated from `brand/` |
| Structured data | `SoftwareApplication`, `WebSite`, `Organization` | `index.html` |

The title, H1 and social card changed in 11.24.26. After deploying, re-scrape the home page in
the Facebook Sharing Debugger and LinkedIn Post Inspector, and request re-indexing in Google
Search Console. When the social card changes again, give it a new file name so caches refresh.

## Images

Source artwork lives in `brand/`. `npm run generate-images` rebuilds the social card and
everything in `public/logos/`. `npm run screenshots` rebuilds `screenshots/` from demo data.
Do not edit generated images by hand.

## Releasing

1. Set the version (the release date, `MM.DD.YY`) in three places: `package.json`, the two root
   `version` fields at the top of `package-lock.json`, and `softwareVersion` in `index.html`.
   Update the release badge in `README.md`. The app reads the version for the Help and Legal pages.
2. Add the release to `CHANGELOG.md`; update `lastmod` in `public/sitemap.xml` for pages that changed.
3. `npm test`, `npm run test:e2e`, `npm run build`.
4. Merge to `main`, tag the release commit `vMM.DD.YY`, and push with `--follow-tags`.
   Cloudflare Pages deploys automatically.
5. Open the site, check the console for errors, and spot-check a quote, a proposal link and a PDF.
