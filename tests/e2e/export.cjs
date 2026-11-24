// E2E: create data → Export page → download each format → check file contents
const { chromium } = require('playwright-core')
const fs = require('fs')
const BASE = process.env.BASE || 'http://localhost:4173'
let pass = 0, fail = 0
const ok = (c, m) => { c ? pass++ : fail++; console.log(`${c ? '✓' : '✗'} ${m}`) }
;(async () => {
  const browser = await chromium.launch()
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 1000 }, acceptDownloads: true })).newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

  await page.goto(`${BASE}/export`, { waitUntil: 'networkidle' })
  ok(await page.locator('li button:has-text("CSV")').first().isDisabled(), 'empty app: download buttons disabled')

  await page.goto(`${BASE}/quotes/new`, { waitUntil: 'networkidle' })
  await page.fill('input[placeholder="Acme Corp"]', 'Dana Whitfield')
  await page.fill('input[placeholder="client@email.com"]', 'dana@example.com')
  await page.fill('input[placeholder^="Describe this"]', 'Roof, "premium" grade')
  await page.fill('input[placeholder="0.00"]', '8000')
  await page.click('button:has-text("Save Quote")')
  await page.waitForURL(/\/quotes\/[0-9a-f-]{36}$/)

  await page.click('a:has-text("Export")')
  await page.waitForURL(/\/export$/)
  ok(await page.locator('[role=tab]').count() === 3, 'three formats: Universal, HubSpot, Salesforce')
  const grab = async (label) => {
    const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('li', { hasText: label }).locator('button:has-text("CSV")').click()])
    return { name: dl.suggestedFilename(), text: fs.readFileSync(await dl.path(), 'utf8') }
  }
  const lines = await grab('Quote line items')
  ok(/^salescloserpro-universal-quote-lines-\d{4}-\d\d-\d\d\.csv$/.test(lines.name), `universal file name (${lines.name})`)
  ok(lines.text.includes('"Roof, ""premium"" grade"') && lines.text.includes('8000.00'), 'universal lines: description escaped, price present')

  await page.click('[role=tab]:has-text("HubSpot")')
  const hd = await grab('Deals (with contact)')
  ok(hd.text.split('\r\n')[0].replace(/^﻿/, '') === 'Deal Name,Pipeline,Deal Stage,Amount,Close Date,Deal Description,Email,First Name,Last Name', 'hubspot deals header')
  ok(hd.text.includes('Dana Whitfield — Q-0001,Sales Pipeline,Qualified To Buy,8660.00') && hd.text.includes('dana@example.com,Dana,Whitfield'), 'hubspot deal row: draft quote → Qualified To Buy, with contact')
  ok(/how to import into hubspot/i.test(await page.locator('body').innerText()), 'hubspot import steps shown')

  await page.click('[role=tab]:has-text("Salesforce")')
  const sc = await grab('Contacts')
  ok(sc.text.includes('First Name,Last Name,Email,Phone,Account Name') && sc.text.includes('Dana,Whitfield,dana@example.com,,Dana Whitfield'), 'salesforce contacts: standard fields + account fallback')
  const so = await grab('Opportunities')
  ok(/Dana Whitfield — Q-0001,Dana Whitfield,Proposal\/Price Quote,8660\.00,\d{4}-\d\d-\d\d/.test(so.text), 'salesforce opportunity row')
  await page.screenshot({ path: require('path').join(__dirname, '.out', 'export-page.png') })

  ok(errors.length === 0, `no console/page errors ${errors.length ? JSON.stringify(errors) : ''}`)
  console.log(`\n${pass} passed, ${fail} failed`); await browser.close(); process.exit(fail ? 1 : 0)
})()
