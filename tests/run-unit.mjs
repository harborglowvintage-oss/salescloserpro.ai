/**
 * Unit tests for the pure modules in src/utils. No test framework: each file is bundled
 * with esbuild (already installed with Vite; resolves the extensionless src imports and
 * the @src alias) and run in Node. Exit code is non-zero if any assertion fails.
 *
 *   npm test
 */
import { build } from 'esbuild'
import { readdirSync, mkdtempSync, rmSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dir = join(root, 'tests/unit')
const tmp = mkdtempSync(join(tmpdir(), 'scp-unit-'))
let failed = 0
for (const file of readdirSync(dir).filter((f) => f.endsWith('.test.js')).sort()) {
  const outfile = join(tmp, file.replace('.js', '.mjs'))
  await build({ entryPoints: [join(dir, file)], bundle: true, platform: 'node', format: 'esm', outfile, alias: { '@src': join(root, 'src') }, logLevel: 'warning' })
  console.log(`\n── ${file}`)
  if (spawnSync(process.execPath, [outfile], { stdio: 'inherit' }).status !== 0) failed++
}
rmSync(tmp, { recursive: true, force: true })
process.exit(failed ? 1 : 0)
