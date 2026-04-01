# Affiliate Compliance Reference

Last updated: 2026-04-01

Purpose: this file is the quick compliance reference for future affiliate updates in this repo.
Use it together with AFFILIATES.md.

## Core Rule

For partner tiles and logo links, default to neutral brand-only wording.

Safe default pattern:

- Visible label = brand name only
- Hover title = same brand name only
- Alt text = same brand name only
- No coupon, discount, promo, save, best, official, or offer language unless the partner program explicitly allows it and the offer is current

Example:

- Visible label: `Peet's Coffee`
- Hover title: `Peet's Coffee`
- Alt text: `Peet's Coffee`

## Repo-Level Rules

- Do not add trademarked partner names to domains, subdomains, paths meant for SEO targeting, page titles, or meta tags unless the partner terms explicitly allow it.
- Do not add coupon/deal wording to titles, labels, or descriptive copy unless the program explicitly provides approved wording.
- Do not imply official status, endorsement, or exclusive relationship.
- Do not use outdated promotions.
- If a partner requires negative matching in SEM, note it here and in AFFILIATES.md.
- SafeShell VPN is removed from the active partner set.

## Current Active CJ Partners

- TP-Link Tapo
- GearUp
- Carbonite
- Verizon
- Hotels.com
- M&M's
- Peet's Coffee
- Northern Tool

## Partner-Specific Notes

### TP-Link Tapo

- Keep wording neutral: `TP-Link Tapo`
- No SEM bidding on TP-Link, Kasa, Tapo, Deco, or tp-link.com branded terms
- No branded SEM display URL or branded SEM ad copy

### GearUp

- Keep wording neutral: `GearUp`
- No SEM bidding on GearUP, GearUP Booster, GearUP coupon, GearUP discount, or gearup game booster
- Avoid booster/performance, coupon, or discount marketing language unless explicitly approved

### Carbonite

- Keep wording neutral: `Carbonite`
- Do not use backup/restore/cloud storage/Microsoft 365 backup/cyber resilience phrasing unless explicitly authorized
- No branded SEM bidding, branded-plus-keyword bidding, or coupon/promo variants
- Do not use Carbonite branded terms in domains or URLs

### Verizon

- Keep wording neutral: `Verizon`
- No branded SEM bidding
- Do not use `Verizon` in SEM display URLs
- Do not use `official site` in ad copy
- Only use current approved offers from the affiliate program

### Hotels.com

- Keep wording neutral: `Hotels.com`
- No Expedia/Hotels.com trademark bidding unless explicitly approved in writing
- Do not use coupon/deal terms in page titles or meta descriptions unless explicitly allowed and current
- Do not imply official affiliation
- Only use affiliate-program-approved coupons/promos

### M&M's

- Keep wording neutral: `M&M's`
- Do not bid on M&M's / MyMMS trademark variants in SEM
- Trademark use in ad copy requires approved merchant copy
- Avoid `Shop Now`, coupon, discount, or promo language unless approved

### Peet's Coffee

- Keep wording neutral: `Peet's Coffee`
- No SEM bidding on Peet's / Peets trademark variants
- Negative matching required in search campaigns
- Do not use `peets` in domains or subdomains
- Only use affiliate-program-approved coupon/promo language

### Northern Tool

- Keep wording neutral: `Northern Tool`
- No SEM bidding on Northern Tool trademark variants, coupon terms, or deal terms
- Do not use the brand in SEO-targeting metadata, hidden text, or branded URLs
- Only use affiliate-program-approved coupon/promo language

## Before Shipping Any Affiliate Change

1. Confirm the partner is active in CJ.
2. Confirm the click URL and pixel URL.
3. Confirm the logo file exists in `public/logos/`.
4. Keep visible label, hover title, and alt text neutral and matching.
5. Update AFFILIATES.md.
6. Update LegalPage disclosure if partner list changes.
7. Apply the change in both repos.
8. Push to `main`, not just `master`.

## Files Usually Affected

- `src/components/auth/EmailGate.jsx`
- `src/components/landing/LandingPage.jsx`
- `src/components/layout/Layout.jsx`
- `src/components/landing/LegalPage.jsx`
- `AFFILIATES.md`

## If Unsure

Use the strict fallback:

- Brand name only
- No promotional wording
- No coupon/deal language
- No SEO-targeting brand usage
