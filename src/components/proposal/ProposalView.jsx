/**
 * SalesCloserPro - client-facing proposal page (/p#…)
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 *
 * Rendered entirely from the link's #fragment — nothing is fetched or stored. The client
 * picks an option, types their name and accepts; the acceptance goes back to the seller
 * as an email draft from the client's own mail app.
 */

import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Download, Mail, Copy, AlertTriangle, Star, Clock } from 'lucide-react'
import clsx from 'clsx'
import { snapshotToQuote, snapshotToCompany, buildAcceptanceUrl } from '../../utils/proposalLink'
import useFragmentPacket from './useFragmentPacket'
import { priceQuote, formatMoney, optionLabel, proposalTerms } from '../../utils/quoteMath'
import { acceptanceEmail, mailtoHref } from '../../utils/emails'
import { longDate, daysFromToday } from '../../utils/dates'
import { stateTaxData } from '../../data/taxDatabase'
import { generatePDF } from '../../utils/pdfExport'
import { StudioCredit } from '../brand/Brand'

const isSnapshot = (p) => p?.v === 1 && Array.isArray(p.q?.o) && p.q.o.length > 0

function useProposal() {
  const snapshot = useFragmentPacket(isSnapshot)
  return useMemo(() => {
    if (snapshot === undefined) return { status: 'loading' }
    if (snapshot === null) return { status: 'error' }
    return { status: 'ready', snapshot, quote: snapshotToQuote(snapshot), company: snapshotToCompany(snapshot) }
  }, [snapshot])
}

export default function ProposalView() {
  const proposal = useProposal()

  useEffect(() => {
    if (proposal.status === 'ready') document.title = `Proposal ${proposal.quote.quoteNumber} · ${proposal.company.name || 'SalesCloserPro'}`
  }, [proposal])

  return (
    <div className="min-h-screen bg-ink-50 text-ink-950 antialiased flex flex-col">
      {proposal.status === 'loading' && <p className="m-auto text-ink-600">Opening proposal…</p>}
      {proposal.status === 'error' && <BrokenLink />}
      {proposal.status === 'ready' && <Proposal key={window.location.hash} {...proposal} />}
      <footer className="mt-auto border-t border-ink-100 py-6 px-4 text-center text-xs text-ink-600 space-y-2">
        <p>
          Prepared with <a href="/" className="font-semibold text-brand-700 hover:underline">SalesCloserPro</a> — free quoting &amp; CRM.
          This proposal lives only in its link; nothing was uploaded.
        </p>
        <StudioCredit className="text-ink-600 hover:text-ink-950" markClassName="w-6 h-6" />
      </footer>
    </div>
  )
}

function BrokenLink() {
  return (
    <div className="m-auto max-w-md p-8 text-center">
      <AlertTriangle className="w-10 h-10 text-copper-500 mx-auto mb-4" />
      <h1 className="font-serif text-2xl font-semibold mb-2">This proposal link is incomplete</h1>
      <p className="text-ink-600">The link may have been cut off when it was copied or emailed. Ask the sender to share it again.</p>
    </div>
  )
}

