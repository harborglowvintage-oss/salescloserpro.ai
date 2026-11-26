/**
 * salescloserpro.ai - finishes the site after `vite build` and keeps the agent files in step.
 *
 *   npm run build        vite build, then this script. Writes to dist/: each public page as
 *                        finished HTML with its own <head>, a markdown copy of each, the empty
 *                        app shell (app.html), 404.html, sitemap.xml and _routes.json.
 *   npm run site:check   checks the committed files without building (the pre-commit hook).
 *   npm run site:sync    rewrites the generated header block in functions/_middleware.js
 *                        from public/_headers; run it after editing _headers.
 *
 * Every mode runs the checks first, and any problem stops it. So a deploy cannot publish
 * headers, routes or agent files that disagree with each other.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { pathToFileURL } from 'node:url'
import { SITE_URL, ROOT, DIST_DIR, MIDDLEWARE_FILE } from './site.mjs'
import {
  APP_SHELL, parseHeaders, parseRedirects, headersFor, markdownPages, middlewareConfig,
  middlewareBlock, withMiddlewareBlock, routesJson, appRoutePaths, routingProblems,
} from './cloudflare.mjs'
import { pageHead, homeStructuredData, toMarkdown, sitemapXml } from './pages.mjs'

const MODES = { '': 'build', '--check': 'check', '--sync': 'sync' }
const mode = MODES[process.argv[2] ?? '']
if (!mode) {
  console.error('Usage: node scripts/site/build.mjs [--check | --sync]')
  process.exit(2)
}

const SECURITY_TXT_WARN_DAYS = 60
const HEAD_BLOCK = /<!-- page-head:[\s\S]*?<!-- \/page-head -->/
const EMPTY_ROOT = '<div id="root"></div>'

const read = (path) => readFileSync(join(ROOT, path), 'utf-8')
const rules = parseHeaders(read('public/_headers'))
const pages = markdownPages(rules)
const block = middlewareBlock(middlewareConfig(rules, SITE_URL))

if (mode === 'sync') {
  const source = read('functions/_middleware.js')
  const synced = withMiddlewareBlock(source, block)
  if (synced !== source) writeFileSync(MIDDLEWARE_FILE, synced)
  console.log(synced === source ? 'functions/_middleware.js was already up to date.' : 'Updated functions/_middleware.js from public/_headers.')
}

const { problems, warnings } = checkRepository()
for (const warning of warnings) console.warn(`warning: ${warning}`)
if (problems.length) stop(problems)
if (mode === 'build') await buildSite()
else console.log(`Site files are consistent (${pages.length} public pages).`)

/** Checks that need no build: they read only the committed files. */
function checkRepository() {
  const problems = []
  const warnings = []

  const middleware = read('functions/_middleware.js')
  if (withMiddlewareBlock(middleware, block) !== middleware) {
    problems.push('functions/_middleware.js does not match public/_headers. Run: npm run site:sync')
  }

  problems.push(...routingProblems({
    routes: appRoutePaths(read('src/App.jsx')),
    redirects: parseRedirects(read('public/_redirects')),
    pagePaths: pages.map((page) => page.path),
  }))

  const llms = read('public/llms.txt')
  const copies = pages.map((page) => `${SITE_URL}${page.markdown}`)
  for (const copy of copies) if (!llms.includes(`(${copy})`)) problems.push(`public/llms.txt does not link ${copy}`)
  for (const [, link] of llms.matchAll(/\]\(([^)\s]+\.md)\)/g)) {
    if (link.startsWith(SITE_URL) && !copies.includes(link)) problems.push(`public/llms.txt links ${link}, which the build does not write`)
  }

  const expires = new Date(read('public/.well-known/security.txt').match(/^Expires:\s*(.+)$/m)?.[1] ?? NaN)
  const daysLeft = (expires - Date.now()) / 86_400_000
  if (Number.isNaN(daysLeft)) problems.push('public/.well-known/security.txt needs a valid Expires: line')
  else if (daysLeft < 0) problems.push(`public/.well-known/security.txt expired on ${expires.toISOString().slice(0, 10)}. Set a new Expires date (at most a year ahead).`)
  else if (daysLeft < SECURITY_TXT_WARN_DAYS) warnings.push(`public/.well-known/security.txt expires in ${Math.floor(daysLeft)} days`)

  return { problems, warnings }
}

