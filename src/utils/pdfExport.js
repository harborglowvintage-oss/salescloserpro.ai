/**
 * SalesCloserPro - PDF export (proposals + purchase orders)
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 *
 * Shared drawing helpers (palette, header, line table, totals, footer) are used by both
 * documents. All quote money comes from utils/quoteMath.js.
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import { stateTaxData } from '../data/taxDatabase'
import { formatMoney, priceQuote, optionLabel, proposalTerms } from './quoteMath'
import { longDate } from './dates'

// ── Neutral palette (one accent: LLMadvisor copper, for "recommended") ──
const PAL = {
  charcoal: [38, 38, 38],
  darkGray: [55, 65, 81],
  midGray:  [107, 114, 128],
  softGray: [156, 163, 175],
  ruleGray: [209, 213, 219],
  bgLight:  [248, 249, 250],
  bgAlt:    [252, 252, 253],
  white:    [255, 255, 255],
  copper:   [194, 112, 58],
  green:    [22, 163, 74],
}
const M = 16 // page margin (mm)

const QUOTE_BADGES = {
  won:  { fill: [220, 252, 231], text: [22, 163, 74] },
  lost: { fill: [254, 226, 226], text: [220, 38, 38] },
  sent: { fill: [226, 232, 240], text: [51, 65, 85] },
}
const PO_BADGES = {
  issued:   { fill: [226, 232, 240], text: [51, 65, 85] },
  ordered:  { fill: [219, 234, 254], text: [37, 99, 235] },
  received: { fill: [254, 243, 199], text: [146, 115, 26] },
  paid:     { fill: [220, 252, 231], text: [22, 163, 74] },
}

const capitalize = (t) => (t || '').charAt(0).toUpperCase() + (t || '').slice(1)

/** Company block (left) + document number block with status badge (right). */
function drawHeader(doc, company, { title, number, date, status, badges }) {
  const W = doc.internal.pageSize.getWidth()
  const { charcoal, midGray, bgLight } = PAL

  doc.setFillColor(...charcoal)
  doc.rect(0, 0, W, 3, 'F')

  let x = M
  if (company.logo) {
    try { doc.addImage(company.logo, M, 9, 19, 19); x = M + 23 } catch (_) { /* unembeddable logo */ }
  }
  doc.setTextColor(...charcoal)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text(company.name || 'SalesCloserPro', x, 21)

  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...midGray)
  let infoY = 26
  for (const v of [company.address, company.phone, company.email, company.website]) {
    if (v) { doc.text(v, x, infoY); infoY += 4 }
  }

  const rX = W - M
  doc.setFillColor(...bgLight)
  doc.roundedRect(W - 72, 8, 58, 31, 3, 3, 'F')
  doc.setTextColor(...charcoal)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text(title, rX, 17, { align: 'right' })
  doc.setFontSize(15)
  doc.text(number, rX, 26, { align: 'right' })
  doc.setTextColor(...midGray)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(longDate(date), rX, 33, { align: 'right' })

  const label = (status || 'draft').toUpperCase()
  const c = badges[status] || { fill: [229, 231, 235], text: midGray }
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  const sw = doc.getTextWidth(label) + 10
  doc.setFillColor(...c.fill)
  doc.setTextColor(...c.text)
  doc.roundedRect(rX - sw, 36.5, sw, 7, 2, 2, 'F')
  doc.text(label, rX - sw / 2, 41.5, { align: 'center' })

  doc.setDrawColor(...PAL.ruleGray)
  doc.setLineWidth(0.3)
  doc.line(M, 49, W - M, 49)
}

/** Small uppercase section label. */
function label(doc, text, x, y, color = PAL.darkGray, align = 'left') {
  doc.setTextColor(...color)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.text(text, x, y, { align })
}

