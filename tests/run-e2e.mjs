/**
 * End-to-end tests: builds the app, serves it on :4173 and drives a real Chromium through
 * every flow (tiers, proposal link + acceptance, follow-ups with a controlled clock,
 * contacts, exports, model numbers + report, upload safety).
 *
 * Needs a browser driver, which is deliberately NOT a project dependency:
 *   npm i --no-save playwright-core && npx playwright-core install chromium
 *   npm run test:e2e                 # all suites
 *   npm run test:e2e -- proposal     # one suite
 *   npm run screenshots              # regenerate /screenshots from demo data
 * Also needs `pdftotext` / `pdftoppm` (poppler-utils) for the PDF assertions.
 */
import { build, preview } from 'vite'
import { createRequire } from 'node:module'
import { readdirSync, mkdirSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeFixtures } from './e2e/fixtures.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dir = join(root, 'tests/e2e')
try { createRequire(import.meta.url).resolve('playwright-core') } catch {
  console.error('playwright-core is not installed. Run:\n  npm i --no-save playwright-core && npx playwright-core install chromium')
  process.exit(2)
}

const only = process.argv.slice(2)
const suites = only.length ? only.map((n) => `${n}.cjs`) : readdirSync(dir).filter((f) => f.endsWith('.cjs') && f !== 'screenshots.cjs').sort()

await build({ root, logLevel: 'warn' })
const server = await preview({ root, preview: { port: 4173, strictPort: true }, logLevel: 'warn' })
mkdirSync(join(dir, '.out'), { recursive: true })
await writeFixtures()

// async spawn: the preview server lives in this process, so it must stay free to serve
const run = (file) => new Promise((done) => {
  console.log(`\n── ${file}`)
  spawn(process.execPath, [join(dir, file)], { stdio: 'inherit' }).on('close', (code) => done([file, code === 0]))
})
const results = []
for (const file of suites) results.push(await run(file))
await new Promise((done) => server.httpServer.close(done))
console.log('\n' + results.map(([f, ok]) => `${ok ? 'PASS' : 'FAIL'}  ${f}`).join('\n'))
process.exit(results.every(([, ok]) => ok) ? 0 : 1)
