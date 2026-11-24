/**
 * SalesCloserPro - export contacts, deals and quotes to other CRMs (CSV)
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 *
 * One engine, many formats. `buildRecords()` flattens the store into neutral records;
 * each entry in EXPORT_FORMATS is just a list of files, and each file a list of
 * [column header, value getter] pairs. Adding a CRM = adding one entry.
 *
 * Nothing is sent anywhere: files are generated on the device and the user imports them
 * with the CRM's own import tool (no API keys, no OAuth, no server).
 */

import { isoDay, addDays } from './dates'
import { priceQuote, optionLabel } from './quoteMath'
import { stateTaxData } from '../data/taxDatabase'

// ── neutral records ─────────────────────────────────────────────
const splitName = (name = '') => {
  const parts = name.trim().split(/\s+/)
  return parts.length > 1 ? { first: parts.slice(0, -1).join(' '), last: parts.at(-1) } : { first: '', last: parts[0] || '' }
}
const stateName = (code) => stateTaxData[code]?.name || code || ''

/** Flatten the store into contacts, deals, quotes and quote lines with their links resolved. */
export function buildRecords({ clients = [], quotes = [], pipeline = [] }) {
  const contactById = new Map(clients.map((c) => [c.id, c]))
  const quoteById = new Map(quotes.map((q) => [q.id, q]))

  const contacts = clients.map((c) => ({ ...c, ...splitName(c.name), stateName: stateName(c.state) }))

  const deals = pipeline.flatMap((stage) => stage.deals.map((d) => {
    const quote = quoteById.get(d.quoteId)
    const contact = contactById.get(d.contactId)
    const closed = stage.id === 'won' || stage.id === 'lost'
    return {
      id: d.id,
      name: [d.name, d.quoteNumber].filter(Boolean).join(' — '),
      stageId: stage.id,
      stage: stage.label,
      amount: d.value || 0,
      createdDate: isoDay(d.createdAt),
      // CRMs require a close date: when it closed, else the quote's expiry, else 30 days out
      closeDate: closed ? isoDay(quote?.acceptance?.at || d.movedAt || d.createdAt) : quote?.validUntil || addDays(isoDay(), 30),
      quoteNumber: d.quoteNumber || '',
      note: d.note || '',
      contactName: contact?.name || d.name || '',
      contactEmail: contact?.email || quote?.clientEmail || '',
      contactPhone: contact?.phone || quote?.clientPhone || '',
      company: contact?.company || '',
      ...splitName(contact?.name || d.name),
    }
  }))

  const quoteRows = quotes.map((q) => {
    const { options, chosen, tiered } = priceQuote(q)
    return {
      ...q,
      createdDate: isoDay(q.createdAt),
      sentDate: q.sentAt ? isoDay(q.sentAt) : '',
      acceptedDate: q.acceptance ? isoDay(q.acceptance.at) : '',
      acceptedBy: q.acceptance?.name || '',
      company: contactById.get(q.contactId)?.company || '',
      optionCount: options.length,
      chosenOption: tiered ? optionLabel(chosen, options.indexOf(chosen)) : '',
      subtotal: chosen.subtotal,
      tax: chosen.tax,
      total: chosen.total,
      priced: { options, tiered },
    }
  })

  const lines = quoteRows.flatMap((q) => q.priced.options.flatMap((o, i) => o.lines.map((l) => ({
    quoteNumber: q.quoteNumber,
    clientName: q.clientName || '',
    option: q.priced.tiered ? optionLabel(o, i) : '',
    ...l,
  }))))

  return { contacts, deals, quotes: quoteRows, lines }
}

// ── formats ─────────────────────────────────────────────────────
const money = (n) => (Number(n) || 0).toFixed(2)

