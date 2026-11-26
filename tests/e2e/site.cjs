// E2E: the public site as crawlers, AI assistants and browsers see it — finished HTML for each
// public page, the app shell, the agent files, and (on the Pages runtime: E2E_SERVER=pages) the
// real headers, CSP, markdown answers and 404 status.
const { chromium } = require('playwright-core')
const BASE = process.env.BASE || 'http://localhost:4173'
const ON_PAGES = process.env.E2E_SERVER === 'pages'
let pass = 0, fail = 0
const ok = (c, m) => { c ? pass++ : fail++; console.log(`${c ? '✓' : '✗'} ${m}`) }
const get = async (path, headers = {}) => {
  const res = await fetch(`${BASE}${path}`, { headers, redirect: 'manual' })
  return { status: res.status, headers: res.headers, text: await res.text() }
}

const PAGES = [
  { path: '/', title: 'salescloserpro.ai | The Free CRM. Designed for simplicity.', text: 'From first number to signed yes' },
  // text from a section that starts closed: it must be in the HTML all the same
  { path: '/about', title: 'About & User Guide | salescloserpro.ai', text: 'How do I move my data to a new computer?' },
  { path: '/services', title: 'Custom & Enterprise Services | salescloserpro.ai', text: 'White-Label &amp; Enterprise Architecture' },
  { path: '/legal', title: 'Legal & Compliance | salescloserpro.ai', text: 'Export Controls &amp; Sanctions' },
]
const escaped = (s) => s.replace(/&/g, '&amp;')

;(async () => {
  // ── as a crawler sees it: plain HTTP, no JavaScript ──
  for (const { path, title, text } of PAGES) {
    const { status, text: html } = await get(path)
    const canonical = `https://salescloserpro.ai${path}`
    ok(status === 200 && html.includes(`<title>${escaped(title)}</title>`) && html.includes(`<link rel="canonical" href="${canonical}" />`),
      `${path}: 200, its own title and canonical address`)
    ok(html.includes(`data-route="${path}"`) && html.includes(text), `${path}: full content in the HTML, before any script runs`)
  }
  const home = (await get('/')).text
  ok(home.split('application/ld+json').length === 2 && !(await get('/about')).text.includes('application/ld+json'), 'structured data on the home page only')
  ok(!/fonts\.googleapis|fonts\.gstatic|<script>|style="/.test(home + (await get('/services')).text), 'no outside fonts, inline scripts or style attributes')

  // vite preview ignores _redirects (it answers /dashboard with the home page), so read the file
  const shell = (await get(ON_PAGES ? '/dashboard' : '/app.html')).text
  ok(/<meta name="robots" content="noindex" \/>/.test(shell) && shell.includes('<div id="root"></div>'), 'app address: empty app shell marked noindex')
  for (const file of ['/sitemap.xml', '/llms.txt', '/robots.txt', '/.well-known/security.txt', '/index.md', '/about.md', '/services.md', '/legal.md']) {
    ok((await get(file)).status === 200, `${file} is served`)
  }
  ok((await get('/about.md')).text.includes('## Frequently asked questions'), 'markdown copy includes the collapsed sections')

  if (ON_PAGES) {
    const page = await get('/about')
    const app = await get('/dashboard')
    const csp = page.headers.get('content-security-policy') || ''
    ok(csp.startsWith("default-src 'none'") && csp === app.headers.get('content-security-policy'), 'same strict CSP on public pages (Function) and app pages (_headers)')
    ok(!page.headers.has('access-control-allow-origin') && !app.headers.has('access-control-allow-origin'), 'no Access-Control-Allow-Origin')
    ok(/preload/.test(page.headers.get('strict-transport-security')) && page.headers.get('x-frame-options') === 'DENY', 'HSTS preload and X-Frame-Options DENY')
    ok(page.headers.get('content-type').startsWith('text/html') && /Accept/.test(page.headers.get('vary')), 'browser gets HTML, with Vary: Accept')
    const md = await get('/about', { Accept: 'text/markdown' })
    ok(md.headers.get('content-type').startsWith('text/markdown') && md.text.startsWith('---\ntitle: "About & User Guide'), 'Accept: text/markdown gets the markdown copy')
    ok(md.headers.get('link') === '<https://salescloserpro.ai/about>; rel="canonical"' && md.headers.get('content-signal') === 'search=yes, ai-input=yes, ai-train=no' && Number(md.headers.get('x-markdown-tokens')) > 0,
      'markdown answer: canonical link, content signal, token estimate')
    ok((await get('/about.md')).headers.get('x-robots-tag') === 'noindex', 'the .md copy itself is kept out of search')
    const missing = await get('/no-such-page')
    ok(missing.status === 404 && missing.text.includes('This page does not exist.'), 'unknown address: real 404 status and page')
    ok((await get('/quotes/q-123')).status === 200 && (await get('/p')).status === 200, 'app addresses answer 200 at their own address')
  } else {
    console.log('  (headers, markdown answers and 404 status: run with E2E_SERVER=pages)')
  }

  // ── in a browser ──
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  const errors = []
  const outside = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('request', (r) => { if (!r.url().startsWith(BASE) && !/^(data|blob):/.test(r.url())) outside.push(r.url()) })

  for (const { path, title } of PAGES) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
    ok((await page.title()) === title, `${path}: title after the app starts`)
  }
  const opened = (id) => page.waitForFunction((id) => document.getElementById(id)?.open, id, { timeout: 5000 }).then(() => true, () => false)
  await page.goto(`${BASE}/legal#ai`, { waitUntil: 'networkidle' })
  ok(await opened('ai') && !(await page.evaluate(() => document.getElementById('gdpr').open)), '/legal#ai on arrival opens that section only (the page came alive)')
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await page.click('footer >> text=Privacy Policy')
  ok(await opened('privacy'), 'footer "Privacy Policy" link opens the privacy section')
  await page.goto(`${BASE}/about`, { waitUntil: 'networkidle' })
  await page.click('summary:has-text("Frequently asked questions")')
  ok(await page.isVisible('text=Is it really free?'), 'About: a closed section opens')
  ok(await page.evaluate(() => document.fonts.check('600 16px "Source Serif 4"') && document.fonts.check('16px Inter')), 'self-hosted fonts loaded')

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await page.click('header >> text=Launch App')
  await page.waitForURL(`${BASE}/dashboard`)
  await page.waitForLoadState('networkidle')
  ok((await page.title()) === 'salescloserpro.ai' && await page.isVisible('aside'), 'Launch App opens the dashboard; tab title switches to the app')
  ok(await page.evaluate(() => document.documentElement.classList.contains('dark')), 'theme script ran (dark by default)')

  ok(outside.length === 0, `nothing loaded from other sites ${outside.length ? JSON.stringify(outside) : ''}`)
  ok(errors.length === 0, `no console/page errors (CSP, hydration) ${errors.length ? JSON.stringify(errors) : ''}`)

  // last: Chrome logs the 404 status of this page itself as a console error, which is the point
  await page.goto(`${BASE}/no-such-page`, { waitUntil: 'networkidle' })
  ok(await page.isVisible('text=This page does not exist.'), 'unknown address shows the not-found page')
  console.log(`\n${pass} passed, ${fail} failed`)
  await browser.close()
  process.exit(fail ? 1 : 0)
})()
