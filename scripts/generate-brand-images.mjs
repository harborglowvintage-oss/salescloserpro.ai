/**
 * Generates every derived brand image from the sources in /brand:
 *   public/og-cover-v3.png              1200×630 social / Google card (LLMadvisor split layout)
 *   public/logos/salescloserpro-hero.webp  landing hero art (the handshake), 720px
 *   public/logos/llmadvisor-mark.png    128px alpha mask of the LLMadvisor atom (tinted in CSS)
 *
 * Run: npm run generate-images
 */

import sharp from 'sharp'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = (p) => resolve(root, 'brand', p)
const out = (p) => resolve(root, 'public', p)

// LLMadvisor tokens (mirror tailwind.config.js)
const T = {
  ink: '#071b1f', teal: '#0c3a42', teal2: '#124a53', cyan: '#1c9fb0',
  paper: '#f7f4ed', cream: '#e9e4d8', muted: '#a9bcbd', copper: '#c2703a',
}

/* ── hero art ── */
await sharp(src('salescloserpro-art.png'))
  .resize(720, 720)
  .webp({ quality: 84 })
  .toFile(out('logos/salescloserpro-hero.webp'))

/* ── LLMadvisor mark: keep only the alpha channel, painted black (CSS mask uses alpha) ── */
await sharp(src('llmadvisor-mark.png'))
  .resize(128, 128)
  .png({ compressionLevel: 9 })
  .toFile(out('logos/llmadvisor-mark.png'))

/* ── OG card ── */
const W = 1200, H = 630, PANEL = 440
const art = await sharp(src('salescloserpro-art.png')).resize(300, 300).png().toBuffer()
const artRounded = await sharp(art)
  .composite([{ input: Buffer.from(`<svg width="300" height="300"><rect width="300" height="300" rx="22" ry="22"/></svg>`), blend: 'dest-in' }])
  .png().toBuffer()
const mark = await sharp(src('llmadvisor-mark.png'))
  .resize(44, 44)
  .composite([{ input: { create: { width: 44, height: 44, channels: 4, background: T.cream } }, blend: 'in' }])
  .png().toBuffer()

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
    <text x="${PANEL + 132}" y="532" font-family="DejaVu Sans Mono, monospace" font-size="21" font-weight="700" fill="${T.cream}">an llmadvisor.ai studio project</text>
  </g>
</svg>`

await sharp(Buffer.from(svg))
  .composite([
    { input: artRounded, left: (PANEL - 300) / 2, top: (H - 300) / 2 },
    { input: mark, left: PANEL + 74, top: 500 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(out('og-cover-v3.png'))

console.log('✅  Generated og-cover-v3.png, logos/salescloserpro-hero.webp, logos/llmadvisor-mark.png')