/** Proposal line-item table → returns the y below it. */
function drawLinesTable(doc, lines, startY) {
  const { charcoal, darkGray, midGray, ruleGray, bgAlt, white } = PAL
  autoTable(doc, {
    startY,
    head: [['Type', 'Description', 'Qty', 'Unit', 'Unit Price', 'Tax', 'Total']],
    body: lines.map((l) => [
      capitalize(l.type || 'product'),
      l.description || '—',
      l.qty,
      (l.unit || 'ea').toUpperCase(),
      formatMoney(l.price),
      l.taxable ? `${(l.taxRate * 100).toFixed(2)}%` : 'Exempt',
      formatMoney(l.total),
    ]),
    theme: 'plain',
    headStyles: { fillColor: charcoal, textColor: white, fontStyle: 'bold', fontSize: 7.5, cellPadding: { top: 4.5, bottom: 4.5, left: 3, right: 3 } },
    bodyStyles: { fontSize: 9, textColor: darkGray, cellPadding: { top: 5.5, bottom: 5.5, left: 3, right: 3 }, lineColor: ruleGray, lineWidth: 0.2 },
    alternateRowStyles: { fillColor: bgAlt },
    // fixed columns total 122mm; Description takes the rest of the 178mm text width
    columnStyles: {
      0: { cellWidth: 20, fontStyle: 'bold', fontSize: 8 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 13, halign: 'center', fontStyle: 'bold' },
      3: { cellWidth: 14, halign: 'center', fontSize: 8, textColor: midGray },
      4: { cellWidth: 27, halign: 'right' },
      5: { cellWidth: 18, halign: 'right', fontSize: 8, textColor: midGray },
      6: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: M, right: M },
    tableLineColor: ruleGray,
    tableLineWidth: 0.2,
  })
  return doc.lastAutoTable.finalY
}

/** Right-aligned totals: detail rows, dashed rule, dark total band → returns the y below it. */
function drawTotals(doc, y, rows, totalLabel, totalValue) {
  const W = doc.internal.pageSize.getWidth()
  const { midGray, darkGray, softGray, charcoal, white } = PAL
  const totalsX = 130
  const valX = W - M
  if (y + 10 + rows.length * 7 + 18 > 280) { doc.addPage(); y = 20 }
  y += 10
  rows.forEach(([name, value], i) => {
    if (i) y += 7
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...midGray)
    doc.text(name, totalsX, y)
    doc.setTextColor(...darkGray)
    doc.setFont('helvetica', 'bold')
    doc.text(formatMoney(value), valX, y, { align: 'right' })
  })
  y += 5
  doc.setDrawColor(...softGray)
  doc.setLineDashPattern([2, 2])
  doc.line(totalsX, y, valX, y)
  doc.setLineDashPattern([])
  y += 4
  doc.setFillColor(...charcoal)
  doc.roundedRect(totalsX - 4, y, valX - totalsX + 4, 14, 3, 3, 'F')
  doc.setTextColor(...white)
  doc.setFontSize(totalLabel.length > 16 ? 8.5 : 10)
  doc.setFont('helvetica', 'bold')
  doc.text(totalLabel, totalsX + 1, y + 9)
  doc.setFontSize(14)
  doc.text(formatMoney(totalValue), valX - 3, y + 9.5, { align: 'right' })
  return y + 14
}

/** Shaded box with a label and numbered lines → returns the y below it. */
function drawTermsBox(doc, y, title, terms) {
  const W = doc.internal.pageSize.getWidth()
  doc.setFontSize(7.5)
  const rows = terms.flatMap((t, i) => doc.splitTextToSize(`${i + 1}. ${t}`, W - M * 2 - 10))
  const h = 10 + rows.length * 4.2
  if (y + h > 280) { doc.addPage(); y = 20 }
  doc.setFillColor(...PAL.bgLight)
  doc.roundedRect(M, y, W - M * 2, h, 2, 2, 'F')
  label(doc, title, M + 5, y + 6)
  doc.setTextColor(...PAL.midGray)
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  rows.forEach((r, i) => doc.text(r, M + 5, y + 11.5 + i * 4.2))
  return y + h
}

