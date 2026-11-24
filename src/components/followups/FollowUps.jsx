/**
 * SalesCloserPro - follow-up UI (quote panel + dashboard "due" card)
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 */

import { Link } from 'react-router-dom'
import { BellRing, CalendarPlus, Check, Mail, CircleCheck } from 'lucide-react'
import clsx from 'clsx'
import useStore from '../../store'
import { buildProposalUrl } from '../../utils/proposalLink'
import { followUpEmail, mailtoHref } from '../../utils/emails'
import { followUpSchedule, followUpCalendar, dueFollowUps, relativeDue } from '../../utils/followUps'
import { downloadFile } from '../../utils/download'
import { shortDate, longDate } from '../../utils/dates'

function useFollowUpActions() {
  const company = useStore((s) => s.company)
  const setFollowUpDone = useStore((s) => s.setFollowUpDone)

  // Opens the drafted email (with a fresh proposal link) and ticks the step off.
  const email = async (quote, step) => {
    const url = await buildProposalUrl(quote, company)
    const { href, linkInBody } = mailtoHref(followUpEmail(step.kind, { quote, company, url }))
    if (!linkInBody) await navigator.clipboard?.writeText(url).catch(() => {})
    setFollowUpDone(quote.id, step.kind, true)
    window.location.href = href
  }
  const exportCalendar = async (quote) => {
    const url = await buildProposalUrl(quote, company)
    downloadFile(followUpCalendar(quote, url), `${quote.quoteNumber}-follow-ups.ics`, 'text/calendar')
  }
  return { email, exportCalendar, toggleDone: (quote, step) => setFollowUpDone(quote.id, step.kind, !step.done) }
}

function FollowUpRow({ quote, step, showQuote, actions }) {
  const tone = step.done ? 'text-gray-400 dark:text-gray-500' : step.inDays < 0 ? 'text-red-600 dark:text-red-400' : step.due ? 'text-copper-700 dark:text-copper-300' : 'text-gray-500 dark:text-gray-400'
  return (
    <li className="flex items-center gap-3 py-3">
      <button
        onClick={() => actions.toggleDone(quote, step)}
        aria-pressed={step.done}
        title={step.done ? 'Mark as not done' : 'Mark as done'}
        className={clsx(
          'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors',
          step.done ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
        )}
      >
        {step.done && <Check className="w-3.5 h-3.5" />}
      </button>
      <div className="min-w-0 flex-1">
        <p className={clsx('text-sm font-semibold', step.done ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100')}>
          {step.label}
          {showQuote && (
            <> · <Link to={`/quotes/${quote.id}`} className="hover:underline">{quote.clientName || quote.quoteNumber}</Link></>
          )}
        </p>
        <p className={clsx('text-xs', tone)}>
          {shortDate(step.date)} · {step.done ? 'done' : relativeDue(step.inDays)}
          {showQuote && <span className="text-gray-400 dark:text-gray-500"> · {quote.quoteNumber}</span>}
        </p>
      </div>
      {!step.done && (
        <button
          onClick={() => actions.email(quote, step)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/40 hover:bg-brand-100 dark:hover:bg-brand-900/70 transition-colors"
        >
          <Mail className="w-3.5 h-3.5" /> Email
        </button>
      )}
    </li>
  )
}

/** Panel on a quote: its follow-up schedule + calendar export. */
export function QuoteFollowUps({ quote }) {
  const actions = useFollowUpActions()
  const steps = followUpSchedule(quote)
  if (!steps.length) return null
  return (
    <div className="card">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
            <BellRing className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight">Follow-ups</h2>
            <p className="text-xs text-gray-400">
              Sent {shortDate(quote.sentAt)}{quote.validUntil && ` · valid until ${longDate(quote.validUntil)}`}
            </p>
          </div>
        </div>
        <button onClick={() => actions.exportCalendar(quote)} className="btn-secondary !py-2 !px-4 text-sm flex items-center gap-2">
          <CalendarPlus className="w-4 h-4" /> Add to calendar
        </button>
      </div>
      <ul className="divide-y divide-gray-100 dark:divide-gray-700">
        {steps.map((step) => <FollowUpRow key={step.kind} quote={quote} step={step} actions={actions} />)}
      </ul>
    </div>
  )
}

/** Dashboard card: everything due today or overdue, plus what's coming this week. */
export function DueFollowUpsCard({ quotes }) {
  const actions = useFollowUpActions()
  const due = dueFollowUps(quotes, 0)
  const upcoming = dueFollowUps(quotes, 7).length - due.length
  const anySent = quotes.some((q) => q.status === 'sent')
  if (!anySent) return null
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-1">
        <BellRing className="w-5 h-5 text-amber-500" />
        <h2 className="font-bold text-gray-900 dark:text-gray-100">Follow-ups due</h2>
        {due.length > 0 && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-copper-100 text-copper-800 dark:bg-copper-500/20 dark:text-copper-200">{due.length}</span>}
      </div>
      {due.length ? (
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {due.map(({ quote, step }) => <FollowUpRow key={`${quote.id}-${step.kind}`} quote={quote} step={step} showQuote actions={actions} />)}
        </ul>
      ) : (
        <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 py-3">
          <CircleCheck className="w-4 h-4 text-green-600" /> You're all caught up.
        </p>
      )}
      {upcoming > 0 && <p className="text-xs text-gray-400 dark:text-gray-500 pt-2">{upcoming} more coming up in the next 7 days.</p>}
    </div>
  )
}
