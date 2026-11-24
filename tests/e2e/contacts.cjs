// E2E: contacts ⇄ quotes ⇄ deals
const { chromium } = require('playwright-core')
const BASE = process.env.BASE || 'http://localhost:4173'
const OUT = require('path').join(__dirname, '.out')
let pass = 0, fail = 0
const ok = (c, m) => { c ? pass++ : fail++; console.log(`${c ? '✓' : '✗'} ${m}`) }
const settle = (p) => p.waitForTimeout(400) // async IndexedDB write before a full reload

;(async () => {
  const browser = await chromium.launch()
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 1000 } })).newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  const card = (name) => page.locator('.card', { hasText: name })

  // 1. quote for a new person → contact auto-created and linked
  await page.goto(`${BASE}/quotes/new`, { waitUntil: 'networkidle' })
  await page.fill('input[placeholder="Acme Corp"]', 'Dana Whitfield')
  await page.fill('input[placeholder="client@email.com"]', 'dana@example.com')
  await page.fill('input[placeholder="(555) 000-0000"]', '(512) 555-0100')
  await page.fill('input[placeholder^="Describe this"]', 'Gutter replacement')
  await page.fill('input[placeholder="0.00"]', '2000')
  await page.click('button:has-text("Save Quote")')
  await page.waitForURL(/\/quotes\/[0-9a-f-]{36}$/)
  ok(await page.locator('text=Contact').first().isVisible(), 'builder shows the quote is linked to a contact after save')
  await settle(page)

  await page.goto(`${BASE}/contacts`, { waitUntil: 'networkidle' })
  let dana = await card('Dana Whitfield').innerText()
  ok(/1 contact/.test(await page.locator('body').innerText()), 'saving a quote created exactly one contact')
  ok(/dana@example\.com/.test(dana) && /\(512\) 555-0100/.test(dana), 'contact carries the email + phone typed on the quote')
  ok(/Q-0001/.test(dana) && /DRAFT/.test(dana) && /\$2,165\.00/.test(dana), 'contact card lists the quote with status and total')
  ok(/Open \$2,165\.00/.test(dana.replace(/\n/g, ' ')), 'contact card: open value from the linked deal')

  // 2. second quote: pick the contact from the type-ahead
  await page.goto(`${BASE}/quotes/new`, { waitUntil: 'networkidle' })
  await page.locator('input[placeholder="Acme Corp"]').pressSequentially('dan')
  await page.locator('[role=option]', { hasText: 'Dana Whitfield' }).click()
  ok(await page.inputValue('input[placeholder="client@email.com"]') === 'dana@example.com', 'picking a contact fills email')
  ok(await page.inputValue('input[placeholder="(555) 000-0000"]') === '(512) 555-0100', 'picking a contact fills phone')
  await page.fill('input[placeholder^="Describe this"]', 'Downspouts')
  await page.fill('input[placeholder="0.00"]', '500')
  await page.click('button:has-text("Save Quote")')
  await page.waitForURL(/\/quotes\/[0-9a-f-]{36}$/)
  await settle(page)
  await page.goto(`${BASE}/contacts`, { waitUntil: 'networkidle' })
  dana = await card('Dana Whitfield').innerText()
  ok(/1 contact/.test(await page.locator('body').innerText()) && /Q-0001/.test(dana) && /Q-0002/.test(dana), 'second quote linked to the SAME contact (no duplicate)')

  // 3. same email, different spelling → still the same contact
  await page.goto(`${BASE}/quotes/new`, { waitUntil: 'networkidle' })
  await page.fill('input[placeholder="Acme Corp"]', 'D. Whitfield')
  await page.fill('input[placeholder="client@email.com"]', 'DANA@example.com')
  await page.fill('input[placeholder="0.00"]', '100')
  await page.click('button:has-text("Save Quote")')
  await page.waitForURL(/\/quotes\/[0-9a-f-]{36}$/)
  await settle(page)

  // 4. pipeline: quote deals show the contact; manual deal creates/links one
  await page.goto(`${BASE}/pipeline`, { waitUntil: 'networkidle' })
  ok(await page.locator('button[title="Open contact"]', { hasText: 'Dana Whitfield' }).count() === 3, 'all three quote deals carry the contact chip (email match ignored case + name)')
  await page.locator('button:has-text("Add Deal")').first().click()
  await page.fill('input[placeholder="Contact name *"]', 'Bob Lee')
  await page.fill('input[placeholder="Deal value"]', '5000')
  await page.click('button:has-text("Add"):not(:has-text("Deal"))')
  ok(await page.locator('button[title="Open contact"]', { hasText: 'Bob Lee' }).count() === 1, 'manual deal linked to a new contact')
  await page.screenshot({ path: `${OUT}/contacts-pipeline.png` })
  await page.locator('button[title="Open contact"]', { hasText: 'Bob Lee' }).click()
  await page.waitForURL(/\/contacts\?q=Bob/)
  const bob = await card('Bob Lee').innerText()
  ok(/Deal · Lead/.test(bob) && /\$5,000\.00/.test(bob), 'deal chip → contact page filtered to Bob, showing his deal + stage')
  await settle(page)

  // 5. edit the contact → drafts and deals follow
  await page.goto(`${BASE}/contacts`, { waitUntil: 'networkidle' })
  ok(/2 contacts/.test(await page.locator('body').innerText()), 'two contacts total')
  await page.screenshot({ path: `${OUT}/contacts-page.png` })
  await card('Dana Whitfield').locator('button:has-text("Edit")').click()
  await page.fill('input[placeholder="john@acme.com"]', 'dana.w@newmail.example')
  await page.fill('input[placeholder="John Smith"]', 'Dana Whitfield-Cole')
  await page.click('button:has-text("Save Changes")')
  await card('Dana Whitfield-Cole').locator('a:has-text("Q-0001")').click()
  await page.waitForURL(/\/quotes\/[0-9a-f-]{36}$/)
  ok(await page.inputValue('input[placeholder="client@email.com"]') === 'dana.w@newmail.example' && await page.inputValue('input[placeholder="Acme Corp"]') === 'Dana Whitfield-Cole', 'editing a contact updated its draft quote')
  await page.goto(`${BASE}/pipeline`, { waitUntil: 'networkidle' })
  ok(await page.locator('button[title="Open contact"]', { hasText: 'Dana Whitfield-Cole' }).count() === 3, 'editing a contact updated its deals')

  // 6. "Quote" on a contact card → prefilled builder
  await page.goto(`${BASE}/contacts`, { waitUntil: 'networkidle' })
  await card('Bob Lee').locator('button[title="New quote for this contact"]').click()
  await page.waitForURL(/\/quotes\/new\?contact=/)
  ok(await page.inputValue('input[placeholder="Acme Corp"]') === 'Bob Lee', 'new quote from a contact card is prefilled')

  // 7. delete a contact → quotes + deals stay, unlinked
  await page.goto(`${BASE}/contacts`, { waitUntil: 'networkidle' })
  page.once('dialog', (d) => d.accept())
  await card('Dana Whitfield-Cole').locator('button[title="Delete contact"]').click()
  await settle(page)
  await page.goto(`${BASE}/quotes`, { waitUntil: 'networkidle' })
  ok(await page.locator('text=Q-0001').count() === 1 && await page.locator('text=Q-0003').count() === 1, 'deleting a contact keeps its quotes')
  await page.goto(`${BASE}/pipeline`, { waitUntil: 'networkidle' })
  ok(await page.locator('button[title="Open contact"]', { hasText: 'Dana' }).count() === 0 && /Dana Whitfield-Cole/.test(await page.locator('body').innerText()), 'deals kept but unlinked')

  // 8. old URL
  await page.goto(`${BASE}/clients`, { waitUntil: 'networkidle' })
  ok(/\/contacts$/.test(page.url()), '/clients redirects to /contacts')

  ok(errors.length === 0, `no console/page errors ${errors.length ? JSON.stringify(errors) : ''}`)
  console.log(`\n${pass} passed, ${fail} failed`)
  await browser.close()
  process.exit(fail ? 1 : 0)
})()
