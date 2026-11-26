/**
 * End-to-end tests: builds the site, serves it on :4173 and drives a real Chromium through
 * every flow (public pages, tiers, proposal link + acceptance, follow-ups with a controlled
 * clock, contacts, exports, model numbers + report, upload safety).
 *
 * Needs a browser driver, which is deliberately NOT a project dependency:
 *   npm i --no-save playwright-core && npx playwright-core install chromium
 *   npm run test:e2e                 # all suites, served by Vite's preview server
 *   npm run test:e2e -- proposal     # one suite
 *   E2E_SERVER=pages npm run test:e2e
 *                                    # served by Cloudflare's own Pages runtime (wrangler, via
 *                                    # npx): real _headers, CSP, _redirects, 404 and the Function.
 *                                    # Run this before a deploy; any CSP block fails a suite.
 *   npm run screenshots              # regenerate /screenshots from demo data
 * Also needs `pdftotext` / `pdftoppm` (poppler-utils) for the PDF assertions.
 */
import { build, preview } from 'vite'
import { createRequire } from 'node:module'
import { readdirSync, mkdirSync } from 'node:fs'
import { spawn, spawnSync } from 'node:child_process'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeFixtures } from './e2e/fixtures.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dir = join(root, 'tests/e2e')
try { createRequire(import.meta.url).resolve('playwright-core') } catch {
  console.error('playwright-core is not installed. Run:\n  npm i --no-save playwright-core && npx playwright-core install chromium')
  process.exit(2)
}

// The local Pages runtime. Pinned so a test run never pulls an untried release; the
// compatibility date only has to be one this wrangler's runtime supports.
const WRANGLER = 'wrangler@4.152.0'
const COMPATIBILITY_DATE = '2026-10-01'
const PORT = 4173
const onPages = process.env.E2E_SERVER === 'pages'

const only = process.argv.slice(2)
const suites = only.length ? only.map((n) => `${n}.cjs`) : readdirSync(dir).filter((f) => f.endsWith('.cjs') && f !== 'screenshots.cjs').sort()

await build({ root, logLevel: 'warn' })
if (spawnSync(process.execPath, [join(root, 'scripts/site/build.mjs')], { stdio: 'inherit' }).status !== 0) process.exit(1)
const stopServer = onPages ? await servePages() : await servePreview()
console.log(`Serving dist/ with ${onPages ? `Cloudflare Pages (${WRANGLER})` : 'vite preview'} on :${PORT}`)
mkdirSync(join(dir, '.out'), { recursive: true })
await writeFixtures()

// async spawn: the preview server lives in this process, so it must stay free to serve
const run = (file) => new Promise((done) => {
  console.log(`\n── ${file}`)
  spawn(process.execPath, [join(dir, file)], { stdio: 'inherit' }).on('close', (code) => done([file, code === 0]))
})
const results = []
for (const file of suites) results.push(await run(file))
await stopServer()
console.log('\n' + results.map(([f, ok]) => `${ok ? 'PASS' : 'FAIL'}  ${f}`).join('\n'))
process.exit(results.every(([, ok]) => ok) ? 0 : 1)

async function servePreview() {
  const server = await preview({ root, preview: { port: PORT, strictPort: true }, logLevel: 'warn' })
  return () => new Promise((done) => server.httpServer.close(done))
}

async function servePages() {
  const args = ['--yes', WRANGLER, 'pages', 'dev', 'dist', '--port', String(PORT), '--compatibility-date', COMPATIBILITY_DATE]
  // its own process group, so stopping it also stops the runtime it starts
  const child = spawn('npx', args, { cwd: root, detached: true, stdio: ['ignore', 'ignore', 'inherit'] })
  const stop = () => { try { process.kill(-child.pid) } catch { /* already gone */ } }
  process.on('exit', stop)
  for (const started = Date.now(); Date.now() - started < 90_000;) {
    if (child.exitCode !== null) break
    try {
      if ((await fetch(`http://localhost:${PORT}/`)).ok) return async () => stop()
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 500))
  }
  stop()
  console.error('The Pages runtime (wrangler pages dev) did not start.')
  process.exit(1)
}
