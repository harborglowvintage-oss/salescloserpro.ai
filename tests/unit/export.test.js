import { EXPORT_FORMATS, buildRecords, buildExportFile, csvCell, toCsv } from '@src/utils/crmExport'
let pass = 0, fail = 0
const ok = (c, m) => { c ? pass++ : fail++; console.log(`${c ? '✓' : '✗'} ${m}`) }

// minimal RFC 4180 parser to read our own output back
function parse(csv) {
  const rows = []; let row = [], cell = '', q = false
  const s = csv.replace(/^﻿/, '')
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (q) { if (ch === '"' && s[i + 1] === '"') { cell += '"'; i++ } else if (ch === '"') q = false; else cell += ch }
    else if (ch === '"') q = true
    else if (ch === ',') { row.push(cell); cell = '' }
    else if (ch === '\r' && s[i + 1] === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; i++ }
    else cell += ch
  }
  return rows
}
const asObjects = (csv) => { const [h, ...r] = parse(csv); return r.map((x) => Object.fromEntries(h.map((k, i) => [k, x[i]]))) }

ok(csvCell('a,b') === '"a,b"' && csvCell('say "hi"') === '"say ""hi"""' && csvCell('line1\nline2') === '"line1\nline2"', 'csv: commas, quotes, newlines escaped')
ok(csvCell('=SUM(A1)') === "'=SUM(A1)" && csvCell('@cmd') === "'@cmd" && csvCell('+cmd|x') === "'+cmd|x" && csvCell('-2+A1') === "'-2+A1", 'csv: formula-like text neutralised')
ok(csvCell('+1 (512) 555-0100') === '+1 (512) 555-0100' && csvCell('-5') === '-5' && csvCell(-12.5) === '-12.5', 'csv: phone numbers and negative numbers untouched')
ok(csvCell(null) === '' && csvCell(undefined) === '' && csvCell(0) === '0', 'csv: empty + zero')

const state = {
  clients: [
    { id: 'c1', name: 'Dana Marie Whitfield', company: 'Riverside Dental, LLC', email: 'dana@example.com', phone: '+1 (512) 555-0100', address: '12 Main St', state: 'TX', notes: 'Prefers "text"\nnot calls', createdAt: '2026-11-01T10:00:00Z' },
    { id: 'c2', name: 'Cher', company: '', email: '', phone: '', state: 'CA', createdAt: '2026-11-02T10:00:00Z' },
  ],
  quotes: [
    { id: 'q1', quoteNumber: 'Q-0001', contactId: 'c1', clientName: 'Dana Marie Whitfield', clientEmail: 'dana@example.com', state: 'TX', status: 'won', createdAt: '2026-11-03T10:00:00Z', sentAt: '2026-11-04T10:00:00Z', validUntil: '2026-12-03',
      acceptance: { name: 'Dana Whitfield', at: '2026-11-10T15:00:00Z', optionId: 'b', fingerprint: 'AAAA-BBBB-CCCC' }, recommendedOptionId: 'g',
      options: [{ id: 'g', name: 'Good', lines: [{ id: 1, type: 'product', description: 'Shingles', qty: 2, unit: 'ea', price: 1000 }] },
                { id: 'b', name: 'Better', lines: [{ id: 2, type: 'product', description: 'Arch shingles', qty: 2, unit: 'ea', price: 1500 }, { id: 3, type: 'freight', description: 'Delivery', qty: 1, unit: 'job', price: 100 }] }] },
    { id: 'q2', quoteNumber: 'Q-0002', contactId: 'c2', clientName: 'Cher', state: 'CA', status: 'sent', createdAt: '2026-11-05T10:00:00Z', validUntil: '2026-12-20', lines: [{ id: 4, type: 'service', description: 'Consult', qty: 1, unit: 'hr', price: 200 }] },
  ],
  pipeline: [
    { id: 'lead', label: 'Lead', deals: [{ id: 'd3', name: 'Cher', value: 900, contactId: 'c2', createdAt: '2026-11-06T10:00:00Z', note: '=HYPERLINK("x")' }] },
    { id: 'sent', label: 'Proposal Sent', deals: [{ id: 'd2', name: 'Cher', value: 200, contactId: 'c2', quoteId: 'q2', quoteNumber: 'Q-0002', createdAt: '2026-11-05T10:00:00Z' }] },
    { id: 'won', label: 'Closed Won', deals: [{ id: 'd1', name: 'Dana Marie Whitfield', value: 3347.5, contactId: 'c1', quoteId: 'q1', quoteNumber: 'Q-0001', createdAt: '2026-11-03T10:00:00Z' }] },
  ],
}
const rec = buildRecords(state)
ok(rec.contacts.length === 2 && rec.deals.length === 3 && rec.quotes.length === 2 && rec.lines.length === 4, 'records: 2 contacts, 3 deals, 2 quotes, 4 lines (all options)')
ok(rec.contacts[0].first === 'Dana Marie' && rec.contacts[0].last === 'Whitfield' && rec.contacts[1].first === '' && rec.contacts[1].last === 'Cher', 'names split: multi-part first name; single name → last name')
const d1 = rec.deals.find((d) => d.id === 'd1'), d2 = rec.deals.find((d) => d.id === 'd2')
ok(d1.closeDate === '2026-11-10' && d2.closeDate === '2026-12-20', 'close date: won → acceptance date; open → quote valid-until')
ok(/^\d{4}-\d\d-\d\d$/.test(rec.deals.find((d) => d.id === 'd3').closeDate), 'close date: manual open deal gets a date (required by CRMs)')
ok(rec.quotes[0].chosenOption === 'Better' && Math.abs(rec.quotes[0].total - 3347.5) < 0.01, 'quote row prices the accepted option (TX 8.25% on product, freight exempt)')

