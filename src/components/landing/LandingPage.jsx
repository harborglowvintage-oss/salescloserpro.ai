/**
 * SalesCloserPro - Landing Page
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 */

import { Link } from 'react-router-dom'
import {
  FileText, Layers, Link2, BellRing, TrendingUp, ShoppingCart, Github,
  CheckCircle2, Check, Zap, ArrowRight, Star, Lock, Hammer, Briefcase,
} from 'lucide-react'
import { ProductLogo, Wordmark, StudioCredit, COPYRIGHT_LINE } from '../brand/Brand'

const REPO_URL = 'https://github.com/harborglowvintage-oss/salescloserpro.ai'

// LLMadvisor button language: bone on ink is primary, outlined bone is secondary
const BTN = 'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors'
const BTN_PRIMARY = `${BTN} bg-ink-100 hover:bg-white text-ink-950`
const BTN_OUTLINE = `${BTN} border border-ink-100/40 hover:border-ink-100 hover:bg-ink-100/[0.08] text-ink-100`
const WRAP = 'max-w-6xl mx-auto px-4 sm:px-6'

const STEPS = [
  { n: '1', title: 'Build the quote', desc: 'Add products, labor and freight. Sales tax for all 50 states is worked out per line. Offer one price or up to three options.' },
  { n: '2', title: 'Send a link',     desc: 'Your client opens a clean proposal on any phone — no app, no account — or you hand them the PDF.' },
  { n: '3', title: 'Get the yes',     desc: 'They pick an option and accept. You get the confirmation, the deal moves to Won, and follow-ups keep the rest warm.' },
]

const FEATURES = [
  { icon: FileText,     tint: 'text-brand-300 bg-brand-500/10',     title: 'Quote Builder',          desc: 'Line items, state sales tax, your branding — export a polished PDF in one click.' },
  { icon: Layers,       tint: 'text-copper-300 bg-copper-500/10',   title: 'Good / Better / Best',   desc: 'Offer up to three packages in one proposal and let the client pick. Tiers lift average deal size.' },
  { icon: Link2,        tint: 'text-emerald-300 bg-emerald-500/10', title: 'Accept online',          desc: 'Send a link; the client reviews and accepts from any phone. The proposal travels inside the link — nothing is uploaded.' },
  { icon: BellRing,     tint: 'text-amber-300 bg-amber-500/10',     title: 'Follow-ups that happen', desc: 'Valid-until dates, a follow-up schedule, ready-to-send emails, and reminders for your own calendar.' },
  { icon: TrendingUp,   tint: 'text-brand-300 bg-brand-500/10',     title: 'Contacts & Pipeline',    desc: 'Every quote links to a contact and becomes a deal on the board — see each person\'s quotes, deals and totals in one place.' },
  { icon: ShoppingCart, tint: 'text-copper-300 bg-copper-500/10',   title: 'Purchase Orders',        desc: 'Issue vendor POs with ship-to details and track margin against each quote line.' },
]

const PROMISES = [
  { t: 'Free forever',          d: 'No premium tiers, no credit card, no trial clock.' },
  { t: 'Your data stays yours', d: 'Everything lives in your browser. Nothing is tracked or uploaded.' },
  { t: 'No account',            d: 'Click Launch App and you are working. No email, no password.' },
  { t: 'Open source',           d: 'Apache-2.0 — inspect it, fork it, host it yourself.' },
]

// the client-proposal mock (mirrors the real /p page)
const MOCK_OPTIONS = [
  { name: 'Good',   total: '$10,640', items: '2 items' },
  { name: 'Better', total: '$13,468', items: '3 items', recommended: true, selected: true },
  { name: 'Best',   total: '$16,890', items: '4 items' },
]

/** Small copper label above a heading (LLMadvisor "eyebrow"). */
const Eyebrow = ({ children }) => (
  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-copper-300">{children}</p>
)

const H2 = ({ children, className = '' }) => (
  <h2 className={`font-serif text-3xl sm:text-4xl font-semibold text-ink-50 leading-[1.12] tracking-tight ${className}`}>{children}</h2>
)

