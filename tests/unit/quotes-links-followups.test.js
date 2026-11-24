// Unit tests for the pure modules. Bundled with esbuild (src imports are extensionless).
import { followUpSchedule, dueFollowUps, followUpCalendar, relativeDue, isExpired } from '@src/utils/followUps'
import { mailtoHref, proposalEmail, followUpEmail, PASTE_HINT } from '@src/utils/emails'
import { priceQuote, deriveQuoteSummary, chosenOptionId, computeLines } from '@src/utils/quoteMath'
import { encodePacket, decodePacket, proposalSnapshot, snapshotToQuote, fingerprint } from '@src/utils/proposalLink'
import { addDays, isoDay } from '@src/utils/dates'

let pass = 0, fail = 0
const ok = (c, m) => { c ? pass++ : fail++; console.log(`${c ? '✓' : '✗'} ${m}`) }

const today = isoDay()
const sentAt = new Date(Date.now() - 4 * 864e5).toISOString() // sent 4 days ago
const base = { id: 'q1', quoteNumber: 'Q-0007', clientName: 'Dana Whitfield', clientEmail: 'dana@example.com', state: 'TX', createdAt: sentAt }

// ── schedule ──
const q = { ...base, status: 'sent', sentAt, validUntil: addDays(today, 10), lines: [{ id: 'a', type: 'product', description: 'Roof', qty: 1, unit: 'ea', price: 1000 }], total: 1082.5 }
const sched = followUpSchedule(q)
ok(sched.map((s) => s.kind).join() === 'checkin,value,expiry', `three steps in order (${sched.map((s) => s.kind)})`)
ok(sched[0].date === addDays(isoDay(sentAt), 3) && sched[0].inDays === -1 && sched[0].due, 'check-in: day 3 after send, 1 day overdue')
ok(sched[1].date === addDays(isoDay(sentAt), 7) && !sched[1].due, 'offer-to-adjust: day 7, upcoming')
ok(sched[2].date === addDays(q.validUntil, -2), 'expiry reminder: 2 days before valid-until')
ok(followUpSchedule({ ...q, status: 'draft' }).length === 0, 'drafts have no schedule')
ok(followUpSchedule({ ...q, status: 'won' }).length === 0, 'won quotes have no schedule')
ok(followUpSchedule({ ...q, validUntil: addDays(isoDay(sentAt), 5) }).map((s) => s.kind).join() === 'expiry', 'short validity (5d): day-3 check-in replaced by same-day expiry reminder; day 7 dropped (after expiry)')
ok(dueFollowUps([q], 0).length === 1 && dueFollowUps([q], 7).length === 2, 'due today: 1; due within 7 days: 2')
ok(dueFollowUps([{ ...q, followUpsDone: { checkin: 'x' } }], 0).length === 0, 'done steps drop out of the due list')
ok(relativeDue(0) === 'today' && relativeDue(1) === 'tomorrow' && relativeDue(-1) === '1 day overdue' && relativeDue(-3) === '3 days overdue', 'relative wording')
ok(isExpired({ ...q, validUntil: addDays(today, -1) }) && !isExpired(q) && !isExpired({ ...q, status: 'won', validUntil: addDays(today, -1) }), 'expired only when sent and past valid-until')

// ── calendar ──
const url = 'https://salescloserpro.ai/p#z' + 'A'.repeat(600)
const ics = followUpCalendar(q, url)
const rows = ics.split('\r\n')
ok(ics.startsWith('BEGIN:VCALENDAR\r\n') && ics.endsWith('END:VCALENDAR\r\n'), 'ics: CRLF envelope')
ok((ics.match(/BEGIN:VEVENT/g) || []).length === 4, 'ics: 3 follow-ups + expiry = 4 events')
ok(rows.every((r) => new TextEncoder().encode(r).length <= 75), 'ics: every physical line ≤ 75 octets (folded)')
const unfolded = ics.replace(/\r\n /g, '')
ok(unfolded.includes(url), 'ics: long proposal URL survives folding intact')
ok(unfolded.includes(`DTSTART;VALUE=DATE:${q.validUntil.replace(/-/g, '')}`), 'ics: expiry event on valid-until date')
ok(/SUMMARY:Check in: Dana Whitfield · Q-0007/.test(unfolded), 'ics: readable summary')
ok(/DESCRIPTION:Q-0007 for Dana Whitfield — \$1\\,082.50\\nEmail: dana@example.com/.test(unfolded), 'ics: description escaped (commas, newlines)')
ok((ics.match(/TRIGGER:PT9H/g) || []).length === 4, 'ics: 9am alert on each event')
ok((followUpCalendar({ ...q, followUpsDone: { checkin: 'x', value: 'x', expiry: 'x' } }).match(/BEGIN:VEVENT/g) || []).length === 1, 'ics: done steps excluded (expiry date kept)')

