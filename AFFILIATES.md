# Trusted Partner / Affiliate Registry

This file is the single source of truth for all CJ affiliate partners.
When adding or removing a partner, update **all** entries in this file AND the four files listed in the checklist below.

---

## Files to Update for Every Partner Change

| File | What to Update |
|------|---------------|
| `src/components/auth/EmailGate.jsx` | Logo pill `<a>` block + CJ pixel `<img>` tag |
| `src/components/landing/LandingPage.jsx` | Logo + label `<a>` block + CJ pixel `<img>` tag |
| `src/components/layout/Layout.jsx` | Logo `<a>` block + CJ pixel `<img>` tag *(Layout only shows a subset — see "In Layout" column below)* |
| `src/components/landing/LegalPage.jsx` | Row in the `Identified Affiliate Relationships` table array |
| `public/logos/` | Drop the logo PNG file here |

> **Logo path convention:** `/logos/<filename>.png`  
> **Pixel tracker pattern:** `<img src="https://<pixel-domain>/image-101696721-<AD-ID>" width="1" height="1" border="0" alt="" aria-hidden="true" />`

---

## Current Partner Registry

> Last updated: 2026-04-01

| # | Partner | Logo File | CJ Click URL | CJ Pixel URL | Label Text | In Layout? |
|---|---------|-----------|-------------|--------------|------------|------------|
| 1 | **TP-Link Tapo** | `/logos/tplink2.png` | `https://www.dpbolvw.net/click-101696721-15600687` | `https://www.tqlkg.com/image-101696721-15600687` | TP-Link Tapo | ✅ Yes |
| 2 | **GearUp** | `/logos/gearup.png` | `https://www.dpbolvw.net/click-101696721-17235974` | `https://www.tqlkg.com/image-101696721-17235974` | GearUp | ❌ No |
| 3 | **Carbonite** | `/logos/carbonite.png` | `https://www.dpbolvw.net/click-101696721-15693758` | `https://www.awltovhc.com/image-101696721-15693758` | Carbonite Backup | ❌ No |
| 4 | **Verizon** | `/logos/verizon.png` | `https://www.tkqlhce.com/click-101696721-11371807` | `https://www.lduhtrp.net/image-101696721-11371807` | Verizon Offers | ✅ Yes |
| 5 | **Hotels.com** | `/logos/hotelsnew.png` | `https://www.tkqlhce.com/click-101696721-10772148` | `https://www.awltovhc.com/image-101696721-10772148` | Hotels.com | ✅ Yes |
| 6 | **M&M's** | `/logos/m_m.png` | `https://www.anrdoezrs.net/click-101696721-15075557` | `https://www.awltovhc.com/image-101696721-15075557` | M&M's | ❌ No |
| 7 | **Peet's Coffee** | `/logos/peetsfinal.png` | `https://www.anrdoezrs.net/click-101696721-17180550` | `https://www.tqlkg.com/image-101696721-17180550` | Peet's Coffee | ❌ No |
| 8 | **Northern Tool + Equipment** | `/logos/northerntool.png` | `https://www.dpbolvw.net/click-101696721-15483785` | `https://www.tqlkg.com/image-101696721-15483785` | Northern Tool | ❌ No |

### Non-CJ Affiliates (in GoLiveWizard / Legal only)

| Partner | Link | Notes |
|---------|------|-------|
| **Namecheap** | `https://namecheap.pxf.io/9VgWEj` | Domain registration — GoLiveWizard.jsx |
| **Zoho Mail** | `https://go.zoho.com/x7Vq` | Email provider — GoLiveWizard.jsx |
| **Gemini Credit Card** | Referral link | Legal disclosure only |
| **Buy Me a Coffee** | Direct support | Legal disclosure only |

---

## How to Add a New Partner

1. **Get the CJ link and pixel** from CJ dashboard → "Get Code" → HTML tab.
2. **Add logo PNG** to `public/logos/<name>.png` in both repos.
3. **Add a row to this table** (above).
4. **Add the logo pill** to `EmailGate.jsx` inside the `flex flex-wrap` div:
   ```jsx
   {/* Partner Name */}
   <a href="<CJ_CLICK_URL>" target="_blank" rel="sponsored noopener" title="Partner — Tagline"
     className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
     <img src="/logos/<file>.png" alt="Partner Name" className="max-h-7 w-auto" />
   </a>
   ```
5. **Add the logo + label block** to `LandingPage.jsx` inside the appropriate `flex flex-wrap` row div:
   ```jsx
   {/* Partner Name */}
   <a href="<CJ_CLICK_URL>" target="_blank" rel="sponsored noopener"
     className="inline-flex w-24 flex-col items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
     title="Partner — Tagline"
   >
     <span className="bg-white rounded inline-flex items-center justify-center w-24 h-8">
       <img src="/logos/<file>.png" alt="Partner Name" className="max-h-7 w-auto" />
     </span>
     <span className="text-center leading-tight">Partner Name</span>
   </a>
   ```
6. **Add CJ pixel tracker** after the last existing pixel `<img>` in each file:
   ```jsx
   <img src="<CJ_PIXEL_URL>" width="1" height="1" border="0" alt="" aria-hidden="true" />
   ```
7. **Add to `LegalPage.jsx`** disclosure table array (keep alphabetical):
   ```js
   ['Partner Name', 'Affiliate (Commission Junction)', 'Commission on qualifying purchases'],
   ```
8. **If adding to Layout sidebar**, also add the block to `Layout.jsx` and its pixel.
9. **Apply changes in both repos**: `salescloserprohomepage.ai-main` AND `salescloserpro.ai-main`.

---

## How to Remove a Partner

1. Remove their `<a>` block from `EmailGate.jsx`, `LandingPage.jsx`, and (if present) `Layout.jsx`.
2. Remove their CJ pixel `<img>` from each of those same files.
3. Remove their row from the `LegalPage.jsx` disclosure table array.
4. Delete the logo file from `public/logos/` in both repos.
5. Remove the row from this registry table.

---

## Removed Partners

| Partner | Removed | Reason |
|---------|---------|--------|
| SafeShell VPN | 2026-04-01 | Replaced by Carbonite |
