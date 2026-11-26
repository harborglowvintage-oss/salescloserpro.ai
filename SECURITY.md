# Security

## Reporting a vulnerability

Please report security issues privately — do not open a public issue.

- Email **brent@llmadvisor.ai**, or
- open a private advisory: *Security → Report a vulnerability* on this repository.

Include what you found, how to reproduce it, and the browser you used.
The machine-readable contact is at
[`/.well-known/security.txt`](public/.well-known/security.txt).

## What is in scope

salescloserpro.ai is a client-side app: there is no server, account system or database of user
data to breach. The parts worth scrutiny are:

- **Uploads and restored backups** — everything passes through `src/utils/fileSafety.js`.
- **Proposal and acceptance links** (`/p#…`, `/accept#…`) — decoded in `src/utils/proposalLink.js`
  and rendered as text. The version code identifies *which* proposal was accepted; it is not a
  signature and does not prove *who* accepted.
- **Generated files** — CSV cells that look like formulas are neutralised (`src/utils/crmExport.js`).
- **Response headers** — `public/_headers` is the only source, including a Content-Security-Policy
  that allows nothing from outside the site. The Pages Function in `functions/_middleware.js`
  repeats those headers for the four public pages; the build stops if the two differ
  (see [DEPLOYMENT.md](DEPLOYMENT.md)).

## Known, accepted advisories

`npm audit` still reports a few items. None of them affects the deployed site:

- **React Router** (two, moderate). One is an open redirect when a link or navigation target
  comes from untrusted input; every target in this app starts with a fixed in-app path such as
  `/quotes/`. The other concerns error data a server passes to a data router during hydration;
  this app has no data router, and its public pages are drawn to HTML once, at build time, from
  fixed addresses. Clearing the report needs React Router 7.
- **Vite / esbuild** (one rated high) — these affect the local development server a
  developer runs on their own machine, not the built site. Clearing them needs Vite 8.

The upload screen is a strict allow-list, not antivirus software.