// ── emails ──
const company = { name: 'Summit Roofing Co.', email: 'jobs@summit.example', phone: '(512) 555-0142' }
const shortMail = mailtoHref(proposalEmail({ quote: q, company, url: 'https://x.test/p#zabc' }))
ok(shortMail.linkInBody && shortMail.href.startsWith('mailto:dana@example.com?subject=Proposal%20Q-0007%20from%20Summit%20Roofing%20Co.'), 'proposal email: addressed + subject')
const longMail = mailtoHref(proposalEmail({ quote: q, company, url: 'https://x.test/p#z' + 'B'.repeat(3000) }))
ok(!longMail.linkInBody && longMail.href.length <= 1900 && decodeURIComponent(longMail.href).includes(PASTE_HINT), 'proposal email: over-long link swapped for paste hint, href ≤ 1900')
for (const kind of ['checkin', 'value', 'expiry']) {
  const m = followUpEmail(kind, { quote: q, company, url: 'https://x.test/p#z1' })
  ok(m.body.startsWith('Hi Dana,') && m.body.includes('Q-0007') && m.body.includes('https://x.test/p#z1') && m.body.includes('Summit Roofing Co.'), `follow-up "${kind}": greeting, number, link, signature`)
}

// ── pricing / tiers ──
const tiered = { ...base, state: 'TX', options: [
  { id: 'g', name: 'Good', lines: [{ id: 1, type: 'product', qty: 1, price: 1000 }] },
  { id: 'b', name: 'Better', lines: [{ id: 2, type: 'product', qty: 2, price: 1000 }, { id: 3, type: 'freight', qty: 1, price: 100 }] },
], recommendedOptionId: 'b' }
ok(chosenOptionId(tiered) === 'b' && chosenOptionId({ ...tiered, acceptance: { optionId: 'g' } }) === 'g', 'chosen: accepted beats recommended')
ok(chosenOptionId({ ...tiered, recommendedOptionId: 'gone' }) === 'g', 'chosen: stale recommended id falls back to first')
const sum = deriveQuoteSummary(tiered)
ok(Math.abs(sum.total - (2000 * 1.0825 + 100)) < 1e-9 && sum.lines.length === 2 && !('taxAmount' in sum.lines[0]), 'derived total/lines = recommended option (TX freight exempt), raw lines only')
ok(computeLines([{ type: 'product', qty: '2', price: '10' }], 'TX').subtotal === 20, 'string qty/price coerced')
ok(priceQuote({ lines: [], state: 'TX' }).chosen.total === 0, 'empty quote prices to 0')

// ── proposal link round-trip ──
const snap = proposalSnapshot(tiered, company)
const packed = await encodePacket(snap)
ok(packed[0] === 'z' && /^[A-Za-z0-9_-]+$/.test(packed.slice(1)), 'packet: deflated, URL-safe')
const back = await decodePacket(packed)
ok(JSON.stringify(back) === JSON.stringify(snap), 'packet: lossless round-trip')
ok(await fingerprint(back) === await fingerprint(snap) && /^[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/.test(await fingerprint(snap)), 'fingerprint: stable across round-trip, XXXX-XXXX-XXXX')
const edited = proposalSnapshot({ ...tiered, options: [tiered.options[0], { ...tiered.options[1], lines: [{ ...tiered.options[1].lines[0], price: 1001 }] }] }, company)
ok(await fingerprint(edited) !== await fingerprint(snap), 'fingerprint: changes when a price changes')
ok(await fingerprint(proposalSnapshot(tiered, { ...company, phone: 'new' })) === await fingerprint(snap), 'fingerprint: company contact edits do not invalidate acceptance')
const rq = snapshotToQuote(back)
ok(priceQuote(rq).chosen.total === priceQuote(tiered).chosen.total && rq.recommendedOptionId === 'b', 'client-side quote prices identically')
ok(await decodePacket('j' + Buffer.from('{"a":1}').toString('base64url')).then((x) => x.a === 1), 'plain-JSON fallback format decodes')
let threw = false
try { await decodePacket(packed.slice(0, -10)) } catch { threw = true }
ok(threw, 'truncated packet throws (→ friendly error page)')

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