// Default stage names in each CRM's stock sales pipeline; users can remap during import.
const HUBSPOT_STAGE = { lead: 'Appointment Scheduled', quoted: 'Qualified To Buy', sent: 'Contract Sent', negotiate: 'Decision Maker Bought-In', won: 'Closed Won', lost: 'Closed Lost' }
const SALESFORCE_STAGE = { lead: 'Prospecting', quoted: 'Proposal/Price Quote', sent: 'Proposal/Price Quote', negotiate: 'Negotiation/Review', won: 'Closed Won', lost: 'Closed Lost' }

export const EXPORT_FORMATS = [
  {
    id: 'universal',
    name: 'Universal CSV',
    blurb: 'Plain spreadsheets that open in Excel, Google Sheets or Numbers and import into almost any CRM, accounting or email tool.',
    files: [
      { key: 'contacts', label: 'Contacts', from: 'contacts', columns: [
        ['Name', (c) => c.name], ['First Name', (c) => c.first], ['Last Name', (c) => c.last], ['Company', (c) => c.company],
        ['Email', (c) => c.email], ['Phone', (c) => c.phone], ['Address', (c) => c.address], ['State', (c) => c.state], ['Notes', (c) => c.notes],
        ['Created', (c) => isoDay(c.createdAt)],
      ] },
      { key: 'deals', label: 'Deals', from: 'deals', columns: [
        ['Deal', (d) => d.name], ['Stage', (d) => d.stage], ['Amount', (d) => money(d.amount)], ['Close Date', (d) => d.closeDate],
        ['Contact', (d) => d.contactName], ['Contact Email', (d) => d.contactEmail], ['Contact Phone', (d) => d.contactPhone], ['Company', (d) => d.company],
        ['Quote Number', (d) => d.quoteNumber], ['Created', (d) => d.createdDate], ['Notes', (d) => d.note],
      ] },
      { key: 'quotes', label: 'Quotes', from: 'quotes', columns: [
        ['Quote Number', (q) => q.quoteNumber], ['Status', (q) => q.status], ['Client', (q) => q.clientName], ['Company', (q) => q.company],
        ['Email', (q) => q.clientEmail], ['Phone', (q) => q.clientPhone], ['State', (q) => q.state],
        ['Subtotal', (q) => money(q.subtotal)], ['Tax', (q) => money(q.tax)], ['Total', (q) => money(q.total)],
        ['Options', (q) => q.optionCount], ['Chosen Option', (q) => q.chosenOption],
        ['Created', (q) => q.createdDate], ['Sent', (q) => q.sentDate], ['Valid Until', (q) => q.validUntil], ['Accepted', (q) => q.acceptedDate], ['Accepted By', (q) => q.acceptedBy],
        ['Notes', (q) => q.notes],
      ] },
      { key: 'quote-lines', label: 'Quote line items', from: 'lines', columns: [
        ['Quote Number', (l) => l.quoteNumber], ['Client', (l) => l.clientName], ['Option', (l) => l.option], ['Type', (l) => l.type],
        ['Description', (l) => l.description], ['Quantity', (l) => l.qty], ['Unit', (l) => l.unit], ['Unit Price', (l) => money(l.price)],
        ['Tax Rate', (l) => (l.taxable ? l.taxRate : 0)], ['Tax', (l) => money(l.taxAmount)], ['Line Total', (l) => money(l.total)],
      ] },
    ],
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    blurb: 'Column names match HubSpot properties, so they map automatically in Contacts → Import. The deals file includes each contact\'s email, which lets HubSpot attach every deal to its contact.',
    steps: [
      'In HubSpot: Contacts → Import → Start an import → Import file from computer.',
      'Import the Contacts file first (one file, one object: Contacts).',
      'Then import the Deals file as "one file, multiple objects": Deals and Contacts. HubSpot matches contacts by Email.',
      'Deal stages use HubSpot\'s default Sales Pipeline names — remap them on the import screen if you renamed your stages.',
    ],
    files: [
      { key: 'contacts', label: 'Contacts', from: 'contacts', columns: [
        ['First Name', (c) => c.first], ['Last Name', (c) => c.last], ['Email', (c) => c.email], ['Phone Number', (c) => c.phone],
        ['Company Name', (c) => c.company], ['Street Address', (c) => c.address], ['State/Region', (c) => c.stateName], ['Country/Region', () => 'United States'],
        ['Notes', (c) => c.notes],
      ] },
      { key: 'deals', label: 'Deals (with contact)', from: 'deals', columns: [
        ['Deal Name', (d) => d.name], ['Pipeline', () => 'Sales Pipeline'], ['Deal Stage', (d) => HUBSPOT_STAGE[d.stageId] || d.stage],
        ['Amount', (d) => money(d.amount)], ['Close Date', (d) => d.closeDate], ['Deal Description', (d) => [d.quoteNumber && `SalesCloserPro ${d.quoteNumber}`, d.note].filter(Boolean).join(' — ')],
        ['Email', (d) => d.contactEmail], ['First Name', (d) => d.first], ['Last Name', (d) => d.last],
      ] },
    ],
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    blurb: 'Column names match Salesforce standard fields. Contacts go in through the Data Import Wizard; opportunities through Data Loader or dataloader.io.',
    steps: [
      'Contacts: Setup → Data Import Wizard → Accounts and Contacts → Add new records. Match contacts by Email; "Account Name" creates or links the account.',
      'Opportunities: the Import Wizard does not handle opportunities — use Data Loader or dataloader.io → Insert → Opportunity.',
      'When mapping, look up the Account by "Account Name". Name, Stage and Close Date are the fields Salesforce requires.',
      'Stages use Salesforce\'s default stage names — remap them if your org customized the sales process.',
    ],
    files: [
      { key: 'contacts', label: 'Contacts', from: 'contacts', columns: [
        ['First Name', (c) => c.first], ['Last Name', (c) => c.last], ['Email', (c) => c.email], ['Phone', (c) => c.phone],
        // Salesforce requires an account for business contacts; fall back to the person's name
        ['Account Name', (c) => c.company || c.name], ['Mailing Street', (c) => c.address], ['Mailing State/Province', (c) => c.stateName], ['Mailing Country', () => 'United States'],
        ['Description', (c) => c.notes],
      ] },
      { key: 'opportunities', label: 'Opportunities', from: 'deals', columns: [
        ['Name', (d) => d.name], ['Account Name', (d) => d.company || d.contactName], ['StageName', (d) => SALESFORCE_STAGE[d.stageId] || d.stage],
        ['Amount', (d) => money(d.amount)], ['CloseDate', (d) => d.closeDate],
        ['Description', (d) => [d.quoteNumber && `SalesCloserPro ${d.quoteNumber}`, d.contactEmail, d.note].filter(Boolean).join(' — ')],
      ] },
    ],
  },
]

