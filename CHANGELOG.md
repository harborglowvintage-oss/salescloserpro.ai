# Changelog

Versions are release dates, `MM.DD.YY`.

## 11.24.26 — November 24, 2026

The largest update since launch: salescloserpro.ai now closes the loop from quote to signed yes.

### Added

- **Accept online, with no server.** *Send* creates a link that carries the proposal in its
  `#fragment`, which browsers never transmit. The client reviews it, picks an option, and accepts
  by name; a confirmation is drafted in their own mail app; the seller opens it to record the
  acceptance and mark the quote Won. A SHA-256 version code shows exactly which version was
  accepted and flags quotes edited after sending.
- **Good / Better / Best.** Up to three named, fully priced options per proposal with a
  recommended pick. The PDF prints each option and a tick-one summary.
- **Follow-ups.** Every quote has a valid-until date (default set in Company Info). Sent quotes
  get a check-in on day 3, an offer to adjust on day 7, and a reminder two days before expiry —
  with drafted emails, a "due" card on the dashboard, and `.ics` calendar export. Expired
  proposals can no longer be accepted.
- **Contacts** (formerly Clients). Quotes and deals link to a contact, with a type-ahead picker
  and automatic create-or-match on save. Contact cards list linked quotes, deals, and open and
  won totals.
- **Export.** A plain-language Business Summary PDF, and CSV files laid out for HubSpot,
  Salesforce, or a universal format, with import steps for each.
- **Model numbers** on product lines — shown on the PDF, the client page, purchase orders and
  exports.
- **Tests in the repo.** `npm test` (104 unit checks) and `npm run test:e2e` (111 browser
  checks across seven flows). `npm run screenshots` regenerates the README images.

### Changed

- **Brand.** The LLMadvisor ai LLC identity throughout: one set of colour and type tokens in
  `tailwind.config.js`, the LLMadvisor mark and "An LLMadvisor ai LLC project" credit, a new
  social card, and a redesigned landing page. Headline: "The Free CRM. Designed for simplicity."
- **One name.** The product is written `salescloserpro.ai` everywhere — pages, PDFs, emails,
  the browser tab, the installable app name and these docs.
- **PDFs** share one set of drawing helpers; tables fit the page margins and headings align
  with their columns.
- **One implementation of each thing**: pricing, money formatting, status badges, email drafts,
  file downloads, and brand elements are each defined once.

### Security

- **Uploads are checked by content, not by name.** Images are re-encoded (metadata and appended
  data removed; SVG refused; a 40-megapixel cap). PDFs are refused if they contain JavaScript,
  launch actions, embedded files, data-submitting actions, scripted forms, or encryption —
  including inside compressed object streams.
- **Restored backups and stored data are sanitized**: only images and PDFs the app created
  survive; remote and script URLs are dropped.
- File names lose control and direction-override characters.
- **Dependencies updated** to clear every known high and critical advisory: jsPDF 2 → 4,
  jspdf-autotable 3 → 5, React Router 6.30.6, sharp 0.35.
- Stored images are accepted back only as PNG or JPEG, the two formats the app writes.
- `Strict-Transport-Security` is sent on every response.

### Fixed

- Refreshing a quote's page opened a blank quote (the page rendered before saved data loaded).
- Quote and purchase-order PDF tables overflowed the right margin; long PO terms ran off the page.
- Opening a second proposal link in the same tab kept showing the first.
- Dashboard and purchase-order totals overflowed their cards; pipeline amounts were formatted
  inconsistently; a heading was invisible in dark mode.

### Removed

- The custom GPT promotion, and the Go Live wizard (`/go-live` redirects to the dashboard).
- Unused images and the 608 KB hero PNG (now a 32 KB WebP).

## 10.14.26 — October 14, 2026

- `robots.txt`, `llms.txt` and `.well-known/security.txt` moved into this repository and are
  served by Cloudflare Pages.
- App routes are `noindex`.
- Legal page corrections; footer standardized on every page.
- This repository became the single source for the live site. Versions became release dates.

## 1.1.0 — September 10, 2026

- Fixed data persistence (nothing survived a reload) and Backup & Restore.
- Quote and PO numbers are never reused after a delete.
- Removed the unreleased payments integration and desktop-app references.
- Documentation rewritten to match the product.
