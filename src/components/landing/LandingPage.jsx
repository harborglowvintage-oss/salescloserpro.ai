/**
 * SalesCloserPro - Landing Page
 * Copyright (c) 2026 Brent Girolimon / llmadvisor.ai
 * Powered by highsignal™
 * Licensed under Apache-2.0
 */

import { Link } from 'react-router-dom'
import {
  FileText,
  Users,
  TrendingUp,
  ShoppingCart,
  Download,
  Github,
  CheckCircle2,
  Lock,
  Zap,
  Coffee,
  BookOpen,
  ArrowRight,
  ChevronRight
} from 'lucide-react'

/* ── tiny step pill ── */
const Step = ({ num, label, accent = '#3b82f6' }) => (
  <div className="flex items-center gap-2.5">
    <span
      className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white flex-shrink-0"
      style={{ background: `radial-gradient(circle at 35% 35%, ${accent}dd, ${accent}88)`, boxShadow: `0 0 12px ${accent}55, 0 2px 4px rgba(0,0,0,0.4)` }}
    >{num}</span>
    <span className="text-sm font-medium text-slate-300">{label}</span>
  </div>
)

/* ── partner card ── */
const PartnerCard = ({ href, logo, alt, bg, title, body, cta, ctaColor = 'text-blue-400', note, rel = 'noopener noreferrer', border = 'border-white/[0.06]', tint = 'bg-white/[0.03]', hoverTint = 'hover:bg-white/[0.06]', glowColor = 'rgba(59,130,246,0.15)' }) => (
  <a
    href={href}
    target="_blank"
    rel={rel}
    className={`group flex flex-col rounded-2xl border ${border} ${tint} ${hoverTint} transition-all duration-300 overflow-hidden`}
    style={{ '--glow': glowColor }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 32px ${glowColor}, 0 8px 24px rgba(0,0,0,0.3)`}
    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
  >
    {/* logo strip */}
    <div className="flex items-center justify-center h-40 p-4">
      <div
        className="relative flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.04]"
        style={{
          width: 280, height: 96,
          borderRadius: 16,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.13)',
          boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.22), inset 0 -1.5px 0 rgba(0,0,0,0.22), inset 1.5px 0 0 rgba(255,255,255,0.07), 0 6px 18px rgba(0,0,0,0.3)'
        }}
      >
        <img src={logo} alt={alt} className="w-full h-full object-contain p-2" />
      </div>
    </div>

    {/* body */}
    <div className="flex flex-col flex-1 p-5 gap-3">
      <h4 className="text-white text-base font-semibold leading-snug">{title}</h4>
      <p className="text-slate-400 text-sm leading-relaxed flex-1">{body}</p>
      <span className={`inline-flex items-center gap-1.5 ${ctaColor} text-sm font-semibold group-hover:gap-2.5 transition-all`}>
        {cta} <ChevronRight className="w-4 h-4" />
      </span>
    </div>

    {/* footer note */}
    {note && <div className="px-5 pb-4 text-[11px] text-slate-500">{note}</div>}
  </a>
)

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 antialiased">

      {/* ───────── NAV ───────── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logos/salescloserprologo.png" alt="SalesCloserPro" className="h-8 w-auto" />
            <span className="text-lg font-bold text-white tracking-tight">salescloserpro.ai</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-400">
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/help" className="hover:text-white transition-colors">Docs</Link>
            <a href="https://github.com/harborglowvintage-oss/salescloserpro.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </nav>

          <Link to="/dashboard" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-blue-600/20">
            Launch App
          </Link>
        </div>
      </header>

      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(56,140,255,0.12),transparent)]" />

        {/* floating 3D keyframes */}
        <style>{`
          @keyframes heroFloat {
            0%, 100% { transform: rotateX(18deg) rotateY(-8deg) translateY(0px); }
            50% { transform: rotateX(14deg) rotateY(-4deg) translateY(-16px); }
          }
        `}</style>

        {/* 3D background logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ perspective: '900px' }}>
          <img
            src="/logos/salescloserprologo.png"
            alt=""
            className="w-[420px] sm:w-[500px] md:w-[580px] opacity-[0.08] mt-16"
            style={{
              animation: 'heroFloat 8s ease-in-out infinite',
              filter: 'drop-shadow(0 60px 100px rgba(56,140,255,0.35)) drop-shadow(0 20px 40px rgba(0,0,0,0.5)) drop-shadow(0 4px 8px rgba(56,140,255,0.2))',
              transformStyle: 'preserve-3d',
            }}
          />
        </div>

        {/* floor reflection */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ perspective: '900px' }}>
          <img
            src="/logos/salescloserprologo.png"
            alt=""
            className="w-[420px] sm:w-[500px] md:w-[580px] opacity-[0.025] mt-16"
            style={{
              animation: 'heroFloat 8s ease-in-out infinite',
              transform: 'rotateX(18deg) rotateY(-8deg) scaleY(-0.4)',
              filter: 'blur(6px)',
              transformStyle: 'preserve-3d',
              maskImage: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)',
            }}
          />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold uppercase tracking-widest text-blue-200 rounded-full" style={{ border: '1px solid rgba(59,130,246,0.35)', background: 'rgba(59,130,246,0.08)', boxShadow: '0 0 20px rgba(59,130,246,0.15), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Free &amp; Open Source — No Account Required
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6">
            Work smarter, not harder.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Close faster.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            Create professional proposals, track every deal in your pipeline, manage clients,
            and export polished PDFs — all from your browser or desktop. Zero cost, zero sign-up.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-base transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" /> Start Using Now
            </Link>
            <a
              href="https://github.com/harborglowvintage-oss/salescloserpro.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 border border-slate-700 hover:border-slate-500 text-white rounded-lg font-semibold text-base transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" /> Download Desktop
            </a>
          </div>
        </div>
      </section>

      {/* ───────── FEATURES ───────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[10px] font-bold uppercase tracking-widest text-emerald-300 rounded-full" style={{ border: '1px solid rgba(52,211,153,0.25)', background: 'rgba(52,211,153,0.07)', boxShadow: '0 0 16px rgba(52,211,153,0.1)' }}>✦ Built for closers</span>
          <h2 className="text-3xl font-bold text-white mb-3">Everything you need to close deals</h2>
          <p className="text-slate-400">No bloat. Just the tools that matter.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: FileText, color: 'text-blue-400 bg-blue-500/10', glow: 'rgba(59,130,246,0.2)', title: 'Quote Builder', desc: 'Line items, taxes, custom branding — export a polished PDF in one click.' },
            { icon: Users, color: 'text-emerald-400 bg-emerald-500/10', glow: 'rgba(52,211,153,0.2)', title: 'Client Manager', desc: 'Contact details, quote history, and deal notes all in one clean view.' },
            { icon: TrendingUp, color: 'text-violet-400 bg-violet-500/10', glow: 'rgba(167,139,250,0.2)', title: 'Pipeline Board', desc: 'Drag-and-drop kanban — move deals from lead to won at a glance.' },
            { icon: ShoppingCart, color: 'text-amber-400 bg-amber-500/10', glow: 'rgba(251,191,36,0.2)', title: 'Purchase Orders', desc: 'Generate POs with vendor details and tracking numbers instantly.' }
          ].map(({ icon: Icon, color, glow, title, desc }) => (
            <div key={title}
              className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 cursor-default"
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 28px ${glow}, 0 4px 16px rgba(0,0,0,0.3)`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${color} transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── WHY SCP ───────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Why choose SalesCloserPro?</h2>
              {[
                { t: 'Free forever', d: 'No hidden fees, no premium tiers, no credit card.' },
                { t: 'Your data stays yours', d: 'Everything lives on your machine — nothing is tracked or uploaded.' },
                { t: 'Runs anywhere', d: 'Browser, Windows, macOS, or Linux desktop app.' },
                { t: 'Open source', d: 'Apache-2.0 licensed — inspect it, fork it, ship it.' }
              ].map(({ t, d }) => (
                <div key={t} className="flex items-start gap-3 mb-5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-semibold">{t}</h4>
                    <p className="text-sm text-slate-400">{d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-slate-900/60 p-8">
              <Lock className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">No account needed</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Click "Launch App" and you're in. No email, no password, no verification steps.
                Start sending quotes in under 60 seconds.
              </p>
              <Link to="/dashboard" className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:gap-3 transition-all">
                Get started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── ABOUT THE BUILDER ───────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0b1120 0%, #0d1a2e 60%, #0a1020 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {/* subtle ambient orb */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full pointer-events-none opacity-10" style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }} />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full pointer-events-none opacity-10" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }} />

          <div className="relative grid lg:grid-cols-[1fr_auto] gap-10 items-center p-8 sm:p-12">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 mb-5 text-[10px] font-bold uppercase tracking-widest text-violet-300 rounded-full" style={{ border: '1px solid rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.08)' }}>
                🔨 Built from the trenches
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-[1.15] mb-5">
                This wasn't built by someone <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">who never had a real deadline.</span>
              </h2>
              <p className="text-slate-300 leading-relaxed text-[15px] mb-4">
                SalesCloserPro was built by someone who's been on job sites, felt the pressure of a last-minute deal falling apart, and knows exactly what it's like to run a business on a shoestring. Not a VC-funded startup. Not a team of developers who've never sent an invoice. Just a real person solving a real problem.
              </p>
              <p className="text-slate-400 leading-relaxed text-[15px] mb-6">
                If you're running an <strong className="text-white">Etsy shop</strong>, selling on <strong className="text-white">Facebook Marketplace</strong>, or turning your <strong className="text-white">side hustle into something serious</strong> — you don't need enterprise software with a monthly fee you can't afford. You need something that works, looks professional, and gets out of your way.
              </p>
              <p className="text-slate-400 leading-relaxed text-[15px] mb-6">
                And here's the edge most of your competition doesn't have yet: <strong className="text-white">integrated crypto and card payments via MoonPay Commerce.</strong> Get paid the moment a client accepts your quote — no bank holds, no 5-day ACH waits, no chargebacks erasing your margin. Have a client in Canada, Europe, or Southeast Asia? They pay in their preferred method. You receive it. Cashflow solved.
              </p>
              <div className="flex flex-wrap gap-3">
                {['$0/month forever', 'No license fees', 'No subscriptions', 'No gatekeeping', 'Crypto payments built in', 'International-ready'].map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-300" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* pull quote */}
            <div className="lg:w-72 flex-shrink-0 flex flex-col items-center text-center p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-5xl mb-3" aria-hidden="true">💼</span>
              <p className="text-white font-bold text-xl leading-snug mb-3">
                "Turn your side hustle into a professional business — overnight."
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Send a quote that looks like it came from a $10M agency. Accept card, Apple Pay, or crypto from clients in 160+ countries. Keep 100% of the profit. Pay nothing.
              </p>
              <div className="mt-5 w-full">
                <Link to="/dashboard" className="block w-full text-center px-5 py-3 rounded-xl text-sm font-bold text-white transition-all" style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', boxShadow: '0 0 20px rgba(124,58,237,0.3)' }}>
                  Start free — right now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── GPT PROMO ───────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <a
          href="https://chatgpt.com/g/g-69930ae1d2748191a9c47556b8ceae82-salescloserpro-ai"
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-2xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #081020 100%)' }}
        >
          {/* border glow */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ padding: '1px', background: 'linear-gradient(135deg, rgba(16,163,127,0.5), rgba(59,130,246,0.2) 50%, rgba(16,163,127,0.3))', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
          {/* orbs */}
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #10a37f, transparent 70%)' }} />
          <div className="absolute -bottom-16 -left-10 w-56 h-56 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }} />

          <div className="relative grid md:grid-cols-2 gap-0 items-center">
            {/* left — mirrors the ChatGPT GPT preview card */}
            <div className="flex flex-col items-center justify-center p-10 gap-4 border-b md:border-b-0 md:border-r border-emerald-500/10">
              {/* collab avatar lockup: SCP × OpenAI */}
              <div className="flex items-center gap-3">
                {/* SCP */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-xl opacity-50 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(16,163,127,0.9), transparent 70%)' }} />
                  <img
                    src="/logos/salescloserprologo.png"
                    alt="SalesCloserPro AI GPT"
                    className="relative w-16 h-16 rounded-full object-cover shadow-2xl ring-2 ring-emerald-400/30"
                  />
                </div>
                {/* separator */}
                <span className="text-slate-500 text-lg font-light select-none">×</span>
                {/* OpenAI */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-xl opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(16,163,127,0.7), transparent 70%)' }} />
                  <div
                    className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl ring-2 ring-emerald-400/20"
                    style={{ background: 'rgba(16,163,127,0.10)', border: '1.5px solid rgba(16,163,127,0.28)' }}
                  >
                    <img
                      src="/logos/chatgpt.svg"
                      alt="OpenAI"
                      className="w-9 h-9"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  </div>
                </div>
              </div>

              {/* name */}
              <p className="text-white font-bold text-lg leading-tight text-center">SalesCloserPro.ai × OpenAI</p>

              {/* model badge — exact copy of ChatGPT UI */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <svg viewBox="0 0 41 41" className="w-3.5 h-3.5 flex-shrink-0" fill="none" style={{ color: '#10a37f' }}>
                  <path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-7.505-3.354 10.079 10.079 0 0 0-9.612 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.504 3.353 10.078 10.078 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813zM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496zM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744zM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012L7.044 23.86a7.504 7.504 0 0 1-2.747-10.24zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .114-.012l8.048 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.647-1.13zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.499v4.993l-4.331 2.5-4.331-2.5V18z" fill="currentColor"/>
                </svg>
                <span className="text-[11px] text-slate-300/80 font-medium">Using the creator's recommended model: <span className="text-white font-semibold">GPT-5.2</span></span>
              </div>

              {/* prompt starter cards — matching ChatGPT GPT interface */}
              <div className="grid grid-cols-2 gap-2 w-full mt-1">
                {[
                  'Write a killer elevator pitch + 3 positioning angles',
                  'Build a deal close plan: stakeholders, risk & timeline',
                  'Turn these CRM notes into a sharp recap email',
                  'Create an objection-handling playbook for: "Too expensive"',
                ].map((prompt) => (
                  <div key={prompt} className="p-2.5 rounded-xl text-[11px] text-slate-300 leading-snug cursor-pointer transition-colors hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {prompt}
                  </div>
                ))}
              </div>
              <p className="text-slate-500 text-[10px] text-center">Free · Requires a ChatGPT account</p>
            </div>

            {/* right */}
            <div className="flex flex-col justify-center p-8 sm:p-10 gap-4">
              <div>
                <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-2">Your AI sales assistant</p>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-[1.1]">
                  Meet the{' '}
                  <span style={{ backgroundImage: 'linear-gradient(90deg, #34d399, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SalesCloserPro AI</span>
                  <br />GPT.
                </h3>
              </div>
              <p className="text-slate-300 leading-relaxed text-[15px]">
                SalesCloserPro.ai helps <strong className="text-white">anyone sell better</strong>. Get instant cold emails, DM scripts, call talk tracks, discovery questions, objection replies, follow-ups, and close plans — tailored to your product and buyer. Privacy-safe placeholders included, plus quick tips on what to say next.
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { icon: '📊', t: 'Cold emails, DMs & call tracks', d: 'Tailored scripts ready in seconds — just describe your deal' },
                  { icon: '🏆', t: 'Close plans that win', d: 'Stakeholder maps, risk flags & timeline pressure baked in' },
                  { icon: '🛡️', t: 'Privacy-safe by design', d: 'Placeholder variables keep sensitive data out of prompts' },
                  { icon: '💡', t: 'App help, instantly', d: 'Ask anything about SalesCloserPro — no docs needed' },
                ].map(({ icon, t, d }) => (
                  <div key={t} className="flex items-start gap-3 p-3 rounded-xl border border-emerald-500/10" style={{ background: 'rgba(16,163,127,0.05)' }}>
                    <span className="text-base leading-none mt-0.5">{icon}</span>
                    <div>
                      <p className="text-white text-sm font-semibold">{t}</p>
                      <p className="text-slate-400 text-xs">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2 mt-1">
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white w-fit transition-all group-hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #10a37f, #0ea5e9)', boxShadow: '0 0 24px rgba(16,163,127,0.35)' }}>
                  Try the GPT — Free →
                </span>
                <span className="text-[11px] text-slate-500 pl-1">Powered by ChatGPT · GPT-5.2 · No Plus subscription needed</span>
              </div>
            </div>
          </div>
        </a>
      </section>

      {/* ───────── PARTNER STACK ───────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[10px] font-bold uppercase tracking-widest text-blue-300 rounded-full" style={{ border: '1px solid rgba(59,130,246,0.25)', background: 'rgba(59,130,246,0.07)', boxShadow: '0 0 16px rgba(59,130,246,0.1)' }}>✦ Partner Stack</span>
          <h2 className="text-3xl font-bold text-white mb-4">Set up your business in 5 steps</h2>
          <p className="text-slate-400 leading-relaxed">
            SalesCloserPro handles your quotes and pipeline. These hand-picked services handle
            everything else — so you can focus on selling, not configuring.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <Step num="1" label="Get a domain" accent="#ef4444" />
          <span className="text-slate-700 hidden sm:block">—</span>
          <Step num="2" label="Protect it" accent="#f97316" />
          <span className="text-slate-700 hidden sm:block">—</span>
          <Step num="3" label="Set up email" accent="#22c55e" />
          <span className="text-slate-700 hidden sm:block">—</span>
          <Step num="4" label="Earn on spend" accent="#f59e0b" />
          <span className="text-slate-700 hidden sm:block">—</span>
          <Step num="5" label="Accept payments" accent="#a855f7" />
        </div>

        {/* ── Bucket 1: Domain & Security (2-up centered) ── */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 text-center">Step 1 &amp; 2 — Your Online Presence</p>
        <div className="grid sm:grid-cols-2 gap-5 mb-8 max-w-2xl mx-auto">
          <PartnerCard
            href="https://namecheap.pxf.io/c/affiliate_id/1632743/5618"
            logo="/logos/namecheap.png"
            alt="Namecheap"
            bg="bg-white"
            border="border-red-500/20"
            tint="bg-red-500/[0.04]"
            hoverTint="hover:bg-red-500/[0.08]"
            ctaColor="text-red-400"
            glowColor="rgba(239,68,68,0.18)"
            title="Don't let your competition own that domain"
            body={<>Securing a domain for your business can feel overwhelming — but Namecheap makes it straightforward. Search, register, and manage your <strong className="text-slate-200">.com in minutes</strong>, with free WhoisGuard privacy included. Your domain is the first thing a buyer sees before a proposal is even opened. <strong className="text-red-300">If you don't claim it, someone else will.</strong> Don't hand your competitors that first click.</>}
            cta="Grab your domain now"
            rel="noopener noreferrer sponsored"
          />
          <PartnerCard
            href="https://dash.cloudflare.com/sign-up"
            logo="/logos/cloudflare.png"
            alt="Cloudflare"
            bg="bg-white"
            border="border-orange-400/20"
            tint="bg-orange-400/[0.04]"
            hoverTint="hover:bg-orange-400/[0.08]"
            ctaColor="text-orange-400"
            glowColor="rgba(251,146,60,0.18)"
            title="The internet's security layer — free"
            body={<>Cloudflare protects <strong className="text-orange-300">~20% of all web traffic</strong> — including major banks and Fortune 500s. Their San Francisco HQ literally uses a wall of <strong className="text-orange-300">lava lamps</strong> to generate unpredictable encryption keys (yes, really). Add free SSL, industry-standard 1.1.1.1 DNS, global CDN, and DDoS protection to your site in under 5 minutes.</>}
            cta="Enable free protection"
            note="Free plan covers most small businesses"
          />
        </div>

        {/* ── Bucket 3: Email (2-up centered) ── */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 text-center">Step 3 — Professional Email</p>
        <div className="grid sm:grid-cols-2 gap-5 mb-8 max-w-2xl mx-auto">
          <PartnerCard
            href="https://go.zoho.com/x7Vq"
            logo="/logos/zohologo.jpg"
            alt="Zoho Mail"
            bg="bg-white"
            border="border-emerald-500/20"
            tint="bg-emerald-500/[0.04]"
            hoverTint="hover:bg-emerald-500/[0.08]"
            ctaColor="text-emerald-400"
            glowColor="rgba(34,197,94,0.18)"
            title="Professional email for $1/month"
            body={<>Get <strong className="text-slate-200">you@yourdomain.com</strong> so every quote you send looks the part. Zoho Mail is <strong className="text-slate-200">secure, ad-free, and built for privacy</strong> — no scanning your inbox to sell you ads. Includes shared calendars, tasks, and built-in collaboration tools. To connect your custom domain you'll need the <strong className="text-emerald-300">Mail Lite plan at $1/user/month</strong> — making it the <strong className="text-emerald-300">absolute best alternative to Gmail or Outlook</strong> for any business that values privacy over price.</>}
            cta="Start for $1/mo"
            rel="noopener noreferrer sponsored"
          />
          <PartnerCard
            href="https://workspace.google.com/intl/en/pricing"
            logo="/logos/google-workspace.png"
            alt="Google Workspace"
            bg="bg-white"
            border="border-blue-500/20"
            tint="bg-blue-500/[0.04]"
            hoverTint="hover:bg-blue-500/[0.08]"
            ctaColor="text-blue-400"
            glowColor="rgba(59,130,246,0.18)"
            title="The easiest way to run your business on one login"
            body={<>Google Workspace is the closest thing to a universal business OS. <strong className="text-slate-200">Gmail, Drive, Docs, Meet, Calendar, Sheets — and Gemini AI built in.</strong> Everything synced across every device and teammate. Send quotes from your pro email, collaborate on proposals in real time, and let Gemini draft, summarize, and answer for you. Plans start at <strong className="text-blue-300">$7–$14/user/month</strong> — less than a lunch tab.</>}
            cta="Compare plans"
            note="Billed directly by Google"
          />
        </div>

        {/* ── Bucket 2: Payments & Earnings ── */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 text-center">Steps 4 &amp; 5 — Get Paid &amp; Earn on Spend</p>
        <div className="grid md:grid-cols-5 gap-5 mb-8 items-stretch">

          {/* MoonPay — spans 3 cols */}
          <a
            href="https://commerce.moonpay.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group md:col-span-3 block rounded-2xl overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #0f0520 40%, #130a28 100%)' }}
          >
            <div className="absolute inset-0 rounded-2xl" style={{ padding: '1px', background: 'linear-gradient(135deg, rgba(168,85,247,0.6), rgba(99,102,241,0.2) 50%, rgba(168,85,247,0.4))', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
            <div className="absolute -top-24 -left-16 w-80 h-80 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #a855f7, transparent 70%)' }} />
            <div className="absolute -bottom-20 right-10 w-64 h-64 rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(168,85,247,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="relative flex flex-col justify-between h-full p-8 gap-6">
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 rounded-2xl blur-xl opacity-60" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.6), transparent 70%)' }} />
                  <div
                    className="relative flex items-center justify-center overflow-hidden"
                    style={{
                      width: 280, height: 96,
                      borderRadius: 16,
                      background: 'rgba(168,85,247,0.1)',
                      border: '1px solid rgba(168,85,247,0.28)',
                      boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.22), inset 0 -1.5px 0 rgba(0,0,0,0.25), inset 1.5px 0 0 rgba(255,255,255,0.08), 0 6px 20px rgba(168,85,247,0.25)'
                    }}
                  >
                    <img src="/logos/moonpay.png" alt="MoonPay" className="w-full h-full object-contain p-2" />
                  </div>
                </div>
                <div>
                  <span className="inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-purple-200 border border-purple-400/30 rounded-full mb-2" style={{ background: 'rgba(168,85,247,0.15)' }}>✦ Now: MoonPay Commerce</span>
                  <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest">Trusted by Shopify · Ledger · Fortune Media</p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white leading-snug mb-3">
                  Get paid faster than your competition<br />
                  <span style={{ backgroundImage: 'linear-gradient(90deg, #c084fc, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>— from anywhere in the world.</span>
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">
                  Cashflow is survival. MoonPay Commerce lets your clients pay by card, Apple Pay, bank transfer, or 100+ cryptos the moment you send a quote.
                  <strong className="text-white"> No chargebacks. No banks holding your money. No 5-day ACH delays.</strong> Funds settle fast — auto-convert to USD or EUR anytime. Most of your competitors aren't offering this yet. You will be.
                </p>
                <p className="text-slate-400 text-xs leading-relaxed mb-3">
                  International client in Japan? Freelancer in Brazil? Contractor in the EU? They pay in their preferred method. You receive instantly. No foreign transaction drama.
                </p>
                <div className="grid grid-cols-2 gap-1.5 mb-4 text-xs text-slate-300">
                  {[
                    { icon: '⚡', text: 'Fast settlement — no delays' },
                    { icon: '🔒', text: 'Zero chargebacks for you' },
                    { icon: '🌍', text: '160+ countries · any currency' },
                    { icon: '🏢', text: '6,000+ merchants already live' },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-purple-400/15" style={{ background: 'rgba(168,85,247,0.07)' }}>
                      <span>{icon}</span><span>{text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {['USDC', 'USDT', 'ETH', 'SOL', 'BTC', '+ more'].map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-full text-xs text-purple-200 font-medium border border-purple-400/20" style={{ background: 'rgba(168,85,247,0.1)' }}>{s}</span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all group-hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #9333ea, #6366f1)', boxShadow: '0 0 20px rgba(147,51,234,0.4)' }}>
                  Start with MoonPay Commerce →
                </span>
              </div>
            </div>
          </a>

          {/* Gemini — spans 2 cols */}
          <a
            href="https://creditcard.exchange.gemini.com/credit-card/apply?referral_code=44qnv2qrx"
            target="_blank"
            rel="noopener noreferrer"
            className="group md:col-span-2 block rounded-2xl overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, #1c1200 0%, #2a1a00 50%, #1c1200 100%)' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 36px rgba(217,119,6,0.25), 0 8px 24px rgba(0,0,0,0.4)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div className="absolute inset-0 rounded-2xl" style={{ padding: '1px', background: 'linear-gradient(135deg, rgba(217,119,6,0.5), rgba(251,191,36,0.15) 50%, rgba(217,119,6,0.35))', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
            <div className="absolute -top-16 -right-12 w-56 h-56 rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #f59e0b, transparent 70%)' }} />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(251,191,36,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="relative flex flex-col h-full p-6 gap-5">

              {/* ── header: logo + label ── */}
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 rounded-2xl blur-lg opacity-60 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.9), transparent 70%)' }} />
                  <div className="relative flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.05]"
                    style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.4)', boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.2), 0 4px 16px rgba(217,119,6,0.3)' }}>
                    <img src="/logos/gemini.png" alt="Gemini" className="w-full h-full object-contain p-1.5" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 leading-none mb-1">Gemini Credit Card®</p>
                  <p className="text-[11px] text-slate-400">Issued by WebBank · No annual fee</p>
                </div>
              </div>

              {/* ── headline ── */}
              <div>
                <h3 className="text-2xl font-extrabold text-white leading-tight">
                  Earn crypto back on<br />
                  <span style={{ backgroundImage: 'linear-gradient(90deg, #fbbf24, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>every purchase.</span>
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mt-2">
                  Put business spend on the <strong className="text-slate-200">Gemini Mastercard®</strong> and earn crypto automatically — in BTC, ETH, SOL, XRP or more.
                </p>
              </div>

              {/* ── reward 2×2 grid ── */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { cat: 'Gas, EV & Transit', pct: '4%' },
                  { cat: 'Dining',            pct: '3%' },
                  { cat: 'Groceries',         pct: '2%' },
                  { cat: 'Everything else',   pct: '1%' },
                ].map(({ cat, pct }) => (
                  <div key={cat} className="flex flex-col items-start p-3 rounded-xl"
                    style={{ background: 'rgba(217,119,6,0.09)', border: '1px solid rgba(217,119,6,0.2)' }}>
                    <span className="text-2xl font-black text-amber-300 leading-none tabular-nums">{pct}</span>
                    <span className="text-[11px] text-slate-400 mt-1 leading-snug">{cat}</span>
                  </div>
                ))}
              </div>

              {/* ── badges ── */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'No Annual Fee',         cls: 'bg-emerald-900/50 text-emerald-300 border-emerald-800/60' },
                  { label: 'Mastercard®',            cls: 'bg-slate-800/70 text-slate-300 border-slate-600/50' },
                  { label: 'BTC · ETH · SOL · XRP', cls: 'bg-amber-900/40 text-amber-300 border-amber-800/40' },
                ].map(b => (
                  <span key={b.label} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${b.cls}`}>{b.label}</span>
                ))}
              </div>

              {/* ── CTA pinned to bottom ── */}
              <div className="mt-auto">
                <span className="flex items-center justify-center w-full py-3 rounded-xl font-bold text-sm text-amber-950 transition-all group-hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', boxShadow: '0 0 24px rgba(251,191,36,0.3)' }}>
                  Apply for the card →
                </span>
                <p className="text-[10px] text-slate-500 mt-2 text-center">Referral · subject to Gemini approval</p>
              </div>

            </div>
          </a>
        </div>



        {/* buy me a coffee — last */}
        <div className="max-w-lg mx-auto mt-14">
          <a
            href="https://buymeacoffee.com/llmadvisor.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center text-center rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] hover:bg-amber-400/[0.08] transition-all p-8 gap-4"
          >
            <div
              className="flex items-center justify-center overflow-hidden"
              style={{
                width: 300, height: 100,
                borderRadius: 16,
                background: 'rgba(251,191,36,0.08)',
                border: '1px solid rgba(251,191,36,0.22)',
                boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.2), inset 0 -1.5px 0 rgba(0,0,0,0.2), inset 1.5px 0 0 rgba(255,255,255,0.07), 0 6px 18px rgba(251,191,36,0.15)'
              }}
            >
              <img src="/logos/buymeacoffee.png" alt="Buy Me a Coffee" className="w-full h-full object-contain p-3" />
            </div>
            <h4 className="text-xl font-bold text-white">Enjoying SalesCloserPro?</h4>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              This app is built and maintained by one developer. If it saved you time or helped you land a deal,
              a coffee keeps the updates coming.
            </p>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-lg font-semibold text-sm transition-colors shadow">
              <Coffee className="w-4 h-4" /> Buy a Coffee
            </span>
            <span className="text-[11px] text-slate-500">llmadvisor.ai · powered by highsignal™</span>
          </a>
        </div>
      </section>

      {/* ───────── ABOUT TEASER ───────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
          <BookOpen className="w-10 h-10 text-blue-400 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">New here? Read the guide.</h3>
            <p className="text-slate-400 text-sm">
              Step-by-step walkthrough for first-time users — from creating your first quote to
              setting up your company branding and exporting invoices.
            </p>
          </div>
          <Link to="/about" className="px-5 py-2.5 bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white rounded-lg font-semibold text-sm transition-colors whitespace-nowrap">
            Read the Guide →
          </Link>
        </div>
      </section>

      {/* ───────── SPONSOR STRIP ───────── */}
      <section className="border-t border-white/[0.06] border-b border-b-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400 text-center sm:text-left">
            <span className="text-white font-semibold">Sponsorships welcome.</span>{' '}
            salescloserpro.ai and its affiliated properties serve{' '}
            <span className="text-white font-medium">hundreds of unique visitors daily</span> and log{' '}
            <span className="text-white font-medium">thousands of installs weekly</span> — small business owners, contractors, and sales professionals.
            Your logo. Your brand. Their screen.
          </p>
          <a
            href="mailto:sponsor@salescloserpro.ai"
            className="flex-shrink-0 px-5 py-2.5 rounded-lg border border-indigo-500/50 hover:border-indigo-400 hover:bg-indigo-500/10 text-indigo-300 hover:text-indigo-200 text-sm font-semibold transition-all whitespace-nowrap"
          >
            Inquire about sponsorship →
          </a>
        </div>
      </section>

      {/* ───────── CLOSING VISUAL ───────── */}
      <div className="relative overflow-hidden" aria-hidden="true">
        {/* Contract + pen SVG — subtle, angled, bottom-right */}
        <svg
          viewBox="0 0 900 520"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 right-0 w-[640px] max-w-[72vw] opacity-[0.045] pointer-events-none select-none"
          style={{ transform: 'translate(8%, 12%) rotate(-11deg)', transformOrigin: 'bottom right' }}
        >
          {/* Paper sheet */}
          <rect x="120" y="40" width="560" height="420" rx="6" fill="none" stroke="white" strokeWidth="2" />
          {/* Top fold corner */}
          <path d="M600 40 L640 80 L600 80 Z" fill="none" stroke="white" strokeWidth="1.5" />
          <line x1="600" y1="40" x2="600" y2="80" stroke="white" strokeWidth="1" />
          <line x1="600" y1="80" x2="640" y2="80" stroke="white" strokeWidth="1" />
          {/* Document text lines */}
          {[110, 140, 168, 196, 224, 252, 280, 308].map((y, i) => (
            <line key={i} x1="168" y1={y} x2={i % 3 === 2 ? 540 : 624} y2={y} stroke="white" strokeWidth="1.2" strokeLinecap="round" />
          ))}
          {/* Section divider */}
          <line x1="168" y1="335" x2="624" y2="335" stroke="white" strokeWidth="0.8" strokeDasharray="4 4" />
          {/* Signature label */}
          <rect x="168" y="355" width="140" height="1.5" rx="1" fill="white" />
          <rect x="360" y="355" width="140" height="1.5" rx="1" fill="white" />
          {/* Signature scribble */}
          <path d="M170 350 C185 338, 195 362, 210 348 C222 336, 228 355, 245 345 C258 336, 262 352, 272 348" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          {/* Date line */}
          <rect x="168" y="400" width="100" height="1" rx="0.5" fill="white" />

          {/* Sleek pen — diagonal, resting across sheet */}
          {/* Pen barrel */}
          <rect x="480" y="280" width="320" height="18" rx="9" fill="none" stroke="white" strokeWidth="2"
            transform="rotate(-28 480 280)" />
          {/* Pen clip */}
          <path d="M492 278 L488 250 L496 252 Z" fill="none" stroke="white" strokeWidth="1.2"
            transform="rotate(-28 480 280)" />
          {/* Pen grip section */}
          <rect x="480" y="280" width="48" height="18" rx="4" fill="none" stroke="white" strokeWidth="1.5"
            transform="rotate(-28 480 280)" />
          {/* Nib */}
          <path d="M476 283 L462 292 L478 298 Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round"
            transform="rotate(-28 480 280)" />
          {/* Ink dot */}
          <circle cx="461" cy="292" r="2.5" fill="white" opacity="0.6"
            transform="rotate(-28 480 280)" />
        </svg>
      </div>

      {/* ───────── FOOTER ───────── */}
      <footer className="border-t border-white/[0.06] mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid sm:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/logos/salescloserprologo.png" alt="" className="h-8 w-auto" />
                <span className="font-bold text-white">salescloserpro.ai</span>
              </div>
              <p className="text-sm text-slate-500">Free, open-source sales quoting and CRM for professionals who value privacy.</p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-3 text-sm">Links</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="https://github.com/harborglowvintage-oss/salescloserpro.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About &amp; Guide</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">In-App Docs</Link></li>
                <li><a href="https://github.com/harborglowvintage-oss/salescloserpro.ai/issues" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Report a Bug</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-3 text-sm">Legal</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/legal" className="hover:text-white transition-colors">Terms of Use</Link></li>
                <li><Link to="/legal#privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/legal#affiliate" className="hover:text-white transition-colors">Affiliate Disclosure</Link></li>
                <li><Link to="/legal#ai" className="hover:text-white transition-colors">AI Disclosure</Link></li>
                <li><Link to="/legal#payments" className="hover:text-white transition-colors">Payments &amp; Crypto</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-3 text-sm">Built by</h5>
              <p className="text-sm text-slate-400">
                <a href="https://llmadvisor.ai" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">llmadvisor.ai</a>
              </p>
              <p className="text-sm text-slate-500 mt-1">Powered by highsignal™</p>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <span>© 2026 SalesCloserPro · Apache-2.0 License</span>
            <Link to="/legal" className="hover:text-slate-300 transition-colors underline underline-offset-2">Legal &amp; Compliance Policies</Link>
          </div>

        </div>
      </footer>
    </div>
  )
}
