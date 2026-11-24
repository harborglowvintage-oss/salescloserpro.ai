/**
 * SalesCloserPro - shared brand primitives (LLMadvisor.ai studio identity)
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 *
 * One home for the product logo, the LLMadvisor atom mark, the studio credit and the
 * copyright line, so every page, the app shell and the proposal page stay in sync.
 * Images are generated from /brand by `npm run generate-images`.
 */

import clsx from 'clsx'

export const COPYRIGHT_LINE = '© 2026 SalesCloserPro.ai · LLMadvisor ai LLC · Apache-2.0'
export const STUDIO_URL = 'https://llmadvisor.ai'

/** The handshake product logo (small sizes — the 192px icon, not the hero art). */
export function ProductLogo({ className = 'h-8 w-8', alt = 'SalesCloserPro' }) {
  return <img src="/icon-192.png" alt={alt} className={clsx('rounded-lg object-cover', className)} />
}

/** The LLMadvisor atom, drawn as a CSS mask so it takes the current text colour in any theme. */
export function StudioMark({ className = 'w-4 h-4' }) {
  const mask = 'url(/logos/llmadvisor-mark.png) center / contain no-repeat'
  return (
    <span
      aria-hidden="true"
      className={clsx('inline-block bg-current flex-shrink-0', className)}
      style={{ mask, WebkitMask: mask }}
    />
  )
}

/** "An llmadvisor.ai studio project" lockup — the endorsement used in footers and the app shell. */
export function StudioCredit({ className = '', markClassName = 'w-5 h-5' }) {
  return (
    <a
      href={STUDIO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx('group inline-flex items-center gap-2 transition-colors', className)}
    >
      <StudioMark className={markClassName} />
      <span>
        An <span className="font-mono font-semibold tracking-tight group-hover:underline underline-offset-2">llmadvisor.ai</span> studio project
      </span>
    </a>
  )
}