function Proposal({ snapshot, quote, company }) {
  const { options, tiered } = useMemo(() => priceQuote(quote), [quote])
  const [selectedId, setSelectedId] = useState(quote.recommendedOptionId || options[0].id)
  const selectedIndex = Math.max(0, options.findIndex((o) => o.id === selectedId))
  const selected = options[selectedIndex]
  const daysLeft = quote.validUntil ? daysFromToday(quote.validUntil) : null
  const expired = daysLeft !== null && daysLeft < 0

  const downloadPdf = () => {
    generatePDF({ quote: { ...quote, recommendedOptionId: selectedId }, company, proposalUrl: window.location.href })
  }

  return (
    <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* ── letterhead ── */}
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <p className="font-serif text-3xl font-semibold leading-tight">{company.name || 'Proposal'}</p>
          <p className="text-sm text-ink-600 mt-1">{[company.phone, company.email, company.website].filter(Boolean).join(' · ')}</p>
          {company.address && <p className="text-sm text-ink-600">{company.address}</p>}
        </div>
        <div className="sm:text-right">
          <p className="text-[11px] font-bold uppercase tracking-widest text-ink-600">Proposal</p>
          <p className="text-xl font-bold">{quote.quoteNumber}</p>
          <p className="text-sm text-ink-600">{longDate(quote.createdAt)}</p>
          <button onClick={downloadPdf} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </header>

      <section className="rounded-2xl bg-white border border-ink-100 shadow-sm p-5 sm:p-6 mb-6 flex flex-wrap gap-x-10 gap-y-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-ink-600">Prepared for</p>
          <p className="text-lg font-semibold">{quote.clientName || '—'}</p>
          {quote.state && <p className="text-sm text-ink-600">{stateTaxData[quote.state]?.name || quote.state}</p>}
        </div>
        {quote.validUntil && (
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-ink-600">Valid until</p>
            <p className={clsx('text-lg font-semibold', expired && 'text-red-700')}>{longDate(quote.validUntil)}</p>
            {!expired && daysLeft <= 7 && (
              <p className="text-sm text-copper-700 inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {daysLeft === 0 ? 'Last day' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`}</p>
            )}
          </div>
        )}
      </section>

      {/* ── option picker ── */}
      {tiered && (
        <section className="mb-6" aria-labelledby="choose">
          <h2 id="choose" className="font-serif text-xl font-semibold mb-3">Choose your option</h2>
          <div className="grid sm:grid-cols-3 gap-3" role="radiogroup">
            {options.map((o, i) => {
              const on = o.id === selectedId
              const rec = o.id === quote.recommendedOptionId
              return (
                <button
                  key={o.id}
                  role="radio"
                  aria-checked={on}
                  onClick={() => setSelectedId(o.id)}
                  className={clsx(
                    'relative text-left rounded-2xl border-2 p-4 transition-all bg-white',
                    on ? 'border-brand-600 shadow-md ring-4 ring-brand-600/10' : 'border-ink-100 hover:border-brand-300'
                  )}
                >
                  {rec && (
                    <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full bg-copper-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      <Star className="w-3 h-3" fill="currentColor" /> Recommended
                    </span>
                  )}
                  <span className="block font-bold">{optionLabel(o, i)}</span>
                  <span className="block text-2xl font-extrabold tabular-nums mt-1">{formatMoney(o.total)}</span>
                  <span className="block text-xs text-ink-600 mt-0.5">{o.lines.length} item{o.lines.length !== 1 ? 's' : ''}</span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* ── line items ── */}
      <section className="rounded-2xl bg-white border border-ink-100 shadow-sm overflow-hidden mb-6">
        {tiered && <p className="px-5 sm:px-6 pt-5 text-sm font-semibold text-ink-600">What's included in {optionLabel(selected, selectedIndex)}</p>}
        <ul className="divide-y divide-ink-100">
          {selected.lines.map((l) => (
            <li key={l.id} className="px-5 sm:px-6 py-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium">{l.description || '—'}</p>
                <p className="text-xs text-ink-600 mt-0.5">
                  <span className="capitalize">{l.type}</span> · {l.qty} {l.unit} × {formatMoney(l.price)}
                  {l.taxable && ` · ${(l.taxRate * 100).toFixed(2)}% tax`}
                </p>
              </div>
              <p className="font-semibold tabular-nums whitespace-nowrap">{formatMoney(l.total)}</p>
            </li>
          ))}
        </ul>
        <dl className="bg-ink-50/60 px-5 sm:px-6 py-4 space-y-1.5 text-sm">
          <div className="flex justify-between"><dt className="text-ink-600">Subtotal</dt><dd className="tabular-nums">{formatMoney(selected.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-600">Tax ({quote.state})</dt><dd className="tabular-nums">{formatMoney(selected.tax)}</dd></div>
          <div className="flex justify-between pt-2 border-t border-ink-100 text-lg font-extrabold"><dt>Total</dt><dd className="tabular-nums">{formatMoney(selected.total)}</dd></div>
        </dl>
      </section>

      {quote.notes && (
        <section className="mb-6">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-ink-600 mb-1.5">Notes</h2>
          <p className="text-sm whitespace-pre-line">{quote.notes}</p>
        </section>
      )}

      <section className="mb-8">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-ink-600 mb-1.5">Terms</h2>
        <ol className="text-sm text-ink-700 list-decimal list-inside space-y-0.5">
          {proposalTerms(quote).map((t) => <li key={t}>{t}</li>)}
        </ol>
      </section>

      {expired
        ? <Expired company={company} quote={quote} />
        : <AcceptPanel snapshot={snapshot} quote={quote} company={company} option={selected} optionName={tiered ? optionLabel(selected, selectedIndex) : null} />}
    </main>
  )
}

function Expired({ company, quote }) {
  return (
    <section className="rounded-2xl border-2 border-red-200 bg-red-50 p-6">
      <h2 className="font-serif text-xl font-semibold text-red-900">This proposal expired on {longDate(quote.validUntil)}</h2>
      <p className="text-sm text-red-900/80 mt-1">
        Pricing may have changed. {company.email ? <>Contact <a className="font-semibold underline" href={`mailto:${company.email}?subject=${encodeURIComponent(`Updated pricing for ${quote.quoteNumber}`)}`}>{company.name || company.email}</a> for an updated proposal.</> : 'Contact the sender for an updated proposal.'}
      </p>
    </section>
  )
}

function AcceptPanel({ snapshot, quote, company, option, optionName }) {
  const [name, setName] = useState('')
  const [agree, setAgree] = useState(false)
  const [done, setDone] = useState(null) // { url, record, mail }
  const [copied, setCopied] = useState(false)
  const canAccept = name.trim().length >= 2 && agree

  const accept = async (e) => {
    e.preventDefault()
    if (!canAccept) return
    const { url, record } = await buildAcceptanceUrl(snapshot, { name, optionId: option.id })
    const mail = mailtoHref(acceptanceEmail({ company, quote, record, url, optionName, total: option.total }))
    setDone({ url, record, mail })
    if (company.email) window.location.href = mail.href
  }
  const copy = async () => {
    try { await navigator.clipboard.writeText(done.url); setCopied(true) } catch { /* clipboard blocked: link is shown below */ }
  }

  if (done) {
    return (
      <section className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-6" aria-live="polite">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0" />
          <div className="min-w-0">
            <h2 className="font-serif text-xl font-semibold text-emerald-950">Accepted — thank you, {done.record.name.split(' ')[0]}.</h2>
            <p className="text-sm text-emerald-950/80 mt-1">
              {optionName ? `${optionName} · ` : ''}{formatMoney(option.total)} · version {done.record.fp}
            </p>
            <p className="text-sm text-emerald-950/80 mt-3">
              <strong>One last step:</strong> send the confirmation so {company.name || 'the sender'} can schedule your work.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {company.email && (
                <a href={done.mail.href} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold">
                  <Mail className="w-4 h-4" /> Send confirmation email
                </a>
              )}
              <button onClick={copy} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-emerald-700/30 bg-white text-emerald-900 text-sm font-semibold">
                <Copy className="w-4 h-4" /> {copied ? 'Copied' : 'Copy confirmation link'}
              </button>
            </div>
            {!company.email && <p className="text-xs text-emerald-950/70 mt-3 break-all">Send this link to the sender: {done.url}</p>}
          </div>
        </div>
      </section>
    )
  }

  return (
    <form onSubmit={accept} className="rounded-2xl bg-ink-950 text-ink-100 p-6 sm:p-7 shadow-lg">
      <h2 className="font-serif text-2xl font-semibold text-white">Ready to go ahead?</h2>
      <p className="text-sm text-ink-400 mt-1">
        You're accepting {optionName ? <strong className="text-ink-100">{optionName}</strong> : 'this proposal'} at{' '}
        <strong className="text-ink-100">{formatMoney(option.total)}</strong>.
      </p>
      <label className="block mt-5 text-[11px] font-bold uppercase tracking-widest text-ink-400" htmlFor="acc-name">Your full name</label>
      <input
        id="acc-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
        className="mt-1.5 w-full rounded-lg bg-white/[0.06] border border-white/15 focus:border-brand-400 outline-none px-4 py-3 text-white"
        placeholder="Jane Smith"
      />
      <label className="mt-4 flex items-start gap-3 text-sm text-ink-300 cursor-pointer">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 w-4 h-4 accent-copper-500" />
        <span>I accept this proposal and its terms, and authorize {company.name || 'the sender'} to proceed.</span>
      </label>
      <button
        type="submit"
        disabled={!canAccept}
        className="mt-5 w-full sm:w-auto px-7 py-3.5 rounded-lg bg-copper-600 hover:bg-copper-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold"
      >
        Accept proposal
      </button>
      <p className="text-xs text-ink-500 mt-3">
        Accepting opens a confirmation email in your own mail app, addressed to {company.email || 'the sender'}. Nothing is sent until you press send.
      </p>
    </form>
  )
}
