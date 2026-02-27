/**
 * Generates public/og-cover.png — 1200×630 OG social card
 * Run: node scripts/generate-og.mjs
 */

import sharp from 'sharp'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const W = 1200
const H = 630

/* ── logo ── */
const logoPath = resolve(root, 'public/logos/salescloserprologo.png')
const logoSize = 160
const logoResized = await sharp(readFileSync(logoPath))
  .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer()

/* ── SVG overlay: background + text ── */
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#0f172a"/>
      <stop offset="55%"  stop-color="#0f1f3d"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
    <!-- subtle grid -->
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(99,102,241,0.07)" stroke-width="1"/>
    </pattern>
    <!-- glow orbs -->
    <radialGradient id="glow1" cx="20%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="80%" cy="70%" r="50%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#glow1)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <!-- accent bar top -->
  <rect x="0" y="0" width="${W}" height="4" fill="url(#accent)"/>

  <!-- logo placeholder (composited separately) -->

  <!-- wordmark -->
  <text
    x="${W / 2}" y="284"
    font-family="Inter, -apple-system, sans-serif"
    font-size="72" font-weight="800"
    fill="#ffffff"
    text-anchor="middle"
    letter-spacing="-2"
  >SalesCloserPro</text>

  <!-- tagline -->
  <text
    x="${W / 2}" y="346"
    font-family="Inter, -apple-system, sans-serif"
    font-size="28" font-weight="500"
    fill="#94a3b8"
    text-anchor="middle"
    letter-spacing="0"
  >Free Sales CRM · Quoting · Pipeline · POs · PDF Export</text>

  <!-- badge pill -->
  <rect x="${W/2 - 110}" y="392" width="220" height="44" rx="22" fill="rgba(59,130,246,0.15)" stroke="rgba(99,130,246,0.4)" stroke-width="1.5"/>
  <text
    x="${W / 2}" y="420"
    font-family="Inter, -apple-system, sans-serif"
    font-size="18" font-weight="700"
    fill="#93c5fd"
    text-anchor="middle"
    letter-spacing="0.5"
  >100% FREE &amp; OPEN SOURCE</text>

  <!-- domain -->
  <text
    x="${W / 2}" y="560"
    font-family="Inter, -apple-system, sans-serif"
    font-size="22" font-weight="600"
    fill="#475569"
    text-anchor="middle"
    letter-spacing="1"
  >salescloserpro.ai</text>

  <!-- powered by -->
  <text
    x="${W / 2}" y="596"
    font-family="Inter, -apple-system, sans-serif"
    font-size="15" font-weight="400"
    fill="#334155"
    text-anchor="middle"
  >Powered by highsignal™ · llmadvisor.ai</text>

  <!-- bottom accent bar -->
  <rect x="0" y="${H - 4}" width="${W}" height="4" fill="url(#accent)"/>
</svg>
`

/* ── composite ── */
const svgBuffer = Buffer.from(svg)

// logo position: centered horizontally, above wordmark
const logoX = Math.round((W - logoSize) / 2)
const logoY = 88

await sharp(svgBuffer)
  .composite([
    {
      input: logoResized,
      top: logoY,
      left: logoX,
    }
  ])
  .png({ compressionLevel: 9 })
  .toFile(resolve(root, 'public/og-cover.png'))

console.log('✅  Generated public/og-cover.png (1200×630)')
