/**
 * salescloserpro.ai - email drafts (opened in the user's own mail app via mailto:)
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 *
 * Nothing is sent by salescloserpro.ai — every message opens as a draft in the user's
 * mail client, so it goes from their own address and stays in their Sent folder.
 */

import { formatMoney, priceQuote, optionLabel } from './quoteMath'
import { longDate } from './dates'

// Windows and some mail clients truncate mailto: URLs around 2,000 characters.
const MAILTO_SAFE_LENGTH = 1900
export const PASTE_HINT = '[paste the proposal link here — it is on your clipboard]'

/**
 * Build a mailto: href. If the long proposal link would push it past the safe length,
 * the link in the body is swapped for PASTE_HINT (callers copy the link to the clipboard).
 */
export function mailtoHref({ to = '', subject, body, url }) {
  const make = (b) => `mailto:${to.replace(/[?&#\s]/g, '')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(b)}`
  const href = make(body)
  if (href.length <= MAILTO_SAFE_LENGTH || !url) return { href, linkInBody: true }
  return { href: make(body.split(url).join(PASTE_HINT)), linkInBody: false }
}

const firstName = (name) => (name || '').trim().split(/\s+/)[0] || 'there'

function signature(company) {
  return [company.name, company.phone, company.email].filter(Boolean).join('\n')
}

function priceLine(quote) {
  const { options, tiered } = priceQuote(quote)
  return tiered
    ? options.map((o, i) => `  • ${optionLabel(o, i)}: ${formatMoney(o.total)}`).join('\n')
    : `  • Total: ${formatMoney(options[0].total)}`
}

/** First send of a proposal. */
export function proposalEmail({ quote, company, url }) {
  const tiered = (quote.options?.length || 0) > 1
  const body = [
    `Hi ${firstName(quote.clientName)},`,
    '',
    `Thanks for the opportunity. Your proposal ${quote.quoteNumber} is ready${tiered ? ` — I've put together ${quote.options.length} options so you can pick the one that fits best` : ''}:`,
    '',
    priceLine(quote),
    '',
    `Review${tiered ? ', choose' : ''} and accept it online (works on any phone, no account needed):`,
    url,
    '',
    quote.validUntil ? `Pricing is held until ${longDate(quote.validUntil)}.` : null,
    'Happy to walk through it on a quick call if that helps.',
    '',
    signature(company),
  ].filter((l) => l !== null).join('\n')
  return { to: quote.clientEmail || '', subject: `Proposal ${quote.quoteNumber} from ${company.name || 'us'}`, body, url }
}

/** Follow-up drafts, keyed by the follow-up step kind (see followUps.js). */
export function followUpEmail(kind, { quote, company, url }) {
  const hi = `Hi ${firstName(quote.clientName)},`
  const link = url ? ['', 'Here is the proposal again for easy reference:', url] : []
  const valid = quote.validUntil ? longDate(quote.validUntil) : null
  const bodies = {
    checkin: [
      hi, '',
      `Just checking that proposal ${quote.quoteNumber} came through OK and whether any questions have come up.`,
      ...link, '',
      'If it would help, I can walk you through it in 10 minutes — just reply with a good time.',
    ],
    value: [
      hi, '',
      `A quick follow-up on ${quote.quoteNumber}. If it's useful, I can adjust the scope or phasing to fit your budget or timeline — just tell me what matters most.`,
      ...link,
    ],
    expiry: [
      hi, '',
      valid
        ? `A heads-up that the pricing in proposal ${quote.quoteNumber} is held until ${valid}. After that I may need to requote.`
        : `A heads-up that the pricing in proposal ${quote.quoteNumber} expires soon.`,
      ...link, '',
      'If you would like to go ahead, you can accept online in a minute — or reply and I will take care of it.',
    ],
  }
  const subjects = {
    checkin: `Following up: proposal ${quote.quoteNumber}`,
    value: `Any questions on ${quote.quoteNumber}?`,
    expiry: `Pricing on ${quote.quoteNumber} expires ${valid || 'soon'}`,
  }
  const body = [...bodies[kind], '', 'Thanks,', signature(company)].join('\n')
  return { to: quote.clientEmail || '', subject: subjects[kind], body, url }
}

/** Sent by the CLIENT back to the seller after accepting on the proposal page. */
export function acceptanceEmail({ company, quote, record, url, optionName, total }) {
  const body = [
    `Hi${company.name ? ` ${company.name}` : ''},`,
    '',
    `I accept proposal ${quote.quoteNumber}${optionName ? ` — ${optionName} option` : ''} (${formatMoney(total)}).`,
    '',
    `Accepted by: ${record.name}`,
    `Date: ${new Date(record.at).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}`,
    `Version: ${record.fp}`,
    '',
    'Acceptance record (open in salescloserpro.ai to log it):',
    url,
  ].join('\n')
  return { to: company.email || '', subject: `Accepted: proposal ${quote.quoteNumber}`, body, url }
}
