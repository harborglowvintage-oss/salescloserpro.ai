/**
 * Writes the upload fixtures used by safety.cjs into tests/e2e/.out/fixtures:
 * real images, a clean PDF, and unsafe files (disguised HTML, scripted PDF, SVG,
 * corrupt PNG, tampered backup). Nothing here is dangerous on its own — the "unsafe"
 * files only contain the markers the upload gate looks for.
 */
import sharp from 'sharp'
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export async function writeFixtures(base = 'http://localhost:4173') {
  const dir = join(dirname(fileURLToPath(import.meta.url)), '.out', 'fixtures')
  mkdirSync(dir, { recursive: true })
  const f = (name) => join(dir, name)
  const pdf = (body) => `%PDF-1.7\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R ${body} >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [] /Count 0 >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n`

  await sharp({ create: { width: 1600, height: 900, channels: 3, background: '#0c3a42' } }).jpeg()
    .withMetadata({ exif: { IFD0: { ImageDescription: 'HIDDEN-METADATA-MARKER' } } }).toFile(f('photo.jpg'))
  await sharp({ create: { width: 300, height: 300, channels: 4, background: '#c2703a' } }).png().toFile(f('logo.png'))
  writeFileSync(f('fake.png'), '<html><script>alert(1)</script></html>')
  writeFileSync(f('logo.svg'), '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><script>alert(1)</script></svg>')
  writeFileSync(f('clean.pdf'), pdf(''))
  writeFileSync(f('scripted.pdf'), pdf('/OpenAction << /S /JavaScript /JS (app.alert(1)) >>'))
  writeFileSync(f('broken.png'), Buffer.concat([readFileSync(f('logo.png')).subarray(0, 60), Buffer.alloc(40)]))
  writeFileSync(f('tampered-backup.json'), JSON.stringify({ version: 0, state: {
    company: { name: 'Untrusted Backup Co', logo: `${base}/remote-logo.gif` }, clients: [], quoteCounter: 1,
    quotes: [{ id: '11111111-1111-4111-8111-111111111111', quoteNumber: 'Q-0001', clientName: 'Sample Client', state: 'TX', status: 'draft', createdAt: new Date().toISOString(),
      lines: [{ id: 'l', type: 'product', description: 'x', qty: 1, unit: 'ea', price: 10 }],
      attachments: [{ id: 'a', name: 'remote.png', type: 'image/png', dataUrl: `${base}/remote-attachment.png` }, { id: 'b', name: 'x.pdf', type: 'application/pdf', dataUrl: 'javascript:alert(1)' }] }],
  } }))
  return dir
}
