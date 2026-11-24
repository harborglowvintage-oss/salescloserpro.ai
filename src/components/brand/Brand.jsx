/**
 * SalesCloserPro - shared brand primitives (LLMadvisor studio identity)
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 *
 * One home for the product logo + wordmark, the LLMadvisor mark, the LLMadvisor credit and
 * the copyright line, so every page, the app shell and the proposal page stay in sync.
 * Images are generated from /brand by `npm run generate-images`.
 */

import clsx from 'clsx'

export const COPYRIGHT_LINE = '© 2026 SalesCloserPro.ai · LLMadvisor ai LLC · Apache-2.0'
export const STUDIO_URL = 'https://llmadvisor.ai'
export const REPO_URL = 'https://github.com/harborglowvintage-oss/salescloserpro.ai'
// The one public contact address (also in public/.well-known/security.txt and package.json)
export const CONTACT_EMAIL = 'brent@llmadvisor.ai'

/** The handshake product logo (small sizes — the 192px icon, not the hero art). */
export function ProductLogo({ className = 'h-8 w-8', alt = 'SalesCloserPro' }) {
  return <img src="/icon-192.png" alt={alt} className={clsx('rounded-lg object-cover', className)} />
}

const AI_GLOW = 'text-mint [text-shadow:0_0_8px_rgba(63,187,176,0.7)] motion-safe:animate-glow'
// same glow, but only under the app's dark theme (mint is too faint on white)
const AI_GLOW_DARK_ONLY = 'text-brand-600 dark:text-mint dark:[text-shadow:0_0_8px_rgba(63,187,176,0.7)] motion-safe:dark:animate-glow'

/**
 * "salescloserpro.ai" with the .ai lit in the LLMadvisor mark's teal. Inherits colour + size.
 * `adaptive` is for surfaces that follow the app's light/dark theme; marketing pages are always dark.
 */
export function Wordmark({ className = '', adaptive = false }) {
  return (
    <span className={clsx('font-bold tracking-tight', className)}>
      salescloserpro<span className={adaptive ? AI_GLOW_DARK_ONLY : AI_GLOW}>.ai</span>
    </span>
  )
}

/**
 * The LLMadvisor mark (glasses in a ring). The artwork is white + teal, so it always sits
 * on an ink disc — that keeps it correct on light and dark surfaces alike. It blinks every
 * ten seconds, as on llmadvisor.ai; reduced-motion users get the still version.
 */
export function StudioMark({ className = 'w-6 h-6' }) {
  return (
    <span aria-hidden="true" className={clsx('inline-flex items-center justify-center rounded-full bg-ink-950 ring-1 ring-ink-100/15 flex-shrink-0', className)}>
      <picture className="contents">
        <source srcSet="/logos/llmadvisor-mark-still.svg" media="(prefers-reduced-motion: reduce)" />
        <img src="/logos/llmadvisor-mark.svg" alt="" width="48" height="42" className="w-[74%] h-auto" />
      </picture>
    </span>
  )
}

/** "An LLMadvisor ai LLC project" lockup — the endorsement used in footers and the app shell. */
export function StudioCredit({ className = '', markClassName = 'w-7 h-7' }) {
  return (
    <a
      href={STUDIO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx('group inline-flex items-center gap-2.5 transition-colors', className)}
    >
      <StudioMark className={markClassName} />
      <span>
        An <span className="font-serif font-semibold text-[1.08em] tracking-tight group-hover:underline underline-offset-2">LLMadvisor ai LLC</span> project
      </span>
    </a>
  )
}
