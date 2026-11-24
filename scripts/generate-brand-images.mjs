/**
 * Generates every derived brand image from the sources in /brand:
 *   public/og-cover-v3.png              1200×630 social / Google card (LLMadvisor split layout)
 *   public/logos/salescloserpro-hero.webp  landing hero art (the handshake), 720px
 *   public/logos/services-console.webp  Services page artwork
 *   public/logos/llmadvisor-mark.svg / -still.svg   the LLMadvisor mark (animated blink / static),
 *                                       copied unchanged from the LLMadvisor site's Static/mark*.svg
 *
 *   docs/readme/*.svg                   brand-coloured section banners for the README
 *
 * Run: npm run generate-images
 */

import sharp from 'sharp'
import { copyFileSync, mkdirSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = (p) => resolve(root, 'brand', p)
const out = (p) => resolve(root, 'public', p)

// LLMadvisor tokens (mirror tailwind.config.js)
const T = {
  ink: '#071b1f', teal: '#0c3a42', teal2: '#124a53', cyan: '#1c9fb0',
  paper: '#f7f4ed', cream: '#efe9dc', muted: '#a9bcbd', copper: '#c2703a',
}

/* ── hero art ── */
await sharp(src('salescloserpro-art.png'))
  .resize(720, 720)
  .webp({ quality: 84 })
  .toFile(out('logos/salescloserpro-hero.webp'))

/* ── Services page artwork (re-encoding also drops the source file's metadata) ── */
await sharp(src('services-console.png')).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 82 }).toFile(out('logos/services-console.webp'))

/* ── LLMadvisor mark (white + teal; made for dark backgrounds) ── */
for (const f of ['llmadvisor-mark.svg', 'llmadvisor-mark-still.svg']) copyFileSync(src(f), out(`logos/${f}`))

/* ── OG card ── */
const W = 1200, H = 630, PANEL = 440
const art = await sharp(src('salescloserpro-art.png')).resize(300, 300).png().toBuffer()
const artRounded = await sharp(art)
  .composite([{ input: Buffer.from(`<svg width="300" height="300"><rect width="300" height="300" rx="22" ry="22"/></svg>`), blend: 'dest-in' }])
  .png().toBuffer()
const mark = await sharp(src('llmadvisor-mark-still.svg'), { density: 300 }).resize({ height: 48 }).png().toBuffer()

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="${T.teal2}"/>
      <stop offset="100%" stop-color="${T.teal}"/>
    </radialGradient>
    <clipPath id="frame"><rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="22"/></clipPath>
  </defs>
  <rect width="${W}" height="${H}" fill="${T.ink}"/>
  <g clip-path="url(#frame)">
    <rect width="${W}" height="${H}" fill="#0a1316"/>
    <rect width="${PANEL}" height="${H}" fill="url(#glow)"/>
    <rect x="${(PANEL - 316) / 2}" y="${(H - 316) / 2}" width="316" height="316" rx="28" fill="none" stroke="${T.cream}" stroke-opacity="0.22" stroke-width="2"/>
  </g>
  <rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="22" fill="none" stroke="${T.cyan}" stroke-opacity="0.55" stroke-width="3"/>
  <rect x="${PANEL + 32}" y="70" width="2" height="${H - 140}" fill="${T.cyan}" opacity="0.7"/>

  <g font-family="DejaVu Sans, sans-serif">
    <text x="${PANEL + 74}" y="208" font-size="21" font-weight="700" letter-spacing="2.5" fill="${T.cyan}">FREE · OPEN SOURCE · NO SIGN-UP</text>
    <text x="${PANEL + 72}" y="290" font-size="58" font-weight="700" fill="${T.paper}">salescloserpro.ai</text>
    <text x="${PANEL + 74}" y="352" font-size="31" font-weight="700" letter-spacing="1" fill="${T.copper}">QUOTES · PIPELINE · POs</text>
    <text x="${PANEL + 74}" y="402" font-size="24" fill="${T.muted}">The free CRM. Designed for simplicity.</text>
    <text x="${PANEL + 132}" y="532" font-size="22" fill="${T.muted}">An <tspan font-family="DejaVu Serif, serif" font-weight="700" fill="${T.cream}">LLMadvisor ai LLC</tspan> project</text>
  </g>
</svg>`

await sharp(Buffer.from(svg))
  .composite([
    { input: artRounded, left: (PANEL - 300) / 2, top: (H - 300) / 2 },
    { input: mark, left: PANEL + 68, top: 500 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(out('og-cover-v3.png'))

/* ── README section banners (docs/readme/*.svg) — brand-coloured headings for GitHub ── */
const BANNERS = [
  ['what-it-is',   'What it is',                         ['#0c3a42', '#124a53'], T.paper],
  ['whats-new',    "What's new in 11.24.26",             ['#8f552b', '#c2703a'], '#ffffff'],
  ['screenshots',  'Screenshots',                        ['#0b6370', '#3fbbb0'], '#ffffff'],
  ['features',     'Features',                           ['#007a8a', '#1c9fb0'], '#ffffff'],
  ['accept',       'How “accept online” works',          ['#071b1f', '#0c3a42'], T.paper],
  ['your-data',    'Your data',                          ['#0b6370', '#3fbbb0'], '#ffffff'],
  ['quick-start',  'Quick start',                        ['#8f552b', '#c2703a'], '#ffffff'],
  ['layout',       'Project layout',                     ['#0c3a42', '#124a53'], T.paper],
  ['good-to-know', 'Good to know',                       ['#c2703a', '#d8b38a'], T.ink],
  ['more',         'Custom work, contributing, license', ['#071b1f', '#124a53'], T.paper],
]
mkdirSync(resolve(root, 'docs/readme'), { recursive: true })
for (const [file, title, [from, to], text] of BANNERS) {
  writeFileSync(resolve(root, `docs/readme/${file}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="860" height="60" viewBox="0 0 860 60" role="img" aria-label="${title}">
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
  <rect width="860" height="60" rx="10" fill="url(#g)"/>
  <rect x="18" y="18" width="5" height="24" rx="2.5" fill="${text}" opacity="0.85"/>
  <text x="36" y="39" font-family="Georgia, 'Times New Roman', serif" font-size="25" font-weight="700" fill="${text}">${title}</text>
</svg>
`)
}

console.log('Generated og-cover-v3.png and logos/{salescloserpro-hero.webp, services-console.webp, llmadvisor-mark(-still).svg}')