/** Footer on every page. */
function drawFooters(doc) {
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const pages = doc.internal.getNumberOfPages()
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p)
    const fY = H - 10
    doc.setDrawColor(...PAL.ruleGray)
    doc.setLineWidth(0.2)
    doc.line(M, fY - 4, W - M, fY - 4)
    doc.setTextColor(...PAL.softGray)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text('Made with SalesCloserPro  ·  an llmadvisor.ai studio project  ·  Free & Open Source', W / 2, fY, { align: 'center' })
    doc.text(`Page ${p} of ${pages}`, W - M, fY, { align: 'right' })
  }
}

// ══════════════════════════════════════════════════════════════
// PROPOSAL
// ══════════════════════════════════════════════════════════════

/**
 * Builds the proposal PDF. Single-option quotes render one table; Good/Better/Best quotes
 * render one priced section per option plus a "choose one" summary.
 *
 * @param {Object} quote        stored quote (raw lines; priced here)
 * @param {Object} company      company settings
 * @param {string} [proposalUrl] online review + accept link (clickable in the PDF)
 * @param {boolean} [download=true]  false → return the jsPDF doc instead of saving
 */
export function generatePDF({ quote, company, proposalUrl, download = true }) {
  const doc = new jsPDF()
  const W = doc.internal.pageSize.getWidth()
  const { charcoal, darkGray, midGray, ruleGray, copper, green } = PAL
  const { options, chosen, tiered } = priceQuote(quote)
  const recommendedId = quote.recommendedOptionId || options[0].id
  const acceptedId = quote.acceptance?.optionId

  drawHeader(doc, company, { title: 'PROPOSAL', number: quote.quoteNumber || 'Q-DRAFT', date: quote.createdAt, status: quote.status, badges: QUOTE_BADGES })

  // ── Prepared for / validity ──
  label(doc, 'PREPARED FOR', M, 56)
  doc.setTextColor(...charcoal)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text(quote.clientName || '—', M, 62)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...midGray)
  let billY = 67
  for (const v of [quote.clientEmail, quote.clientPhone, stateTaxData[quote.state]?.name || quote.state]) {
    if (v) { doc.text(v, M, billY); billY += 4.5 }
  }
  if (quote.validUntil) {
    label(doc, 'VALID UNTIL', W - M, 56, PAL.darkGray, 'right')
    doc.setTextColor(...charcoal)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(longDate(quote.validUntil), W - M, 62, { align: 'right' })
  }

  let y = 84
  if (!tiered) {
    y = drawLinesTable(doc, chosen.lines, y)
    y = drawTotals(doc, y, [['Subtotal', chosen.subtotal], [`Tax (${quote.state || ''})`, chosen.tax]], 'GRAND TOTAL', chosen.total)
  } else {
    doc.setTextColor(...darkGray)
    doc.setFontSize(9)
    doc.text(`This proposal offers ${options.length} options. Choose the one that fits — each is fully priced below.`, M, y - 2)
    y += 4
    options.forEach((o, i) => {
      const name = optionLabel(o, i)
      if (y > 230) { doc.addPage(); y = 20 }
      doc.setTextColor(...charcoal)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(`Option ${String.fromCharCode(65 + i)} — ${name}`, M, y + 4)
      const tag = o.id === acceptedId ? ['ACCEPTED', green] : !acceptedId && o.id === recommendedId ? ['RECOMMENDED', copper] : null
      if (tag) {
        const tx = M + doc.getTextWidth(`Option ${String.fromCharCode(65 + i)} — ${name}`) + 4
        doc.setFontSize(7)
        const tw = doc.getTextWidth(tag[0]) + 6
        doc.setFillColor(...tag[1])
        doc.roundedRect(tx, y, tw, 5.5, 1.5, 1.5, 'F')
        doc.setTextColor(...PAL.white)
        doc.text(tag[0], tx + 3, y + 3.9)
      }
      y = drawLinesTable(doc, o.lines, y + 8)
      y = drawTotals(doc, y, [['Subtotal', o.subtotal], [`Tax (${quote.state || ''})`, o.tax]], `${name.toUpperCase()} TOTAL`, o.total) + 10
    })

    // choose-one summary (tick box per option — works on paper too)
    const h = 12 + options.length * 7
    if (y + h > 280) { doc.addPage(); y = 20 }
    doc.setDrawColor(...PAL.ruleGray)
    doc.setLineWidth(0.3)
    doc.roundedRect(M, y, W - M * 2, h, 2, 2, 'S')
    label(doc, acceptedId ? 'SELECTED OPTION' : 'YOUR CHOICE — TICK ONE', M + 5, y + 6.5)
    options.forEach((o, i) => {
      const ry = y + 13 + i * 7
      doc.setDrawColor(...midGray)
      doc.rect(M + 5, ry - 3.3, 4, 4)
      if (o.id === acceptedId) { doc.setFillColor(...green); doc.rect(M + 5.8, ry - 2.5, 2.4, 2.4, 'F') }
      doc.setTextColor(...darkGray)
      doc.setFontSize(9.5)
      doc.setFont('helvetica', 'bold')
      doc.text(`Option ${String.fromCharCode(65 + i)} — ${optionLabel(o, i)}`, M + 12, ry)
      doc.text(formatMoney(o.total), W - M - 5, ry, { align: 'right' })
    })
    y += h
  }

  // ── Terms ──
  y = drawTermsBox(doc, y + 8, 'TERMS & PAYMENT', proposalTerms(quote))

  // ── Acceptance record, or the online accept link ──
  if (quote.acceptance) {
    const a = quote.acceptance
    y += 8
    if (y > 262) { doc.addPage(); y = 20 }
    label(doc, 'ACCEPTANCE', M, y, green)
    doc.setTextColor(...darkGray)
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'normal')
    const opt = tiered ? ` · ${optionLabel(options.find((o) => o.id === a.optionId), options.findIndex((o) => o.id === a.optionId))}` : ''
    doc.text(`Accepted by ${a.name} on ${format(new Date(a.at), "MMMM d, yyyy 'at' h:mm a")}${opt} · version ${a.fingerprint}`, M, y + 5)
    y += 8
  } else if (proposalUrl) {
    y += 8
    if (y > 266) { doc.addPage(); y = 20 }
    label(doc, 'REVIEW & ACCEPT ONLINE', M, y)
    doc.setTextColor(...copper)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.textWithLink('Open this proposal in your browser to choose and accept →', M, y + 5.5, { url: proposalUrl })
    y += 8
  }

  // ── Notes ──
  if (quote.notes) {
    y += 8
    if (y > 255) { doc.addPage(); y = 20 }
    label(doc, 'NOTES', M, y)
    doc.setTextColor(...darkGray)
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'normal')
    const noteLines = doc.splitTextToSize(quote.notes, W - M * 2)
    doc.text(noteLines, M, y + 5)
    y += 5 + noteLines.length * 4
  }

  // ── ATTACHMENTS ───────────────────────────────────────────
  const imageAttachments = (quote.attachments || []).filter(a => a.type?.startsWith('image/'))
  const pdfAttachments = (quote.attachments || []).filter(a => a.type === 'application/pdf')

  if (imageAttachments.length || pdfAttachments.length) {
    y += 10
    if (y > 240) { doc.addPage(); y = 20 }

    doc.setTextColor(...darkGray)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.text('ATTACHMENTS', M, y)
    y += 6

    // Image thumbnails
    if (imageAttachments.length) {
      let imgX = M
      const thumbW = 38
      const thumbH = 28
      for (const img of imageAttachments) {
        if (imgX + thumbW > W - M) { imgX = M; y += thumbH + 10 }
        if (y + thumbH > 270) { doc.addPage(); y = 20; imgX = M }
        try {
          doc.addImage(img.dataUrl, imgX, y, thumbW, thumbH)
          doc.setDrawColor(...ruleGray)
          doc.setLineWidth(0.3)
          doc.rect(imgX, y, thumbW, thumbH)
          doc.setFontSize(5.5)
          doc.setTextColor(...midGray)
          doc.setFont('helvetica', 'normal')
          const truncName = img.name.length > 18 ? img.name.slice(0, 15) + '...' : img.name
          doc.text(truncName, imgX, y + thumbH + 3.5)
        } catch (_) { /* skip unembeddable images */ }
        imgX += thumbW + 5
      }
      y += thumbH + 8
    }

    // PDF file list
    if (pdfAttachments.length) {
      if (y > 270) { doc.addPage(); y = 20 }
      for (const pdf of pdfAttachments) {
        doc.setFontSize(8)
        doc.setTextColor(...midGray)
        doc.setFont('helvetica', 'normal')
        doc.text(`\u{1F4CE} ${pdf.name}`, M, y)
        y += 5
      }
    }
  }

  drawFooters(doc)
  if (!download) return doc
  doc.save(`${(quote.quoteNumber || 'quote').replace(/\s/g, '_')}.pdf`)
}

