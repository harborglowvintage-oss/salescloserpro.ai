/**
 * SalesCloserPro - Email Gate
 * Copyright (c) 2026 Brent Girolimon / llmadvisor.ai
 * Powered by highsignal™
 * Licensed under Apache-2.0
 *
 * Gates internal app routes behind a simple email capture.
 * Marketing / landing pages remain public.
 * Email is persisted in localStorage — no backend required.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Mail, ArrowRight, Shield, Zap, Lock, CheckCircle2,
  FileText, Users, TrendingUp, ShoppingCart
} from 'lucide-react'

const STORAGE_KEY = 'scp_gate_email'

/* ── tiny feature pill ── */
const Feature = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 text-sm text-slate-300">
    <Icon size={15} className="text-blue-400 flex-shrink-0" />
    <span>{label}</span>
  </div>
)

export function getGatedEmail() {
  try {
    return localStorage.getItem(STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

export function clearGatedEmail() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export default function EmailGate({ children }) {
  const [email, setEmail] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Check localStorage on mount
  useEffect(() => {
    const stored = getGatedEmail()
    if (stored) setEmail(stored)
  }, [])

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const trimmed = inputValue.trim().toLowerCase()

    if (!trimmed) {
      setError('Please enter your email address.')
      return
    }
    if (!isValidEmail(trimmed)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)

    // Simulate a brief delay for polish, then persist
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, trimmed)
      } catch {
        // localStorage full — still allow access
      }
      setEmail(trimmed)
      setLoading(false)
    }, 400)
  }

  // ── Already authenticated — render app ──
  if (email) return children

  // ── Gate screen ──
  return (
    <div className="relative min-h-screen bg-[#0a0e1a] flex flex-col overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(56,140,255,0.12),transparent)]" />

      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: rotateX(10deg) rotateY(-3deg) translateY(0px); }
          50% { transform: rotateX(8deg) rotateY(-2deg) translateY(-16px); }
        }
      `}</style>

      <div className="absolute inset-0 flex items-start justify-center pt-14 sm:pt-16 pointer-events-none select-none" style={{ perspective: '900px' }}>
        <img
          src="/logos/salescloserprologo.png"
          alt=""
          className="w-[420px] sm:w-[500px] md:w-[580px] opacity-[0.08]"
          style={{
            animation: 'heroFloat 8s ease-in-out infinite',
            filter: 'drop-shadow(0 60px 100px rgba(56,140,255,0.35)) drop-shadow(0 20px 40px rgba(0,0,0,0.5)) drop-shadow(0 4px 8px rgba(56,140,255,0.2))',
            transformStyle: 'preserve-3d',
          }}
        />
      </div>

      <div className="absolute inset-0 flex items-start justify-center pt-20 sm:pt-24 pointer-events-none select-none" style={{ perspective: '900px' }}>
        <img
          src="/logos/salescloserprologo.png"
          alt=""
          className="w-[420px] sm:w-[500px] md:w-[580px] opacity-[0.025]"
          style={{
            animation: 'heroFloat 8s ease-in-out infinite',
            transform: 'rotateX(10deg) rotateY(-3deg) scaleY(-0.35)',
            filter: 'none',
            transformStyle: 'preserve-3d',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)',
          }}
        />
      </div>

      {/* Top nav bar */}
      <nav className="relative z-10 w-full border-b border-white/[0.06] bg-[#0a0e1a]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/logos/salescloserprologo.png"
              alt="SalesCloserPro"
              className="h-8 w-auto"
            />
            <span className="text-lg font-bold text-white tracking-tight">salescloserpro.ai</span>
          </Link>
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Card */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-8 sm:p-10 shadow-2xl">
            {/* Icon */}
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-6 mx-auto">
              <Lock size={24} className="text-blue-400" />
            </div>

            {/* Header */}
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-2">
              Enter Your Email to Start
            </h1>
            <p className="text-center text-slate-400 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
              Get full access to the SalesCloserPro app — quote builder, pipeline tracker,
              client management, and more. Free to use, no credit card required.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="gate-email" className="sr-only">Email address</label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                  />
                  <input
                    id="gate-email"
                    type="email"
                    value={inputValue}
                    onChange={(e) => { setInputValue(e.target.value); setError('') }}
                    placeholder="you@company.com"
                    autoFocus
                    autoComplete="email"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.06] border text-white placeholder:text-slate-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all ${
                      error ? 'border-red-500/50' : 'border-white/[0.1] hover:border-white/[0.15]'
                    }`}
                  />
                </div>
                {error && (
                  <p className="text-red-400 text-xs mt-1.5 pl-1">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-wait shadow-lg shadow-blue-600/20"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Activating…
                  </span>
                ) : (
                  <>
                    Launch App <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Shield size={12} /> No spam
              </span>
              <span className="flex items-center gap-1">
                <Zap size={12} /> Instant access
              </span>
              <span className="flex items-center gap-1">
                <Lock size={12} /> 100% free
              </span>
            </div>
          </div>

          {/* What you get */}
          <div className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">What you'll unlock</p>
            <div className="grid grid-cols-2 gap-3">
              <Feature icon={FileText} label="Quote Builder" />
              <Feature icon={Users} label="Client CRM" />
              <Feature icon={TrendingUp} label="Sales Pipeline" />
              <Feature icon={ShoppingCart} label="Purchase Orders" />
              <Feature icon={CheckCircle2} label="PDF Export" />
              <Feature icon={Shield} label="Local-first Data" />
            </div>
          </div>

          {/* Fine print */}
          <p className="text-center text-[11px] text-slate-600 mt-6 leading-relaxed">
            By continuing, you agree to our{' '}
            <Link to="/legal" className="text-slate-400 hover:text-white transition-colors underline underline-offset-2">
              Terms & Privacy Policy
            </Link>
            . Your data stays in your browser — we never share or sell your information.
          </p>
        </div>
      </div>

      {/* Affiliate Offers — full-width categorized card grid */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 mt-12">
        <div className="border-t border-white/[0.06] pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
              <span className="text-xs font-bold text-white uppercase tracking-widest">Affiliate Offers</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-white/[0.05] rounded-full px-3 py-1 border border-white/[0.08] ring-1 ring-blue-400/30 shadow-[0_0_12px_rgba(59,130,246,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block flex-shrink-0" />
                We earn a commission when you shop through the links below &middot; <Link to="/legal" className="ml-1 text-blue-400 hover:text-blue-300 transition-colors">Full disclosure →</Link>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {/* EDUCATION */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-amber-500 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-amber-400 mb-2">🎓 Education</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.jdoqocy.com/click-101696721-17262416" target="_blank" rel="sponsored nofollow noopener" title="EWA" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Ewa-23803634.png" alt="EWA" className="max-h-6 w-auto" /></a>
                </div>
              </div>

              {/* FOOD & HEALTH */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-emerald-500 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-emerald-400 mb-2">🌿 Food &amp; Health</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.dpbolvw.net/click-101696721-13443788" target="_blank" rel="sponsored nofollow noopener" title="Peet's Coffee" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Peets-Coffee-13426123.jpeg" alt="Peet's Coffee" className="max-h-6 w-auto" /></a>
                  <a href="https://www.tkqlhce.com/click-101696721-15712042" target="_blank" rel="sponsored nofollow noopener" title="M&M's" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/M&Ms-15075557.jpeg" alt="M&M's" className="max-h-6 w-auto" /></a>
                  <a href="https://www.tkqlhce.com/click-101696721-17254505" target="_blank" rel="sponsored nofollow noopener" title="VitalHeal" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Vital-Health-23801187.png" alt="VitalHeal" className="max-h-6 w-auto" /></a>
                  <a href="https://www.dpbolvw.net/click-101696721-17110018" target="_blank" rel="sponsored nofollow noopener" title="Blackout Coffee" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/blackoutcoffee.png" alt="Blackout Coffee" className="max-h-6 w-auto" /></a>
                  <a href="https://www.awin1.com/cread.php?awinmid=124484&awinaffid=2848879&ued=https%3A%2F%2Fsurvive-x.com%2F" target="_blank" rel="sponsored nofollow noopener" title="Survive X" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/surviveXlogo.webp" alt="Survive X" className="max-h-5 w-auto" /></a>
                </div>
              </div>

              {/* GAMING */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-pink-500 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-pink-400 mb-2">🎮 Gaming</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.kqzyfj.com/click-101696721-10448329" target="_blank" rel="sponsored nofollow noopener" title="GameFly" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Gamefly-logo-10495782.png" alt="GameFly" className="max-h-6 w-auto" /></a>
                  <a href="https://www.tkqlhce.com/click-101696721-17235980" target="_blank" rel="sponsored nofollow noopener" title="GearUP" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Gearup-23735360.png" alt="GearUP" className="max-h-6 w-auto" /></a>
                </div>
              </div>

              {/* HOME FURNISHINGS & AUDIO */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-orange-500 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-orange-400 mb-2">🏠 Home Furnishings &amp; Audio</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.awin1.com/cread.php?awinmid=119863&awinaffid=2848879&ued=https%3A%2F%2Fjoydeco.com%2F" target="_blank" rel="sponsored nofollow noopener" title="Joydeco" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/joydecologo.webp" alt="Joydeco" className="max-h-5 w-auto" /></a>
                  <a href="https://www.jdoqocy.com/click-101696721-15826779" target="_blank" rel="sponsored nofollow noopener" title="Skutchi Designs" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Skutchi-Designs-20918025.jpeg" alt="Skutchi Designs" className="max-h-6 w-auto" /></a>
                  <a href="https://www.awin1.com/cread.php?awinmid=83073&awinaffid=2848879&ued=https%3A%2F%2Fsleepez.com%2F" target="_blank" rel="sponsored nofollow noopener" title="SleepEZ" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/sleepezUSAlogo-83073.png" alt="SleepEZ" className="max-h-6 w-auto" /></a>
                  <a href="https://www.jdoqocy.com/click-101696721-15919841" target="_blank" rel="sponsored nofollow noopener" title="TEAC" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Teac--21087655.png" alt="TEAC" className="max-h-6 w-auto" /></a>
                </div>
              </div>

              {/* OFFICE & WORKSPACE */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-amber-600 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-amber-500 mb-2">💼 Office &amp; Workspace</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.dpbolvw.net/click-101696721-15600474" target="_blank" rel="sponsored nofollow noopener" title="Arka" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/arkalogo.png" alt="Arka" className="max-h-6 w-auto" /></a>
                  <a href="https://www.awin1.com/cread.php?awinmid=91359&awinaffid=2848879&ued=https%3A%2F%2Fwww.giftcards.ca%2F" target="_blank" rel="sponsored nofollow noopener" title="Giftcards.ca" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/giftcardscalogo.webp" alt="Giftcards.ca" className="max-h-8 w-auto" /></a>
                </div>
              </div>

              {/* PERSONAL ACCESSORIES */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-cyan-500 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-cyan-400 mb-2">✦ Personal Accessories</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.dpbolvw.net/click-101696721-15153860" target="_blank" rel="sponsored nofollow noopener" title="Oakley" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Oakley-10375170.jpeg" alt="Oakley" className="max-h-6 w-auto" /></a>
                  <a href="https://www.awin1.com/cread.php?awinmid=109230&awinaffid=2848879&ued=https%3A%2F%2Ftsarbomba.com%2Fcollections%2Fpre-sale-collection" target="_blank" rel="sponsored nofollow noopener" title="Tsar Bomba" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Tsarbomba-109230.png" alt="Tsar Bomba" className="max-h-6 w-auto" /></a>
                </div>
              </div>

              {/* PETS */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-yellow-500 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-yellow-400 mb-2">🐾 Pets</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.jdoqocy.com/click-101696721-17234935" target="_blank" rel="sponsored nofollow noopener" title="Raw Paws Pet Food" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Raw-Paws-Petfoods-15878721.jpeg" alt="Raw Paws Pet Food" className="max-h-6 w-auto" /></a>
                  <a href="https://www.awin1.com/cread.php?awinmid=79708&awinaffid=2848879&ued=https%3A%2F%2Fjugbow.com%2F" target="_blank" rel="sponsored nofollow noopener" title="Jugbow" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Jugbow-79708.png" alt="Jugbow" className="max-h-6 w-auto" /></a>
                </div>
              </div>

              {/* SECURITY & PRIVACY */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-green-500 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-green-400 mb-2">🔒 Security &amp; Privacy</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.jdoqocy.com/click-101696721-15740556" target="_blank" rel="sponsored nofollow noopener" title="Surfshark" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Surfshark-20148897.jpeg" alt="Surfshark" className="max-h-6 w-auto" /></a>
                  <a href="https://www.anrdoezrs.net/click-101696721-17124588" target="_blank" rel="sponsored nofollow noopener" title="AdBlocker Ultimate" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Adblocker-17124591.jpeg" alt="AdBlocker Ultimate" className="max-h-6 w-auto" /></a>
                  <a href="https://www.jdoqocy.com/click-101696721-15178612" target="_blank" rel="sponsored nofollow noopener" title="Carbonite" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Carbonite-logo-15554902.png" alt="Carbonite" className="max-h-6 w-auto" /></a>
                </div>
              </div>

              {/* SOFTWARE & AI */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-blue-500 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-blue-400 mb-2">💻 Software &amp; AI</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.dpbolvw.net/click-101696721-17222070" target="_blank" rel="sponsored nofollow noopener" title="DomoAI" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/DomoAi-17163300.png" alt="DomoAI" className="max-h-6 w-auto" /></a>
                  <a href="https://www.jdoqocy.com/click-101696721-17258377" target="_blank" rel="sponsored nofollow noopener" title="FM Software" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/FMSoftwarelogo.png" alt="FM Software" className="max-h-6 w-auto" /></a>
                  <a href="https://www.jdoqocy.com/click-101696721-17250447" target="_blank" rel="sponsored nofollow noopener" title="QuickBooks" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Intuit-Quickbooks-15647418.png" alt="QuickBooks" className="max-h-6 w-auto" /></a>
                  <a href="https://www.tkqlhce.com/click-101696721-17163276" target="_blank" rel="sponsored nofollow noopener" title="Epidemic Sound" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/epidemic-sound-20089917.png" alt="Epidemic Sound" className="max-h-6 w-auto" /></a>
                  <a href="https://www.awin1.com/cread.php?awinmid=123996&awinaffid=2848879&ued=https%3A%2F%2Fwww.digitalocean.com%2F" target="_blank" rel="sponsored nofollow noopener" title="DigitalOcean" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/digitaloceanlogo.png" alt="DigitalOcean" className="max-h-5 w-auto" /></a>
                </div>
              </div>

              {/* TELECOM & HARDWARE */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-slate-400 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-slate-400 mb-2">📡 Telecom &amp; Hardware</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.tkqlhce.com/click-101696721-11371807" target="_blank" rel="sponsored nofollow noopener" title="Verizon" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Verizon-10416412.png" alt="Verizon" className="max-h-4 w-auto" /></a>
                  <a href="https://runpod.io?ref=li2hee5u" target="_blank" rel="sponsored nofollow noopener" title="RunPod" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/runpod-685b36c74aa59531d0f1a347_runpod-logo-black.svg" alt="RunPod" className="max-h-4 w-auto" /></a>
                  <a href="https://www.anrdoezrs.net/click-101696721-15600687" target="_blank" rel="sponsored nofollow noopener" title="TP-Link Tapo" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/TP-Link-15600687.jpeg" alt="TP-Link Tapo" className="max-h-6 w-auto" /></a>
                  <a href="https://www.jdoqocy.com/click-101696721-17257661" target="_blank" rel="sponsored nofollow noopener" title="amFilm" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/am-film-23807336.png" alt="amFilm" className="max-h-6 w-auto" /></a>
                  <a href="https://www.anrdoezrs.net/click-101696721-17272885" target="_blank" rel="sponsored nofollow noopener" title="AMBIR" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Ambir-17262056.jpeg" alt="AMBIR" className="max-h-6 w-auto" /></a>
                </div>
              </div>

              {/* TOOLS, EQUIPMENT & PROFESSIONAL SERVICES */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-teal-500 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-teal-400 mb-2">🔧 Tools, Equipment &amp; Professional Services</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.anrdoezrs.net/click-101696721-17080749" target="_blank" rel="sponsored nofollow noopener" title="Angi" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/angi-23444170.png" alt="Angi" className="max-h-6 w-auto" /></a>
                  <a href="https://www.tkqlhce.com/click-101696721-15483785" target="_blank" rel="sponsored nofollow noopener" title="Northern Tool" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/NorthernTool-Logo-10356274.gif" alt="Northern Tool" className="max-h-6 w-auto" /></a>
                  <a href="https://www.jdoqocy.com/click-101696721-15786075" target="_blank" rel="sponsored nofollow noopener" title="OBI" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/OBI-15786075.png" alt="OBI" className="max-h-6 w-auto" /></a>
                </div>
              </div>

              {/* TRAVEL */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-rose-500 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-rose-400 mb-2">✈️ Travel</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.kqzyfj.com/click-101696721-10433860" target="_blank" rel="sponsored nofollow noopener" title="Hotels.com" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/hotels-com-10418404.png" alt="Hotels.com" className="max-h-8 w-auto" /></a>
                  <a href="https://www.anrdoezrs.net/click-101696721-17133005" target="_blank" rel="sponsored nofollow noopener" title="EF Adventures" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/ef-adventures-23557584.jpeg" alt="EF Adventures" className="max-h-6 w-auto" /></a>
                  <a href="https://www.anrdoezrs.net/click-101696721-12843042" target="_blank" rel="sponsored nofollow noopener" title="CheapTickets" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Cheaptickets-Logo-12843040.jpeg" alt="CheapTickets" className="max-h-6 w-auto" /></a>
                  <a href="https://www.anrdoezrs.net/click-101696721-15751514" target="_blank" rel="sponsored nofollow noopener" title="Pelican" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Pelican-20815910.png" alt="Pelican" className="max-h-6 w-auto" /></a>
                  <a href="https://www.dpbolvw.net/click-101696721-17207704" target="_blank" rel="sponsored nofollow noopener" title="Fresh Adventures" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/FreshAdventures-23650288.png" alt="Fresh Adventures" className="max-h-6 w-auto" /></a>
                </div>
              </div>

            </div>
          </div>
        </div>

            <div className="hidden">
              {/* old flat links preserved for pixel tracker parity — not rendered */}
              <a href="https://www.anrdoezrs.net/click-101696721-17124588" target="_blank" rel="sponsored nofollow noopener" title="AdBlocker Ultimate"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/Adblocker-17124591.jpeg" alt="AdBlocker Ultimate" className="max-h-7 w-auto" />
              </a>
              {/* Blackout Coffee */}
              <a href="https://www.dpbolvw.net/click-101696721-17110018" target="_blank" rel="sponsored nofollow noopener" title="Blackout Coffee"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/blackoutcoffee.png" alt="Blackout Coffee" className="max-h-7 w-auto" />
              </a>
              {/* Survive X */}
              <a href="https://www.awin1.com/cread.php?awinmid=124484&awinaffid=2848879&ued=https%3A%2F%2Fsurvive-x.com%2F" target="_blank" rel="sponsored nofollow noopener" title="Survive X"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/surviveXlogo.webp" alt="Survive X" className="max-h-6 w-auto" />
              </a>
              {/* Carbonite */}
              <a href="https://www.jdoqocy.com/click-101696721-15178612" target="_blank" rel="sponsored nofollow noopener" title="Carbonite"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/Carbonite-logo-15554902.png" alt="Carbonite" className="max-h-7 w-auto" />
              </a>
              {/* DomoAI */}
              <a href="https://www.dpbolvw.net/click-101696721-17222070" target="_blank" rel="sponsored nofollow noopener" title="DomoAI"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/DomoAi-17163300.png" alt="DomoAI" className="max-h-7 w-auto" />
              </a>
              {/* DigitalOcean */}
              <a href="https://www.awin1.com/cread.php?awinmid=123996&awinaffid=2848879&ued=https%3A%2F%2Fwww.digitalocean.com%2F" target="_blank" rel="sponsored nofollow noopener" title="DigitalOcean"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/digitaloceanlogo.png" alt="DigitalOcean" className="max-h-6 w-auto" />
              </a>
              {/* RunPod */}
              <a href="https://runpod.io?ref=li2hee5u" target="_blank" rel="sponsored nofollow noopener" title="RunPod"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/runpod-685b36c74aa59531d0f1a347_runpod-logo-black.svg" alt="RunPod" className="max-h-5 w-auto" />
              </a>
              {/* EF Adventures */}
              <a href="https://www.anrdoezrs.net/click-101696721-17133005" target="_blank" rel="sponsored nofollow noopener" title="EF Adventures"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/ef-adventures-23557584.jpeg" alt="EF Adventures" className="max-h-7 w-auto" />
              </a>
              {/* EWA */}
              <a href="https://www.jdoqocy.com/click-101696721-17262416" target="_blank" rel="sponsored nofollow noopener" title="EWA"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/Ewa-23803634.png" alt="EWA" className="max-h-7 w-auto" />
              </a>
              {/* FM Software */}
              <a href="https://www.jdoqocy.com/click-101696721-17258377" target="_blank" rel="sponsored nofollow noopener" title="FM Software"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/FMSoftwarelogo.png" alt="FM Software" className="max-h-7 w-auto" />
              </a>
              {/* GameFly */}
              <a href="https://www.kqzyfj.com/click-101696721-10448329" target="_blank" rel="sponsored nofollow noopener" title="GameFly"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/Gamefly-logo-10495782.png" alt="GameFly" className="max-h-7 w-auto" />
              </a>
              {/* GearUP */}
              <a href="https://www.tkqlhce.com/click-101696721-17235980" target="_blank" rel="sponsored nofollow noopener" title="GearUP"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/Gearup-23735360.png" alt="GearUP" className="max-h-7 w-auto" />
              </a>
              {/* Hotels.com */}
              <a href="https://www.kqzyfj.com/click-101696721-10433860" target="_blank" rel="sponsored nofollow noopener" title="Hotels.com"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/hotels-com-10418404.png" alt="Hotels.com" className="max-h-5 w-auto" />
              </a>
              {/* Intuit QuickBooks */}
              <a href="https://www.jdoqocy.com/click-101696721-17250447" target="_blank" rel="sponsored nofollow noopener" title="Intuit QuickBooks"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/Intuit-Quickbooks-15647418.png" alt="Intuit QuickBooks" className="max-h-7 w-auto" />
              </a>
              {/* M&M's */}
              <a href="https://www.tkqlhce.com/click-101696721-15712042" target="_blank" rel="sponsored nofollow noopener" title="M&M's"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/M&Ms-15075557.jpeg" alt="M&M's" className="max-h-7 w-auto" />
              </a>
              {/* Northern Tool */}
              <a href="https://www.tkqlhce.com/click-101696721-15483785" target="_blank" rel="sponsored nofollow noopener" title="Northern Tool"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/NorthernTool-Logo-10356274.gif" alt="Northern Tool" className="max-h-7 w-auto" />
              </a>
              {/* Peet's Coffee */}
              <a href="https://www.dpbolvw.net/click-101696721-13443788" target="_blank" rel="sponsored nofollow noopener" title="Peet's Coffee"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/Peets-Coffee-13426123.jpeg" alt="Peet's Coffee" className="max-h-7 w-auto" />
              </a>
              {/* Surfshark */}
              <a href="https://www.jdoqocy.com/click-101696721-15740556" target="_blank" rel="sponsored nofollow noopener" title="Surfshark"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/Surfshark-20148897.jpeg" alt="Surfshark" className="max-h-7 w-auto" />
              </a>
              {/* TEAC */}
              <a href="https://www.jdoqocy.com/click-101696721-15919841" target="_blank" rel="sponsored nofollow noopener" title="TEAC"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/Teac--21087655.png" alt="TEAC" className="max-h-7 w-auto" />
              </a>
              {/* TP-Link Tapo */}
              <a href="https://www.anrdoezrs.net/click-101696721-15600687" target="_blank" rel="sponsored nofollow noopener" title="TP-Link Tapo"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/TP-Link-15600687.jpeg" alt="TP-Link Tapo" className="max-h-7 w-auto" />
              </a>
              {/* Verizon */}
              <a href="https://www.tkqlhce.com/click-101696721-11371807" target="_blank" rel="sponsored nofollow noopener" title="Verizon"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/Verizon-10416412.png" alt="Verizon" className="max-h-5 w-auto" />
              </a>
              {/* VitalHeal */}
              <a href="https://www.tkqlhce.com/click-101696721-17254505" target="_blank" rel="sponsored nofollow noopener" title="VitalHeal"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/Vital-Health-23801187.png" alt="VitalHeal" className="max-h-7 w-auto" />
              </a>
              {/* CheapTickets */}
              <a href="https://www.anrdoezrs.net/click-101696721-12843042" target="_blank" rel="sponsored nofollow noopener" title="CheapTickets"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/Cheaptickets-Logo-12843040.jpeg" alt="CheapTickets" className="max-h-7 w-auto" />
              </a>
              {/* Raw Paws Pet Food */}
              <a href="https://www.jdoqocy.com/click-101696721-17234935" target="_blank" rel="sponsored nofollow noopener" title="Raw Paws Pet Food"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/Raw-Paws-Petfoods-15878721.jpeg" alt="Raw Paws Pet Food" className="max-h-7 w-auto" />
              </a>
              {/* amFilm */}
              <a href="https://www.jdoqocy.com/click-101696721-17257661" target="_blank" rel="sponsored nofollow noopener" title="amFilm"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/am-film-23807336.png" alt="amFilm" className="max-h-7 w-auto" />
              </a>
              {/* Skutchi Designs */}
              <a href="https://www.jdoqocy.com/click-101696721-15826779" target="_blank" rel="sponsored nofollow noopener" title="Skutchi Designs"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/Skutchi-Designs-20918025.jpeg" alt="Skutchi Designs" className="max-h-7 w-auto" />
              </a>
              {/* Joydeco */}
              <a href="https://www.awin1.com/cread.php?awinmid=119863&awinaffid=2848879&ued=https%3A%2F%2Fjoydeco.com%2F" target="_blank" rel="sponsored nofollow noopener" title="Joydeco"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/joydecologo.webp" alt="Joydeco" className="max-h-6 w-auto" />
              </a>
              {/* Pelican */}
              <a href="https://www.anrdoezrs.net/click-101696721-15751514" target="_blank" rel="sponsored nofollow noopener" title="Pelican"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/Pelican-20815910.png" alt="Pelican" className="max-h-7 w-auto" />
              </a>
              {/* Arka */}
              <a href="https://www.dpbolvw.net/click-101696721-15600474" target="_blank" rel="sponsored nofollow noopener" title="Arka"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/arkalogo.png" alt="Arka" className="max-h-7 w-auto" />
              </a>
              {/* Giftcards.ca */}
              <a href="https://www.awin1.com/cread.php?awinmid=91359&awinaffid=2848879&ued=https%3A%2F%2Fwww.giftcards.ca%2F" target="_blank" rel="sponsored nofollow noopener" title="Giftcards.ca"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/giftcardscalogo.webp" alt="Giftcards.ca" className="max-h-6 w-auto" />
              </a>
              {/* OBI */}
              <a href="https://www.jdoqocy.com/click-101696721-15786075" target="_blank" rel="sponsored nofollow noopener" title="OBI"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/OBI-15786075.png" alt="OBI" className="max-h-7 w-auto" />
              </a>
              {/* AMBIR */}
              <a href="https://www.anrdoezrs.net/click-101696721-17272885" target="_blank" rel="sponsored nofollow noopener" title="AMBIR"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/Ambir-17262056.jpeg" alt="AMBIR" className="max-h-7 w-auto" />
              </a>
              {/* Oakley */}
              <a href="https://www.dpbolvw.net/click-101696721-15153860" target="_blank" rel="sponsored nofollow noopener" title="Oakley"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/Oakley-10375170.jpeg" alt="Oakley" className="max-h-7 w-auto" />
              </a>
              {/* Fresh Adventures */}
              <a href="https://www.dpbolvw.net/click-101696721-17207704" target="_blank" rel="sponsored nofollow noopener" title="Fresh Adventures"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/FreshAdventures-23650288.png" alt="Fresh Adventures" className="max-h-7 w-auto" />
              </a>
              {/* Epidemic Sound */}
              <a href="https://www.tkqlhce.com/click-101696721-17163276" target="_blank" rel="sponsored nofollow noopener" title="Epidemic Sound"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/epidemic-sound-20089917.png" alt="Epidemic Sound" className="max-h-7 w-auto" />
              </a>
            </div>
            {/* CJ pixel trackers — all 30 partners */}
            <img src="https://www.tqlkg.com/image-101696721-17124588" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.awltovhc.com/image-101696721-17110018" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.awltovhc.com/image-101696721-15178612" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.ftjcfx.com/image-101696721-17222070" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.ftjcfx.com/image-101696721-17133005" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.awltovhc.com/image-101696721-17262416" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.lduhtrp.net/image-101696721-17258377" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.ftjcfx.com/image-101696721-10448329" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.lduhtrp.net/image-101696721-17235980" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.ftjcfx.com/image-101696721-10433860" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.tqlkg.com/image-101696721-17250447" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.ftjcfx.com/image-101696721-15712042" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.ftjcfx.com/image-101696721-15483785" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.lduhtrp.net/image-101696721-13443788" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.lduhtrp.net/image-101696721-15740556" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.tqlkg.com/image-101696721-15919841" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.lduhtrp.net/image-101696721-15600687" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.lduhtrp.net/image-101696721-17080749" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.lduhtrp.net/image-101696721-11371807" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.lduhtrp.net/image-101696721-17254505" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.tqlkg.com/image-101696721-12843042" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.tqlkg.com/image-101696721-17234935" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.tqlkg.com/image-101696721-17257661" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.ftjcfx.com/image-101696721-15826779" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.ftjcfx.com/image-101696721-15751514" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.awltovhc.com/image-101696721-15600474" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.awltovhc.com/image-101696721-15786075" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.tqlkg.com/image-101696721-17272885" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.tqlkg.com/image-101696721-15153860" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.lduhtrp.net/image-101696721-17207704" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.tqlkg.com/image-101696721-17163276" width="1" height="1" border="0" alt="" aria-hidden="true" />
      {/* ───────── FOOTER ───────── */}
      <footer className="border-t border-white/[0.06] mt-12 w-full">
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
              <p className="mt-0.5">Powered by highsignal™</p>
            </div>
          </div>

          {/* Links row */}
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <h5 className="text-white font-semibold mb-3 text-xs uppercase tracking-widest">Links</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="https://github.com/harborglowvintage-oss/salescloserpro.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About &amp; Guide</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">In-App Docs</Link></li>
                <li><a href="https://github.com/harborglowvintage-oss/salescloserpro.ai/issues" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Report a Bug</a></li>
                <li><Link to="/services" className="text-amber-400 hover:text-amber-300 transition-colors">✦ Custom &amp; Enterprise</Link></li>
                <li><Link to="/whitepaper" className="hover:text-white transition-colors">📄 Whitepaper</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-3 text-xs uppercase tracking-widest">Legal</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/legal" className="hover:text-white transition-colors">Terms of Use</Link></li>
                <li><Link to="/legal#privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/legal#affiliate" className="hover:text-white transition-colors">Affiliate Disclosure</Link></li>
                <li><Link to="/legal#ai" className="hover:text-white transition-colors">AI Disclosure</Link></li>
                <li><Link to="/legal#payments" className="hover:text-white transition-colors">Payments &amp; Crypto</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/[0.06] pt-6 text-center text-xs text-slate-600">
            © 2026 SalesCloserPro · Apache-2.0 License
          </div>

        </div>
      </footer>
    </div>
  )
}
