/**
 * SalesCloserPro - Landing Page
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 */

import { Link } from 'react-router-dom'
import {
  FileText,
  Users,
  TrendingUp,
  ShoppingCart,
  Github,
  CheckCircle2,
  Lock,
  Zap,
  BookOpen,
  ArrowRight
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 antialiased pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">

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
            <Link to="/services" className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 transition-colors text-xs font-semibold tracking-wide">✦ Custom</Link>
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
            The Free CRM. No gimmicks.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Send a professional quote or PO in minutes.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            Create professional proposals, track every deal in your pipeline, manage clients,
            and export polished PDFs — all from your browser. Zero cost, zero sign-up.
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
              <Github className="w-5 h-5" /> View on GitHub
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
            { icon: Users, color: 'text-emerald-400 bg-emerald-500/10', glow: 'rgba(52,211,153,0.2)', title: 'Client Manager', desc: 'Contact details, addresses, and private notes for every client in one clean view.' },
            { icon: TrendingUp, color: 'text-violet-400 bg-violet-500/10', glow: 'rgba(167,139,250,0.2)', title: 'Pipeline Board', desc: 'Kanban board — every saved quote becomes a deal you move from lead to won.' },
            { icon: ShoppingCart, color: 'text-amber-400 bg-amber-500/10', glow: 'rgba(251,191,36,0.2)', title: 'Purchase Orders', desc: 'Issue vendor POs with ship-to details and track margin against each quote line.' }
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
                { t: 'Runs anywhere', d: 'Works in any modern browser — Windows, macOS, Linux, or Chromebook.' },
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
                salescloserpro.ai was built by someone who's been on job sites, felt the pressure of a last-minute deal falling apart, and knows exactly what it's like to run a business on a shoestring. Not a VC-funded startup. Not a team of developers who've never sent an invoice. Just a real person solving a real problem.
              </p>
              <p className="text-slate-400 leading-relaxed text-[15px] mb-6">
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
              <p className="text-white font-bold text-xl leading-snug mb-3">
                "Turn your side hustle into a professional business — overnight."
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Send a quote that looks like it came from a $10M agency. Track every deal from lead to closed. Keep 100% of the profit. Pay nothing.
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

      {/* ───────── ABOUT TEASER ───────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
          <BookOpen className="w-10 h-10 text-blue-400 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">New here? Read the guide.</h3>
            <p className="text-slate-400 text-sm">
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
                <img src="/logos/salescloserprologo.png" alt="" className="h-8 w-auto" />
                <span className="font-bold text-white text-base">salescloserpro.ai</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">Free, open-source sales quoting and CRM for professionals who value privacy.</p>
            </div>
            <div className="text-sm text-slate-500 sm:text-right">
              <p>Built by <a href="https://llmadvisor.ai" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">llmadvisor.ai</a></p>
            </div>
          </div>

          {/* Links row */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-8 mb-10">
            <div>
              <h5 className="text-white font-semibold mb-3 text-xs uppercase tracking-widest">Links</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="https://github.com/harborglowvintage-oss/salescloserpro.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About &amp; Guide</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">In-App Docs</Link></li>
                <li><a href="https://github.com/harborglowvintage-oss/salescloserpro.ai/issues" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Report a Bug</a></li>
                <li><Link to="/services" className="text-amber-400 hover:text-amber-300 transition-colors">✦ Custom &amp; Enterprise</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-3 text-xs uppercase tracking-widest">Legal</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/legal" className="hover:text-white transition-colors">Terms of Use</Link></li>
                <li><Link to="/legal#privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/legal#ai" className="hover:text-white transition-colors">AI Disclosure</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/[0.06] pt-6 text-center text-xs text-slate-600">
            © 2026 SalesCloserPro.ai · LLMadvisor ai LLC · Apache-2.0
          </div>

        </div>
      </footer>
    </div>
  )
}
