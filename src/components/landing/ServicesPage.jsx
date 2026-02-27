/**
 * SalesCloserPro - Custom & Enterprise Services
 * Copyright (c) 2026 Brent Girolimon / llmadvisor.ai
 * Powered by highsignal™
 * Licensed under Apache-2.0
 */

import { Link } from 'react-router-dom'
import { ArrowLeft, Settings2, Layers, LifeBuoy, Handshake, MessageSquare, ClipboardList, Rocket } from 'lucide-react'
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
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

function Reveal({ children, className = '', delay = '' }) {
  const ref = useReveal()
  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-6 transition-all duration-700 ease-out ${delay} ${className}`}
    >
      {children}
    </div>
  )
}

const offerings = [
  {
    icon: Settings2,
    color: 'bg-blue-500/10 text-blue-400',
    border: 'border-blue-500/20',
    num: '01',
    numColor: 'text-blue-500/30',
    title: 'Custom Configuration & Build',
    body:
      'Your operation is not a template. We scope, configure, and extend the platform to match your exact workflow — from data structure and automations to feature additions built specifically around how your team closes deals.',
  },
  {
    icon: Layers,
    color: 'bg-violet-500/10 text-violet-400',
    border: 'border-violet-500/20',
    num: '02',
    numColor: 'text-violet-500/30',
    title: 'White-Label & Enterprise Architecture',
    body:
      'Need SalesCloserPro branded entirely for your franchise or sales floor? We strip the default branding and rebuild the interface around your corporate identity — so it feels completely in-house.',
  },
  {
    icon: LifeBuoy,
    color: 'bg-cyan-500/10 text-cyan-400',
    border: 'border-cyan-500/20',
    num: '03',
    numColor: 'text-cyan-500/30',
    title: 'Setup, Onboarding & Consulting',
    body:
      'Hands-on deployment guidance for businesses that need implementation done right the first time. We handle the technical complexity, migrate your existing data, and get your team operational — without the learning curve.',
  },
  {
    icon: Handshake,
    color: 'bg-amber-500/10 text-amber-400',
    border: 'border-amber-500/20',
    num: '04',
    numColor: 'text-amber-500/30',
    title: 'Ongoing Partnership & Support',
    body:
      'For businesses that need more than software — they need a capable technical partner. Retainer-based engagement with dedicated responsiveness, roadmap input, and continuous refinement as your operation grows.',
  },
]

const audiences = ['Contractors', 'Sales Teams', 'Agencies', 'Solo Operators', 'B2B Companies']

const steps = [
  {
    icon: MessageSquare,
    num: '1',
    title: 'Describe',
    body: 'Tell us what you need — scope, timeline, constraints. No forms, no chatbots. Just a conversation.',
  },
  {
    icon: ClipboardList,
    num: '2',
    title: 'Scope',
    body: 'We assess feasibility, define deliverables, and present a clear, straightforward proposal.',
  },
  {
    icon: Rocket,
    num: '3',
    title: 'Execute',
    body: 'Work begins with direct communication and full transparency — delivered on time, built right.',
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 antialiased">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <span className="text-slate-700 select-none">|</span>
          <span className="text-sm font-medium text-white">Custom &amp; Enterprise</span>
        </div>
      </header>

<main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">

        {/* ── Hero: split layout with perspective mockup ── */}
        <Reveal>
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-14">
            {/* Left — copy */}
            <div className="flex-1 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold tracking-wide uppercase mb-5">
                ✦ Premier Services
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] mb-5">
                Not everything{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  fits in a box.
                </span>
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed">
                salescloserpro.ai is free and open source — built for operators who want to move fast
                without paying a subscription tax. But some businesses require something more: a tailored
                implementation, a branded interface, or a dedicated partner who understands the details of
                their operation.
              </p>
              <p className="text-lg text-slate-400 leading-relaxed mt-4">
                We take on a limited number of private technical partnerships. You get the same
                precision that built the platform — pointed directly at your bottom line.
              </p>
            </div>

            {/* Right — perspective browser mockup */}
            <div className="flex-1 flex justify-center lg:justify-end" style={{ perspective: '1200px' }}>
              <div
                className="relative w-full max-w-md"
                style={{ transform: 'rotateY(-6deg) rotateX(3deg)', transformStyle: 'preserve-3d' }}
              >
                {/* Glow */}
                <div className="absolute -inset-4 rounded-2xl bg-blue-500/10 blur-2xl" />
                {/* Browser chrome */}
                <div className="relative rounded-xl border border-white/[0.08] bg-slate-900/80 shadow-2xl shadow-blue-950/40 overflow-hidden">
                  {/* Title bar */}
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/60 border-b border-white/[0.06]">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                    <span className="ml-3 text-[10px] text-slate-500 font-mono truncate">salescloserpro.ai — Quote Intake</span>
                  </div>
                  {/* Screenshot */}
                  <img
                    src="/logos/intake.png"
                    alt="SalesCloserPro quote intake interface"
                    className="w-full h-auto block"
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Audience strip ── */}
        <Reveal className="mb-14">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-widest mr-2">Built for</span>
            {audiences.map((a, i) => (
              <span key={a} className="flex items-center gap-2">
                <span className="text-slate-400">{a}</span>
                {i < audiences.length - 1 && <span className="text-slate-700">·</span>}
              </span>
            ))}
          </div>
        </Reveal>

        {/* ── Offerings grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
          {offerings.map(({ icon: Icon, color, border, num, numColor, title, body }, i) => (
            <Reveal key={title} delay={i % 2 === 1 ? 'delay-100' : ''}>
              <div
                className={`relative rounded-xl border ${border} bg-white/[0.03] p-6 hover:bg-white/[0.05] transition-colors group h-full`}
              >
                {/* Number badge */}
                <span className={`absolute top-4 right-4 text-2xl font-black ${numColor} select-none`}>
                  {num}
                </span>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── Three-step process ── */}
        <Reveal className="mb-16">
          <h2 className="text-white font-bold text-xl mb-8 text-center">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden sm:block absolute top-7 left-[17%] right-[17%] h-px bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-blue-500/30" />

            {steps.map(({ icon: Icon, num, title, body }) => (
              <div key={num} className="relative text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-white/[0.08] bg-slate-900 mb-4 relative z-10">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-xs font-bold text-blue-400/60 uppercase tracking-widest mb-1">Step {num}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">{body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── Gradient divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent mb-14" />

        {/* ── CTA ── */}
        <Reveal>
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-5">
              Ready to discuss your requirements? Reach out directly.
            </p>
            <a
              href="mailto:brent@llmadvisor.ai?subject=SalesCloserPro%3A%20Custom%20Build%20Inquiry"
              className="inline-flex items-center gap-2 px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-xl shadow-blue-600/30 text-base tracking-wide"
            >
              Request a Build Conversation
            </a>
            <p className="text-sm text-slate-500 mt-5">Engagements typically start at $2,500.</p>
            <p className="text-xs text-slate-600 mt-2">brent@llmadvisor.ai · typically replies within 1 business day</p>
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
            <Link to="/legal" className="hover:text-slate-400 transition-colors">Legal</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
