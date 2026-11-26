/**
 * salescloserpro.ai - Page not found
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 *
 * Shown for any address the site does not have. The build saves it as dist/404.html, which
 * Cloudflare Pages serves with a real 404 status; the router shows the same page in the app.
 */

import { Link } from 'react-router-dom'
import { ArrowLeft, Zap } from 'lucide-react'
import { ProductLogo, Wordmark, COPYRIGHT_LINE } from '../brand/Brand'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-950 text-ink-200 antialiased">
      <header className="border-b border-ink-100/[0.08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <ProductLogo />
            <Wordmark className="text-lg text-white" />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-copper-300">404</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-ink-50 leading-tight mb-4">This page does not exist.</h1>
          <p className="text-ink-400 leading-relaxed max-w-xl mb-8">
            The address may be mistyped, or the page has moved. Your quotes and contacts are safe:
            they are stored in your browser, not at any address.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/" className="inline-flex items-center justify-center gap-2 rounded-md border border-ink-100/40 hover:border-ink-100 px-6 py-3 font-semibold text-ink-100 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Home
            </Link>
            <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-md bg-ink-100 hover:bg-white px-6 py-3 font-semibold text-ink-950 transition-colors">
              <Zap className="w-4 h-4" /> Open the app
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-ink-100/[0.08] py-6 text-center text-xs text-ink-500">{COPYRIGHT_LINE}</footer>
    </div>
  )
}
