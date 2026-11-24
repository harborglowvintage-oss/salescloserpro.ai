// E2E: company setup → tiered quote → Send (link) → client opens /p#… in a separate
// browser context (no shared storage) → accepts "Best" → seller opens /accept#… → Won
const { chromium } = require('playwright-core')
const BASE = process.env.BASE || 'http://localhost:4173'
const OUT = require('path').join(__dirname, '.out')
let pass = 0, fail = 0
const ok = (c, m) => { c ? pass++ : fail++; console.log(`${c ? '✓' : '✗'} ${m}`) }

;(async () => {
  const browser = await chromium.launch()
  const seller = await browser.newContext({ viewport: { width: 1280, height: 1000 }, acceptDownloads: true, permissions: ['clipboard-read', 'clipboard-write'] })
  const page = await seller.newPage()
  const errors = []
  const watch = (p, who) => { p.on('pageerror', (e) => errors.push(`${who}: ${e.message}`)); p.on('console', (m) => m.type() === 'error' && errors.push(`${who}: ${m.text()}`)) }
  watch(page, 'seller')

  // company
  await page.goto(`${BASE}/settings`, { waitUntil: 'networkidle' })
  await page.fill('input[placeholder="Acme Corp"]', 'Summit Roofing Co.')
  await page.fill('input[placeholder="(512) 555-0100"]', '(512) 555-0142')
  await page.fill('input[placeholder="hello@acmecorp.com"]', 'jobs@summitroofing.example')
  await page.click('button:has-text("Save Company Info")')
  await page.waitForTimeout(400) // let the async IndexedDB write land before a full reload

  // tiered quote
  await page.goto(`${BASE}/quotes/new`, { waitUntil: 'networkidle' })
  await page.fill('input[placeholder="Acme Corp"]', 'Dana Whitfield')
  await page.fill('input[placeholder="client@email.com"]', 'dana@example.com')
  await page.fill('input[placeholder^="Describe this"]', 'Roof replacement — 3-tab shingles')
  await page.fill('input[placeholder="0.00"]', '8000')
  await page.fill('textarea', 'Includes tear-off, haul-away and 10-year workmanship warranty.')
  await page.click('text=Offer Good / Better / Best')
  await page.locator('input[placeholder="0.00"]').first().fill('9500')
  await page.click('text=Add option')
  await page.locator('input[placeholder="0.00"]').first().fill('11800')
  await page.locator('[role=tab]').nth(1).locator('button[title="Mark as recommended"]').click()

  // Send (new, unsaved quote → saves, opens dialog)
  await page.locator('button:has-text("Send")').first().click()
  const dialog = page.locator('[role=dialog]')
  await dialog.waitFor()
  const url = await dialog.locator('input[aria-label="Proposal link"]').inputValue()
  ok(/\/p#z[A-Za-z0-9_-]+$/.test(url), `proposal link generated (${url.length} chars)`)
  ok(page.url().match(/\/quotes\/[0-9a-f-]{36}$/), 'new quote saved before sending')
  const mailHref = await dialog.locator('a:has-text("Email")').getAttribute('href')
  ok(mailHref.startsWith('mailto:dana@example.com?subject=Proposal%20Q-0001%20from%20Summit%20Roofing'), 'email draft addressed to client with subject')
  ok(decodeURIComponent(mailHref).includes(url), 'email body contains the proposal link')
  await dialog.locator('button:has-text("Copy")').click()
  ok((await page.evaluate(() => navigator.clipboard.readText())) === url, 'copy puts the link on the clipboard')
  await page.screenshot({ path: `${OUT}/share-dialog.png` })
  await page.keyboard.press('Escape')
  ok(/SENT/i.test(await page.locator('select').first().inputValue()), 'quote marked Sent once the link left the app')

  // client — fresh context, no access to seller storage
  const client = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true })
  const cp = await client.newPage()
  watch(cp, 'client')
  let mailtoNav = null
  await cp.route(/^mailto:/, (r) => { mailtoNav = r.request().url(); r.abort() })
  await cp.goto(url, { waitUntil: 'networkidle' })
  const body = await cp.locator('body').innerText()
  ok(body.includes('Summit Roofing Co.') && body.includes('Dana Whitfield') && body.includes('Q-0001'), 'client page shows company, client, number')
  ok(await cp.locator('[role=radio]').count() === 3, 'client sees 3 options')
  ok((await cp.locator('[role=radio][aria-checked=true]').innerText()).includes('Better'), 'recommended option preselected')
  ok(body.includes('10-year workmanship warranty'), 'notes shown')
  await cp.screenshot({ path: `${OUT}/client-proposal.png`, fullPage: true })
  await cp.locator('[role=radio]', { hasText: 'Best' }).click()
  const bestTotal = (await cp.locator('[role=radio]', { hasText: 'Best' }).innerText()).match(/\$[\d,]+\.\d\d/)[0]
  ok(await cp.locator('button:has-text("Accept proposal")').isDisabled(), 'accept disabled until name + consent')
  await cp.fill('#acc-name', 'Dana Whitfield')
  await cp.check('input[type=checkbox]')
  const [pdf] = await Promise.all([cp.waitForEvent('download'), cp.click('text=Download PDF')])
  ok(/Q-0001\.pdf/.test(pdf.suggestedFilename()), 'client can download the PDF')
  await cp.click('button:has-text("Accept proposal")')
  await cp.locator('text=Accepted — thank you').waitFor()
  const confirmHref = await cp.locator('a:has-text("Send confirmation email")').getAttribute('href')
  ok(confirmHref.startsWith('mailto:jobs@summitroofing.example?subject=Accepted%3A%20proposal%20Q-0001'), 'confirmation email drafted to the seller')
  const confirmBody = decodeURIComponent(confirmHref)
  ok(confirmBody.includes('Best option') && confirmBody.includes(bestTotal), `confirmation names option + total (${bestTotal})`)
  const acceptUrl = confirmBody.match(/https?:\/\/\S+\/accept#\S+/)[0]
  await cp.screenshot({ path: `${OUT}/client-accepted.png`, fullPage: false })

  // seller records it (fresh load → exercises hydration gate)
  await page.goto(acceptUrl, { waitUntil: 'networkidle' })
  const acc = await page.locator('main').innerText()
  ok(acc.includes('Dana Whitfield accepted Q-0001'), 'seller sees the acceptance')
  ok(acc.includes('Option: Best') && acc.includes(bestTotal), 'seller sees accepted option + total')
  ok(/matches the quote as it is now/.test(acc), 'version fingerprint matches')
  await page.screenshot({ path: `${OUT}/seller-accept.png` })
  await page.click('button:has-text("Record acceptance")')
  await page.waitForURL(/\/quotes\/[0-9a-f-]{36}$/)
  ok(/WON/i.test(await page.locator('select').first().inputValue()), 'quote marked Won')
  await page.goto(`${BASE}/quotes`, { waitUntil: 'networkidle' })
  const row = await page.locator('.card', { hasText: 'Dana Whitfield' }).innerText()
  ok(/Accepted online/.test(row) && row.includes(bestTotal), 'list: "Accepted online" + total switched to the accepted option')

  // edited-after-send → mismatch warning
  await page.click('text=Dana Whitfield')
  await page.waitForURL(/\/quotes\/[0-9a-f-]{36}$/)
  await page.fill('textarea', 'Changed after sending.')
  await page.click('button:has-text("Save Quote")')
  await page.waitForTimeout(400) // let the async IndexedDB write land before a full reload
  await page.goto(acceptUrl, { waitUntil: 'networkidle' })
  ok(/edited since/.test(await page.locator('main').innerText()), 'edited quote → version mismatch warning')
  ok(/already recorded/.test(await page.locator('main').innerText()), 'duplicate acceptance not re-recorded')

  // tampered / truncated link
  await cp.goto(url.slice(0, url.length - 25), { waitUntil: 'networkidle' })
  await cp.waitForTimeout(500)
  const tb = await cp.locator('body').innerText()
  ok(/incomplete/.test(tb), 'truncated link (same tab) → friendly error' + (/incomplete/.test(tb) ? '' : ' :: ' + tb.slice(0, 160)))
  const fresh = await client.newPage()
  await fresh.goto(url.slice(0, url.length - 25), { waitUntil: 'networkidle' })
  ok(/incomplete/.test(await fresh.locator('body').innerText()), 'truncated link (new tab) → friendly error')

  ok(errors.length === 0, `no console/page errors ${errors.length ? JSON.stringify(errors) : ''}`)
  console.log(`\n${pass} passed, ${fail} failed`)
  await browser.close()
  process.exit(fail ? 1 : 0)
})()
