// Regenerates /screenshots for the README from a fictional demo dataset.
// Run with: npm run screenshots   (see tests/run-e2e.mjs for prerequisites)
//
// The data is loaded through the app's own Backup → Restore, so the pictures show
// exactly what a user with this data would see. Every name, email and number is made up.
const { chromium } = require('playwright-core')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const sharp = require('sharp')
const BASE = process.env.BASE || 'http://localhost:4173'
const OUT = path.join(__dirname, '.out')
const SHOTS = path.join(__dirname, '..', '..', 'screenshots')

const TX = 1.0825 // Texas rate applied to product + labor lines
const day = (n) => new Date(Date.now() + n * 864e5)
const iso = (n) => day(n).toISOString()
const ymd = (n) => day(n).toISOString().slice(0, 10)
const id = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`
const line = (n, type, description, qty, unit, price, model = '') => ({ id: id(n), type, description, model, qty, unit, price })
const total = (lines) => Math.round(lines.reduce((s, l) => s + l.qty * l.price, 0) * TX * 100) / 100

// Every README image is the same 1600×1000 canvas, so the gallery grid is perfectly even:
// captures are scaled to a common height, given rounded corners, and centred side by side.
const CANVAS = { width: 1600, height: 1000, pad: 56, gap: 44 }
async function frame(name, captures, { radius = 16 } = {}) {
  const maxH = CANVAS.height - CANVAS.pad * 2
  const maxW = (CANVAS.width - CANVAS.pad * 2 - CANVAS.gap * (captures.length - 1)) / captures.length
  const tiles = []
  for (const file of captures) {
    const meta = await sharp(file).metadata()
    const scale = Math.min(maxW / meta.width, maxH / meta.height)
    const width = Math.round(meta.width * scale)
    const height = Math.round(meta.height * scale)
    const mask = Buffer.from(`<svg width="${width}" height="${height}"><rect width="${width}" height="${height}" rx="${radius}"/></svg>`)
    tiles.push({ width, height, input: await sharp(file).resize(width, height).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer() })
  }
  const total = tiles.reduce((w, t) => w + t.width, 0) + CANVAS.gap * (tiles.length - 1)
  let left = Math.round((CANVAS.width - total) / 2)
  const layers = []
  for (const t of tiles) {
    const topY = Math.round((CANVAS.height - t.height) / 2)
    // soft outline so light pages (PDFs, the client view) and dark screens both sit cleanly on the canvas
    layers.push({ input: Buffer.from(`<svg width="${t.width + 2}" height="${t.height + 2}"><rect x="0.5" y="0.5" width="${t.width + 1}" height="${t.height + 1}" rx="${radius + 1}" fill="none" stroke="#efe9dc" stroke-opacity="0.22"/></svg>`), left: left - 1, top: topY - 1 })
    layers.push({ input: t.input, left, top: topY })
    left += t.width + CANVAS.gap
  }
  const background = Buffer.from(`<svg width="${CANVAS.width}" height="${CANVAS.height}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0c3a42"/><stop offset="1" stop-color="#071b1f"/></linearGradient></defs><rect width="100%" height="100%" rx="24" fill="url(#g)"/></svg>`)
  await sharp(background).composite(layers).png({ compressionLevel: 9 }).toFile(path.join(SHOTS, `${name}.png`))
  console.log('✓', name)
}

function demoState() {
  const contacts = [
    ['Dana Whitfield', 'Whitfield Residence', 'dana@example.com', '(512) 555-0114'],
    ['Marcus Oyelaran', 'Oyelaran Dental Group', 'marcus@example.com', '(512) 555-0127'],
    ['Priya Raman', '', 'priya@example.com', '(512) 555-0133'],
    ['Greenfield Apartments', 'Greenfield Property Mgmt', 'office@greenfield.example', '(512) 555-0150'],
    ['Tom Becker', 'Becker Hardware', 'tom@example.com', '(512) 555-0168'],
  ].map(([name, company, email, phone], i) => ({ id: id(100 + i), name, company, email, phone, address: '', state: 'TX', notes: '', createdAt: iso(-30 + i) }))
  const c = (i) => ({ contactId: contacts[i].id, clientName: contacts[i].name, clientEmail: contacts[i].email, clientPhone: contacts[i].phone, state: 'TX' })

  const good = [line(1, 'product', '3-tab shingles, 24 squares', 24, 'ea', 310, 'GAF-RS3'), line(2, 'labor', 'Tear-off and install', 1, 'job', 3200)]
  const better = [line(3, 'product', 'Architectural shingles, 24 squares', 24, 'ea', 385, 'GAF-HDZ'), line(4, 'labor', 'Tear-off and install', 1, 'job', 3200), line(5, 'product', 'Ice and water shield', 1, 'lot', 650, 'GAF-WW36')]
  const best = [line(6, 'product', 'Designer shingles, 24 squares', 24, 'ea', 470, 'GAF-GS'), line(7, 'labor', 'Tear-off and install', 1, 'job', 3400), line(8, 'product', 'Ice and water shield', 1, 'lot', 650, 'GAF-WW36'), line(9, 'service', '25-year workmanship warranty', 1, 'job', 900)]
  const dental = [line(10, 'product', 'Standing-seam metal roof, 40 squares', 40, 'ea', 720, 'MBCI-SS24'), line(11, 'labor', 'Install and flashing', 1, 'job', 9800)]
  const dentalBasic = [line(12, 'product', 'TPO membrane, 40 squares', 40, 'ea', 540, 'CAR-TPO60'), line(13, 'labor', 'Install', 1, 'job', 7600)]
  const gutters = [line(14, 'product', 'Seamless gutters, 180 ft', 180, 'ft', 11, 'ALU-K6'), line(15, 'labor', 'Install', 1, 'job', 850)]
  const complex = [line(16, 'product', 'Roof coating, 12 buildings', 12, 'ea', 4200, 'GACO-S20'), line(17, 'labor', 'Prep and application', 12, 'ea', 1900)]
  const repair = [line(18, 'service', 'Storm damage inspection and repair', 1, 'job', 1450)]

  const quotes = [
    { n: 41, ...c(0), status: 'sent', createdAt: iso(-5), sentAt: iso(-4), validUntil: ymd(10), notes: 'Includes tear-off, haul-away and permit. Crew can start within 10 days of acceptance.',
      options: [{ id: 'g', name: 'Good', lines: good }, { id: 'b', name: 'Better', lines: better }, { id: 'x', name: 'Best', lines: best }], recommendedOptionId: 'b', lines: better },
    { n: 42, ...c(1), status: 'won', createdAt: iso(-18), sentAt: iso(-17), validUntil: ymd(12), notes: '',
      options: [{ id: 'm1', name: 'Membrane', lines: dentalBasic }, { id: 'm2', name: 'Metal', lines: dental }], recommendedOptionId: 'm2', lines: dental,
      acceptance: { name: 'Marcus Oyelaran', at: iso(-12), optionId: 'm2', fingerprint: '3F9A-1C22-7B0E', versionMatched: true } },
    { n: 43, ...c(2), status: 'draft', createdAt: iso(-1), validUntil: ymd(29), notes: '', lines: gutters },
    { n: 44, ...c(3), status: 'sent', createdAt: iso(-9), sentAt: iso(-8), validUntil: ymd(21), notes: '', lines: complex },
    { n: 45, ...c(4), status: 'lost', createdAt: iso(-25), sentAt: iso(-24), validUntil: ymd(-3), notes: '', lines: repair },
  ].map(({ n, ...q }) => ({ id: id(n), quoteNumber: `Q-00${n}`, attachments: [], total: total(q.lines), ...q }))

  const purchaseOrders = [
    { id: id(201), poNumber: 'PO-0007', quoteId: id(42), lineId: id(10), vendor: 'Lone Star Metal Supply', vendorContact: 'Order desk · (512) 555-0190', shipToAddress: '', description: '', qty: 40, unitCost: 498, status: 'ordered', notes: '', createdAt: iso(-11), issuedAt: iso(-11) },
    { id: id(202), poNumber: 'PO-0008', quoteId: id(42), lineId: id(11), vendor: 'Hill Country Roofing Crew', vendorContact: '', shipToAddress: '', description: '', qty: 1, unitCost: 6100, status: 'issued', notes: '', createdAt: iso(-10), issuedAt: iso(-10) },
  ]
  return { version: 0, state: {
    theme: 'dark',
    company: { name: 'Summit Roofing Co.', logo: '', address: '410 Congress Ave, Austin, TX 78701', phone: '(512) 555-0142', email: 'jobs@summitroofing.example', website: 'summitroofing.example', homeState: 'TX', defaultValidDays: 30 },
    clients: contacts, quotes, quoteCounter: 45, purchaseOrders, poCounter: 8,
  } }
}

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  fs.mkdirSync(SHOTS, { recursive: true })
  const backup = path.join(OUT, 'demo-backup.json')
  fs.writeFileSync(backup, JSON.stringify(demoState()))

  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5, acceptDownloads: true, permissions: ['clipboard-read', 'clipboard-write'] })
  const page = await ctx.newPage()
  page.on('dialog', (d) => d.accept())
  const go = async (route) => { await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' }); await page.waitForTimeout(500) }
  const raw = (name) => path.join(OUT, `raw-${name}.png`)
  const capture = async (name, target = page) => { await target.screenshot({ path: raw(name) }); return raw(name) }

  // The landing page is the README's hero image and is used as captured.
  await go('/')
  await page.screenshot({ path: path.join(SHOTS, 'landing.png') })
  console.log('✓ landing')

  await go('/backup')
  await page.locator('input[type=file][accept*="json"]').setInputFiles(backup)
  await page.click('button:has-text("Restore This Backup")')
  await page.waitForTimeout(2500)

  // ── app screens: one 1280×800 window each ──
  for (const name of ['dashboard', 'pipeline', 'contacts', 'purchase-orders', 'export']) {
    await go(`/${name}`)
    await frame(name, [await capture(name)])
  }

  await go('/quotes')
  await page.click('text=Q-0041')
  await page.waitForTimeout(600)
  // show the contact picker, the three options and the first line item with its model number
  await page.locator('h2:has-text("Line Items")').evaluate((el) => el.scrollIntoView({ block: 'center' }))
  await page.waitForTimeout(400)
  // the sidebar has scrolled out of view here, so capture the working area only
  const main = await page.locator('main').boundingBox()
  await page.screenshot({ path: raw('quote-builder'), clip: { x: main.x, y: 0, width: 1280 - main.x, height: 800 } })
  await frame('quote-builder', [raw('quote-builder')])

  // ── what the client sees: the real proposal link on a phone, top and accept panel ──
  await page.locator('button:has-text("Send")').first().click()
  const url = await page.locator('[role=dialog] input[aria-label="Proposal link"]').inputValue()
  await page.keyboard.press('Escape')
  const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
  const client = await phone.newPage()
  await client.goto(url, { waitUntil: 'networkidle' })
  await client.waitForTimeout(500)
  const top = await capture('client-top', client)
  await client.locator('text=What\'s included in').evaluate((el) => el.scrollIntoView({ block: 'start' }))
  await client.evaluate(() => window.scrollBy(0, -24))
  const middle = await capture('client-items', client)
  await client.fill('#acc-name', 'Dana Whitfield')
  await client.check('input[type=checkbox]')
  await client.locator('h2:has-text("Ready to go ahead?")').evaluate((el) => el.scrollIntoView({ block: 'center' }))
  await client.waitForTimeout(300)
  const accept = await capture('client-accept', client)
  await frame('client-proposal', [top, middle, accept], { radius: 34 })

  // ── documents: Business Summary and the proposal PDF, first pages ──
  await go('/export')
  const [summary] = await Promise.all([page.waitForEvent('download'), page.click('button:has-text("Download PDF")')])
  await summary.saveAs(path.join(OUT, 'summary.pdf'))
  await go('/quotes')
  await page.click('text=Q-0041')
  await page.waitForTimeout(600)
  const [proposal] = await Promise.all([page.waitForEvent('download'), page.click('button:has-text("Export PDF")')])
  await proposal.saveAs(path.join(OUT, 'proposal.pdf'))
  for (const doc of ['summary', 'proposal']) execSync(`pdftoppm -r 110 -png -f 1 -l 1 -singlefile "${path.join(OUT, doc + '.pdf')}" "${path.join(OUT, 'raw-' + doc)}"`)
  await frame('documents', [raw('proposal'), raw('summary')], { radius: 6 })

  await browser.close()
})()