// ══════════════════════════════════════════════════════════════
// PURCHASE ORDER
// ══════════════════════════════════════════════════════════════

/**
 * Generates a polished, color-neutral Purchase Order PDF for vendors.
 * No internal margin data is included.
 *
 * @param {Object} options
 * @param {Object} options.po        – enriched PO object (from PurchaseOrders component)
 * @param {Object} options.company   – company settings from store
 */
export function generatePO_PDF({ po, company }) {
  const doc = new jsPDF()
  const W = doc.internal.pageSize.getWidth()   // 210
  const H = doc.internal.pageSize.getHeight()  // 297

  const { charcoal, darkGray, midGray, softGray, ruleGray, bgLight, white } = PAL
  const poCreated = po.createdAt ? longDate(po.createdAt) : '—'

  drawHeader(doc, company, { title: 'PURCHASE ORDER', number: po.poNumber || 'PO-0000', date: po.issuedAt, status: po.status, badges: PO_BADGES })

  // ── VENDOR (TO) ────────────────────────────────────────────
  let leftY = 58
  doc.setTextColor(...darkGray)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.text('VENDOR / SHIP FROM', M, leftY)

  leftY += 6
  doc.setTextColor(...charcoal)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text(po.vendor || '—', M, leftY)

  if (po.vendorContact) {
    leftY += 5.5
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...midGray)
    doc.text(po.vendorContact, M, leftY)
  }

  // ── SHIP TO (right — PO address or company address) ────────
  let rightY = 58
  doc.setTextColor(...darkGray)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.text('SHIP TO', W / 2 + 10, rightY)

  rightY += 6
  if (po.shipToAddress) {
    // Use the explicit ship-to address from the PO
    doc.setTextColor(...charcoal)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(company.name || 'SalesCloserPro', W / 2 + 10, rightY)
    rightY += 5
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...midGray)
    const shipLines = doc.splitTextToSize(po.shipToAddress, W / 2 - M - 14)
    doc.text(shipLines, W / 2 + 10, rightY)
    rightY += shipLines.length * 4.5
  } else {
    // Fall back to company address
    doc.setTextColor(...charcoal)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(company.name || 'SalesCloserPro', W / 2 + 10, rightY)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...midGray)
    if (company.address) { rightY += 5; doc.text(company.address, W / 2 + 10, rightY) }
    if (company.phone)   { rightY += 4.5; doc.text(company.phone, W / 2 + 10, rightY) }
    if (company.email)   { rightY += 4.5; doc.text(company.email, W / 2 + 10, rightY) }
  }

  // ── PO Details row ─────────────────────────────────────────
  const detailsY = Math.max(leftY, rightY) + 10
  doc.setFillColor(...bgLight)
  doc.roundedRect(M, detailsY, W - M * 2, 14, 2, 2, 'F')

  const cols = [
    { label: 'PO Number',    value: po.poNumber || 'PO-0000' },
    { label: 'Date Created', value: poCreated },
    { label: 'Date Issued',  value: po.issuedAt ? format(new Date(po.issuedAt), 'MM/dd/yyyy') : '—' },
    { label: 'Linked Quote', value: po.quoteNumber || '—' },
  ]
  const colW = (W - M * 2) / cols.length
  cols.forEach((col, i) => {
    const cx = M + colW * i + 6
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...midGray)
    doc.text(col.label.toUpperCase(), cx, detailsY + 5)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...charcoal)
    doc.text(col.value, cx, detailsY + 10.5)
  })

  // ── LINE ITEMS TABLE ───────────────────────────────────────
  const lineTotal = (po.qty || 0) * (po.unitCost || 0)

  autoTable(doc, {
    startY: detailsY + 20,
    head: [['#', 'Description', 'Type', 'Qty', 'Unit Cost', 'Line Total']],
    body: [
      [
        '1',
        po.lineDescription || po.description || '—',
        (po.lineType || 'product').charAt(0).toUpperCase() + (po.lineType || 'product').slice(1),
        String(po.qty || 0),
        formatMoney(po.unitCost || 0),
        formatMoney(lineTotal),
      ]
    ],
    theme: 'plain',
    headStyles: {
      fillColor: [...charcoal],
      textColor: [...white],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: { top: 5, bottom: 5, left: 5, right: 5 },
    },
    bodyStyles: {
      fontSize: 9.5,
      textColor: darkGray,
      cellPadding: { top: 6, bottom: 6, left: 5, right: 5 },
      lineColor: [...ruleGray],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: 'auto' }, // fixed columns total 110mm of 178mm
      2: { cellWidth: 24, fontStyle: 'bold', fontSize: 8 },
      3: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
      4: { cellWidth: 28, halign: 'right' },
      5: { cellWidth: 28, halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: M, right: M },
  })

  let y = drawTotals(doc, doc.lastAutoTable.finalY, [['Subtotal', lineTotal]], 'PO TOTAL', lineTotal) + 8

  // ── NOTES ──────────────────────────────────────────────────
  if (po.notes) {
    if (y > 240) { doc.addPage(); y = 20 }
    doc.setTextColor(...darkGray)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.text('NOTES & SPECIAL INSTRUCTIONS', M, y)

    doc.setTextColor(...darkGray)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    const noteLines = doc.splitTextToSize(po.notes, W - M * 2)
    doc.text(noteLines, M, y + 6)
    y += 6 + noteLines.length * 4.5
  }

  y = drawTermsBox(doc, y + 8, 'TERMS & CONDITIONS', [
    'Please reference the PO number on all correspondence, invoices, and shipping documents.',
    'Goods must be delivered to the Ship To address listed above unless otherwise specified.',
    'Vendor shall notify buyer immediately of any delays or changes to the order.',
    'Payment terms: 50% deposit due upon PO issuance; remaining balance due net 30 days from receipt of goods and valid invoice.',
    'This Purchase Order is subject to the terms agreed upon between buyer and vendor.',
  ])

  // ── SIGNATURE LINES ────────────────────────────────────────
  y += 4
  if (y > 255) { doc.addPage(); y = 20 }

  const sigW = (W - M * 2 - 20) / 2

  // Authorized by
  doc.setDrawColor(...softGray)
  doc.setLineWidth(0.4)
  doc.line(M, y + 12, M + sigW, y + 12)
  doc.setTextColor(...charcoal)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('Authorized By', M, y + 18)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...midGray)
  doc.setFontSize(7)
  doc.text(company.name || 'Company', M, y + 22)

  // Date
  doc.setDrawColor(...softGray)
  doc.line(M + sigW + 20, y + 12, W - M, y + 12)
  doc.setTextColor(...charcoal)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('Date', M + sigW + 20, y + 18)

  drawFooters(doc)

  // ── SAVE ───────────────────────────────────────────────────
  doc.save(`${(po.poNumber || 'PO').replace(/\s/g, '_')}.pdf`)
}