function ProposalPhone() {
  return (
    <div className="relative mx-auto w-[17.5rem] rounded-[2.2rem] border border-ink-100/15 bg-ink-900 p-2.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]" aria-hidden="true">
      <div className="rounded-[1.7rem] bg-ink-50 text-ink-950 px-4 pt-5 pb-4">
        <p className="font-serif text-lg font-semibold leading-tight">Summit Roofing Co.</p>
        <p className="text-[10px] text-ink-600">Proposal Q-0042 · valid until Dec 8</p>
        <p className="mt-3 mb-2 font-serif text-sm font-semibold">Choose your option</p>
        <div className="space-y-2">
          {MOCK_OPTIONS.map((o) => (
            <div key={o.name} className={`relative flex items-center justify-between rounded-xl border-2 bg-white px-3 py-2 ${o.selected ? 'border-brand-600 ring-4 ring-brand-600/10' : 'border-ink-100'}`}>
              {o.recommended && (
                <span className="absolute -top-2 left-3 inline-flex items-center gap-0.5 rounded-full bg-copper-600 px-1.5 py-px text-[8px] font-bold uppercase tracking-wide text-white">
                  <Star className="w-2 h-2" fill="currentColor" /> Recommended
                </span>
              )}
              <span>
                <span className="block text-xs font-bold">{o.name}</span>
                <span className="block text-[10px] text-ink-600">{o.items}</span>
              </span>
              <span className="text-sm font-extrabold tabular-nums">{o.total}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl bg-ink-950 p-3">
          <p className="text-[10px] text-ink-400">You're accepting <span className="font-semibold text-ink-100">Better</span> at <span className="font-semibold text-ink-100">$13,468</span></p>
          <div className="mt-2 rounded-md border border-white/15 bg-white/[0.06] px-2.5 py-1.5 text-[11px] text-ink-100">Dana Whitfield</div>
          <div className="mt-2 rounded-md bg-copper-600 py-2 text-center text-[11px] font-semibold text-white">Accept proposal</div>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-950 text-ink-200 antialiased pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">

      {/* ───────── NAV ───────── */}
      <header className="sticky top-0 z-50 border-b border-ink-100/[0.08] bg-ink-950/85 backdrop-blur-lg">
        <div className={`${WRAP} py-3 flex items-center justify-between`}>
          <Link to="/" className="flex items-center gap-2.5">
            <ProductLogo />
            <Wordmark className="text-lg text-white" />
          </Link>

          <nav className="hidden sm:flex items-center gap-7 text-sm font-medium text-ink-400">
            <Link to="/about" className="hover:text-ink-100 transition-colors">About</Link>
            <Link to="/help" className="hover:text-ink-100 transition-colors">Docs</Link>
            <Link to="/services" className="text-copper-300 hover:text-copper-200 transition-colors">Custom builds</Link>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" aria-label="SalesCloserPro on GitHub" className="hover:text-ink-100 transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </nav>

          <Link to="/dashboard" className={`${BTN_PRIMARY} px-4 py-2 text-sm`}>Launch App</Link>
        </div>
      </header>

      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_55%_60%_at_80%_30%,rgba(63,187,176,0.13),transparent),radial-gradient(ellipse_40%_40%_at_10%_0%,rgba(216,179,138,0.07),transparent)]" />

        <div className={`relative ${WRAP} pt-16 sm:pt-24 pb-24 grid lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-16 items-center`}>
          <div className="text-center lg:text-left">
            <h1 className="font-serif text-[2.6rem] sm:text-6xl lg:text-[4.25rem] font-semibold text-ink-50 leading-[1.04] tracking-tight mb-6">
              The Free CRM.{' '}
              <span className="text-copper-300">Designed for simplicity.</span>
            </h1>

            <p className="text-lg sm:text-xl text-ink-400 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-9">
              Send a professional quote or PO in minutes, track every deal in your pipeline, and
              export polished PDFs — all from your browser. Zero cost, zero sign-up.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link to="/dashboard" className={`${BTN_PRIMARY} w-full sm:w-auto px-7 py-3.5 text-base`}>
                <Zap className="w-5 h-5" /> Start Using Now
              </Link>
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={`${BTN_OUTLINE} w-full sm:w-auto px-7 py-3.5 text-base`}>
                <Github className="w-5 h-5" /> View on GitHub
              </a>
            </div>

            <ul className="mt-6 flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-1.5 text-sm text-ink-400">
              {['Free forever', 'Open source', 'No account'].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-mint" /> {t}</li>
              ))}
            </ul>

            <StudioCredit className="mt-9 text-sm text-ink-400 hover:text-ink-100" />
          </div>

          {/* hero art — the handshake, framed like the LLMadvisor card */}
          <figure className="relative mx-auto w-full max-w-[22rem] lg:max-w-[26rem]">
            <div className="motion-safe:animate-float rounded-[2rem] p-3 border border-ink-100/15 bg-brand-900/70 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
              <img
                src="/logos/salescloserpro-hero.webp"
                alt="Two professionals shaking hands — the SalesCloserPro handshake"
                width="720" height="720"
                fetchpriority="high"
                className="w-full h-auto rounded-[1.4rem]"
              />
            </div>
            <figcaption className="absolute -bottom-5 -left-3 sm:-left-8 flex items-center gap-3 rounded-xl border border-ink-100/10 bg-ink-900/95 backdrop-blur px-4 py-3 shadow-xl text-left">
              <span className="w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink-50">Proposal accepted</span>
                <span className="block text-xs text-ink-400">Q-0042 · “Better” option · $13,468</span>
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section className="border-y border-ink-100/[0.08] bg-ink-900/40">
        <div className={`${WRAP} py-16 sm:py-20`}>
          <Eyebrow>How it works</Eyebrow>
          <H2 className="mb-10 max-w-2xl">From first number to signed yes, in three steps.</H2>
          <ol className="grid md:grid-cols-3 gap-8 md:gap-10">
            {STEPS.map(({ n, title, desc }) => (
              <li key={n} className="border-t border-ink-100/15 pt-5">
                <span className="font-serif text-4xl font-semibold text-copper-300">{n}</span>
                <h3 className="mt-2 text-lg font-semibold text-ink-50">{title}</h3>
                <p className="mt-1.5 text-sm text-ink-400 leading-relaxed">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── CLIENT PROPOSAL SHOWCASE ───────── */}
      <section className={`${WRAP} py-20 sm:py-24 grid lg:grid-cols-2 gap-14 items-center`}>
        <div>
          <Eyebrow>Accept online</Eyebrow>
          <H2 className="mb-5">Your client says yes from their phone.</H2>
          <p className="text-ink-400 leading-relaxed mb-6 max-w-xl">
            Skip the print-sign-scan loop. Send one link: the client sees your proposal, compares
            options side by side, and accepts with their name. No app to install and no account to create — for them or for you.
          </p>
          <ul className="space-y-3 text-sm text-ink-300 max-w-xl">
            {[
              ['Good / Better / Best', 'three priced options turn "how much?" into "which one?"'],
              ['Nothing is uploaded', 'the proposal travels inside the link itself, not through a server'],
              ['You know what they agreed to', 'every acceptance carries a version code checked against your quote'],
            ].map(([lead, rest]) => (
              <li key={lead} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-mint flex-shrink-0 mt-px" />
                <span><strong className="text-ink-50 font-semibold">{lead}</strong> — {rest}.</span>
              </li>
            ))}
          </ul>
          <Link to="/dashboard" className="mt-8 inline-flex items-center gap-2 text-ink-100 font-semibold hover:gap-3 transition-all">
            Build your first proposal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ProposalPhone />
      </section>

      {/* ───────── FEATURES ───────── */}
      <section className="border-t border-ink-100/[0.08]">
        <div className={`${WRAP} py-20 sm:py-24`}>
          <Eyebrow>Built for closers</Eyebrow>
          <H2 className="mb-3">Everything you need to close deals.</H2>
          <p className="text-ink-400 mb-12 max-w-2xl">No bloat, no accounts, no server holding your data.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, tint, title, desc }) => (
              <div key={title} className="group rounded-xl border border-ink-100/[0.08] bg-ink-100/[0.02] p-6 transition-colors duration-300 hover:border-mint/30 hover:bg-ink-100/[0.04]">
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${tint} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-ink-50 font-semibold mb-2">{title}</h3>
                <p className="text-sm text-ink-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── PROMISES ───────── */}
      <section className="border-y border-ink-100/[0.08] bg-ink-900/40">
        <div className={`${WRAP} py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-8`}>
          {PROMISES.map(({ t, d }) => (
            <div key={t}>
              <h3 className="flex items-center gap-2 font-semibold text-ink-50"><Lock className="w-4 h-4 text-mint" /> {t}</h3>
              <p className="mt-1.5 text-sm text-ink-400 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── ABOUT THE BUILDER ───────── */}
      <section className={`${WRAP} py-20 sm:py-24`}>
        <div className="relative rounded-2xl overflow-hidden border border-ink-100/[0.08] bg-gradient-to-br from-ink-950 via-brand-900 to-ink-900">
          <div className="relative grid lg:grid-cols-[1fr_auto] gap-10 items-center p-8 sm:p-12">
            <div className="max-w-2xl">
              <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-copper-300">
                <Hammer className="w-4 h-4" /> Built from the trenches
              </p>
              <H2 className="mb-5">
                This wasn't built by someone <br className="hidden sm:block" />
                <span className="text-copper-300">who never had a real deadline.</span>
              </H2>
              <p className="text-ink-300 leading-relaxed text-[15px] mb-4">
                salescloserpro.ai was built by someone who's been on job sites, felt the pressure of a last-minute deal falling apart, and knows exactly what it's like to run a business on a shoestring. Not a VC-funded startup. Not a team of developers who've never sent an invoice. Just a real person solving a real problem.
              </p>
              <p className="text-ink-400 leading-relaxed text-[15px]">
                If you're running a <strong className="text-ink-50">contracting business</strong>, managing a <strong className="text-ink-50">sales operation</strong>, or closing <strong className="text-ink-50">high-ticket deals</strong> — you need a tool built for operators who take their numbers seriously. Not a toy. Not a subscription trap. Something that runs lean, looks executive, and keeps your pipeline moving.
              </p>
            </div>

            {/* pull quote */}
            <div className="lg:w-72 flex-shrink-0 flex flex-col items-center text-center p-6 rounded-2xl bg-ink-100/[0.04] border border-ink-100/[0.08]">
              <Briefcase className="w-9 h-9 text-copper-300 mb-3" aria-hidden="true" />
              <p className="font-serif text-ink-50 font-semibold text-xl leading-snug mb-3">
                "Turn your side hustle into a professional business — overnight."
              </p>
              <p className="text-ink-400 text-sm leading-relaxed">
                Send a quote that looks like it came from a $10M agency. Track every deal from lead to closed. Keep 100% of the profit. Pay nothing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── FINAL CTA ───────── */}
      <section className={`${WRAP} pb-24 text-center`}>
        <H2 className="mb-4">Send your first quote in the next five minutes.</H2>
        <p className="text-ink-400 mb-8">No sign-up form stands between you and the builder.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/dashboard" className={`${BTN_PRIMARY} w-full sm:w-auto px-7 py-3.5 text-base`}>
            <Zap className="w-5 h-5" /> Start free — right now
          </Link>
          <Link to="/about" className={`${BTN_OUTLINE} w-full sm:w-auto px-7 py-3.5 text-base`}>Read the guide</Link>
        </div>
      </section>

      {/* ───────── FOOTER ───────── */}
      <footer className="border-t border-ink-100/[0.08]">
        <div className={`${WRAP} py-12`}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-10">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <ProductLogo alt="" />
                <Wordmark className="text-base text-white" />
              </div>
              <p className="text-sm text-ink-500 leading-relaxed">Free, open-source sales quoting and CRM for professionals who value privacy.</p>
            </div>
            <StudioCredit className="text-sm text-ink-400 hover:text-ink-100" />
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <h5 className="text-ink-50 font-semibold mb-3 text-xs uppercase tracking-widest">Links</h5>
              <ul className="space-y-2 text-sm text-ink-400">
                <li><a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-ink-100 transition-colors">GitHub</a></li>
                <li><Link to="/about" className="hover:text-ink-100 transition-colors">About &amp; Guide</Link></li>
                <li><Link to="/help" className="hover:text-ink-100 transition-colors">In-App Docs</Link></li>
                <li><a href={`${REPO_URL}/issues`} target="_blank" rel="noopener noreferrer" className="hover:text-ink-100 transition-colors">Report a Bug</a></li>
                <li><Link to="/services" className="text-copper-300 hover:text-copper-200 transition-colors">Custom &amp; Enterprise</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-ink-50 font-semibold mb-3 text-xs uppercase tracking-widest">Legal</h5>
              <ul className="space-y-2 text-sm text-ink-400">
                <li><Link to="/legal" className="hover:text-ink-100 transition-colors">Terms of Use</Link></li>
                <li><Link to="/legal#privacy" className="hover:text-ink-100 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/legal#ai" className="hover:text-ink-100 transition-colors">AI Disclosure</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-ink-100/[0.08] pt-6 text-center text-xs text-ink-500">{COPYRIGHT_LINE}</div>
        </div>
      </footer>
    </div>
  )
}
