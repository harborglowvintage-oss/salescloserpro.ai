/**
 * SalesCloserPro - Whitepaper: The Sovereign Operator
 * Copyright (c) 2026 Brent Girolimon / llmadvisor.ai
 * Powered by highsignal™
 * Licensed under Apache-2.0
 */

import { Link } from 'react-router-dom'
import {
  ArrowLeft, BookOpen, Clock, Calendar, TrendingDown, DollarSign,
  Globe, Presentation, Scissors, Shield, Zap, ExternalLink, ArrowRight,
  AlertTriangle, CheckCircle2, XCircle, CreditCard, RefreshCw,
  FileText, Send
} from 'lucide-react'
import { useEffect, useRef } from 'react'

/* ── Intersection Observer hook for scroll-in animations ── */
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('opacity-100', 'translate-y-0')
          el.classList.remove('opacity-0', 'translate-y-6')
          io.unobserve(el)
        }
      },
      { threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

function Reveal({ children, className = '', delay = '' }) {
  const ref = useReveal()
  return (
    <div ref={ref} className={`opacity-0 translate-y-6 transition-all duration-700 ease-out ${delay} ${className}`}>
      {children}
    </div>
  )
}

/* ── Stat callout card ── */
const StatCard = ({ value, label, accent = 'blue' }) => {
  const colors = {
    blue: 'border-blue-500/20 text-blue-400',
    red: 'border-red-500/20 text-red-400',
    amber: 'border-amber-500/20 text-amber-400',
    emerald: 'border-emerald-500/20 text-emerald-400',
    cyan: 'border-cyan-500/20 text-cyan-400',
    violet: 'border-violet-500/20 text-violet-400',
  }
  return (
    <div className={`inline-flex flex-col items-center px-5 py-3 rounded-xl border ${colors[accent]} bg-white/[0.03]`}>
      <span className="text-2xl sm:text-3xl font-extrabold">{value}</span>
      <span className="text-[11px] text-slate-500 mt-1 text-center leading-tight">{label}</span>
    </div>
  )
}

/* ── Animated horizontal bar ── */
const Bar = ({ label, sublabel, width, gradient, delay = '0ms' }) => {
  const barRef = useRef(null)
  useEffect(() => {
    const el = barRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => { el.style.width = width }, 100)
          io.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [width])
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <span className="text-xs text-slate-500">{sublabel}</span>
      </div>
      <div className="h-3 rounded-full bg-white/[0.04] overflow-hidden">
        <div ref={barRef} className={`h-full rounded-full ${gradient} transition-all duration-1000 ease-out`} style={{ width: '0%', transitionDelay: delay }} />
      </div>
    </div>
  )
}

/* ── Animated ring / donut (SVG) ── */
const Ring = ({ percent, label, color = '#f59e0b', size = 100 }) => {
  const r = 38
  const c = 2 * Math.PI * r
  const ringRef = useRef(null)
  useEffect(() => {
    const el = ringRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => { el.style.strokeDashoffset = String(c - (c * percent) / 100) }, 200)
          io.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [percent, c])
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle
          ref={ringRef}
          cx="50" cy="50" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c}
          style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
        />
      </svg>
      <span className="text-xs text-slate-500 text-center leading-tight">{label}</span>
    </div>
  )
}

