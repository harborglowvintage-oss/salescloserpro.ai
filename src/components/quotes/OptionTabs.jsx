/**
 * SalesCloserPro - Good / Better / Best option tabs for the quote builder
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 */

import { Layers, Plus, Star, X } from 'lucide-react'
import clsx from 'clsx'
import { formatMoney, optionLabel, MAX_OPTIONS } from '../../utils/quoteMath'

/**
 * @param {Array}  options        priced options (id, name, total, lines)
 * @param {string} activeId       option whose lines are being edited
 * @param {string} recommendedId  option highlighted for the client
 */
export default function OptionTabs({ options, activeId, recommendedId, onSelect, onAdd, onRemove, onRename, onRecommend }) {
  if (options.length < 2) {
    return (
      <button
        type="button"
        onClick={onAdd}
        className="w-full mb-6 flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-copper-300/70 dark:border-copper-500/40 text-left hover:bg-copper-50 dark:hover:bg-copper-500/10 transition-colors group"
      >
        <span className="w-10 h-10 rounded-xl bg-copper-100 dark:bg-copper-500/15 text-copper-600 dark:text-copper-300 flex items-center justify-center flex-shrink-0">
          <Layers className="w-5 h-5" />
        </span>
        <span className="min-w-0">
          <span className="block font-bold text-sm text-gray-800 dark:text-gray-100">Offer Good / Better / Best</span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">Give the client up to three packages to choose from — tiers lift average deal size.</span>
        </span>
        <Plus className="w-5 h-5 ml-auto text-copper-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
      </button>
    )
  }

  return (
    // 2 options + "Add", or 3 options → always three cells
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3" role="tablist" aria-label="Quote options">
      {options.map((o, i) => {
        const isActive = o.id === activeId
        const isRec = o.id === recommendedId
        return (
          <div
            key={o.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={0}
            onClick={() => onSelect(o.id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget && onSelect(o.id)}
            className={clsx(
              'relative rounded-2xl border-2 p-3 sm:p-4 cursor-pointer transition-all select-none',
              isActive
                ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/40 shadow-md'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-brand-300'
            )}
          >
            <div className="flex items-center gap-1.5">
              <input
                value={o.name}
                onChange={(e) => onRename(o.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder={optionLabel(o, i)}
                aria-label={`Name of option ${i + 1}`}
                maxLength={24}
                className="min-w-0 flex-1 bg-transparent font-bold text-sm text-gray-900 dark:text-gray-100 outline-none border-b border-transparent focus:border-brand-400"
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onRecommend(o.id) }}
                title={isRec ? 'Recommended to the client' : 'Mark as recommended'}
                aria-pressed={isRec}
                className={clsx('p-1 rounded-md transition-colors', isRec ? 'text-copper-500' : 'text-gray-300 hover:text-copper-400 dark:text-gray-600')}
              >
                <Star className="w-4 h-4" fill={isRec ? 'currentColor' : 'none'} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onRemove(o.id) }}
                title="Remove this option"
                className="p-1 rounded-md text-gray-300 hover:text-red-500 dark:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-1 text-lg sm:text-xl font-extrabold text-gray-900 dark:text-gray-100 tabular-nums">{formatMoney(o.total)}</div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400">
              {o.lines.length} line{o.lines.length !== 1 ? 's' : ''}{isRec && <span className="ml-1.5 font-bold text-copper-600 dark:text-copper-300">· Recommended</span>}
            </div>
          </div>
        )
      })}
      {options.length < MAX_OPTIONS && (
        <button
          type="button"
          onClick={onAdd}
          className="rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex flex-col items-center justify-center gap-1 p-3 text-xs font-bold transition-colors"
        >
          <Plus className="w-5 h-5" /> Add option
        </button>
      )}
    </div>
  )
}
