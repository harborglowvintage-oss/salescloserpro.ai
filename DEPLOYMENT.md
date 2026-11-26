# Deployment

The live site at [salescloserpro.ai](https://salescloserpro.ai) is this repository, built by
**Cloudflare Pages** on every push to `main` (`npm run build` → `dist/`). There is no server
component; one small Pages Function answers AI assistants that ask for markdown.

| | |
|---|---|
| Repository | `harborglowvintage-oss/salescloserpro.ai` — the single source for the live site |
| Build | Framework preset **Vite**, command `npm run build`, output `dist`, Functions from `functions/` |

## Host your own copy

1. Fork the repository and give your fork its own name and logo ([CONTRIBUTING.md](CONTRIBUTING.md)).
2. In Cloudflare Pages: *Create project → Connect to Git*, pick the fork, preset **Vite**.
3. Optional: add a custom domain under *Custom domains*.
4. Set your address in `scripts/site/site.mjs` (`SITE_URL`), and update `public/llms.txt`,
   `public/robots.txt` and `public/.well-known/security.txt`.

Another static host works if it serves `about.html` at `/about` (and so on), rewrites the app
addresses in `public/_redirects` to `app.html`, and serves `404.html` for anything else.

## How the build works

`npm run build` runs `vite build`, then `scripts/site/build.mjs`, which:

1. **Checks** that the site files agree (below). Any problem stops the build, so a deploy can
   never publish mismatched headers, routes or agent files.
2. **Draws each public page** listed in `src/publicPages.jsx` to finished HTML, using the same
   React components the browser runs. Each page gets its own title, description, canonical
   address and social card; the home page also gets the structured data, with the version taken
   from `package.json`. In the browser, React attaches to that HTML instead of drawing it again
   (`src/main.jsx`).
3. Writes a **markdown copy** of each public page (`/about.md` for `/about`), `app.html` (the
   empty app shell, marked noindex), `404.html`, `sitemap.xml` and `_routes.json`.

### Routes

| Address | Served as | Indexed |
|---|---|---|
| `/`, `/about`, `/services`, `/legal` | Finished HTML, through the Pages Function | yes |
| `/index.md`, `/about.md`, `/services.md`, `/legal.md` | Markdown copies for AI assistants | no (`X-Robots-Tag`) |
| `/dashboard`, `/quotes`, `/quotes/*`, `/contacts`, `/pipeline`, `/purchase-orders`, `/settings`, `/backup`, `/export`, `/help`, `/accept` | `app.html`, via a 200 rewrite in `public/_redirects` | no (`noindex` in `app.html`) |
| `/p` | `app.html`: a client's proposal, carried in the link's `#fragment` | no |
| `/clients`, `/go-live` | `app.html`, which redirects to `/contacts` and `/dashboard` | no |
| anything else | `404.html` with a 404 status | no |

The rewrites point to `/app`, not `/app.html`: Pages answers `/app.html` with a redirect to `/app`,
so a rewrite to it would move the visitor to a different address.

## Search engines and AI assistants

| File | What it is | Source |
|---|---|---|
| `public/_headers` | **The only source of security and cache headers.** Nothing is set in the Cloudflare dashboard. | hand-written |
| `functions/_middleware.js` | Pages Function for the four public pages. A request whose `Accept` header prefers `text/markdown` gets the markdown copy, with `Vary: Accept`, a canonical `Link`, the `Content-Signal` and an `x-markdown-tokens` estimate; everyone else gets the HTML. Falls back to the HTML on any error. | logic hand-written; header block generated |
| `/*.md` | Markdown copies of the public pages | generated at build |
| `public/llms.txt` | Summary for AI assistants ([llmstxt.org](https://llmstxt.org) format), linking the markdown copies | hand-written, checked |
| `public/robots.txt` | Allow-all plus the sitemap. AI-crawler rules live in Cloudflare (AI Crawl Control), which places them above this file. | hand-written |
| `public/.well-known/security.txt` | Security contact (RFC 9116) | hand-written, checked |
| `sitemap.xml`, `_routes.json` | From `src/publicPages.jsx` and `public/_headers` | generated at build |

Content signals: `search=yes, ai-input=yes, ai-train=no` — search engines may index the pages and
assistants may use them to answer a person's question, but not train on them. The value is set
once, in the `/*.md` rule of `public/_headers`; `llms.txt` says the same in words.

**Why the header block is copied.** Cloudflare does not apply `_headers` to responses that pass
through a Function, so the Function sets the same headers itself. Never edit its generated
block: edit `public/_headers`, then run `npm run site:sync`.

**What the checks catch** (`npm run site:check`, run by the build and the pre-commit hook):

- `functions/_middleware.js` out of step with `public/_headers`;
- a route in `src/App.jsx` with no rewrite in `public/_redirects`, or a rewrite left over after a
  route was removed (the message gives the line to add);
- a public page with no markdown rule in `public/_headers`, or the other way round;
- `public/llms.txt` missing a markdown copy, or linking one that does not exist;
- `security.txt` expired (the build warns 60 days ahead).

Enable the hook once per clone: `git config core.hooksPath scripts/git-hooks`.

**To add a public page:** add it to `src/publicPages.jsx`, give it a rule in `public/_headers`
(cache line plus markdown `Link`), run `npm run site:sync`, and add a line to `public/llms.txt`.

**To add an app route:** add it to `src/App.jsx` and a rewrite line to `public/_redirects`.

## Headers

Headers come from `public/_headers` only. The Content-Security-Policy allows nothing from outside
the site: scripts, styles and fonts from the site itself (the theme script is a file,
`public/theme.js`, not inline code), and images also from `data:` and `blob:` (logos and
attachments are stored as data URLs; PDFs are built in the browser). A host feature that adds
headers or injects scripts into pages would conflict with it, so leave those off.

## What stays out of this repository

This repository is public. Hosting account details, project and preview addresses, dashboard
settings, security rules, scan results and runbooks are kept outside it, never in a gitignored
folder inside it. The pre-commit hook stops a commit that adds a local file path, a `pages.dev`
address, an email address other than the public contact or a demo one, or a secrets file
(`.env`, `.dev.vars`, keys).

## Search and social signals

These values are what search engines and link previews have indexed. Changing any of them
triggers re-evaluation, so change them together and deliberately.

| Signal | Value | Where |
|---|---|---|
| Home `<title>` | `salescloserpro.ai \| The Free CRM. Designed for simplicity.` | `src/publicPages.jsx` |
| H1 | `The Free CRM. Designed for simplicity.` | `src/components/landing/LandingPage.jsx` |
| Titles and descriptions | One per public page | `src/publicPages.jsx` |
| Canonical | Each page's own address on `https://salescloserpro.ai` | generated (`scripts/site/pages.mjs`) |
| Social card | `/og-cover-v3.png` | `scripts/site/pages.mjs`, image generated from `brand/` |
| Structured data | `SoftwareApplication`, `WebSite`, `Organization` (home page) | `scripts/site/pages.mjs` |

After deploying a change to these, re-scrape the page in the Facebook Sharing Debugger and
LinkedIn Post Inspector, and request re-indexing in Google Search Console. When the social card
changes, give it a new file name so caches refresh.

## Images

Source artwork lives in `brand/`. `npm run generate-images` rebuilds the social card and
everything in `public/logos/`. `npm run screenshots` rebuilds `screenshots/` from demo data.
Do not edit generated images by hand. The typefaces in `public/fonts/` are third-party (SIL OFL
1.1, see `public/fonts/LICENSE.txt`).

## Releasing

1. Set the version (the release date, `MM.DD.YY`) in `package.json` and the two root `version`
   fields at the top of `package-lock.json`. Update the release badge in `README.md`. The pages
   and the structured data read the version from `package.json`.
2. Add the release to `CHANGELOG.md`.
3. `npm test`, then `E2E_SERVER=pages npm run test:e2e` (every flow on Cloudflare's own runtime,
   with the real headers and CSP), then `npm run build`.
4. Merge to `main`, tag the release commit `vMM.DD.YY`, and push with `--follow-tags`.
   Cloudflare Pages deploys automatically.
5. Open the site, check the console for errors, and spot-check a quote, a proposal link and a PDF.
