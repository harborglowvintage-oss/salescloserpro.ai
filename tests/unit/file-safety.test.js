import zlib from 'node:zlib'
import { sniffType, imageDimensions, pdfRisk, cleanFileName, inspectFile, sanitizeState, isSafeImageUrl, MAX_UPLOAD_BYTES } from '@src/utils/fileSafety'
let pass = 0, fail = 0
const ok = (c, m) => { c ? pass++ : fail++; console.log(`${c ? '✓' : '✗'} ${m}`) }
const enc = (s) => new Uint8Array(Buffer.from(s, 'latin1'))
const cat = (...parts) => new Uint8Array(Buffer.concat(parts.map((p) => Buffer.from(p))))
const file = (bytes, name) => new File([bytes], name)

// ── fixtures ──
const png = (w, h) => { const b = Buffer.alloc(40); Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(b); b.writeUInt32BE(13, 8); b.write('IHDR', 12); b.writeUInt32BE(w, 16); b.writeUInt32BE(h, 20); return new Uint8Array(b) }
const gif = (w, h) => { const b = Buffer.alloc(20); b.write('GIF89a'); b.writeUInt16LE(w, 6); b.writeUInt16LE(h, 8); return new Uint8Array(b) }
const jpeg = (w, h) => { const b = Buffer.alloc(40); b.set([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x04, 0x00, 0x00, 0xff, 0xc0, 0x00, 0x11, 0x08]); b.writeUInt16BE(h, 13); b.writeUInt16BE(w, 15); return new Uint8Array(b) }
const webp = (w, h) => { const b = Buffer.alloc(40); b.write('RIFF'); b.write('WEBP', 8); b.write('VP8X', 12); b.writeUIntLE(w - 1, 24, 3); b.writeUIntLE(h - 1, 27, 3); return new Uint8Array(b) }
const pdf = (body) => enc(`%PDF-1.7\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R ${body} >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [] /Count 0 >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n`)
const objStm = (inner, flate = true) => {
  const data = flate ? zlib.deflateSync(Buffer.from(inner, 'latin1')) : Buffer.from(inner, 'latin1')
  return cat(enc(`%PDF-1.7\n1 0 obj\n<< /Type /Catalog >>\nendobj\n5 0 obj\n<< /Type /ObjStm /N 1 /First 4 ${flate ? '/Filter /FlateDecode ' : ''}/Length ${data.length} >>\nstream\n`), data, enc('\nendstream\nendobj\n%%EOF\n'))
}

// ── sniffing ──
ok(sniffType(png(1, 1)) === 'image/png' && sniffType(jpeg(1, 1)) === 'image/jpeg' && sniffType(gif(1, 1)) === 'image/gif' && sniffType(webp(1, 1)) === 'image/webp' && sniffType(pdf('')) === 'application/pdf', 'magic bytes: png, jpeg, gif, webp, pdf recognised')
ok(sniffType(enc('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>')) === null, 'SVG is not an accepted type')
ok(sniffType(enc('MZ\x90\x00 this is a windows program')) === null && sniffType(enc('<html><script>x</script>')) === null, 'executables and HTML are not accepted types')
ok(JSON.stringify(imageDimensions(png(640, 480), 'image/png')) === '{"width":640,"height":480}' && imageDimensions(jpeg(800, 600), 'image/jpeg').width === 800 && imageDimensions(gif(10, 20), 'image/gif').height === 20 && imageDimensions(webp(300, 200), 'image/webp').width === 300, 'dimensions read from headers without decoding')

// ── the gate ──
const why = async (f, o) => (await inspectFile(f, o)).reason || 'OK'
ok((await why(file(png(640, 480), 'photo.png'))) === 'OK', 'real PNG accepted')
ok(/not a real/.test(await why(file(enc('<html><script>alert(1)</script></html>'), 'photo.png'))), 'HTML renamed .png refused')
ok(/not a real/.test(await why(file(enc('<svg onload="alert(1)"/>'), 'logo.svg'))), 'SVG refused')
ok(/not a real/.test(await why(file(enc('MZ\x90 program'), 'invoice.pdf'), { allowPdf: true })), 'program renamed .pdf refused')
ok(/does not match its contents/.test(await why(file(png(10, 10), 'photo.jpg'))), 'PNG named .jpg refused (name must match contents)')
ok(/does not match/.test(await why(file(png(10, 10), 'photo.png.exe'))), 'double extension .png.exe refused')
ok(/too large \(over 40 megapixels\)/.test(await why(file(png(30000, 30000), 'bomb.png'))), 'decompression bomb (30000×30000 px in a tiny file) refused before decoding')
ok(/damaged/.test(await why(file(png(0, 0), 'zero.png'))), 'zero-size image refused')
ok(/larger than 2 MB/.test(await why(file(new Uint8Array(MAX_UPLOAD_BYTES + 1), 'big.png'))), 'over-size file refused')
ok(/empty/.test(await why(file(new Uint8Array(0), 'empty.png'))), 'empty file refused')
ok(/not a real/.test(await why(file(pdf(''), 'doc.pdf'))), 'PDF refused where only images are allowed (logos)')

