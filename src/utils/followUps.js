/**
 * SalesCloserPro - follow-up schedule + calendar export
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 *
 * A sent quote gets a fixed, proven cadence counted from `sentAt`:
 *   day 3  check in · day 7  offer to adjust · 2 days before `validUntil`  expiry reminder
 * Steps after the quote expires are dropped. Done steps live in quote.followUpsDone.
 * Reminders reach the user's own calendar via an .ics file — no server, no notifications.
 */

import { addDays, daysFromToday, isoDay, longDate } from './dates'
import { formatMoney } from './quoteMath'

export const DEFAULT_VALID_DAYS = 30

export const FOLLOW_UP_STEPS = [
  { kind: 'checkin', label: 'Check in',          afterSent: 3 },
  { kind: 'value',   label: 'Offer to adjust',   afterSent: 7 },
  { kind: 'expiry',  label: 'Expiry reminder',   beforeExpiry: 2 },
]

/** Full schedule for a quote (empty unless it is out with the client). */
export function followUpSchedule(quote) {
  if (quote?.status !== 'sent' || !quote.sentAt) return []
  const sent = isoDay(quote.sentAt)
  const steps = FOLLOW_UP_STEPS.map((s) => ({
    ...s,
    date: s.afterSent != null ? addDays(sent, s.afterSent) : quote.validUntil ? addDays(quote.validUntil, -s.beforeExpiry) : null,
  }))
    .filter((s) => s.date && s.date > sent && (!quote.validUntil || s.date <= quote.validUntil))
  // one step per day — a later step in FOLLOW_UP_STEPS (more urgent) replaces an earlier one
  const byDate = new Map(steps.map((s) => [s.date, s]))
  return [...byDate.values()].sort((x, y) => x.date.localeCompare(y.date)).map((s) => {
    const inDays = daysFromToday(s.date)
    return { ...s, done: Boolean(quote.followUpsDone?.[s.kind]), inDays, due: inDays <= 0 }
  })
}

/** Open follow-ups across all quotes that are due within `horizonDays` (0 = today/overdue). */
export function dueFollowUps(quotes, horizonDays = 0) {
  return quotes
    .flatMap((quote) => followUpSchedule(quote).filter((s) => !s.done && s.inDays <= horizonDays).map((step) => ({ quote, step })))
    .sort((a, b) => a.step.date.localeCompare(b.step.date))
}

/** "today" · "tomorrow" · "in 3 days" · "2 days overdue" */
export function relativeDue(inDays) {
  if (inDays === 0) return 'today'
  if (inDays === 1) return 'tomorrow'
  if (inDays > 1) return `in ${inDays} days`
  return `${-inDays} day${inDays === -1 ? '' : 's'} overdue`
}

export const isExpired = (quote) => quote?.status === 'sent' && Boolean(quote.validUntil) && daysFromToday(quote.validUntil) < 0

// ── iCalendar (RFC 5545) ─────────────────────────────────────────
const icsEscape = (t) => String(t).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')

/** Fold content lines at 75 octets (continuation lines start with a space). */
function fold(line) {
  const bytes = new TextEncoder().encode(line)
  if (bytes.length <= 75) return line
  const out = []
  let start = 0
  const dec = new TextDecoder()
  while (start < bytes.length) {
    let end = Math.min(start + (out.length ? 74 : 75), bytes.length)
    while (end < bytes.length && (bytes[end] & 0xc0) === 0x80) end-- // never split a UTF-8 sequence
    out.push((out.length ? ' ' : '') + dec.decode(bytes.slice(start, end)))
    start = end
  }
  return out.join('\r\n')
}

const icsDate = (iso) => iso.replace(/-/g, '')
const stamp = () => new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

/**
 * Calendar file with one all-day event (09:00 alert) per open follow-up step,
 * plus the expiry date itself.
 */
export function followUpCalendar(quote, proposalUrl) {
  const who = quote.clientName || 'client'
  const events = followUpSchedule(quote)
    .filter((s) => !s.done)
    .map((s) => ({ uid: s.kind, date: s.date, title: `${s.label}: ${who} · ${quote.quoteNumber}` }))
  if (quote.validUntil) events.push({ uid: 'expires', date: quote.validUntil, title: `Proposal expires: ${who} · ${quote.quoteNumber}` })

  const description = [
    `${quote.quoteNumber} for ${who} — ${formatMoney(quote.total)}`,
    quote.clientEmail && `Email: ${quote.clientEmail}`,
    quote.clientPhone && `Phone: ${quote.clientPhone}`,
    quote.validUntil && `Valid until ${longDate(quote.validUntil)}`,
    proposalUrl && `Proposal: ${proposalUrl}`,
    'Open SalesCloserPro to send the drafted follow-up email.',
  ].filter(Boolean).join('\n')

  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//LLMadvisor ai LLC//SalesCloserPro//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    ...events.flatMap((e) => [
      'BEGIN:VEVENT',
      `UID:${quote.id}-${e.uid}@salescloserpro.ai`,
      `DTSTAMP:${stamp()}`,
      `DTSTART;VALUE=DATE:${icsDate(e.date)}`,
      `DTEND;VALUE=DATE:${icsDate(addDays(e.date, 1))}`,
      `SUMMARY:${icsEscape(e.title)}`,
      `DESCRIPTION:${icsEscape(description)}`,
      'TRANSP:TRANSPARENT',
      'BEGIN:VALARM', 'ACTION:DISPLAY', 'TRIGGER:PT9H', `DESCRIPTION:${icsEscape(e.title)}`, 'END:VALARM',
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ]
  return lines.map(fold).join('\r\n') + '\r\n'
}