async function buildSite() {
  const templatePath = join(DIST_DIR, 'index.html')
  if (!existsSync(templatePath)) stop(['dist/index.html is missing. Run vite build first (npm run build does both).'])
  const template = readFileSync(templatePath, 'utf-8')
  if (!HEAD_BLOCK.test(template) || template.split(EMPTY_ROOT).length !== 2) {
    stop(['index.html must contain one <!-- page-head: … --> … <!-- /page-head --> block and one empty <div id="root"></div>'])
  }

  const { render, PUBLIC_PAGES, NOT_FOUND_PAGE, APP_TITLE } = await loadRenderer()
  const missing = [
    ...PUBLIC_PAGES.filter((p) => !pages.some((h) => h.path === p.path)).map((p) => `${p.path} is in src/publicPages.jsx but has no markdown Link rule in public/_headers`),
    ...pages.filter((h) => !PUBLIC_PAGES.some((p) => p.path === h.path)).map((h) => `public/_headers gives ${h.path} a markdown copy, but src/publicPages.jsx has no such page`),
  ]
  if (missing.length) stop(missing)

  const version = JSON.parse(read('package.json')).version
  const contentSignal = Object.entries(headersFor(rules, pages[0].markdown).headers).find(([name]) => name.toLowerCase() === 'content-signal')[1]
  const htmlPage = (head, body = '', route) => template
    .replace(HEAD_BLOCK, head.join('\n    '))
    .replace(EMPTY_ROOT, body ? `<div id="root"${route ? ` data-route="${route}"` : ''}>${body}</div>` : EMPTY_ROOT)
  const written = []
  const write = (path, text) => {
    const file = join(DIST_DIR, path)
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, text)
    written.push(`${relative(ROOT, file)}  ${(Buffer.byteLength(text) / 1024).toFixed(1)} kB`)
  }

  for (const { path, Component, title, description } of PUBLIC_PAGES) {
    const url = new URL(path, SITE_URL).href
    const { markdown } = pages.find((h) => h.path === path)
    const body = render(Component, path)
    const structuredData = path === '/' ? homeStructuredData({ version, description }) : undefined
    write(`${path === '/' ? 'index' : path.slice(1)}.html`, htmlPage(pageHead({ title, description, url, markdown, indexable: true, structuredData }), body, path))
    write(markdown.slice(1), toMarkdown(body, { url, title, description, contentSignal }))
  }
  write(`${APP_SHELL.slice(1)}.html`, htmlPage(pageHead({ title: APP_TITLE, description: PUBLIC_PAGES[0].description, indexable: false })))
  write('404.html', htmlPage(pageHead({ ...NOT_FOUND_PAGE, indexable: false }), render(NOT_FOUND_PAGE.Component, '/404')))
  write('sitemap.xml', sitemapXml(PUBLIC_PAGES.map(({ path }) => new URL(path, SITE_URL).href)))
  write('_routes.json', `${JSON.stringify(routesJson(rules), null, 2)}\n`)

  console.log(`Site build: ${written.length} files\n${written.map((line) => `  ${line}`).join('\n')}`)
}

/** Builds src/entry-server.jsx for Node and loads it: the same components the browser runs. */
async function loadRenderer() {
  const { build } = await import('vite')
  const outDir = join(ROOT, 'node_modules/.cache/site-render')
  await build({
    root: ROOT,
    logLevel: 'warn',
    build: { ssr: 'src/entry-server.jsx', outDir, emptyOutDir: true, copyPublicDir: false, minify: false },
  })
  try {
    return await import(pathToFileURL(join(outDir, 'entry-server.js')).href)
  } finally {
    rmSync(outDir, { recursive: true, force: true })
  }
}

function stop(problems) {
  console.error(`Site check failed:\n${problems.map((p) => `  - ${p}`).join('\n')}`)
  process.exit(1)
}
