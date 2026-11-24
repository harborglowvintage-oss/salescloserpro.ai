/**
 * SalesCloserPro - Landing Page
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 */

import { Link } from 'react-router-dom'
import {
  FileText,
  Layers,
  Link2,
  BellRing,
  TrendingUp,
  ShoppingCart,
  Github,
  CheckCircle2,
  Lock,
  Zap,
  BookOpen,
  ArrowRight
} from 'lucide-react'
import { ProductLogo, StudioCredit, COPYRIGHT_LINE } from '../brand/Brand'

const REPO_URL = 'https://github.com/harborglowvintage-oss/salescloserpro.ai'

const FEATURES = [
  { icon: FileText,      tint: 'text-brand-300 bg-brand-500/10',     title: 'Quote Builder',          desc: 'Line items, state sales tax, your branding — export a polished PDF in one click.' },
  { icon: Layers,        tint: 'text-copper-300 bg-copper-500/10',   title: 'Good / Better / Best',   desc: 'Offer up to three packages in one proposal and let the client pick. Tiers lift average deal size.' },
  { icon: Link2,         tint: 'text-emerald-300 bg-emerald-500/10', title: 'Accept online',          desc: 'Send a link; the client reviews and accepts from any phone. The proposal travels inside the link — nothing is uploaded.' },
  { icon: BellRing,      tint: 'text-amber-300 bg-amber-500/10',     title: 'Follow-ups that happen', desc: 'Valid-until dates, a follow-up schedule, ready-to-send emails, and reminders for your own calendar.' },
  { icon: TrendingUp,    tint: 'text-brand-300 bg-brand-500/10',     title: 'Clients & Pipeline',     desc: 'Every saved quote becomes a deal on the board — from lead to won, with client details in one place.' },
  { icon: ShoppingCart,  tint: 'text-copper-300 bg-copper-500/10',   title: 'Purchase Orders',        desc: 'Issue vendor POs with ship-to details and track margin against each quote line.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-950 text-ink-200 antialiased pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">

      {/* ───────── NAV ───────── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <ProductLogo />
            <span className="text-lg font-bold text-white tracking-tight">salescloserpro.ai</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6 text-sm text-ink-400">
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/help" className="hover:text-white transition-colors">Docs</Link>
            <Link to="/services" className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-copper-500/40 bg-copper-500/10 text-copper-300 hover:bg-copper-500/20 hover:text-copper-200 transition-colors text-xs font-semibold tracking-wide">✦ Custom</Link>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" aria-label="SalesCloserPro on GitHub" className="hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </nav>

          <Link to="/dashboard" className="px-4 py-2 bg-copper-600 hover:bg-copper-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-copper-600/20">
            Launch App
          </Link>
        </div>
      </header>

      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_55%_60%_at_80%_30%,rgba(28,159,176,0.16),transparent),radial-gradient(ellipse_40%_40%_at_10%_0%,rgba(194,112,58,0.08),transparent)]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-20 grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center">
          {/* copy */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold uppercase tracking-widest text-brand-300 rounded-full border border-brand-500/30 bg-brand-500/[0.08]">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              Free &amp; Open Source — No Account Required
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-ink-50 leading-[1.08] tracking-tight mb-6">
              The Free CRM. No gimmicks.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-copper-300 to-copper-500">
                Send a professional quote or PO in minutes.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-ink-400 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-10">
              Create professional proposals, track every deal in your pipeline, manage clients,
              and export polished PDFs — all from your browser. Zero cost, zero sign-up.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-7 py-3.5 bg-copper-600 hover:bg-copper-500 text-white rounded-lg font-semibold text-base transition-all shadow-lg shadow-copper-600/25 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" /> Start Using Now
              </Link>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 border border-ink-700 hover:border-ink-500 text-white rounded-lg font-semibold text-base transition-all flex items-center justify-center gap-2"
              >
                <Github className="w-5 h-5" /> View on GitHub
              </a>
            </div>

            <StudioCredit className="mt-8 text-sm text-ink-500 hover:text-ink-300" />
          </div>

          {/* hero art — the handshake, framed like the LLMadvisor card */}
          <figure className="relative mx-auto w-full max-w-[22rem] lg:max-w-[26rem]">
            <div className="motion-safe:animate-float rounded-[2rem] p-3 border border-ink-200/15 bg-brand-900/70 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
              <img
                src="/logos/salescloserpro-hero.webp"
                alt="Two professionals shaking hands — the SalesCloserPro handshake"
                width="720" height="720"
                fetchpriority="high"
                className="w-full h-auto rounded-[1.4rem]"
              />
            </div>
            {/* product moment: an accepted proposal */}
            <figcaption className="absolute -bottom-5 -left-3 sm:-left-8 flex items-center gap-3 rounded-xl border border-white/10 bg-ink-900/95 backdrop-blur px-4 py-3 shadow-xl text-left">
              <span className="w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink-50">Proposal accepted</span>
                <span className="block text-xs text-ink-400">Q-0042 · “Better” option · $12,480</span>
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ───────── FEATURES ───────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[10px] font-bold uppercase tracking-widest text-brand-300 rounded-full border border-brand-500/25 bg-brand-500/[0.07]">✦ Built for closers</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink-50 mb-3">Everything you need to close deals</h2>
          <p className="text-ink-400">From first quote to signed yes — no bloat, no accounts, no server holding your data.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, tint, title, desc }) => (
            <div key={title} className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-colors duration-300 hover:border-brand-400/25 hover:bg-white/[0.04]">
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${tint} transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-ink-50 font-semibold mb-2">{title}</h3>
              <p className="text-sm text-ink-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── WHY SCP ───────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-ink-50 mb-8">Why choose SalesCloserPro?</h2>
              {[
                { t: 'Free forever', d: 'No hidden fees, no premium tiers, no credit card.' },
                { t: 'Your data stays yours', d: 'Everything lives on your machine — nothing is tracked or uploaded.' },
                { t: 'Runs anywhere', d: 'Works in any modern browser — Windows, macOS, Linux, or Chromebook.' },
                { t: 'Open source', d: 'Apache-2.0 licensed — inspect it, fork it, ship it.' }
              ].map(({ t, d }) => (
                <div key={t} className="flex items-start gap-3 mb-5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-semibold">{t}</h4>
                    <p className="text-sm text-ink-400">{d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-ink-900/60 p-8">
              <Lock className="w-10 h-10 text-brand-400 mb-4" />
              <h3 className="font-serif text-2xl font-semibold text-ink-50 mb-3">No account needed</h3>
              <p className="text-ink-400 mb-6 leading-relaxed">
                Click "Launch App" and you're in. No email, no password, no verification steps.
                Start sending quotes in under 60 seconds.
              </p>
              <Link to="/dashboard" className="inline-flex items-center gap-2 text-brand-400 font-semibold hover:gap-3 transition-all">
                Get started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── ABOUT THE BUILDER ───────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #071b1f 0%, #0c3a42 65%, #0a2328 100%)', border: '1px solid rgba(233,228,216,0.08)' }}>
          {/* subtle ambient orb */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full pointer-events-none opacity-10" style={{ background: 'radial-gradient(circle, #1c9fb0, transparent 70%)' }} />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full pointer-events-none opacity-10" style={{ background: 'radial-gradient(circle, #c2703a, transparent 70%)' }} />

          <div className="relative grid lg:grid-cols-[1fr_auto] gap-10 items-center p-8 sm:p-12">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 mb-5 text-[10px] font-bold uppercase tracking-widest text-copper-300 rounded-full border border-copper-500/30 bg-copper-500/[0.08]">
                🔨 Built from the trenches
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink-50 leading-[1.15] mb-5">
                This wasn't built by someone <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-copper-300 to-brand-300">who never had a real deadline.</span>
              </h2>
              <p className="text-ink-300 leading-relaxed text-[15px] mb-4">
                salescloserpro.ai was built by someone who's been on job sites, felt the pressure of a last-minute deal falling apart, and knows exactly what it's like to run a business on a shoestring. Not a VC-funded startup. Not a team of developers who've never sent an invoice. Just a real person solving a real problem.
              </p>
              <p className="text-ink-400 leading-relaxed text-[15px] mb-6">
                If you're running a <strong className="text-white">contracting business</strong>, managing a <strong className="text-white">sales operation</strong>, or closing <strong className="text-white">high-ticket deals</strong> — you need a tool built for operators who take their numbers seriously. Not a toy. Not a subscription trap. Something that runs lean, looks executive, and keeps your pipeline moving.
              </p>
              <div className="flex flex-wrap gap-3">
                {['$0/month forever', 'No license fees', 'No subscriptions', 'No gatekeeping', 'No account required', 'Your data stays on your device'].map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-300" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* pull quote */}
            <div className="lg:w-72 flex-shrink-0 flex flex-col items-center text-center p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-5xl mb-3" aria-hidden="true">💼</span>
              <p className="font-serif text-ink-50 font-semibold text-xl leading-snug mb-3">
                "Turn your side hustle into a professional business — overnight."
              </p>
              <p className="text-ink-400 text-sm leading-relaxed">
                Send a quote that looks like it came from a $10M agency. Track every deal from lead to closed. Keep 100% of the profit. Pay nothing.
              </p>
              <div className="mt-5 w-full">
                <Link to="/dashboard" className="block w-full text-center px-5 py-3 rounded-xl text-sm font-bold text-white bg-copper-600 hover:bg-copper-500 shadow-lg shadow-copper-600/25 transition-colors">
                  Start free — right now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── ABOUT TEASER ───────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
          <BookOpen className="w-10 h-10 text-brand-400 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-serif text-xl font-semibold text-ink-50 mb-1">New here? Read the guide.</h3>
            <p className="text-ink-400 text-sm">
              Step-by-step walkthrough for first-time users — from creating your first quote to
              setting up your company branding and exporting PDFs.
            </p>
          </div>
          <Link to="/about" className="px-5 py-2.5 bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white rounded-lg font-semibold text-sm transition-colors whitespace-nowrap">
            Read the Guide →
          </Link>
        </div>
      </section>




      {/* ───────── FOOTER ───────── */}
      <footer className="border-t border-white/[0.06] mt-12">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12">

          {/* Brand row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-10">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <ProductLogo alt="" />
                <span className="font-bold text-white text-base">salescloserpro.ai</span>
              </div>
              <p className="text-sm text-ink-500 leading-relaxed">Free, open-source sales quoting and CRM for professionals who value privacy.</p>
            </div>
            <StudioCredit className="text-sm text-ink-400 hover:text-ink-200" />
          </div>

          {/* Links row */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-8 mb-10">
            <div>
              <h5 className="text-white font-semibold mb-3 text-xs uppercase tracking-widest">Links</h5>
              <ul className="space-y-2 text-sm text-ink-400">
                <li><a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About &amp; Guide</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">In-App Docs</Link></li>
                <li><a href={`${REPO_URL}/issues`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Report a Bug</a></li>
                <li><Link to="/services" className="text-copper-300 hover:text-copper-200 transition-colors">✦ Custom &amp; Enterprise</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-3 text-xs uppercase tracking-widest">Legal</h5>
              <ul className="space-y-2 text-sm text-ink-400">
                <li><Link to="/legal" className="hover:text-white transition-colors">Terms of Use</Link></li>
                <li><Link to="/legal#privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/legal#ai" className="hover:text-white transition-colors">AI Disclosure</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/[0.06] pt-6 text-center text-xs text-ink-600">
            {COPYRIGHT_LINE}
          </div>

        </div>
      </footer>
    </div>
  )
}
