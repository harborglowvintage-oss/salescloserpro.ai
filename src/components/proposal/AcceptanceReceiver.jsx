/**
 * salescloserpro.ai - record a client's online acceptance (/accept#…)
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 *
 * Opened by the seller from the client's confirmation email. The record is matched to
 * the quote in this browser and its version fingerprint is checked against the quote
 * as it stands now, so an acceptance of an older version is flagged, not silently logged.
 */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, AlertTriangle, ShieldCheck, ShieldAlert, Inbox } from 'lucide-react'
import useStore from '../../store'
import { proposalSnapshot, fingerprint } from '../../utils/proposalLink'
import useFragmentPacket from './useFragmentPacket'
import { priceQuote, formatMoney, optionLabel } from '../../utils/quoteMath'

const isRecord = (r) => Boolean(r?.qid && r?.name && r?.fp && r?.at)

export default function AcceptanceReceiver() {
  const navigate = useNavigate()
  const quotes = useStore((s) => s.quotes)
  const company = useStore((s) => s.company)
  const updateQuote = useStore((s) => s.updateQuote)
  const syncQuoteToPipeline = useStore((s) => s.syncQuoteToPipeline)

  const record = useFragmentPacket(isRecord) // undefined = decoding, null = broken
  const [currentFp, setCurrentFp] = useState(null)
  const quote = record ? quotes.find((q) => q.id === record.qid) : null

  useEffect(() => {
    if (quote) fingerprint(proposalSnapshot(quote, company)).then(setCurrentFp)
  }, [quote, company])

  if (record === undefined) return null
  if (record === null) {
    return (
      <Shell icon={AlertTriangle} tone="amber" title="This acceptance link is incomplete">
        It may have been cut off in the email. Ask the client to use “Copy confirmation link” and send it again.
      </Shell>
    )
  }
  if (!quote) {
    return (
      <Shell icon={Inbox} tone="amber" title={`Quote ${record.no} isn't in this browser`}>
        salescloserpro.ai stores your data on this device only. Open this link in the browser where you created {record.no}
        {' '}(or restore your backup here first), and it will be recorded.
      </Shell>
    )
  }

  const { options, tiered } = priceQuote(quote)
  const idx = Math.max(0, options.findIndex((o) => o.id === record.opt))
  const option = options[idx]
  const matches = currentFp === record.fp
  const already = quote.acceptance?.at === record.at

  const recordIt = () => {
    updateQuote(quote.id, {
      status: 'won',
      acceptance: { name: record.name, at: record.at, optionId: tiered ? option.id : null, fingerprint: record.fp, versionMatched: matches },
    })
    syncQuoteToPipeline(quote.id)
    navigate(`/quotes/${quote.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card space-y-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">{record.name} accepted {quote.quoteNumber}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {quote.clientName} · {new Date(record.at).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 dark:bg-gray-900/50 p-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{tiered ? `Option: ${optionLabel(option, idx)}` : 'Proposal total'}</span>
          <span className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tabular-nums">{formatMoney(option.total)}</span>
        </div>

        {currentFp && (matches ? (
          <p className="flex items-start gap-2 text-sm text-green-700 dark:text-green-400">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            Version {record.fp} matches the quote as it is now — the client accepted exactly these items and prices.
          </p>
        ) : (
          <p className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            The client accepted version {record.fp}, but this quote has been edited since (now {currentFp}).
            Check the changes with the client before you start work.
          </p>
        ))}

        {already ? (
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">This acceptance is already recorded.</p>
        ) : (
          <button onClick={recordIt} className="btn-primary w-full sm:w-auto">
            Record acceptance &amp; mark Won
          </button>
        )}
      </div>
    </div>
  )
}

function Shell({ icon: Icon, tone, title, children }) {
  return (
    <div className="max-w-2xl mx-auto card flex items-start gap-3">
      <Icon className={`w-8 h-8 flex-shrink-0 ${tone === 'amber' ? 'text-amber-500' : 'text-gray-400'}`} />
      <div>
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{children}</p>
      </div>
    </div>
  )
}
