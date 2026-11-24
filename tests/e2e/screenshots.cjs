// Regenerates /screenshots for the README from a fictional demo dataset.
// Run with: npm run screenshots   (see tests/run-e2e.mjs for prerequisites)
//
// The data is loaded through the app's own Backup → Restore, so the pictures show
// exactly what a user with this data would see. Every name, email and number is made up.
const { chromium } = require('playwright-core')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
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
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, deviceScaleFactor: 1.5, acceptDownloads: true, permissions: ['clipboard-read', 'clipboard-write'] })
  const page = await ctx.newPage()
  page.on('dialog', (d) => d.accept())
  const go = async (route) => { await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' }); await page.waitForTimeout(500) }
  const shot = async (name, opts = {}) => { await page.screenshot({ path: path.join(SHOTS, `${name}.png`), ...opts }); console.log('✓', name) }

  await go('/')
  await shot('landing')

  await go('/backup')
  await page.locator('input[type=file][accept*="json"]').setInputFiles(backup)
  await page.click('button:has-text("Restore This Backup")')
  await page.waitForTimeout(2500)

  await go('/dashboard'); await shot('dashboard')
  await go('/contacts'); await shot('contacts')
  await go('/pipeline'); await shot('pipeline')
  await go('/purchase-orders'); await shot('purchase-orders')
  await go('/export'); await shot('export')

  await go('/quotes')
  await page.click('text=Q-0041')
  await page.waitForTimeout(600)
  // Both images in this README row are cut at a content boundary, never through a card.
  // Quote builder: from the top of the page to just below the "add line" buttons.
  await page.setViewportSize({ width: 1280, height: 2400 })
  await page.waitForTimeout(400)
  const addButtons = await page.locator('button:has-text("Freight")').boundingBox()
  const builderHeight = Math.round(addButtons.y + addButtons.height + 28)
  await shot('quote-builder', { clip: { x: 0, y: 0, width: 1280, height: builderHeight } })
  await page.setViewportSize({ width: 1280, height: 860 })

  // The client's view of the same quote, from the real Send dialog link:
  // from the letterhead to just below the last option card.
  await page.locator('button:has-text("Send")').first().click()
  const url = await page.locator('[role=dialog] input[aria-label="Proposal link"]').inputValue()
  await page.keyboard.press('Escape')
  const phone = await browser.newContext({ viewport: { width: 390, height: 2400 }, deviceScaleFactor: 2 })
  const client = await phone.newPage()
  await client.goto(url, { waitUntil: 'networkidle' })
  await client.waitForTimeout(500)
  const options = await client.locator('[role=radiogroup]').boundingBox()
  const clientHeight = Math.round(options.y + options.height + 24)
  await client.screenshot({ path: path.join(SHOTS, 'client-proposal.png'), clip: { x: 0, y: 0, width: 390, height: clientHeight } })
  // README column widths that make the two images the same displayed height
  const share = Math.round((100 * (builderHeight / 1280)) / (builderHeight / 1280 + clientHeight / 390))
  console.log(`  README row widths → quote-builder ${100 - share}% · client-proposal ${share}%`)
  console.log('✓ client-proposal')

  // Business Summary PDF → first page as an image
  await go('/export')
  const [pdf] = await Promise.all([page.waitForEvent('download'), page.click('button:has-text("Download PDF")')])
  const pdfPath = path.join(OUT, 'summary.pdf')
  await pdf.saveAs(pdfPath)
  execSync(`pdftoppm -r 110 -png -f 1 -l 1 -singlefile "${pdfPath}" "${path.join(SHOTS, 'business-summary')}"`)
  console.log('✓ business-summary')

  await browser.close()
})()
