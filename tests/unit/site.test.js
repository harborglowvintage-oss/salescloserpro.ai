import { readFileSync } from 'node:fs'
import {
  parseHeaders, parseRedirects, matches, headersFor, markdownPages, middlewareConfig,
  routesJson, appRoutePaths, routingProblems, APP_SHELL,
} from '../../scripts/site/cloudflare.mjs'
import { toMarkdown, pageHead } from '../../scripts/site/pages.mjs'
import { onRequest, prefersMarkdown } from '../../functions/_middleware.js'
let pass = 0, fail = 0
const ok = (c, m) => { c ? pass++ : fail++; console.log(`${c ? '✓' : '✗'} ${m}`) }
const throws = (fn) => { try { fn(); return false } catch { return true } }
const read = (path) => readFileSync(path, 'utf-8') // npm test runs from the repo root

// ── reading _headers and _redirects the way Pages does ──
ok(matches('/*', '/') && matches('/*', '/a/b.js') && matches('/*.md', '/about.md') && !matches('/*.md', '/about'), 'splat matches anything, including nothing')
ok(matches('/quotes/*', '/quotes/q-1') && !matches('/quotes/*', '/quotes') && !matches('/quotes', '/quotes-x'), 'exact paths and splats do not overreach')
ok(matches('/p/:id', '/p/abc') && !matches('/p/:id', '/p/a/b') && matches('/a.b', '/a.b') && !matches('/a.b', '/aXb'), 'placeholders match one segment; dots are literal')

const sample = parseHeaders('# comment\n/*\n  ! Access-Control-Allow-Origin\n  Link: </sitemap.xml>; rel="sitemap"\n  X-A: 1\n/about\n  Link: </about.md>; rel="alternate"; type="text/markdown"\n/*.md\n  Content-Signal: ai-train=no\n')
const about = headersFor(sample, '/about')
ok(about.headers.Link === '</sitemap.xml>; rel="sitemap", </about.md>; rel="alternate"; type="text/markdown"' && about.headers['X-A'] === '1', 'a header set by two rules is joined with ", "')
ok(about.detached.join() === 'Access-Control-Allow-Origin', '"! Name" lines are collected as removals')
ok(throws(() => parseHeaders('  X-A: 1\n')) && throws(() => parseHeaders('/a\n  no colon\n')) && throws(() => parseHeaders('https://x.example/a\n  X: 1\n')), '_headers: malformed lines are refused, not skipped')
ok(JSON.stringify(markdownPages(sample)) === '[{"path":"/about","markdown":"/about.md"}]' && JSON.stringify(routesJson(sample).include) === '["/about"]', 'pages with a markdown Link become the Function routes')

const redirects = parseRedirects('# c\n/a  /b\n/c  /d  301\n')
ok(redirects[0].status === 302 && redirects[1].status === 301 && throws(() => parseRedirects('/a /b 301 extra')) && throws(() => parseRedirects('/a')), '_redirects: Pages defaults (302) and malformed lines refused')

// ── the committed files agree with each other ──
const rules = parseHeaders(read('public/_headers'))
const config = middlewareConfig(rules, 'https://salescloserpro.ai')
ok(Object.keys(config.PAGES).join() === '/,/about,/services,/legal', 'the four public pages are served through the Function')
ok(config.SHARED['Content-Security-Policy']?.startsWith("default-src 'none'") && config.SHARED['Strict-Transport-Security'].endsWith('preload'), 'every page shares the strict CSP and HSTS preload')
ok(config.REMOVE.join() === 'Access-Control-Allow-Origin' && config.CONTENT_SIGNAL === 'search=yes, ai-input=yes, ai-train=no', 'ACAO removed; markdown content signal taken from the /*.md rule')
ok(config.PAGES['/about'].canonical === 'https://salescloserpro.ai/about' && config.PAGES['/'].headers.Link.includes('</index.md>'), 'canonical addresses and per-page Link headers')

const routes = appRoutePaths(read('src/App.jsx'))
const live = parseRedirects(read('public/_redirects'))
const pagePaths = markdownPages(rules).map((p) => p.path)
ok(routes.includes('/dashboard') && routes.includes('/quotes/:id') && !routes.includes('*'), 'App.jsx routes are read (catch-all left out)')
ok(routingProblems({ routes, redirects: live, pagePaths }).length === 0, 'every app route has a rewrite to the app shell, and no rewrite is left over')
const without = live.filter((r) => r.from !== '/pipeline')
ok(/route \/pipeline has no rewrite.*\/pipeline  \/app  200/.test(routingProblems({ routes, redirects: without, pagePaths }).join()), 'a missing rewrite is named, with the line to add')
ok(/quotes\/\*  \/app  200/.test(routingProblems({ routes, redirects: live.filter((r) => r.from !== '/quotes/*'), pagePaths }).join()), 'a missing :param route asks for a splat rule')
ok(/rewrites \/old/.test(routingProblems({ routes, redirects: [...live, { from: '/old', to: APP_SHELL, status: 200 }], pagePaths }).join()), 'a rewrite for a route the app no longer has is named')

// ── the Function: who gets markdown ──
const cases = [
  [null, false], ['', false], ['*/*', false],
  ['text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', false], // Chrome
  ['text/markdown', true], ['text/x-markdown', true], ['text/markdown, text/html;q=0.9', true],
  ['text/html, text/markdown', true], ['text/html, text/markdown;q=0.5', false], ['text/markdown;q=0', false],
  ['text/*, text/markdown;q=0.8', false], ['TEXT/MARKDOWN', true], ['text/markdown;q=abc', false],
]
ok(cases.every(([accept, want]) => prefersMarkdown(accept) === want), `Accept negotiation (${cases.length} cases)`)