/* ── TOC item ── */
const TocItem = ({ num, title, id }) => (
  <a
    href={`#${id}`}
    className="flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-lg hover:bg-white/[0.04] transition-colors group"
    onClick={e => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
  >
    <span className="w-7 h-7 rounded-full border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-xs font-bold text-blue-400 flex-shrink-0">{num}</span>
    <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{title}</span>
  </a>
)

/* ── Section heading ── */
const SectionHeading = ({ num, title, icon: Icon, id }) => (
  <div id={id} className="scroll-mt-24 flex items-start gap-4 mb-6">
    <div className="flex flex-col items-center flex-shrink-0 mt-1">
      <span className="text-3xl font-black text-blue-500/20 select-none">{num}</span>
    </div>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-blue-400" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{title}</h2>
    </div>
  </div>
)

/* ── Comparison row (check / x) ── */
const CompareRow = ({ label, old: oldVal, modern }) => (
  <div className="grid grid-cols-[1fr,100px,100px] sm:grid-cols-[1fr,140px,140px] gap-2 py-2.5 border-b border-white/[0.04] last:border-0 items-center">
    <span className="text-sm text-slate-400">{label}</span>
    <span className="text-sm text-red-400 flex items-center gap-1.5 justify-center"><XCircle className="w-3.5 h-3.5 flex-shrink-0" /> {oldVal}</span>
    <span className="text-sm text-emerald-400 flex items-center gap-1.5 justify-center"><CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> {modern}</span>
  </div>
)

/* ═══════════════════════════════════════════════════════════════════════════ */

const WHITEPAPER_META = {
  title: 'The Sovereign Operator — How to Protect Your Cash Flow, Drop the Software Bloat, and Win Bigger Jobs | salescloserpro.ai',
  description: 'A data-driven whitepaper for contractors and independent operators: protect cash flow from the $957B CRE debt wall, escape the $9,100/yr software tax, get paid instantly with MoonPay/USDC, and earn crypto rewards on every purchase with Gemini.',
  url: 'https://salescloserpro.ai/#/whitepaper',
  image: 'https://salescloserpro.ai/og-cover.png',
  published: '2026-03-01',
  author: 'Brent Girolimon',
  org: 'llmadvisor.ai',
}

export default function WhitepaperPage() {
  /* ── SEO: dynamic meta tags ── */
  useEffect(() => {
    const prev = document.title
    document.title = WHITEPAPER_META.title

    const setMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el) }
      el.setAttribute('content', content)
    }

    // Standard
    setMeta('name', 'description', WHITEPAPER_META.description)
    setMeta('name', 'author', WHITEPAPER_META.author)

    // Open Graph
    setMeta('property', 'og:title', WHITEPAPER_META.title)
    setMeta('property', 'og:description', WHITEPAPER_META.description)
    setMeta('property', 'og:url', WHITEPAPER_META.url)
    setMeta('property', 'og:type', 'article')
    setMeta('property', 'og:image', WHITEPAPER_META.image)
    setMeta('property', 'article:published_time', WHITEPAPER_META.published)
    setMeta('property', 'article:author', WHITEPAPER_META.author)
    setMeta('property', 'article:section', 'Business')
    setMeta('property', 'article:tag', 'cash flow,contractor,CRM,stablecoin,MoonPay,Gemini,Cloudflare,SaaS inflation')

    // Twitter / X
    setMeta('name', 'twitter:title', WHITEPAPER_META.title)
    setMeta('name', 'twitter:description', WHITEPAPER_META.description)
    setMeta('name', 'twitter:image', WHITEPAPER_META.image)

    // JSON-LD Article structured data
    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.id = 'whitepaper-ld'
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'The Sovereign Operator: How to Protect Your Cash Flow, Drop the Software Bloat, and Win Bigger Jobs',
      description: WHITEPAPER_META.description,
      url: WHITEPAPER_META.url,
      image: WHITEPAPER_META.image,
      datePublished: WHITEPAPER_META.published,
      dateModified: WHITEPAPER_META.published,
      author: { '@type': 'Person', name: WHITEPAPER_META.author },
      publisher: { '@type': 'Organization', name: WHITEPAPER_META.org, url: 'https://llmadvisor.ai' },
      mainEntityOfPage: { '@type': 'WebPage', '@id': WHITEPAPER_META.url },
      articleSection: 'Business',
      keywords: 'cash flow, contractor, CRM, stablecoin, MoonPay, Gemini, Cloudflare, SaaS inflation, Net-30, USDC',
      wordCount: 2800,
      inLanguage: 'en-US',
    })
    document.head.appendChild(ld)

    return () => {
      document.title = prev
      document.getElementById('whitepaper-ld')?.remove()
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 antialiased">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <span className="text-slate-700 select-none">|</span>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">The Sovereign Operator</span>
          </div>
        </div>
      </header>

      {/* ── Hero masthead ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(56,140,255,0.10),transparent)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold tracking-wide uppercase mb-6">
              <BookOpen className="w-3.5 h-3.5" /> Whitepaper
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] mb-4">The Sovereign Operator</h1>
            <p className="text-xl sm:text-2xl font-medium leading-snug mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                How to Protect Your Cash Flow, Drop the Software Bloat, and Win Bigger Jobs
              </span>
            </p>
            <div className="flex items-center justify-center gap-5 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 10 min read</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> March 1, 2026</span>
              <span>salescloserpro.ai</span>
            </div>
          </Reveal>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-24">

        {/* ── Table of Contents ── */}
        <Reveal>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 mb-16">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Contents</h3>
            <div className="grid sm:grid-cols-2 gap-x-6">
              <TocItem num="0" title="Introduction: The Game Has Changed" id="intro" />
              <TocItem num="1" title="The Banking Squeeze" id="part-1" />
              <TocItem num="2" title="The Global Squeeze" id="part-2" />
              <TocItem num="3" title="The Professional Pitch" id="part-3" />
              <TocItem num="4" title="Cutting the Fat" id="part-4" />
              <TocItem num="5" title="The Digital Bouncer" id="part-5" />
              <TocItem num="6" title="Getting Paid Instantly" id="part-6" />
              <TocItem num="7" title="Crypto Rewards on Purchases" id="part-7" />
            </div>
          </div>
        </Reveal>

        {/* ═══════ INTRODUCTION ═══════ */}
        <Reveal>
          <section className="mb-16" id="intro">
            <div className="scroll-mt-24 flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-slate-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Introduction: The Game Has Changed</h2>
            </div>
            <div className="text-base text-slate-300 leading-relaxed space-y-4 pl-0 sm:pl-[52px]">
              <p>
                You build real things in the physical world, but the financial system running in the background is playing games with your money. Between banks tightening their belts, global conflicts driving up material costs, and software companies bleeding your margins with hidden fees, the everyday contractor is exposed.
              </p>
              <p>
                This is the exact blueprint for modernizing your operation, securing your cash flow, and winning high-ticket commercial bids — without relying on a fragile system.
              </p>
            </div>
          </section>
        </Reveal>


        {/* ═══════ PART 1: THE BANKING SQUEEZE ═══════ */}
        <Reveal>
          <section className="mb-16">
            <SectionHeading num="01" title="The Banking Squeeze" icon={TrendingDown} id="part-1" />
            <p className="text-xs font-semibold text-red-400/60 uppercase tracking-widest mb-6 pl-0 sm:pl-[52px]">Why "Net-30" is a Trap</p>
            <div className="text-base text-slate-300 leading-relaxed space-y-4 pl-0 sm:pl-[52px]">
              <p>
                The banking system is currently choking on Commercial Real Estate (CRE) debt. In 2025 alone, <strong className="text-white">$957 billion</strong> in commercial real estate loans matured — nearly triple the 20-year historical average. Because so many massive office buildings are sitting empty, regional banks are losing money. When banks face a $957 billion maturity wall, their first move is to tighten the leash on Main Street. They freeze small business credit lines and hold your deposited checks longer to protect their own ledgers.
              </p>

              {/* ── Inline chart: CRE maturity wall ── */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 my-6">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <h4 className="text-white font-semibold text-sm">CRE Loan Maturity Wall</h4>
                </div>
                <p className="text-xs text-slate-500 mb-4">2025 maturities vs. 20-year historical average.</p>
                <Bar label="20-Year Average" sublabel="~$340B" width="35%" gradient="bg-gradient-to-r from-slate-600 to-slate-500" delay="0ms" />
                <Bar label="2025 Maturities" sublabel="$957B (2.8×)" width="100%" gradient="bg-gradient-to-r from-red-600 to-red-400" delay="200ms" />
              </div>

              <div className="flex flex-wrap gap-3 my-6">
                <StatCard value="$957B" label="CRE loans matured (2025)" accent="red" />
                <StatCard value="50%" label="US invoices overdue" accent="amber" />
                <StatCard value="43 days" label="Average wait to get paid" accent="amber" />
              </div>

              <p>
                Because of this, <strong className="text-white">"Net-30" payment terms are dead</strong>. Right now, 50% of US B2B invoices are currently overdue, and suppliers are waiting an average of 43 days to get paid. If you let a client delay payment for 43 days after a job is done, you are giving them a free loan to finance their project. You cannot afford to let middlemen control your oxygen.
              </p>

              {/* ── Inline chart: Invoice overdue ring ── */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 my-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <h4 className="text-white font-semibold text-sm">US B2B Invoice Status</h4>
                </div>
                <div className="flex items-center justify-center gap-10">
                  <Ring percent={50} label="Overdue (50%)" color="#f59e0b" size={110} />
                  <div className="text-left">
                    <p className="text-2xl font-extrabold text-amber-400">43 days</p>
                    <p className="text-xs text-slate-500">average wait to receive payment</p>
                    <p className="text-xs text-slate-600 mt-1">= free loan to your client</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Reveal>


        {/* ═══════ PART 2: THE GLOBAL SQUEEZE ═══════ */}
        <Reveal>
          <section className="mb-16">
            <SectionHeading num="02" title="The Global Squeeze" icon={Globe} id="part-2" />
            <p className="text-xs font-semibold text-red-400/60 uppercase tracking-widest mb-6 pl-0 sm:pl-[52px]">Why Your Cash is Bleeding</p>
            <div className="text-base text-slate-300 leading-relaxed space-y-4 pl-0 sm:pl-[52px]">
              <p>
                It is not just the local banks tightening up — the global board is shifting. The escalating conflict in the Middle East between the US, Israel, and Iran is spreading chaos across the region, even rattling historically stable financial hubs like Dubai.
              </p>
              <p>
                For a contractor, this isn't just news — it is a direct threat to your margins. This instability immediately rattles global oil markets, driving up the cost of fuel for your trucks and the price of petroleum-based materials like PVC, flooring, and asphalt.
              </p>

              {/* ── Inline chart: Purchasing power erosion ── */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 my-6">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <h4 className="text-white font-semibold text-sm">Your Purchasing Power</h4>
                </div>
                <p className="text-xs text-slate-500 mb-4">What $100 in the bank is actually worth today.</p>
                <Bar label="Last Year" sublabel="$100" width="100%" gradient="bg-gradient-to-r from-blue-500 to-cyan-400" delay="0ms" />
                <Bar label="Today" sublabel="$93 (−7%)" width="93%" gradient="bg-gradient-to-r from-amber-500 to-red-500" delay="200ms" />
                <p className="text-[11px] text-slate-600 mt-3">If you wait 43 days for payment, you're paid back in money worth less than when you swung the hammer.</p>
              </div>

              <div className="flex flex-wrap gap-3 my-6">
                <StatCard value="−7%" label="Purchasing power lost" accent="red" />
                <StatCard value="$93" label="What $100 is worth today" accent="amber" />
              </div>

              <p>
                At the same time, money is flowing out of the US at speeds we haven't seen in decades. The math is brutal: you have lost roughly <strong className="text-red-400">7% of your purchasing power</strong> over the last few years. To simplify it: if you had $100 sitting in the bank last year, it is now worth $93 on the global market.
              </p>
              <p>
                If you are waiting 43 days to get paid on a legacy banking contract, you aren't just acting as a free bank for your client — you are being paid back in money that is literally <strong className="text-white">worth less than when you swung the hammer</strong>.
              </p>
            </div>
          </section>
        </Reveal>


        {/* ═══════ PART 3: THE PROFESSIONAL PITCH ═══════ */}
        <Reveal>
          <section className="mb-16">
            <SectionHeading num="03" title="The Professional Pitch" icon={Presentation} id="part-3" />
            <p className="text-xs font-semibold text-blue-400/60 uppercase tracking-widest mb-6 pl-0 sm:pl-[52px]">Selling When You Aren't in the Room</p>
            <div className="text-base text-slate-300 leading-relaxed space-y-4 pl-0 sm:pl-[52px]">
              <p>
                When money gets tight, clients get incredibly protective of their budgets. They do not hand <strong className="text-white">$65,000 commercial interior jobs</strong> to a guy who emails them a Microsoft Word document. They hire the operator who looks like a fortress.
              </p>

              {/* ── Inline: Side-by-side comparison ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
                {/* Old way */}
                <div className="rounded-xl border border-red-500/20 bg-red-500/[0.03] p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-4 h-4 text-red-400" />
                    <h4 className="text-red-400 font-semibold text-sm">The Word Doc Email</h4>
                  </div>
                  <ul className="space-y-3">
                    {[
                      ['Delivery', 'Hours to format'],
                      ['Presentation', 'Amateur / inconsistent'],
                      ['Payment link', 'None — "mail a check"'],
                      ['Mobile', 'Breaks on phones'],
                    ].map(([label, val]) => (
                      <li key={label} className="flex items-start gap-2.5">
                        <XCircle className="w-4 h-4 text-red-500/70 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-xs text-slate-500 block">{label}</span>
                          <span className="text-sm text-slate-400">{val}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* New way */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Send className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-emerald-400 font-semibold text-sm">The SalesCloserPro Quote</h4>
                  </div>
                  <ul className="space-y-3">
                    {[
                      ['Delivery', '10 minutes from job site'],
                      ['Presentation', 'Branded PDF — print-ready'],
                      ['Payment link', 'Built-in — one-click pay'],
                      ['Mobile', 'Fully responsive'],
                    ].map(([label, val]) => (
                      <li key={label} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500/70 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-xs text-slate-500 block">{label}</span>
                          <span className="text-sm text-slate-300">{val}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p>
                You need software that does the heavy lifting for you. <strong className="text-blue-300">Speed wins the bid.</strong> The contractor who can walk a job site and fire off a binding, professional quote to the client's phone in 10 minutes takes the job.
              </p>
              <p>
                Furthermore, you can't always be in the boardroom. By using tools like <strong className="text-blue-300">SalesCloserPro.ai</strong>, the software does the selling for you. The client clicks a link, sees a professional branded quote on their phone, and signs the deal while you are physically working on another job site.
              </p>
            </div>
          </section>
        </Reveal>


        {/* ═══════ PART 4: CUTTING THE FAT ═══════ */}
        <Reveal>
          <section className="mb-16">
            <SectionHeading num="04" title="Cutting the Fat" icon={Scissors} id="part-4" />
            <p className="text-xs font-semibold text-emerald-400/60 uppercase tracking-widest mb-6 pl-0 sm:pl-[52px]">Escaping the Software Tax</p>
            <div className="text-base text-slate-300 leading-relaxed space-y-4 pl-0 sm:pl-[52px]">
              <p>
                Most contractors bleed cash by paying for heavy corporate software they don't actually need. Standard enterprise packages like Microsoft Office or bloated CRMs like Salesforce are built for 5,000-person tech companies, not lean commercial operators.
              </p>

              {/* ── Inline chart: SaaS inflation vs general inflation ── */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 my-6">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <h4 className="text-white font-semibold text-sm">SaaS Inflation vs. General Inflation</h4>
                </div>
                <p className="text-xs text-slate-500 mb-4">Software prices are rising 4.5× faster than everything else.</p>
                <Bar label="General Inflation" sublabel="~2.7%" width="22%" gradient="bg-gradient-to-r from-slate-600 to-slate-500" delay="0ms" />
                <Bar label="SaaS Price Increase" sublabel="12.2% (4.5×)" width="100%" gradient="bg-gradient-to-r from-red-600 to-amber-500" delay="200ms" />
              </div>

              <div className="flex flex-wrap gap-3 my-6">
                <StatCard value="+12.2%" label="SaaS price surge (2024)" accent="red" />
                <StatCard value="4.5×" label="Faster than inflation" accent="amber" />
                <StatCard value="$9,100" label="Per employee / year" accent="red" />
              </div>

              <p>
                The software industry is actively squeezing its users. SaaS prices <strong className="text-red-400">increased by 12.2% in 2024</strong>, running 4.5 times higher than the general inflation rate. The average organization now spends over <strong className="text-white">$9,100 per employee annually</strong> on software subscriptions. You need to switch to a <strong className="text-emerald-300">"Lean Stack."</strong>
              </p>

              {/* ── Inline: Cost comparison cards ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
                <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-5">
                  <p className="text-xs text-red-400/70 font-semibold uppercase tracking-widest mb-2">Enterprise Stack</p>
                  <p className="text-2xl font-extrabold text-red-400">$9,100</p>
                  <p className="text-xs text-slate-500 mt-1">per employee / year</p>
                  <p className="text-xs text-slate-600 mt-2">Office 365 + Salesforce + Adobe + extras</p>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
                  <p className="text-xs text-emerald-400/70 font-semibold uppercase tracking-widest mb-2">Lean Stack</p>
                  <p className="text-2xl font-extrabold text-emerald-400">$0 – $84</p>
                  <p className="text-xs text-slate-500 mt-1">per employee / year</p>
                  <p className="text-xs text-slate-600 mt-2">SalesCloserPro (free) + Zoho/Gmail</p>
                </div>
              </div>

              <p>
                By moving to fast, cloud-based tools like Zoho or Google Workspace (Gmail), you drop your monthly overhead to near zero. More importantly, these tools are built for the field. You don't need a heavy desktop computer back at the office to run them — you can review a blueprint, update a quote, and email a client from your phone with one bar of cell service standing on a concrete slab.
              </p>
            </div>
          </section>
        </Reveal>


        {/* ═══════ PART 5: THE DIGITAL BOUNCER ═══════ */}
        <Reveal>
          <section className="mb-16">
            <SectionHeading num="05" title="The Digital Bouncer" icon={Shield} id="part-5" />
            <p className="text-xs font-semibold text-cyan-400/60 uppercase tracking-widest mb-6 pl-0 sm:pl-[52px]">Bulletproof Security</p>
            <div className="text-base text-slate-300 leading-relaxed space-y-4 pl-0 sm:pl-[52px]">
              <p>
                When you start sending $50,000 quotes and payment links over the internet, your quoting software becomes a financial instrument. It needs military-grade armor.
              </p>

              {/* ── Inline: Threat flow diagram ── */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 my-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-white font-semibold text-sm">How Cloudflare Protects Your Cash Flow</h4>
                </div>
                <div className="flex items-center justify-center gap-0 sm:gap-2 flex-wrap sm:flex-nowrap">
                  {/* Attacker */}
                  <div className="flex flex-col items-center px-3 py-3 rounded-lg border border-red-500/20 bg-red-500/[0.05] min-w-[90px]">
                    <AlertTriangle className="w-6 h-6 text-red-400 mb-1" />
                    <span className="text-xs text-red-400 font-medium">Attacker</span>
                    <span className="text-[10px] text-slate-600">MITM intercept</span>
                  </div>
                  {/* Arrow → Blocked */}
                  <div className="flex items-center px-1 sm:px-2">
                    <div className="hidden sm:block w-8 h-px bg-red-500/30" />
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <div className="hidden sm:block w-8 h-px bg-red-500/30" />
                  </div>
                  {/* Cloudflare */}
                  <div className="flex flex-col items-center px-3 py-3 rounded-lg border border-cyan-500/20 bg-cyan-500/[0.05] min-w-[90px]">
                    <Shield className="w-6 h-6 text-cyan-400 mb-1" />
                    <span className="text-xs text-cyan-400 font-medium">Cloudflare</span>
                    <span className="text-[10px] text-slate-600">DNS / WAF / SSL</span>
                  </div>
                  {/* Arrow → Safe */}
                  <div className="flex items-center px-1 sm:px-2">
                    <div className="hidden sm:block w-8 h-px bg-emerald-500/30" />
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <div className="hidden sm:block w-8 h-px bg-emerald-500/30" />
                  </div>
                  {/* Your Business */}
                  <div className="flex flex-col items-center px-3 py-3 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05] min-w-[90px]">
                    <DollarSign className="w-6 h-6 text-emerald-400 mb-1" />
                    <span className="text-xs text-emerald-400 font-medium">Your Business</span>
                    <span className="text-[10px] text-slate-600">Safe &amp; encrypted</span>
                  </div>
                </div>
              </div>

              <p>
                This is where <strong className="text-cyan-300">Cloudflare DNS</strong> comes in. Think of Cloudflare as a digital bouncer standing in front of your business. If a hacker tries to intercept your client's payment link and send the money to their own account (a Man-in-the-Middle attack), Cloudflare blocks them before they even get to the front door. Your clients' data, and your money, are locked in a vault.
              </p>
            </div>
          </section>
        </Reveal>


        {/* ═══════ PART 6: GETTING PAID INSTANTLY ═══════ */}
        <Reveal>
          <section className="mb-16">
            <SectionHeading num="06" title="Getting Paid Instantly" icon={Zap} id="part-6" />
            <p className="text-xs font-semibold text-emerald-400/60 uppercase tracking-widest mb-6 pl-0 sm:pl-[52px]">MoonPay &amp; Stablecoin Rails</p>
            <div className="text-base text-slate-300 leading-relaxed space-y-4 pl-0 sm:pl-[52px]">
              <p>
                All of this means nothing if you have to wait days for the bank to clear your money while inflation eats your profit. Relying on traditional file-based ACH processes means dealing with manual tracking, limited visibility, and batch-processing delays that can take several days to clear.
              </p>
              <p>
                By integrating tools like <strong className="text-emerald-300">MoonPay</strong>, you bypass the banks entirely using the Lightning Network and Stablecoins (USDC). You do not have to hold volatile cryptocurrency. You can transact in digital dollars that are pegged 1-to-1 with the US Dollar, but move at the speed of the internet.
              </p>

              {/* Key benefits */}
              <div className="grid gap-4 my-6">
                {[
                  { title: 'Instant Digital Dollars', body: 'Crypto rails don\'t take the weekend off. If a client pays you a $50,000 deposit on a Friday night, the funds are in your digital wallet instantly. You can buy materials on Saturday morning before prices shift.', accent: 'border-emerald-500/20', icon: '⚡' },
                  { title: 'Zero Volatility, Total Control', body: 'By using USDC via MoonPay, your money doesn\'t fluctuate like Bitcoin. It stays exactly at its dollar value, but the bank cannot freeze it or delay it.', accent: 'border-blue-500/20', icon: '🛡️' },
                  { title: 'No Chargebacks', body: 'Credit cards allow clients to dispute charges weeks later. Cryptographic transactions are final. Once the money hits your wallet, it is mathematically yours.', accent: 'border-cyan-500/20', icon: '🔐' },
                ].map(({ title, body, accent, icon }) => (
                  <div key={title} className={`rounded-xl border ${accent} bg-white/[0.02] p-5`}>
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="text-lg">{icon}</span>
                      <h4 className="text-white font-semibold text-sm">{title}</h4>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>

              {/* ── Settlement speed chart (inline) ── */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 my-6">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <h4 className="text-white font-semibold text-sm">Settlement Speed</h4>
                </div>
                <p className="text-xs text-slate-500 mb-4">The danger of waiting on traditional banks vs. modern rails.</p>
                <Bar label="Bank Check" sublabel="5 days — high bounce risk" width="100%" gradient="bg-gradient-to-r from-red-600 to-red-500" delay="0ms" />
                <Bar label="Standard ACH" sublabel="3 days — weekend delays" width="60%" gradient="bg-gradient-to-r from-amber-600 to-amber-400" delay="150ms" />
                <Bar label="Credit Card" sublabel="1 day — 3% fee + chargebacks" width="20%" gradient="bg-gradient-to-r from-blue-500 to-blue-400" delay="300ms" />
                <Bar label="MoonPay / USDC" sublabel="Instant — zero freeze risk" width="4%" gradient="bg-gradient-to-r from-emerald-500 to-cyan-400" delay="450ms" />
              </div>
            </div>
          </section>
        </Reveal>


        {/* ═══════ PART 7: CRYPTO REWARDS ═══════ */}
        <Reveal>
          <section className="mb-16">
            <SectionHeading num="07" title="Crypto Rewards on Purchases" icon={CreditCard} id="part-7" />
            <p className="text-xs font-semibold text-violet-400/60 uppercase tracking-widest mb-6 pl-0 sm:pl-[52px]">Close the Loop with Gemini</p>
            <div className="text-base text-slate-300 leading-relaxed space-y-4 pl-0 sm:pl-[52px]">
              <p>
                You've locked down the <em>incoming</em> side — clients pay you instantly via MoonPay in digital dollars. But what about the <em>outgoing</em> side? Every trip to the supply house, every fuel stop, every material order — that's money leaving your operation and earning you nothing.
              </p>
              <p>
                The <strong className="text-violet-300">Gemini Credit Card</strong> changes the equation. Instead of earning 1–2% fiat cash-back that depreciates with inflation, you earn <strong className="text-white">up to 3% back in crypto</strong> (BTC, ETH, or other assets) on every purchase. Newer programs like Gemini are running aggressive reward incentives that outpace legacy cash-back cards — and the rewards themselves can appreciate over time.
              </p>

              {/* ── Cash flow loop diagram ── */}
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.03] p-5 my-6">
                <div className="flex items-center gap-2 mb-4">
                  <RefreshCw className="w-4 h-4 text-violet-400" />
                  <h4 className="text-white font-semibold text-sm">The Sovereign Cash Flow Loop</h4>
                </div>
                <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0">
                  {[
                    { label: 'Client Pays', sub: 'MoonPay / USDC', color: 'border-emerald-500/30 bg-emerald-500/[0.06]', textColor: 'text-emerald-400' },
                    { label: 'Your Wallet', sub: 'Instant settlement', color: 'border-blue-500/30 bg-blue-500/[0.06]', textColor: 'text-blue-400' },
                    { label: 'You Purchase', sub: 'Gemini Card', color: 'border-violet-500/30 bg-violet-500/[0.06]', textColor: 'text-violet-400' },
                    { label: 'Crypto Rewards', sub: 'Up to 3% back', color: 'border-amber-500/30 bg-amber-500/[0.06]', textColor: 'text-amber-400' },
                  ].map(({ label, sub, color, textColor }, i) => (
                    <div key={label} className="flex items-center gap-0">
                      <div className={`flex flex-col items-center px-4 py-3 rounded-lg border ${color} min-w-[110px]`}>
                        <span className={`text-xs font-semibold ${textColor}`}>{label}</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">{sub}</span>
                      </div>
                      {i < 3 && <ArrowRight className="w-4 h-4 text-slate-600 mx-1 flex-shrink-0 hidden sm:block" />}
                      {i < 3 && <div className="w-4 h-px bg-slate-700 sm:hidden" />}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-600 text-center mt-4">Both sides of your cash flow now build crypto positions. The loop closes.</p>
              </div>

              <p>
                Here's why this matters over the long run: every dollar you spend on materials, fuel, and supplies is now <strong className="text-white">dollar-cost averaging you into crypto</strong> — automatically, with money you were already spending. You're not speculating. You're not trading. You're just getting paid on both ends of every transaction.
              </p>

              {/* ── Rewards comparison ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
                <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-5">
                  <p className="text-xs text-red-400/70 font-semibold uppercase tracking-widest mb-2">Traditional Cash-Back</p>
                  <p className="text-2xl font-extrabold text-red-400">1–2%</p>
                  <p className="text-xs text-slate-500 mt-1">fiat USD rewards</p>
                  <p className="text-xs text-slate-600 mt-2">Depreciates with inflation. Loses 7% purchasing power while sitting in your account.</p>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
                  <p className="text-xs text-emerald-400/70 font-semibold uppercase tracking-widest mb-2">Gemini Crypto Rewards</p>
                  <p className="text-2xl font-extrabold text-emerald-400">Up to 3%</p>
                  <p className="text-xs text-slate-500 mt-1">BTC, ETH, or 40+ assets</p>
                  <p className="text-xs text-slate-600 mt-2">Appreciating asset. Your materials budget quietly builds a long-term crypto position.</p>
                </div>
              </div>

              <p>
                Combined with MoonPay on the receiving end, your entire operation now runs on a <strong className="text-white">parallel financial ecosystem</strong> — one where the legacy banking bottleneck, weekend delays, and inflation drag can't touch you. That's the sovereign operator thesis, fully closed.
              </p>
            </div>
          </section>
        </Reveal>


        {/* ── Gradient divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent mb-14" />


        {/* ═══════ EXECUTIVE SUMMARY SCORECARD ═══════ */}
        <Reveal>
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Executive Summary</h2>
            <p className="text-sm text-slate-500 text-center mb-8">The full picture at a glance.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { value: '$957B', label: 'CRE maturity wall', accent: 'border-red-500/20 text-red-400' },
                { value: '43 days', label: 'Avg payment delay', accent: 'border-amber-500/20 text-amber-400' },
                { value: '−7%', label: 'Purchasing power lost', accent: 'border-red-500/20 text-red-400' },
                { value: '$9,100', label: 'Software cost / employee', accent: 'border-red-500/20 text-red-400' },
                { value: 'Instant', label: 'MoonPay settlement', accent: 'border-emerald-500/20 text-emerald-400' },
                { value: '3%', label: 'Gemini crypto rewards', accent: 'border-violet-500/20 text-violet-400' },
              ].map(({ value, label, accent }) => (
                <div key={label} className={`rounded-xl border ${accent} bg-white/[0.02] p-4 text-center`}>
                  <p className="text-xl sm:text-2xl font-extrabold">{value}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>


        {/* ── Gradient divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent mb-14" />


        {/* ═══════ CONCLUSION ═══════ */}
        <Reveal>
          <section className="mb-16">
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Conclusion</h2>
              <p className="text-base text-slate-300 leading-relaxed">
                The old way of doing business is a liability. Waiting 43 days on overdue invoices, absorbing 7% inflation, paying over $9,100 per employee for heavy software, and sending Word documents will cost you jobs and freeze your cash. <strong className="text-white">SalesCloserPro.ai gives you the blueprint to fix it.</strong> By cutting the software bloat (Zoho/Gmail), locking the front door (Cloudflare), automating your sales pitch, getting paid instantly in digital dollars (MoonPay/USDC), and earning crypto rewards on every outgoing purchase (Gemini), you turn your construction business into a bulletproof operation that global instability and fragile banks cannot touch.
              </p>
            </div>
          </section>
        </Reveal>


        {/* ═══════ REFERENCES ═══════ */}
        <Reveal>
          <section className="mb-16">
            <h2 className="text-lg font-bold text-white mb-6">Verified Data &amp; References</h2>
            <div className="space-y-5">
              {[
                { num: 1, title: 'The Commercial Real Estate Debt Wall', desc: 'In 2025, $957 billion in CRE loans are maturing, nearly triple the 20-year average, causing regional banks to heavily restrict capital.', source: 'The Kaplan Group', url: 'https://www.kaplancollectionagency.com/business-advice/is-commercial-real-estate-at-a-breaking-point-in-2025/' },
                { num: 2, title: 'The Software Inflation Tax', desc: 'SaaS prices have surged 12.2%, outpacing standard inflation by 4.5×, driving the average per-employee software cost to $9,100 annually.', source: 'Vertice', url: 'https://www.softwareseni.com/why-saas-prices-are-rising-4x-faster-than-inflation-and-what-you-can-do-about-it/' },
                { num: 3, title: 'The Death of Net-30 (Payment Delays)', desc: '50% of US invoices are currently overdue, with suppliers waiting an average of 43 days for payment, crippling contractor cash flow.', source: 'The Kaplan Group', url: 'https://www.kaplancollectionagency.com/business-advice/54-statistics-on-the-b2b-payment-delays/' },
              ].map(({ num, title, desc, source, url }) => (
                <div key={num} className="flex gap-4">
                  <span className="text-xs font-bold text-slate-600 mt-0.5 flex-shrink-0">[{num}]</span>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
                    <p className="text-sm text-slate-400 mb-1.5">{desc}</p>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                      {source} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>


        {/* ── Gradient divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent mb-14" />


        {/* ═══════ CTA ═══════ */}
        <Reveal>
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-6">See the tools mentioned in this paper.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/dashboard" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors shadow-xl shadow-blue-600/25">
                <Zap className="w-4 h-4" /> Start Using Now
              </Link>
              <Link to="/services" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-slate-700 hover:border-slate-500 text-white font-semibold rounded-xl transition-colors">
                Custom &amp; Enterprise <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Reveal>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <span>© 2026 SalesCloserPro · Apache-2.0 License</span>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-slate-400 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-slate-400 transition-colors">About</Link>
            <Link to="/services" className="hover:text-slate-400 transition-colors">Services</Link>
            <Link to="/legal" className="hover:text-slate-400 transition-colors">Legal</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
