/**
 * SalesCloserPro - "Send proposal" dialog: online link, email draft, client preview
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 */

import { useEffect, useRef, useState } from 'react'
import { Copy, Check, Mail, ExternalLink, X, Lock } from 'lucide-react'
import { proposalEmail, mailtoHref } from '../../utils/emails'

/**
 * @param {Object}   quote    the saved quote
 * @param {Object}   company
 * @param {string}   url      proposal link (/p#…)
 * @param {Function} onSent   called when the link leaves the app (copy or email) → marks the quote Sent
 * @param {Function} onClose
 */
export default function SharePanel({ quote, company, url, onSent, onClose }) {
  const [copied, setCopied] = useState(false)
  const [pasteNeeded, setPasteNeeded] = useState(false)
  const dialogRef = useRef(null)
  const mail = mailtoHref(proposalEmail({ quote, company, url }))

  useEffect(() => {
    dialogRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true) } catch { /* the link stays selectable below */ }
    onSent()
  }
  const email = () => {
    copy()
    setPasteNeeded(!mail.linkInBody)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4" onClick={onClose}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 outline-none"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="share-title" className="text-lg font-extrabold text-gray-900 dark:text-gray-100">Send {quote.quoteNumber}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your client can review{quote.options?.length > 1 ? ', pick an option' : ''} and accept from any device.</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 flex gap-2">
          <input
            readOnly
            value={url}
            onFocus={(e) => e.target.select()}
            aria-label="Proposal link"
            className="input-field text-xs font-mono py-2.5 truncate"
          />
          <button onClick={copy} className="btn-secondary !px-4 !py-2.5 flex items-center gap-1.5 text-sm whitespace-nowrap">
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="mt-4 grid sm:grid-cols-2 gap-2">
          <a href={mail.href} onClick={email} className="btn-primary flex items-center justify-center gap-2 text-sm !py-3">
            <Mail className="w-4 h-4" /> Email {quote.clientName ? quote.clientName.split(' ')[0] : 'client'}
          </a>
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center justify-center gap-2 text-sm !py-3">
            <ExternalLink className="w-4 h-4" /> Preview as client
          </a>
        </div>

        {pasteNeeded && (
          <p className="mt-3 text-sm font-semibold text-amber-700 dark:text-amber-400">
            This proposal is long, so the link was copied instead of placed in the email — paste it where the draft says so.
          </p>
        )}

        <p className="mt-5 flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Lock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          The proposal travels inside the link and is never uploaded. Anyone with the link can view it — like an emailed PDF.
        </p>
      </div>
    </div>
  )
}