const html = (headers = {}) => new Response('<html>page</html>', { headers: { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*', ...headers } })
const run = async ({ path = '/about', method = 'GET', accept, assets, response = html() } = {}) => {
  let nextCalled = false
  const res = await onRequest({
    request: new Request(`https://salescloserpro.ai${path}`, { method, headers: accept ? { Accept: accept } : {} }),
    next: async () => { nextCalled = true; return response },
    env: { ASSETS: { fetch: assets ?? (async (req) => new Response(`# copy of ${new URL(req.url).pathname}`, { status: 200 })) } },
  })
  return { res, nextCalled, body: method === 'HEAD' ? null : await res.text() }
}
{
  const { res, body, nextCalled } = await run({ accept: 'text/markdown' })
  ok(!nextCalled && body === '# copy of /about.md' && res.headers.get('Content-Type') === 'text/markdown; charset=utf-8', 'markdown request: answered with the .md copy')
  ok(res.headers.get('Link') === '<https://salescloserpro.ai/about>; rel="canonical"' && res.headers.get('Vary') === 'Accept' && res.headers.get('x-markdown-tokens') === '5' && res.headers.get('Content-Signal') === config.CONTENT_SIGNAL,
    'markdown answer: canonical, Vary, token estimate, content signal')
  ok(res.headers.get('Content-Security-Policy') === config.SHARED['Content-Security-Policy'] && !res.headers.has('X-Robots-Tag'), 'markdown answer keeps the security headers and is not noindex (the page address is)')
}
{
  const { res, body } = await run({ accept: 'text/html', response: html({ Vary: 'Accept-Encoding' }) })
  ok(body === '<html>page</html>' && res.headers.get('Content-Security-Policy') === config.SHARED['Content-Security-Policy'] && !res.headers.has('Access-Control-Allow-Origin'), 'browser request: HTML with the _headers headers, ACAO removed')
  ok(res.headers.get('Vary') === 'Accept-Encoding, Accept' && res.headers.get('Link') === config.PAGES['/about'].headers.Link, 'Vary: Accept added to the existing Vary; page Link headers set')
}
{
  const untouched = async (options) => { const response = html(); return (await run({ ...options, response })).res === response }
  ok(await untouched({ path: '/dashboard', accept: 'text/markdown' }), 'other addresses pass through untouched')
  ok(await untouched({ method: 'POST', accept: 'text/markdown' }), 'non-GET requests pass through untouched')
  const moved = new Response(null, { status: 308, headers: { Location: '/about' } })
  ok((await run({ response: moved })).res === moved, 'redirects pass through untouched')
  const broken = await run({ accept: 'text/markdown', assets: async () => { throw new Error('down') } })
  const missing = await run({ accept: 'text/markdown', assets: async () => new Response('no', { status: 404 }) })
  ok(broken.nextCalled && broken.body === '<html>page</html>' && missing.body === '<html>page</html>', 'a failing or missing markdown copy falls back to the HTML page')
  const head = await run({ method: 'HEAD', accept: 'text/markdown' })
  ok(head.res.status === 200 && head.res.body === null && head.res.headers.get('x-markdown-tokens') === '5', 'HEAD: markdown headers, no body')
}

// ── page head and markdown copies ──
const head = pageHead({ title: 'A "quoted" & <b>', description: 'd', url: 'https://salescloserpro.ai/x', markdown: '/x.md', indexable: true, structuredData: [{ name: '</script><script>alert(1)' }] }).join('\n')
ok(head.includes('<title>A &quot;quoted&quot; &amp; &lt;b&gt;</title>') && head.includes('content="A &quot;quoted&quot; &amp; &lt;b&gt;"'), 'head: titles and attributes are escaped')
ok(!head.includes('</script><script>') && head.includes('\\u003c/script>'), 'head: structured data cannot close its <script> tag')
ok(pageHead({ title: 't', description: 'd', indexable: false }).join().includes('content="noindex"') && !pageHead({ title: 't', description: 'd', indexable: false }).join().includes('canonical'), 'head: app shell and 404 are noindex with no canonical')

const md = toMarkdown(
  '<header><nav><a href="/">Home</a></nav></header><h1>Big<br>title</h1><p aria-hidden="true">mock</p><svg><text>icon</text></svg>' +
  '<p><a href="/dashboard">Start</a><a href="/about">Guide</a></p><ol><li><h3>One</h3><p>first</p></li><li>Two</li></ol><ul><li>a</li><li>b<ul><li>c</li></ul></li></ul>' +
  '<details><summary><svg></svg><span>More</span></summary><p>hidden text</p></details><img src="/x.png" alt="pic"><footer>foot</footer>',
  { url: 'https://salescloserpro.ai/about', title: 'T', description: 'D "q"', contentSignal: 'search=yes' })
ok(md.startsWith('---\ntitle: "T"\ndescription: "D \\"q\\""\nurl: https://salescloserpro.ai/about\n') && md.includes('content-signal: search=yes\n'), 'markdown: front matter')
ok(md.includes('# Big title') && md.includes('[Start](https://salescloserpro.ai/dashboard) [Guide](https://salescloserpro.ai/about)'), 'markdown: headings stay on one line; links absolute and spaced')
ok(!/Home|mock|icon|pic|foot/.test(md), 'markdown: navigation, footer, icons, images and aria-hidden parts dropped')
ok(md.includes('1. ### One\n\n   first\n2. Two') && md.includes('- a\n- b\n  - c') && md.includes('## More\n\nhidden text') && !/ $/m.test(md), 'markdown: compact lists, collapsed sections as headings, no trailing spaces')

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
