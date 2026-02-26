import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'

/**
 * Generates a polished, color-neutral PDF quote / proposal.
 */
export function generatePDF({ quote, company, lines, subtotal, tax, grandTotal, paymentSettings }) {
  const doc = new jsPDF()
  const W = doc.internal.pageSize.getWidth()   // 210
  const H = doc.internal.pageSize.getHeight()  // 297
  const M = 16  // margin

  // ── Neutral palette ────────────────────────────────────────
  const charcoal = [38, 38, 38]
  const darkGray = [55, 65, 81]
  const midGray  = [107, 114, 128]
  const softGray = [156, 163, 175]
  const ruleGray = [209, 213, 219]
  const bgLight  = [248, 249, 250]
  const bgAlt    = [252, 252, 253]
  const white    = [255, 255, 255]

  const fmt = (n) =>
    '$' + (n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  // ── HEADER — thin top rule ─────────────────────────────────
  doc.setFillColor(...charcoal)
  doc.rect(0, 0, W, 3, 'F')

  // Company logo
  let textStartX = M
  if (company.logo) {
    try {
      doc.addImage(company.logo, M, 9, 18, 18)
      textStartX = M + 22
    } catch (_) { /* skip */ }
  }

  // Company name
  doc.setTextColor(...charcoal)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text(company.name || 'SalesCloserPro', textStartX, 20)

  // Company details
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...midGray)
  let infoY = 25
  if (company.address) { doc.text(company.address, textStartX, infoY); infoY += 4 }
  if (company.phone)   { doc.text(company.phone,   textStartX, infoY); infoY += 4 }
  if (company.email)   { doc.text(company.email,   textStartX, infoY); infoY += 4 }
  if (company.website) { doc.text(company.website,  textStartX, infoY) }

  // ── Quote number block (right) ─────────────────────────────
  const rX = W - M
  doc.setFillColor(...bgLight)
  doc.roundedRect(W - 72, 8, 58, 30, 3, 3, 'F')

  doc.setTextColor(...charcoal)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('PROPOSAL', rX, 17, { align: 'right' })

  doc.setFontSize(15)
  doc.text(quote.quoteNumber || 'Q-0000', rX, 26, { align: 'right' })

  doc.setTextColor(...midGray)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(format(new Date(), 'MMMM d, yyyy'), rX, 33, { align: 'right' })

  // Status badge
  const statusText = (quote.status || 'DRAFT').toUpperCase()
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  const sw = doc.getTextWidth(statusText) + 10
  if (quote.status === 'won')       { doc.setFillColor(220, 252, 231); doc.setTextColor(22, 163, 74) }
  else if (quote.status === 'lost') { doc.setFillColor(254, 226, 226); doc.setTextColor(220, 38, 38) }
  else if (quote.status === 'sent') { doc.setFillColor(226, 232, 240); doc.setTextColor(51, 65, 85) }
  else                              { doc.setFillColor(229, 231, 235); doc.setTextColor(...midGray) }
  doc.roundedRect(rX - sw, 36, sw, 7, 2, 2, 'F')
  doc.text(statusText, rX - sw / 2, 41, { align: 'center' })

  // ── DIVIDER ────────────────────────────────────────────────
  doc.setDrawColor(...ruleGray)
  doc.setLineWidth(0.3)
  doc.line(M, 48, W - M, 48)

  // ── BILL TO ────────────────────────────────────────────────
  doc.setTextColor(...darkGray)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.text('BILL TO', M, 55)

  doc.setTextColor(...charcoal)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text(quote.clientName || '—', M, 61)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...midGray)
  let billY = 66
  if (quote.clientEmail) { doc.text(quote.clientEmail, M, billY); billY += 4.5 }
  if (quote.clientPhone) { doc.text(quote.clientPhone, M, billY); billY += 4.5 }
  if (quote.state) {
    const stateNames = { TX: 'Texas', CA: 'California', NY: 'New York', FL: 'Florida', MA: 'Massachusetts' }
    doc.text(stateNames[quote.state] || quote.state, M, billY)
  }

  // ── LINE ITEMS TABLE ───────────────────────────────────────
  const tableBody = lines.map((l) => [
    (l.type || 'product').charAt(0).toUpperCase() + (l.type || 'product').slice(1),
    l.description || '—',
    l.qty,
    (l.unit || 'ea').toUpperCase(),
    fmt(l.price || 0),
    l.taxable ? `${(l.taxRate * 100).toFixed(2)}%` : 'Exempt',
    fmt(l.total || 0),
  ])

  autoTable(doc, {
    startY: 82,
    head: [['Type', 'Description', 'Qty', 'Unit', 'Unit Price', 'Tax', 'Total']],
    body: tableBody,
    theme: 'plain',
    headStyles: {
      fillColor: [...charcoal],
      textColor: [...white],
      fontStyle: 'bold',
      fontSize: 7.5,
      cellPadding: { top: 4.5, bottom: 4.5, left: 5, right: 5 },
    },
    bodyStyles: {
      fontSize: 9,
      textColor: darkGray,
      cellPadding: { top: 5.5, bottom: 5.5, left: 5, right: 5 },
      lineColor: [...ruleGray],
      lineWidth: 0.2,
    },
    alternateRowStyles: { fillColor: [...bgAlt] },
    columnStyles: {
      0: { cellWidth: 22, fontStyle: 'bold', fontSize: 8 },
      1: { cellWidth: 60 },
      2: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
      3: { cellWidth: 14, halign: 'center', fontSize: 8, textColor: midGray },
      4: { cellWidth: 26, halign: 'right' },
      5: { cellWidth: 20, halign: 'right', fontSize: 8, textColor: midGray },
      6: { cellWidth: 26, halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: M, right: M },
    tableLineColor: [...ruleGray],
    tableLineWidth: 0.2,
  })

  let y = doc.lastAutoTable.finalY + 12

  // ── TOTALS ─────────────────────────────────────────────────
  const totalsX = 130
  const valX = W - M

  // Subtotal
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...midGray)
  doc.text('Subtotal', totalsX, y)
  doc.setTextColor(...darkGray)
  doc.setFont('helvetica', 'bold')
  doc.text(fmt(subtotal), valX, y, { align: 'right' })

  // Tax
  y += 7
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...midGray)
  doc.text(`Tax (${quote.state || ''})`, totalsX, y)
  doc.setTextColor(...darkGray)
  doc.setFont('helvetica', 'bold')
  doc.text(fmt(tax), valX, y, { align: 'right' })

  // Dashed divider
  y += 5
  doc.setDrawColor(...softGray)
  doc.setLineDashPattern([2, 2])
  doc.line(totalsX, y, valX, y)
  doc.setLineDashPattern([])

  // Grand Total band
  y += 4
  doc.setFillColor(...charcoal)
  doc.roundedRect(totalsX - 4, y, valX - totalsX + 8, 14, 3, 3, 'F')
  doc.setTextColor(...white)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('GRAND TOTAL', totalsX + 2, y + 9)
  doc.setFontSize(14)
  doc.text(fmt(grandTotal), valX + 2, y + 9.5, { align: 'right' })

  // ── TERMS & PAYMENT ────────────────────────────────────────
  y += 22
  if (y > 245) { doc.addPage(); y = 20 }

  doc.setFillColor(...bgLight)
  doc.roundedRect(M, y, W - M * 2, 24, 2, 2, 'F')
  doc.setTextColor(...darkGray)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.text('TERMS & PAYMENT', M + 5, y + 6)

  doc.setTextColor(...midGray)
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  const proposalTerms = [
    '1. A deposit of 50% of the total is due upon acceptance of this proposal.',
    '2. Remaining balance is due net 30 days from date of invoice.',
    '3. This proposal is valid for 30 days from the date shown above.',
  ]
  proposalTerms.forEach((t, i) => {
    doc.text(t, M + 5, y + 11.5 + i * 4.2)
  })

  y += 30

  // ── NOTES ──────────────────────────────────────────────────
  if (quote.notes) {
    if (y > 255) { doc.addPage(); y = 20 }
    doc.setTextColor(...darkGray)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.text('NOTES', M, y)
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

  // ── PAY ONLINE (MoonPay) ─────────────────────────────────
  if (paymentSettings?.enabled && paymentSettings.moonpayApiKey && paymentSettings.walletAddress) {
    y += 12
    if (y > 255) { doc.addPage(); y = 20 }

    doc.setFillColor(245, 245, 247)
    doc.roundedRect(M, y, W - M * 2, 22, 3, 3, 'F')
    doc.setDrawColor(...softGray)
    doc.setLineWidth(0.4)
    doc.roundedRect(M, y, W - M * 2, 22, 3, 3, 'S')

    doc.setTextColor(...charcoal)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('PAY THIS INVOICE ONLINE', M + 6, y + 7)

    doc.setTextColor(...midGray)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    doc.text('This invoice supports secure online payment via MoonPay.', M + 6, y + 12.5)
    doc.text('Open this quote in SalesCloserPro and click "Pay Invoice" to pay by card, bank, or Apple Pay.', M + 6, y + 17)

    y += 24
  }

  // ── FOOTER ─────────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    const fY = H - 10
    doc.setDrawColor(...ruleGray)
    doc.setLineWidth(0.2)
    doc.line(M, fY - 4, W - M, fY - 4)
    doc.setTextColor(...softGray)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text('Generated by SalesCloserPro  ·  Powered by llmadvisor.ai  ·  Free & Open Source', W / 2, fY, { align: 'center' })
    doc.text(`Page ${p} of ${totalPages}`, W - M, fY, { align: 'right' })
  }

  // ── SAVE ───────────────────────────────────────────────────
  doc.save(`${(quote.quoteNumber || 'quote').replace(/\s/g, '_')}.pdf`)
}


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
  const M = 16  // margin

  // ── Neutral palette ────────────────────────────────────────
  const charcoal = [38, 38, 38]
  const darkGray = [55, 65, 81]
  const midGray  = [107, 114, 128]
  const softGray = [156, 163, 175]
  const ruleGray = [209, 213, 219]
  const bgLight  = [248, 249, 250]
  const white    = [255, 255, 255]

  const dollarFmt = (n) =>
    '$' + (n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const poDate    = po.issuedAt  ? format(new Date(po.issuedAt),  'MMMM d, yyyy') : format(new Date(), 'MMMM d, yyyy')
  const poCreated = po.createdAt ? format(new Date(po.createdAt), 'MMMM d, yyyy') : '—'

  // ── HEADER — thin top rule ─────────────────────────────────
  doc.setFillColor(...charcoal)
  doc.rect(0, 0, W, 3, 'F')

  // Company logo
  let textStartX = M
  if (company.logo) {
    try {
      doc.addImage(company.logo, M, 9, 20, 20)
      textStartX = M + 24
    } catch (_) { /* skip */ }
  }

  // Company name
  doc.setTextColor(...charcoal)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text(company.name || 'SalesCloserPro', textStartX, 22)

  // Company details
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...midGray)
  let infoY = 27
  if (company.address) { doc.text(company.address, textStartX, infoY); infoY += 4 }
  if (company.phone)   { doc.text(company.phone,   textStartX, infoY); infoY += 4 }
  if (company.email)   { doc.text(company.email,    textStartX, infoY); infoY += 4 }
  if (company.website) { doc.text(company.website,  textStartX, infoY) }

  // ── PO Number block (right side) ──────────────────────────
  const rX = W - M
  doc.setFillColor(...bgLight)
  doc.roundedRect(W - 72, 8, 58, 32, 3, 3, 'F')

  doc.setTextColor(...charcoal)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('PURCHASE ORDER', rX, 17, { align: 'right' })

  doc.setFontSize(16)
  doc.text(po.poNumber || 'PO-0000', rX, 26, { align: 'right' })

  doc.setTextColor(...midGray)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(poDate, rX, 33, { align: 'right' })

  // Status badge
  const statusText = (po.status || 'DRAFT').toUpperCase()
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  const sw = doc.getTextWidth(statusText) + 10
  if (po.status === 'issued')        { doc.setFillColor(226, 232, 240); doc.setTextColor(51, 65, 85) }
  else if (po.status === 'ordered')  { doc.setFillColor(219, 234, 254); doc.setTextColor(37, 99, 235) }
  else if (po.status === 'received') { doc.setFillColor(254, 243, 199); doc.setTextColor(146, 115, 26) }
  else if (po.status === 'paid')     { doc.setFillColor(220, 252, 231); doc.setTextColor(22, 163, 74) }
  else                               { doc.setFillColor(229, 231, 235); doc.setTextColor(...midGray) }
  doc.roundedRect(rX - sw, 37, sw, 7, 2, 2, 'F')
  doc.text(statusText, rX - sw / 2, 42, { align: 'center' })

  // ── DIVIDER ────────────────────────────────────────────────
  doc.setDrawColor(...ruleGray)
  doc.setLineWidth(0.3)
  doc.line(M, 50, W - M, 50)

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
        dollarFmt(po.unitCost || 0),
        dollarFmt(lineTotal),
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
      1: { cellWidth: 72 },
      2: { cellWidth: 24, fontStyle: 'bold', fontSize: 8 },
      3: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
      4: { cellWidth: 28, halign: 'right' },
      5: { cellWidth: 28, halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: M, right: M },
  })

  let y = doc.lastAutoTable.finalY + 12

  // ── TOTALS ─────────────────────────────────────────────────
  const totalsX = 130
  const valX = W - M

  // Subtotal
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...midGray)
  doc.text('Subtotal', totalsX, y)
  doc.setTextColor(...darkGray)
  doc.setFont('helvetica', 'bold')
  doc.text(dollarFmt(lineTotal), valX, y, { align: 'right' })

  // Dashed divider
  y += 6
  doc.setDrawColor(...softGray)
  doc.setLineDashPattern([2, 2])
  doc.line(totalsX, y, valX, y)
  doc.setLineDashPattern([])

  // Total band
  y += 4
  doc.setFillColor(...charcoal)
  doc.roundedRect(totalsX - 4, y, valX - totalsX + 8, 14, 3, 3, 'F')
  doc.setTextColor(...white)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('PO TOTAL', totalsX + 2, y + 9)
  doc.setFontSize(14)
  doc.text(dollarFmt(lineTotal), valX + 2, y + 9.5, { align: 'right' })

  y += 22

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

  // ── TERMS & CONDITIONS ─────────────────────────────────────
  y += 8
  if (y > 245) { doc.addPage(); y = 20 }

  doc.setFillColor(...bgLight)
  doc.roundedRect(M, y, W - M * 2, 32, 2, 2, 'F')
  doc.setTextColor(...darkGray)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.text('TERMS & CONDITIONS', M + 5, y + 6)

  doc.setTextColor(...midGray)
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  const terms = [
    '1. Please reference the PO number on all correspondence, invoices, and shipping documents.',
    '2. Goods must be delivered to the Ship To address listed above unless otherwise specified.',
    '3. Vendor shall notify buyer immediately of any delays or changes to the order.',
    '4. Payment terms: 50% deposit due upon PO issuance; remaining balance due net 30 days from receipt of goods and valid invoice.',
    '5. This Purchase Order is subject to the terms agreed upon between buyer and vendor.',
  ]
  terms.forEach((t, i) => {
    doc.text(t, M + 5, y + 11.5 + i * 4.2)
  })

  // ── SIGNATURE LINES ────────────────────────────────────────
  y += 42
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

  // ── FOOTER (all pages) ────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    const fY = H - 10
    doc.setDrawColor(...ruleGray)
    doc.setLineWidth(0.2)
    doc.line(M, fY - 4, W - M, fY - 4)
    doc.setTextColor(...softGray)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text('Generated by SalesCloserPro  ·  Powered by llmadvisor.ai  ·  Free & Open Source', W / 2, fY, { align: 'center' })
    doc.text(`Page ${p} of ${totalPages}`, W - M, fY, { align: 'right' })
  }

  // ── SAVE ───────────────────────────────────────────────────
  doc.save(`${(po.poNumber || 'PO').replace(/\s/g, '_')}.pdf`)
}
