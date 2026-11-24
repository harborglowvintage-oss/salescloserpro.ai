/**
 * SalesCloserPro - Business Summary report (PDF)
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 *
 * A plain-language snapshot for people who are not going to open a spreadsheet: four
 * headline numbers, then deals by stage, quotes and contacts in roomy tables.
 * Built from the same neutral records as the CSV exports (crmExport.buildRecords).
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { PAL, M, drawHeader, drawFooters, label, alignHead } from './pdfExport'
import { formatMoney } from './quoteMath'
import { format } from 'date-fns'
import { isoDay, shortDate } from './dates'

const OPEN_STATUSES = ['draft', 'sent']
const sum = (list, key) => list.reduce((s, x) => s + (Number(x[key]) || 0), 0)
const titleCase = (t = '') => t.charAt(0).toUpperCase() + t.slice(1)
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

/** The headline numbers, also useful on their own. */
export function summarize({ contacts, deals, quotes }) {
  const openDeals = deals.filter((d) => d.stageId !== 'won' && d.stageId !== 'lost')
  const wonDeals = deals.filter((d) => d.stageId === 'won')
  const lostDeals = deals.filter((d) => d.stageId === 'lost')
  const openQuotes = quotes.filter((q) => OPEN_STATUSES.includes(q.status))
  const decided = wonDeals.length + lostDeals.length
  return {
    contacts: contacts.length,
    openDeals: openDeals.length,
    openValue: sum(openDeals, 'amount'),
    wonDeals: wonDeals.length,
    wonValue: sum(wonDeals, 'amount'),
    openQuotes: openQuotes.length,
    openQuoteValue: sum(openQuotes, 'total'),
    winRate: decided ? Math.round((wonDeals.length / decided) * 100) : null,
  }
}

function section(doc, y, title, note) {
  if (y > 228) { doc.addPage(); y = 22 } // keep a heading together with its first rows
  doc.setTextColor(...PAL.charcoal)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(title, M, y)
  if (note) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...PAL.midGray)
    doc.text(note, M, y + 5.5)
  }
  return y + (note ? 9 : 4)
}

function table(doc, startY, head, body, columnStyles, emptyText) {
  if (!body.length) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...PAL.softGray)
    doc.text(emptyText, M, startY + 6)
    return startY + 12
  }
  autoTable(doc, {
    startY,
    head: [head],
    body,
    theme: 'plain',
    headStyles: { fillColor: PAL.bgLight, textColor: PAL.midGray, fontStyle: 'bold', fontSize: 8, cellPadding: { top: 3.5, bottom: 3.5, left: 3, right: 3 } },
    bodyStyles: { fontSize: 10, textColor: PAL.darkGray, cellPadding: { top: 4, bottom: 4, left: 3, right: 3 }, lineColor: PAL.ruleGray, lineWidth: { bottom: 0.2 } },
    columnStyles,
    margin: { left: M, right: M, bottom: 22 },
    rowPageBreak: 'avoid',
    didParseCell: alignHead(columnStyles),
  })
  return doc.lastAutoTable.finalY + 12
}

/**
 * @param {Object} records  from buildRecords()
 * @param {Object} company
 * @param {boolean} [download=true]  false → return the jsPDF doc
 */
export function generateReportPDF({ records, company, download = true }) {
  const doc = new jsPDF()
  const W = doc.internal.pageSize.getWidth()
  const s = summarize(records)
  const right = { halign: 'right' }

  drawHeader(doc, company, { title: 'BUSINESS SUMMARY', number: format(new Date(), 'MMM d, yyyy'), subtitle: 'Snapshot of your business' })

  // ── at a glance: four tiles ──
  const tiles = [
    ['Open deals', formatMoney(s.openValue), plural(s.openDeals, 'deal') + ' in progress'],
    ['Won', formatMoney(s.wonValue), plural(s.wonDeals, 'deal') + (s.winRate !== null ? ` · ${s.winRate}% win rate` : '')],
    ['Quotes awaiting answer', formatMoney(s.openQuoteValue), plural(s.openQuotes, 'quote') + ' (draft or sent)'],
    ['Contacts', String(s.contacts), 'people and companies'],
  ]
  const gap = 4
  const tw = (W - M * 2 - gap * 3) / 4
  tiles.forEach(([name, value, sub], i) => {
    const x = M + i * (tw + gap)
    doc.setFillColor(...PAL.bgLight)
    doc.roundedRect(x, 56, tw, 27, 2.5, 2.5, 'F')
    label(doc, name.toUpperCase(), x + 4, 63, PAL.midGray)
    doc.setTextColor(...PAL.charcoal)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(value.length > 11 ? 11.5 : 14)
    doc.text(value, x + 4, 72)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...PAL.midGray)
    doc.text(doc.splitTextToSize(sub, tw - 7), x + 4, 78)
  })

  // ── deals by stage ──
  let y = section(doc, 97, 'Deals by stage', 'Where every deal stands right now.')
  const stages = [...new Map(records.deals.map((d) => [d.stageId, d.stage])).entries()]
  y = table(doc, y, ['Stage', 'Deals', 'Value'],
    stages.map(([id, name]) => {
      const list = records.deals.filter((d) => d.stageId === id)
      return [name, list.length, formatMoney(sum(list, 'amount'))]
    }),
    { 1: { ...right, cellWidth: 26 }, 2: { ...right, cellWidth: 44, fontStyle: 'bold' } },
    'No deals yet.')

  // ── quotes ──
  y = section(doc, y, 'Quotes', 'Newest first.')
  const quotes = [...records.quotes].sort((a, b) => b.createdDate.localeCompare(a.createdDate))
  y = table(doc, y, ['Quote', 'Client', 'Status', 'Created', 'Valid until', 'Total'],
    quotes.map((q) => [
      q.quoteNumber,
      q.clientName || '—',
      titleCase(q.status) + (q.acceptedDate ? ' (accepted online)' : ''),
      shortDate(q.createdDate),
      q.validUntil ? shortDate(q.validUntil) : '—',
      formatMoney(q.total),
    ]),
    { 0: { cellWidth: 22, fontStyle: 'bold' }, 3: { cellWidth: 22 }, 4: { cellWidth: 24 }, 5: { ...right, cellWidth: 32, fontStyle: 'bold' } },
    'No quotes yet.')

  // ── contacts ──
  y = section(doc, y, 'Contacts', 'With the value of their open and won deals.')
  const byContact = (id, won) => sum(records.deals.filter((d) => d.contactId === id && (won ? d.stageId === 'won' : d.stageId !== 'won' && d.stageId !== 'lost')), 'amount')
  table(doc, y, ['Name', 'Email', 'Phone', 'Open', 'Won'],
    [...records.contacts].sort((a, b) => (a.name || '').localeCompare(b.name || '')).map((c) => [
      c.company ? `${c.name}\n${c.company}` : c.name,
      c.email || '—',
      c.phone || '—',
      formatMoney(byContact(c.id, false)),
      formatMoney(byContact(c.id, true)),
    ]),
    { 0: { fontStyle: 'bold' }, 3: { ...right, cellWidth: 28 }, 4: { ...right, cellWidth: 28 } },
    'No contacts yet.')

  drawFooters(doc)
  if (!download) return doc
  doc.save(`salescloserpro-summary-${isoDay()}.pdf`)
}