// ── PDFs ──
const P = async (bytes) => (await pdfRisk(bytes)) || 'clean'
ok((await P(pdf(''))) === 'clean', 'plain PDF passes')
ok((await P(pdf('/OpenAction [3 0 R /FitH 800] /A << /S /URI /URI (https://example.com) >>'))) === 'clean', 'benign PDF (opening zoom + web link) passes — no false positive')
ok(/JavaScript/.test(await P(pdf('/OpenAction << /S /JavaScript /JS (app.alert(1)) >>'))), 'PDF with JavaScript refused')
ok(/JavaScript/.test(await P(pdf('/OpenAction << /S /J#61va#53cript /JS (x) >>'))), 'JavaScript hidden behind #hex name escapes refused')
ok(/launch/.test(await P(pdf('/OpenAction << /S /Launch /F (cmd.exe) >>'))), 'PDF that launches a program refused')
ok(/embedded/.test(await P(pdf('/Names << /EmbeddedFiles << /Names [(a.exe) 9 0 R] >> >>'))), 'PDF with an embedded file refused')
ok(/send data/.test(await P(pdf('/AA << /O << /S /SubmitForm /F (http://untrusted.example) >> >>'))), 'PDF that submits data refused')
ok(/scripted forms/.test(await P(pdf('/AcroForm << /XFA 7 0 R >>'))), 'XFA form refused')
ok(/password/.test(await P(enc('%PDF-1.7\ntrailer\n<< /Root 1 0 R /Encrypt 9 0 R >>\n%%EOF\n'))), 'encrypted PDF refused (cannot be inspected)')
ok(/launch/.test(await P(objStm('9 0 << /S /Launch /F (cmd.exe) >>'))), 'action hidden in a COMPRESSED object stream found and refused')
ok(/JavaScript/.test(await P(objStm('9 0 << /S /JavaScript >>', false))), 'action in an uncompressed object stream refused')
ok((await P(objStm('9 0 << /Type /Page >>'))) === 'clean', 'compressed object stream with nothing risky passes')
ok(/incomplete or has extra data/.test(await P(cat(pdf(''), enc('<script>alert(1)</script>')))), 'PDF with data appended after the end (polyglot) refused')
ok(/incomplete/.test(await P(enc('%PDF-1.7\n1 0 obj\n<< >>'))), 'truncated PDF refused')
ok((await why(file(pdf(''), 'spec.pdf'), { allowPdf: true })) === 'OK' && /JavaScript/.test(await why(file(pdf('/X << /S /JavaScript >>'), 'spec.pdf'), { allowPdf: true })), 'gate: clean PDF accepted, scripted PDF refused')
// false-positive rate on random binary (like compressed image data inside a PDF)
let hits = 0
for (let i = 0; i < 30; i++) { const junk = new Uint8Array(500_000); for (let k = 0; k < junk.length; k += 65536) crypto.getRandomValues(junk.subarray(k, k + 65536)); if (await pdfRisk(cat(enc('%PDF-1.7\n'), junk, enc('\n%%EOF\n')))) hits++ }
ok(hits === 0, `no false alarms on 15 MB of random binary PDF content (${hits} hits)`)

// ── names ──
ok(cleanFileName('invoice‮fdp.exe') === 'invoicefdp.exe', 'right-to-left override (name spoofing) stripped')
ok(cleanFileName('..\\..\\etc/passwd') === '.._.._etc_passwd' && cleanFileName('a\x00b\nc.png') === 'abc.png', 'path separators and control characters removed')
ok(cleanFileName('x'.repeat(300) + '.pdf').length === 80 && cleanFileName('x'.repeat(300) + '.pdf').endsWith('.pdf') && cleanFileName('') === 'file', 'long names capped at 80 keeping the extension; empty → "file"')

// ── stored data ──
const good = 'data:image/png;base64,iVBORw0KGgo='
ok(isSafeImageUrl(good) && !isSafeImageUrl('https://untrusted.example/pixel.png') && !isSafeImageUrl('javascript:alert(1)') && !isSafeImageUrl('data:image/svg+xml;base64,PHN2Zz4=') && !isSafeImageUrl('data:image/gif;base64,R0lGODlh') && !isSafeImageUrl('data:text/html;base64,PGI+') && !isSafeImageUrl('data:image/png;base64,AAA" onerror="x'), 'only our own base64 PNG/JPEG data: URLs count as images (no GIF, WebP, SVG, remote or script URLs)')
const dirty = { company: { name: 'Co', logo: 'https://untrusted.example/track.gif?u=1' }, clients: [], quotes: [
  { id: 'q1', attachments: [
    { id: 'a', name: 'ok.png', type: 'image/png', dataUrl: good },
    { id: 'b', name: 'x.png', type: 'image/png', dataUrl: 'https://untrusted.example/remote.png' },
    { id: 'c', name: 'x.pdf', type: 'application/pdf', dataUrl: 'javascript:alert(document.domain)' },
    { id: 'd', name: 'x.svg', type: 'image/png', dataUrl: 'data:image/svg+xml;base64,PHN2Zz4=' },
    { id: 'e', name: 'doc‮fdp.exe', type: 'image/png', dataUrl: 'data:application/pdf;base64,JVBERi0=' },
    null, 'string',
  ] },
  { id: 'q2', attachments: [] }, { id: 'q3' },
] }
const clean = sanitizeState(dirty)
ok(clean.company.logo === '' && clean.company.name === 'Co', 'tampered backup: remote logo (tracking pixel) removed')
ok(clean.quotes[0].attachments.map((a) => a.id).join() === 'a,e', 'tampered backup: http, javascript:, SVG and junk attachments removed; valid ones kept')
ok(clean.quotes[0].attachments[1].type === 'application/pdf' && clean.quotes[0].attachments[1].name === 'docfdp.exe', 'kept attachment: type corrected from its real data, name de-spoofed')
const tidy = { company: { logo: good }, quotes: [{ id: 'q', attachments: [{ id: 'a', name: 'ok.png', type: 'image/png', dataUrl: good }] }] }
ok(sanitizeState(tidy) === tidy && sanitizeState(null) === null && sanitizeState({}) && sanitizeState({ quotes: 'nope' }), 'clean state returned untouched; odd shapes do not throw')

console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0)
