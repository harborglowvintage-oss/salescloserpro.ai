# Security

## Reporting a vulnerability

Please report security issues privately — do not open a public issue.

- Email **brent@llmadvisor.ai**, or
- open a private advisory: *Security → Report a vulnerability* on this repository.

Include what you found, how to reproduce it, and the browser you used.
The machine-readable contact is at
[`/.well-known/security.txt`](public/.well-known/security.txt).

## What is in scope

SalesCloserPro is a client-side app: there is no server, account system or database of user
data to breach. The parts worth scrutiny are:

- **Uploads and restored backups** — everything passes through `src/utils/fileSafety.js`.
- **Proposal and acceptance links** (`/p#…`, `/accept#…`) — decoded in `src/utils/proposalLink.js`
  and rendered as text. The version code identifies *which* proposal was accepted; it is not a
  signature and does not prove *who* accepted.
- **Generated files** — CSV cells that look like formulas are neutralised (`src/utils/crmExport.js`).
- **Response headers** — `public/_headers`, plus the Content-Security-Policy set at the edge
  (see [DEPLOYMENT.md](DEPLOYMENT.md)).

The upload screen is a strict allow-list, not antivirus software.
