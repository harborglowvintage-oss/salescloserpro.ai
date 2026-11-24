/**
 * SalesCloserPro - quote pricing + Good/Better/Best options
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 *
 * The ONE place quote money is computed. The builder, the store, the PDF and the
 * client-facing proposal page all price quotes through here.
 *
 * Data model
 *   Line item:            { id, type, description, model?, qty, unit, price }  (model = product model number)
 *   Single-option quote:  { lines: [...] }
 *   Tiered quote:         { options: [{ id, name, lines }, …2–3], recommendedOptionId }
 *   Accepted quote:       { acceptance: { optionId, name, at, fingerprint } }
 * For tiered quotes the store keeps `lines` + `total` derived from the chosen option
 * (accepted → recommended → first), so the pipeline, dashboard and PO screens keep
 * working without knowing about tiers.
 */

import { calculateTax } from '../data/taxDatabase'
import { longDate } from './dates'

export const MAX_OPTIONS = 3
export const OPTION_NAMES = ['Good', 'Better', 'Best']

/** "$1,234.50" — or "$1,235" with digits = 0, for headline numbers where cents are noise. */
export function formatMoney(n, digits = 2) {
  return '$' + (Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

export function newLine(type = 'product') {
  return { id: crypto.randomUUID(), type, description: '', model: '', qty: 1, unit: 'ea', price: 0 }
}

/** A line's model number, tidied (single spaces, trimmed); '' when it has none. */
export const modelOf = (line) => (line?.model || '').replace(/\s+/g, ' ').trim()

/** One-line name for a line item, with its model number when it has one: "Heat pump (Model XR-15)". */
export function lineLabel(line) {
  const desc = line?.description?.trim() || ''
  const model = modelOf(line)
  return model ? `${desc || 'Item'} (Model ${model})` : desc
}

/** Price a list of line items for a state → per-line tax + totals. */
export function computeLines(lines = [], stateCode) {
  const computed = lines.map((line) => {
    const subtotal = (Number(line.qty) || 0) * (Number(line.price) || 0)
    const { taxAmount, taxRate, taxable } = calculateTax(stateCode, line.type, subtotal)
    return { ...line, subtotal, taxAmount, taxRate, taxable, total: subtotal + taxAmount }
  })
  const subtotal = computed.reduce((s, l) => s + l.subtotal, 0)
  const tax = computed.reduce((s, l) => s + l.taxAmount, 0)
  return { lines: computed, subtotal, tax, total: subtotal + tax }
}

export const hasTiers = (quote) => (quote?.options?.length || 0) > 1

/** Every quote as a list of options (a single-option quote is one unnamed option). */
export function getOptions(quote) {
  return hasTiers(quote) ? quote.options : [{ id: 'single', name: '', lines: quote?.lines || [] }]
}

/** The option that counts: the client's accepted choice, else the recommended one, else the first. */
export function chosenOptionId(quote) {
  const ids = getOptions(quote).map((o) => o.id)
  const pick = [quote?.acceptance?.optionId, quote?.recommendedOptionId].find((id) => id && ids.includes(id))
  return pick || ids[0]
}

/** Price every option of a quote and identify the chosen one. */
export function priceQuote(quote) {
  const options = getOptions(quote).map((o) => ({ ...o, ...computeLines(o.lines, quote?.state) }))
  const chosenId = chosenOptionId(quote)
  return { options, chosen: options.find((o) => o.id === chosenId) || options[0], tiered: options.length > 1 }
}

/** Derived fields the store keeps in sync on every save (see data model above). */
export function deriveQuoteSummary(quote) {
  const { chosen, tiered } = priceQuote(quote)
  return tiered
    ? { lines: chosen.lines.map(stripComputed), total: chosen.total }
    : { total: chosen.total }
}

/** Option label for UI/PDF: "Better" or "Option B" when unnamed. */
export function optionLabel(option, index) {
  return option?.name?.trim() || `Option ${String.fromCharCode(65 + index)}`
}

/** Proposal terms — shown on the PDF and on the client's online proposal page. */
export function proposalTerms(quote) {
  return [
    'A deposit of 50% of the total is due upon acceptance of this proposal.',
    'Remaining balance is due net 30 days from date of invoice.',
    quote?.validUntil
      ? `This proposal is valid until ${longDate(quote.validUntil)}.`
      : 'This proposal is valid for 30 days from the date shown above.',
  ]
}

const stripComputed = ({ subtotal, taxAmount, taxRate, taxable, total, ...raw }) => raw
