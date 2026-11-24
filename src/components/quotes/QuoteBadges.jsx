/**
 * SalesCloserPro - small quote badges shared by the quote list and dashboard
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 */

import { Layers, CheckCircle2 } from 'lucide-react'
import { hasTiers } from '../../utils/quoteMath'

const STATUS_CLASSES = {
  draft: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
  sent:  'bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300',
  won:   'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300',
  lost:  'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400',
}

export function StatusBadge({ status = 'draft' }) {
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_CLASSES[status] || STATUS_CLASSES.draft}`}>
      {status.toUpperCase()}
    </span>
  )
}

/** "3 options" for Good/Better/Best quotes, "Accepted online" once the client accepted. */
export function QuoteMetaBadges({ quote }) {
  return (
    <>
      {hasTiers(quote) && (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-copper-700 dark:text-copper-300">
          <Layers className="w-3 h-3" /> {quote.options.length} options
        </span>
      )}
      {quote.acceptance && (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 dark:text-green-400">
          <CheckCircle2 className="w-3 h-3" /> Accepted online
        </span>
      )}
    </>
  )
}
