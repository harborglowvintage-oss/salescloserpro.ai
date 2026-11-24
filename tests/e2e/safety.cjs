// E2E: hostile uploads + poisoned backup
const { chromium } = require('playwright-core')
const BASE = process.env.BASE || 'http://localhost:4173'; const FX = require('path').join(__dirname, '.out', 'fixtures')
let pass = 0, fail = 0
const ok = (c, m) => { c ? pass++ : fail++; console.log(`${c ? '✓' : '✗'} ${m}`) }
;(async () => {
  const browser = await chromium.launch()
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 1000 } })).newPage()
  const errors = [], requests = [], dialogs = []
  page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('request', (r) => requests.push(r.url()))
  page.on('dialog', async (d) => { dialogs.push(d.message()); await d.accept() })

  await page.goto(`${BASE}/quotes/new`, { waitUntil: 'networkidle' })
  const input = page.locator('input[type=file][accept*=".pdf"]')
  const thumbs = page.locator('img[alt$=".jpg"], img[alt$=".png"]')
  const errorBox = page.locator('.text-red-600, .dark\\:text-red-400').filter({ hasText: 'was not added' })

  await input.setInputFiles(`${FX}/photo.jpg`)
  await page.locator('img[alt="photo.jpg"]').waitFor()
  const src = await page.locator('img[alt="photo.jpg"]').getAttribute('src')
  ok(src.startsWith('data:image/jpeg;base64,'), 'real JPG accepted and stored as a re-encoded data: image')
  ok(!Buffer.from(src.split(',')[1], 'base64').includes('SECRET-GPS-PAYLOAD'), 're-encoding stripped the hidden metadata payload')
  const dims = await page.locator('img[alt="photo.jpg"]').evaluate((i) => [i.naturalWidth, i.naturalHeight])
  ok(dims[0] === 1200 && dims[1] === 675, `image downsized to 1200px wide (${dims})`)

  await input.setInputFiles(`${FX}/fake.png`)
  await errorBox.waitFor()
  ok(/“fake\.png” was not added: it is not a real JPG, PNG, GIF, WebP or PDF file/.test(await errorBox.innerText()), 'HTML disguised as .png refused with a plain reason')
  await input.setInputFiles(`${FX}/evil.pdf`)
  await page.locator('text=it contains JavaScript').waitFor()
  ok(true, 'PDF with JavaScript refused: "it contains JavaScript"')
  await input.setInputFiles(`${FX}/broken.png`)
  await page.locator('text=“broken.png” was not added').waitFor()
  ok(/damaged/.test(await errorBox.innerText()), 'corrupt image refused instead of hanging the uploader')
  await input.setInputFiles(`${FX}/logo.svg`)
  await page.locator('text=“logo.svg” was not added').waitFor()
  ok(true, 'SVG refused as an attachment')
  await input.setInputFiles([`${FX}/clean.pdf`, `${FX}/evil.pdf`])
  await page.locator('text=clean.pdf').waitFor()
  ok(await page.locator('text=2/5').count() === 1, 'mixed batch: clean PDF kept, hostile one dropped (2 of 5 slots used)')

  // logo
  await page.goto(`${BASE}/settings`, { waitUntil: 'networkidle' })
  const logoInput = page.locator('input[type=file]').last()
  await logoInput.setInputFiles(`${FX}/logo.svg`)
  await page.waitForTimeout(400)
  ok(dialogs.some((d) => /can't be used: it is not a real JPG, PNG, GIF or WebP file/.test(d)), 'SVG logo refused')
  await logoInput.setInputFiles(`${FX}/clean.pdf`)
  await page.waitForTimeout(400)
  ok(dialogs.filter((d) => /can't be used/.test(d)).length === 2, 'PDF refused as a logo')
  await logoInput.setInputFiles(`${FX}/logo.png`)
  await page.locator('img[alt="Company logo"]').waitFor()
  ok((await page.locator('img[alt="Company logo"]').getAttribute('src')).startsWith('data:image/png;base64,'), 'real PNG logo accepted (re-encoded)')

  // poisoned backup
  await page.goto(`${BASE}/backup`, { waitUntil: 'networkidle' })
  requests.length = 0
  await page.locator('input[type=file][accept*="json"]').setInputFiles(`${FX}/poisoned-backup.json`)
  await page.click('button:has-text("Restore This Backup")')
  await page.waitForLoadState('load'); await page.waitForTimeout(2500)
  await page.goto(`${BASE}/quotes`, { waitUntil: 'networkidle' })
  await page.click('text=Victim')
  await page.waitForURL(/\/quotes\//); await page.waitForTimeout(600)
  ok(/Evil Co/.test(await page.locator('aside').innerText()), 'backup restored (company name present)')
  ok(await page.locator('text=0/5').count() === 1, 'both poisoned attachments were dropped on restore')
  ok(await page.locator('aside img[alt="Logo"]').count() === 0, 'remote logo was dropped (default logo shown)')
  ok(!requests.some((u) => /TRACKER/.test(u)), 'no request was ever made to the tracking URLs')

  ok(errors.length === 0, `no console/page errors ${errors.length ? JSON.stringify(errors) : ''}`)
  console.log(`\n${pass} passed, ${fail} failed`); await browser.close(); process.exit(fail ? 1 : 0)
})()