const get = (fid, key) => { const f = EXPORT_FORMATS.find((x) => x.id === fid); return buildExportFile(f, f.files.find((x) => x.key === key), rec) }
for (const f of EXPORT_FORMATS) for (const file of f.files) {
  const { csv, count } = buildExportFile(f, file, rec)
  const rows = parse(csv)
  ok(csv.startsWith('﻿') && rows.length === count + 1 && rows.every((r) => r.length === file.columns.length), `${f.id}/${file.key}: BOM, ${count} rows, every row has ${file.columns.length} columns`)
}

const hc = asObjects(get('hubspot', 'contacts').csv)
ok(hc[0]['First Name'] === 'Dana Marie' && hc[0]['Email'] === 'dana@example.com' && hc[0]['Phone Number'] === '+1 (512) 555-0100' && hc[0]['Company Name'] === 'Riverside Dental, LLC' && hc[0]['State/Region'] === 'Texas', 'hubspot contacts: property names + full state name + comma company survives')
ok(hc[0]['Notes'] === 'Prefers "text"\nnot calls', 'multi-line note with quotes round-trips')
const hd = asObjects(get('hubspot', 'deals').csv)
ok(hd.map((d) => d['Deal Stage']).join('|') === 'Appointment Scheduled|Contract Sent|Closed Won' && hd.every((d) => d['Pipeline'] === 'Sales Pipeline'), 'hubspot deals: stages translated to default pipeline')
ok(hd[2]['Email'] === 'dana@example.com' && hd[2]['Deal Name'] === 'Dana Marie Whitfield — Q-0001' && hd[2]['Amount'] === '3347.50', 'hubspot deals: contact email on the row (association) + amount')
ok(hd[0]['Deal Description'].startsWith("'="), 'formula in a note is neutralised in the export')
const so = asObjects(get('salesforce', 'opportunities').csv)
ok(so.map((d) => d.StageName).join('|') === 'Prospecting|Proposal/Price Quote|Closed Won' && so.every((d) => d.Name && d.CloseDate && d['Account Name']), 'salesforce opportunities: required Name/StageName/CloseDate + account')
const sc = asObjects(get('salesforce', 'contacts').csv)
ok(sc[0]['Account Name'] === 'Riverside Dental, LLC' && sc[1]['Account Name'] === 'Cher' && sc[1]['Last Name'] === 'Cher', 'salesforce contacts: account falls back to the person; Last Name always present')
const ul = asObjects(get('universal', 'quote-lines').csv)
ok(ul.filter((l) => l['Quote Number'] === 'Q-0001').map((l) => l.Option).join() === 'Good,Better,Better' && ul[3].Option === '', 'universal lines: every option listed; single-option quotes blank')
const uq = asObjects(get('universal', 'quotes').csv)
ok(uq[0]['Accepted'] === '2026-11-10' && uq[0]['Accepted By'] === 'Dana Whitfield' && uq[0]['Options'] === '2' && uq[1]['Subtotal'] === '200.00' && uq[1]['Total'] === '217.36', 'universal quotes: acceptance, option count, totals')
ok(buildExportFile(EXPORT_FORMATS[0], EXPORT_FORMATS[0].files[0], buildRecords({})).count === 0, 'empty store exports header-only files')

console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0)
