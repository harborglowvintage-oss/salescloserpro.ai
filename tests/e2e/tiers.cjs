// E2E: Good/Better/Best quote → save → list → PDF → reload persistence
const { chromium } = require('playwright-core')
const BASE = process.env.BASE || 'http://localhost:4173'
const OUT = require('path').join(__dirname, '.out')
let pass = 0, fail = 0
const ok = (c, m) => { c ? pass++ : fail++; console.log(`${c ? '✓' : '✗'} ${m}`) }

;(async () => {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 }, acceptDownloads: true })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

  await page.goto(`${BASE}/quotes/new`, { waitUntil: 'networkidle' })
  await page.fill('input[placeholder="Acme Corp"]', 'Riverside Dental')
  await page.fill('input[placeholder="client@email.com"]', 'office@riverside.example')
  await page.fill('input[placeholder^="Describe this"]', 'Roof replacement — architectural shingles')
  await page.fill('input[placeholder="0.00"]', '8000')

  // single → tiered
  await page.click('text=Offer Good / Better / Best')
  ok(await page.locator('[role=tab]').count() === 2, 'two option tabs after "Offer Good / Better / Best"')
  // Better (active, copy of Good): raise price, add a line
  await page.locator('input[placeholder="0.00"]').first().fill('9500')
  await page.click('button:has-text("Install / Labor")')
  await page.locator('input[placeholder^="Describe this install"]').fill('Ice & water shield upgrade')
  await page.locator('input[placeholder="0.00"]').nth(1).fill('1200')
  await page.click('text=Add option')
  ok(await page.locator('[role=tab]').count() === 3, 'three option tabs after "Add option"')
  ok(await page.locator('text=Add option').count() === 0, '"Add option" hidden at max 3')
  await page.locator('input[placeholder="0.00"]').first().fill('11800')

  // recommend "Better"
  await page.locator('[role=tab]').nth(1).locator('button[title="Mark as recommended"]').click()
  const tabsText = await page.locator('[role=tablist]').innerText()
  ok(/Recommended/.test(tabsText), 'recommended marker shown')
  const betterTotal = (await page.locator('[role=tab]').nth(1).innerText()).match(/\$[\d,]+\.\d\d/)[0]
  console.log('  Better tab total:', betterTotal)
  await page.screenshot({ path: `${OUT}/tiers-builder.png`, fullPage: false })

  await page.locator('button:has-text("Save Quote")').click()
  await page.waitForURL(/\/quotes\/[0-9a-f-]{36}$/)

  // list shows chosen (recommended) total and tier badge
  await page.goto(`${BASE}/quotes`, { waitUntil: 'networkidle' })
  const row = await page.locator('.card', { hasText: 'Riverside Dental' }).innerText()
  ok(/3 options/.test(row), 'quote list shows "3 options" badge')
  ok(row.includes(betterTotal), `list total = recommended option total (${betterTotal})`)

  // reload → persisted
  await page.reload({ waitUntil: 'networkidle' })
  ok(await page.locator('text=Riverside Dental').count() === 1, 'quote persists across reload (IndexedDB)')

  // pipeline deal value follows the chosen option
  await page.goto(`${BASE}/pipeline`, { waitUntil: 'networkidle' })
  ok((await page.locator('body').innerText()).includes(betterTotal.replace(/\.\d\d$/, '').slice(1)), 'pipeline deal value = recommended option total')

  // PDF
  await page.goto(`${BASE}/quotes`, { waitUntil: 'networkidle' })
  await page.click('text=Riverside Dental')
  await page.waitForURL(/\/quotes\/[0-9a-f-]{36}$/)
  ok(await page.locator('[role=tab]').count() === 3, 'builder reopens with 3 options')
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('button:has-text("Export PDF")')])
  const pdfPath = `${OUT}/tiers.pdf`
  await dl.saveAs(pdfPath)
  ok(true, `PDF downloaded → ${dl.suggestedFilename()}`)

  ok(errors.length === 0, `no console/page errors ${errors.length ? JSON.stringify(errors) : ''}`)
  console.log(`\n${pass} passed, ${fail} failed`)
  await browser.close()
  process.exit(fail ? 1 : 0)
})()