// ── CSV (RFC 4180) ──────────────────────────────────────────────
/**
 * One cell. Quotes when needed, and neutralises spreadsheet formulas: text starting with
 * = or @, or with + / - followed by letters, would be executed by Excel/Sheets, so it gets
 * a leading apostrophe. Plain numbers (-5) and phone numbers (+1 512 555 0100) are left
 * exactly as typed so they import cleanly into a CRM.
 */
export function csvCell(value) {
  let s = value == null ? '' : String(value)
  if (/^[=@\t\r]/.test(s) || /^[+\-].*[A-Za-z]/.test(s)) s = `'${s}`
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** Rows → CSV text with a UTF-8 BOM (so Excel reads accents and em dashes correctly). */
export function toCsv(columns, rows) {
  const lines = [columns.map(([header]) => csvCell(header)), ...rows.map((row) => columns.map(([, get]) => csvCell(get(row))))]
  return '﻿' + lines.map((l) => l.join(',')).join('\r\n') + '\r\n'
}

/** Build one file of a format → { filename, csv, count }. */
export function buildExportFile(format, file, records) {
  const rows = records[file.from]
  return { filename: `salescloserpro-${format.id}-${file.key}-${isoDay()}.csv`, csv: toCsv(file.columns, rows), count: rows.length }
}
