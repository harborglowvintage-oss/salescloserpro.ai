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
    <div className="min-h-screen bg-[#0a0e1a] flex flex-col">
      {/* Top nav bar */}
      <nav className="w-full border-b border-white/[0.06] bg-[#0a0e1a]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
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
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Card */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 sm:p-10 shadow-2xl">
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
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.06] border text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all ${
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

          {/* Affiliate Offers — logo pills */}
          <div className="mt-8 border-t border-white/[0.04] pt-6">
            <div className="flex flex-col gap-1 mb-3">
              <p className="text-[10px] font-bold text-white uppercase tracking-widest">Affiliate Offers</p>
              <p className="text-[10px] text-slate-500">We earn a commission when you shop through the links below</p>
            </div>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {/* AdBlocker Ultimate */}
              <a href="https://www.anrdoezrs.net/click-101696721-17124588" target="_blank" rel="sponsored noopener" title="AdBlocker Ultimate"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/adblockerlogo.png" alt="AdBlocker Ultimate" className="max-h-7 w-auto" />
              </a>
              {/* Blackout Coffee */}
              <a href="https://www.dpbolvw.net/click-101696721-17110018" target="_blank" rel="sponsored noopener" title="Blackout Coffee"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/blackoutcoffee.png" alt="Blackout Coffee" className="max-h-7 w-auto" />
              </a>
              {/* Carbonite */}
              <a href="https://www.jdoqocy.com/click-101696721-15178612" target="_blank" rel="sponsored noopener" title="Carbonite"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/carbonitelogo.png" alt="Carbonite" className="max-h-7 w-auto" />
              </a>
              {/* DomoAI */}
              <a href="https://www.dpbolvw.net/click-101696721-17222070" target="_blank" rel="sponsored noopener" title="DomoAI"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/domoailogo.png" alt="DomoAI" className="max-h-7 w-auto" />
              </a>
              {/* EF Adventures */}
              <a href="https://www.anrdoezrs.net/click-101696721-17133005" target="_blank" rel="sponsored noopener" title="EF Adventures"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/efeducationlogo.png" alt="EF Adventures" className="max-h-7 w-auto" />
              </a>
              {/* EWA */}
              <a href="https://www.jdoqocy.com/click-101696721-17262416" target="_blank" rel="sponsored noopener" title="EWA"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/ewalogo.png" alt="EWA" className="max-h-7 w-auto" />
              </a>
              {/* FM Software */}
              <a href="https://www.jdoqocy.com/click-101696721-17258377" target="_blank" rel="sponsored noopener" title="FM Software"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/FMSoftwarelogo.png" alt="FM Software" className="max-h-7 w-auto" />
              </a>
              {/* GameFly */}
              <a href="https://www.kqzyfj.com/click-101696721-10448329" target="_blank" rel="sponsored noopener" title="GameFly"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/gameflylogo.png" alt="GameFly" className="max-h-7 w-auto" />
              </a>
              {/* GearUP */}
              <a href="https://www.tkqlhce.com/click-101696721-17235980" target="_blank" rel="sponsored noopener" title="GearUP"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/gearuplogo.png" alt="GearUP" className="max-h-7 w-auto" />
              </a>
              {/* Hotels.com */}
              <a href="https://www.kqzyfj.com/click-101696721-10433860" target="_blank" rel="sponsored noopener" title="Hotels.com"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/hotelslogo.png" alt="Hotels.com" className="max-h-5 w-auto" />
              </a>
              {/* Intuit QuickBooks */}
              <a href="https://www.jdoqocy.com/click-101696721-17250447" target="_blank" rel="sponsored noopener" title="Intuit QuickBooks"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/quickbookslogo.png" alt="Intuit QuickBooks" className="max-h-7 w-auto" />
              </a>
              {/* M&M's */}
              <a href="https://www.tkqlhce.com/click-101696721-15712042" target="_blank" rel="sponsored noopener" title="M&M's"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/mmslogo.png" alt="M&M's" className="max-h-7 w-auto" />
              </a>
              {/* Northern Tool */}
              <a href="https://www.tkqlhce.com/click-101696721-15483785" target="_blank" rel="sponsored noopener" title="Northern Tool"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/northerntoollogo.png" alt="Northern Tool" className="max-h-7 w-auto" />
              </a>
              {/* Peet's Coffee */}
              <a href="https://www.dpbolvw.net/click-101696721-13443788" target="_blank" rel="sponsored noopener" title="Peet's Coffee"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/peetslogo.png" alt="Peet's Coffee" className="max-h-7 w-auto" />
              </a>
              {/* Surfshark */}
              <a href="https://www.jdoqocy.com/click-101696721-15740556" target="_blank" rel="sponsored noopener" title="Surfshark"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/surfsharklogo.png" alt="Surfshark" className="max-h-7 w-auto" />
              </a>
              {/* TEAC */}
              <a href="https://www.jdoqocy.com/click-101696721-15919841" target="_blank" rel="sponsored noopener" title="TEAC"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/TEAClogo.png" alt="TEAC" className="max-h-7 w-auto" />
              </a>
              {/* TP-Link Tapo */}
              <a href="https://www.tkqlhce.com/click-101696721-15610800" target="_blank" rel="sponsored noopener" title="TP-Link Tapo"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/tplinklogo.png" alt="TP-Link Tapo" className="max-h-7 w-auto" />
              </a>
              {/* Verizon */}
              <a href="https://www.tkqlhce.com/click-101696721-11371807" target="_blank" rel="sponsored noopener" title="Verizon"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/verizonlogo.png" alt="Verizon" className="max-h-5 w-auto" />
              </a>
              {/* VitalHeal */}
              <a href="https://www.tkqlhce.com/click-101696721-17254505" target="_blank" rel="sponsored noopener" title="VitalHeal"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/vitalheallogo.png" alt="VitalHeal" className="max-h-7 w-auto" />
              </a>
              {/* CheapTickets */}
              <a href="https://www.anrdoezrs.net/click-101696721-12843042" target="_blank" rel="sponsored noopener" title="CheapTickets"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/cheapticketslogo.png" alt="CheapTickets" className="max-h-7 w-auto" />
              </a>
              {/* Raw Paws Pet Food */}
              <a href="https://www.jdoqocy.com/click-101696721-17234935" target="_blank" rel="sponsored noopener" title="Raw Paws Pet Food"
                className="bg-white rounded inline-flex items-center justify-center w-24 h-8 hover:opacity-80 transition-opacity">
                <img src="/logos/rawpawspetfoodlogo.png" alt="Raw Paws Pet Food" className="max-h-7 w-auto" />
              </a>
            </div>
            {/* CJ pixel trackers — all 21 partners */}
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
            <img src="https://www.tqlkg.com/image-101696721-15610800" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.lduhtrp.net/image-101696721-11371807" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.lduhtrp.net/image-101696721-17254505" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.tqlkg.com/image-101696721-12843042" width="1" height="1" border="0" alt="" aria-hidden="true" />
            <img src="https://www.tqlkg.com/image-101696721-17234935" width="1" height="1" border="0" alt="" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  )
}
