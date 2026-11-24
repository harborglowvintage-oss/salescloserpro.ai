/**
 * SalesCloserPro - contacts ⇄ quotes ⇄ deals
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 *
 * Contacts are stored under the `clients` key (kept for backup compatibility).
 * Quotes and deals point at a contact with `contactId`; a quote also keeps its own copy of
 * the name/email/phone it was written for, so a sent proposal never changes underneath a client.
 */

const norm = (s) => (s || '').trim().toLowerCase()

/** Find the contact a typed-in name/email refers to: same email, else same name. */
export function matchContact(contacts, { name, email }) {
  const e = norm(email)
  const n = norm(name)
  return (e && contacts.find((c) => norm(c.email) === e)) || (n && contacts.find((c) => norm(c.name) === n || norm(c.company) === n)) || null
}

/** Contacts whose name, company or email contains the query (for pickers and search). */
export function searchContacts(contacts, query) {
  const q = norm(query)
  if (!q) return contacts
  return contacts.filter((c) => [c.name, c.company, c.email].some((v) => norm(v).includes(q)))
}

/** Everything linked to one contact, with the money rolled up. */
export function contactActivity(contactId, quotes, pipeline) {
  const linkedQuotes = quotes.filter((q) => q.contactId === contactId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const deals = pipeline.flatMap((stage) => stage.deals.filter((d) => d.contactId === contactId).map((d) => ({ ...d, stageId: stage.id, stageLabel: stage.label })))
  const sum = (list, key) => list.reduce((s, x) => s + (x[key] || 0), 0)
  const open = deals.filter((d) => d.stageId !== 'won' && d.stageId !== 'lost')
  return {
    quotes: linkedQuotes,
    deals,
    openDeals: open,
    openValue: sum(open, 'value'),
    wonValue: sum(deals.filter((d) => d.stageId === 'won'), 'value'),
  }
}
