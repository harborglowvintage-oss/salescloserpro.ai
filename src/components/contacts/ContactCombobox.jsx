/**
 * salescloserpro.ai - name field that doubles as a contact picker
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 *
 * Used wherever a quote or deal names who it is for. Typing filters saved contacts;
 * picking one links it. Free text is always allowed (a contact is created on save).
 */

import { useId, useState } from 'react'
import { UserCheck } from 'lucide-react'
import clsx from 'clsx'
import useStore from '../../store'
import { searchContacts } from '../../utils/contacts'

const MAX_SUGGESTIONS = 6

export default function ContactCombobox({ value, onChange, onPick, linkedId, placeholder, className = 'input-field', autoFocus }) {
  const contacts = useStore((s) => s.clients)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const listId = useId()
  const linked = contacts.find((c) => c.id === linkedId)
  const matches = searchContacts(contacts, value).filter((c) => c.id !== linkedId).slice(0, MAX_SUGGESTIONS)
  const show = open && matches.length > 0

  const pick = (c) => { onPick(c); setOpen(false) }
  const onKeyDown = (e) => {
    if (!show) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => (i + 1) % matches.length) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => (i - 1 + matches.length) % matches.length) }
    else if (e.key === 'Enter') { e.preventDefault(); pick(matches[active]) }
    else if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div className="relative">
      <input
        className={className}
        placeholder={placeholder}
        value={value}
        autoFocus={autoFocus}
        role="combobox"
        aria-expanded={show}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        onChange={(e) => { onChange(e.target.value); setOpen(true); setActive(0) }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)} // let a click on a suggestion land first
        onKeyDown={onKeyDown}
      />
      {linked && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 dark:text-green-400 pointer-events-none" title={`Linked to contact ${linked.name}`}>
          <UserCheck className="w-3.5 h-3.5" /> Contact
        </span>
      )}
      {show && (
        <ul id={listId} role="listbox" className="absolute z-30 left-0 right-0 mt-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
          {matches.map((c, i) => (
            <li
              key={c.id}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => { e.preventDefault(); pick(c) }}
              onMouseEnter={() => setActive(i)}
              className={clsx('px-4 py-2.5 cursor-pointer', i === active ? 'bg-brand-50 dark:bg-brand-900/40' : '')}
            >
              <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">{c.name}</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">{[c.company, c.email].filter(Boolean).join(' · ') || 'Saved contact'}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
