// E2E: valid-until default from settings → send → follow-up panel + .ics → time-travel:
// dashboard due list, mark done via Email, expiry badge, expired client page
const { chromium } = require('playwright-core')
const fs = require('fs')
const BASE = process.env.BASE || 'http://localhost:4173'
const OUT = require('path').join(__dirname, '.out')
let pass = 0, fail = 0
const ok = (c, m) => { c ? pass++ : fail++; console.log(`${c ? '✓' : '✗'} ${m}`) }
const day = (iso, n) => new Date(new Date(iso).getTime() + n * 864e5)

;(async () => {
  const T0 = '2026-11-24T10:00:00'
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 }, acceptDownloads: true, permissions: ['clipboard-read', 'clipboard-write'] })
  await ctx.clock.install({ time: new Date(T0) })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

  await page.goto(`${BASE}/settings`, { waitUntil: 'networkidle' })
  await page.fill('input[placeholder="Acme Corp"]', 'Summit Roofing Co.')
  await page.fill('input[placeholder="hello@acmecorp.com"]', 'jobs@summitroofing.example')
  await page.fill('#valid-days', '14')
  await page.click('button:has-text("Save Company Info")')

  await page.goto(`${BASE}/quotes/new`, { waitUntil: 'networkidle' })
  ok(await page.inputValue('#valid-until') === '2026-12-08', 'new quote: valid-until = today + 14 days (from settings)')
  await page.fill('input[placeholder="Acme Corp"]', 'Dana Whitfield')
  await page.fill('input[placeholder="client@email.com"]', 'dana@example.com')
  await page.fill('input[placeholder^="Describe this"]', 'Gutter replacement')
  await page.fill('input[placeholder="0.00"]', '2400')
  ok(await page.locator('text=Follow-ups').count() === 0, 'no follow-up panel before sending')

  await page.locator('button:has-text("Send")').first().click()
  const dialog = page.locator('[role=dialog]')
  await dialog.locator('button:has-text("Copy")').click()
  const url = await dialog.locator('input[aria-label="Proposal link"]').inputValue()
  await page.keyboard.press('Escape')

  const panel = page.locator('.card', { hasText: 'Follow-ups' })
  await panel.waitFor()
  const ptxt = await panel.innerText()
  ok(/Check in[\s\S]*Nov 27 · in 3 days/.test(ptxt), 'panel: check-in Nov 27 (in 3 days)')
  ok(/Offer to adjust[\s\S]*Dec 1 · in 7 days/.test(ptxt), 'panel: offer-to-adjust Dec 1')
  ok(/Expiry reminder[\s\S]*Dec 6 · in 12 days/.test(ptxt), 'panel: expiry reminder Dec 6 (2 days before Dec 8)')
  await page.screenshot({ path: `${OUT}/followups-panel.png` })

  const [ics] = await Promise.all([page.waitForEvent('download'), panel.locator('button:has-text("Add to calendar")').click()])
  ok(ics.suggestedFilename() === 'Q-0001-follow-ups.ics', 'calendar file downloaded')
  const icsText = fs.readFileSync(await ics.path(), 'utf8')
  ok((icsText.match(/BEGIN:VEVENT/g) || []).length === 4 && icsText.includes('DTSTART;VALUE=DATE:20261127') && icsText.includes('DTSTART;VALUE=DATE:20261208'), '.ics: 4 events incl. Nov 27 and expiry Dec 8')

  await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' })
  let dash = await page.locator('.card', { hasText: 'Follow-ups due' }).innerText()
  ok(/all caught up/.test(dash) && /2 more coming up in the next 7 days/.test(dash), 'dashboard today: caught up, 2 coming this week')

  // +4 days → check-in overdue
  await page.clock.setSystemTime(day(T0, 4))
  await page.reload({ waitUntil: 'networkidle' })
  dash = await page.locator('.card', { hasText: 'Follow-ups due' }).innerText()
  ok(/Check in · Dana Whitfield/.test(dash) && /Nov 27 · 1 day overdue/.test(dash), 'dashboard +4d: check-in 1 day overdue')
  await page.screenshot({ path: `${OUT}/followups-dashboard.png` })
  await page.locator('.card', { hasText: 'Follow-ups due' }).locator('button:has-text("Email")').click()
  await page.waitForTimeout(300)
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' })
  ok(/all caught up/.test(await page.locator('.card', { hasText: 'Follow-ups due' }).innerText()), 'Email marks the step done')

  // undo from the quote panel
  await page.goto(`${BASE}/quotes`, { waitUntil: 'networkidle' })
  await page.click('text=Dana Whitfield')
  await page.locator('.card', { hasText: 'Follow-ups' }).locator('button[title="Mark as not done"]').click()
  await page.waitForTimeout(400) // async IndexedDB write before reload
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' })
  ok(/Check in · Dana Whitfield/.test(await page.locator('.card', { hasText: 'Follow-ups due' }).innerText()), 'un-ticking brings it back')

  // +16 days → expired
  await page.clock.setSystemTime(day(T0, 16))
  await page.goto(`${BASE}/quotes`, { waitUntil: 'networkidle' })
  ok(/Expired/.test(await page.locator('.card', { hasText: 'Dana Whitfield' }).innerText()), 'quote list: Expired badge after valid-until')
  const client = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await client.clock.install({ time: day(T0, 16) })
  const cp = await client.newPage()
  await cp.goto(url, { waitUntil: 'networkidle' })
  const ctext = await cp.locator('body').innerText()
  ok(/expired on December 8, 2026/.test(ctext) && (await cp.locator('button:has-text("Accept proposal")').count()) === 0, 'client page: expired notice, no accept button')

  // client, day 5 → "days left" hint
  const c2 = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await c2.clock.install({ time: day(T0, 9) })
  const cp2 = await c2.newPage()
  await cp2.goto(url, { waitUntil: 'networkidle' })
  ok(/5 days left/.test(await cp2.locator('body').innerText()), 'client page: "5 days left" in the final week')

  ok(errors.length === 0, `no console/page errors ${errors.length ? JSON.stringify(errors) : ''}`)
  console.log(`\n${pass} passed, ${fail} failed`)
  await browser.close()
  process.exit(fail ? 1 : 0)
})()
