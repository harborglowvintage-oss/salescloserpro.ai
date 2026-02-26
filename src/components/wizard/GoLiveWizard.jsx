import { useState } from 'react'
import {
  Github, Globe, Mail, ChevronRight, ChevronDown, CheckCircle, ExternalLink,
  CreditCard, Wallet, Shield, Zap, AlertCircle, Copy, Check, Eye, EyeOff,
  Circle, RotateCcw, ArrowRight, Sparkles, Clock, Info,
} from 'lucide-react'
import useStore from '../../store'

const CURRENCIES = [
  { id: 'usdc_polygon', label: 'USDC (Polygon)',    desc: 'Low fees, fast settlement',    badge: '⭐ Recommended' },
  { id: 'usdc',         label: 'USDC (Ethereum)',    desc: 'Stablecoin on Ethereum',       badge: null },
  { id: 'usdt',         label: 'USDT (Tether)',      desc: 'Most widely used stablecoin',  badge: null },
  { id: 'eth',          label: 'Ethereum (ETH)',     desc: 'Native Ethereum',               badge: null },
  { id: 'btc',          label: 'Bitcoin (BTC)',      desc: 'Original cryptocurrency',       badge: null },
  { id: 'matic_polygon',label: 'MATIC (Polygon)',    desc: 'Polygon native token',          badge: null },
]

const STEP_META = [
  { id: 1, label: 'GitHub',     icon: Github,     color: 'bg-gray-900',                          keys: ['github_account','github_forked','github_cloned'] },
  { id: 2, label: 'Cloudflare', icon: Globe,       color: 'bg-orange-500',                        keys: ['cf_account','cf_project','cf_build','cf_deployed'] },
  { id: 3, label: 'Domain',     icon: Globe,       color: 'bg-purple-600',                        keys: ['domain_decided','domain_configured'] },
  { id: 4, label: 'Email',      icon: Mail,        color: 'bg-red-500',                           keys: ['email_decided','email_configured'] },
  { id: 5, label: 'Payments',   icon: CreditCard,  color: 'bg-gradient-to-br from-violet-600 to-blue-600', keys: ['pay_account','pay_keys','pay_wallet','pay_enabled'] },
]

/* ── Reusable checkbox task ─────────────────────────────── */
function TaskCheck({ checked, onChange, children, sub, timeEst }) {
  return (
    <label className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 select-none ${checked ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800'}`}>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <div className="mt-0.5 flex-shrink-0">
        {checked
          ? <CheckCircle className="w-5 h-5 text-green-500" />
          : <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium leading-snug ${checked ? 'text-green-800 dark:text-green-300 line-through opacity-70' : 'text-gray-800 dark:text-gray-200'}`}>{children}</div>
        {sub && <div className={`text-xs mt-0.5 leading-relaxed ${checked ? 'text-green-600/60 dark:text-green-400/60' : 'text-gray-400 dark:text-gray-500'}`}>{sub}</div>}
      </div>
      {timeEst && !checked && (
        <span className="flex items-center gap-1 text-[10px] text-gray-400 font-medium flex-shrink-0 mt-1">
          <Clock className="w-3 h-3" />{timeEst}
        </span>
      )}
    </label>
  )
}

/* ── Link button ────────────────────────────────────────── */
function LinkCard({ href, label, badge, recommended }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="flex items-center justify-between p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 hover:shadow-md transition-all group bg-white dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <div className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{label}</div>
        {recommended && <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">⭐ Recommended</span>}
        {badge && <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">{badge}</span>}
      </div>
      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
    </a>
  )
}

/* ── Tip box ────────────────────────────────────────────── */
function Tip({ children }) {
  return (
    <div className="flex gap-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
      <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />
      <div>{children}</div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════ */
export default function GoLiveWizard() {
  const [step, setStep]           = useState(0)  // 0 = overview
  const company                   = useStore((s) => s.company)
  const paymentSettings           = useStore((s) => s.paymentSettings)
  const setPaymentSettings        = useStore((s) => s.setPaymentSettings)
  const cl                        = useStore((s) => s.goLiveChecklist)
  const setCheck                  = useStore((s) => s.setGoLiveCheck)
  const resetChecklist            = useStore((s) => s.resetGoLiveChecklist)

  const [showKey, setShowKey]     = useState(false)
  const [copied, setCopied]       = useState('')
  const [expandedTip, setExpandedTip] = useState(null)

  const copyText = (text, label) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(label); setTimeout(() => setCopied(''), 1500) })
  }
  const tog = (key) => setCheck(key, !cl[key])

  /* Progress helpers */
  const stepDone = (keys) => keys.every((k) => cl[k])
  const stepCount = (keys) => keys.filter((k) => cl[k]).length
  const totalDone = Object.values(cl).filter(Boolean).length
  const totalAll  = Object.keys(cl).length
  const pct = Math.round((totalDone / totalAll) * 100)

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Go Live</h1>
        <p className="text-gray-500 dark:text-gray-400">Launch your SalesCloserPro online — free, secure, yours.</p>
      </div>

      {/* Overall progress bar */}
      <div className="card !p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-gray-700 dark:text-gray-300">Overall Progress</span>
          <span className={`font-bold ${pct === 100 ? 'text-green-600' : 'text-blue-600'}`}>{totalDone}/{totalAll} tasks · {pct}%</span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${pct}%` }} />
        </div>
        {pct === 100 && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-bold">
            <Sparkles className="w-4 h-4" /> All steps complete — you're live!
          </div>
        )}
      </div>

      {/* ── Step cards (always visible) ─────────────────── */}
      {STEP_META.map((s, idx) => {
        const Icon = s.icon
        const done = stepDone(s.keys)
        const count = stepCount(s.keys)
        const isOpen = step === s.id

        return (
          <div key={s.id} className="card !p-0 overflow-hidden">
            {/* Accordion header */}
            <button
              onClick={() => setStep(isOpen ? 0 : s.id)}
              className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${done ? 'bg-green-500' : s.color}`}>
                {done ? <CheckCircle className="w-5 h-5 text-white" /> : <Icon className="w-5 h-5 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className={`font-bold text-lg ${done ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
                    Step {s.id} — {s.label}
                  </h2>
                  {done && <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold px-2 py-0.5 rounded-full">Complete</span>}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{count}/{s.keys.length} tasks done</div>
              </div>
              {/* Mini progress ring */}
              <div className="flex-shrink-0 mr-1">
                <svg viewBox="0 0 36 36" className="w-9 h-9">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" className="text-gray-100 dark:text-gray-700" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor"
                    className={done ? 'text-green-500' : 'text-blue-500'}
                    strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={`${(count / s.keys.length) * 94.2} 94.2`}
                    transform="rotate(-90 18 18)" />
                </svg>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Accordion body */}
            {isOpen && (
              <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 space-y-4 pt-4">
                {/* ── STEP 1: GitHub ─────────────── */}
                {s.id === 1 && (<>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    GitHub hosts your code for free. You'll fork (copy) the SalesCloserPro repo, which gives you your own version you can customize and deploy.
                  </p>
                  <div className="space-y-2">
                    <TaskCheck checked={cl.github_account} onChange={() => tog('github_account')} timeEst="2 min"
                      sub="Go to github.com → click 'Sign up' → verify email. If you already have one, check this off.">
                      Create a free GitHub account (or already have one)
                    </TaskCheck>
                    <TaskCheck checked={cl.github_forked} onChange={() => tog('github_forked')} timeEst="30 sec"
                      sub="Go to the SalesCloserPro repo → click the 'Fork' button (top right). This creates your own copy at github.com/yourusername/salescloserpro.">
                      Fork the SalesCloserPro repository
                    </TaskCheck>
                    <TaskCheck checked={cl.github_cloned} onChange={() => tog('github_cloned')} timeEst="1 min"
                      sub={<>Optional for local development. Run: <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">git clone https://github.com/yourusername/salescloserpro.git</code> then <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">npm install && npm run dev</code></>}>
                      Clone locally & run dev server (optional)
                    </TaskCheck>
                  </div>
                  <Tip>Your forked repo is independent — you can customize it freely. Push changes to auto-deploy (after Cloudflare setup in Step 2).</Tip>
                  <LinkCard href="https://github.com/join" label="Create GitHub Account" badge="Free forever" />
                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                      Continue to Cloudflare <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </>)}

                {/* ── STEP 2: Cloudflare ─────────── */}
                {s.id === 2 && (<>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Cloudflare Pages hosts your site for free with global CDN, automatic HTTPS, and auto-deploys from GitHub. Every push to your repo instantly updates your live site.
                  </p>
                  <div className="space-y-2">
                    <TaskCheck checked={cl.cf_account} onChange={() => tog('cf_account')} timeEst="2 min"
                      sub="Go to dash.cloudflare.com → click 'Sign up'. Free plan includes Pages, DNS, SSL, and CDN.">
                      Create a free Cloudflare account
                    </TaskCheck>
                    <TaskCheck checked={cl.cf_project} onChange={() => tog('cf_project')} timeEst="2 min"
                      sub="Cloudflare Dashboard → Pages → 'Create a project' → 'Connect to Git' → authorize GitHub → select your forked repo.">
                      Create a Pages project & connect GitHub
                    </TaskCheck>
                    <TaskCheck checked={cl.cf_build} onChange={() => tog('cf_build')} timeEst="1 min"
                      sub={<>Set these exact build settings: Framework preset: <strong>Vite</strong> · Build command: <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">npm run build</code> · Output directory: <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">dist</code></>}>
                      Configure build settings (Vite / npm run build / dist)
                    </TaskCheck>
                    <TaskCheck checked={cl.cf_deployed} onChange={() => tog('cf_deployed')} timeEst="1 min"
                      sub="Click 'Save and Deploy'. After ~60 seconds your site is live at yourproject.pages.dev. Visit it to confirm!">
                      First deploy successful — site is live!
                    </TaskCheck>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 text-sm text-green-800 dark:text-green-300 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>After deploy: ✓ Free SSL certificate · ✓ Free global CDN · ✓ Every GitHub push auto-deploys</span>
                  </div>
                  <Tip>Your site URL will be <strong>yourproject.pages.dev</strong>. You can add a custom domain in Step 3, or keep this free URL permanently.</Tip>
                  <LinkCard href="https://pages.cloudflare.com" label="Go to Cloudflare Pages" badge="Free tier" />
                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="btn-secondary">← Back</button>
                    <button onClick={() => setStep(3)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                      Continue to Domain <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </>)}

                {/* ── STEP 3: Domain ─────────────── */}
                {s.id === 3 && (<>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    A custom domain (like quotes.yourbiz.com) is professional but optional. Your free .pages.dev URL is permanent and fully functional.
                  </p>
                  <div className="space-y-2">
                    <TaskCheck checked={cl.domain_decided} onChange={() => tog('domain_decided')} timeEst="—"
                      sub="Choose whether to use a custom domain or keep the free yourproject.pages.dev URL. Both work with SSL.">
                      Decide: custom domain or free .pages.dev URL
                    </TaskCheck>
                    <TaskCheck checked={cl.domain_configured} onChange={() => tog('domain_configured')} timeEst="5 min"
                      sub="If using custom domain: Cloudflare Pages → your project → Custom Domains → Add domain. If using .pages.dev, check this off — you're done!">
                      Domain configured (or skipping with .pages.dev)
                    </TaskCheck>
                  </div>

                  {/* Expandable instructions */}
                  <button onClick={() => setExpandedTip(expandedTip === 'domain' ? null : 'domain')}
                    className="text-sm text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 hover:underline">
                    {expandedTip === 'domain' ? 'Hide' : 'Show'} domain setup instructions <ChevronDown className={`w-4 h-4 transition-transform ${expandedTip === 'domain' ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedTip === 'domain' && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-4 text-sm text-gray-700 dark:text-gray-300 space-y-3">
                      <p className="font-bold text-purple-800 dark:text-purple-300">If you own a domain:</p>
                      <ol className="space-y-2 ml-1">
                        <li className="flex gap-2"><span className="font-bold text-purple-600">1.</span> In Cloudflare Pages → your project → <strong>Custom Domains</strong> → <strong>Add domain</strong></li>
                        <li className="flex gap-2"><span className="font-bold text-purple-600">2.</span> Enter your domain (e.g. <code className="bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">quotes.yourbusiness.com</code>)</li>
                        <li className="flex gap-2"><span className="font-bold text-purple-600">3.</span> If domain is registered elsewhere, Cloudflare shows the DNS records (CNAME) to add</li>
                        <li className="flex gap-2"><span className="font-bold text-purple-600">4.</span> SSL is automatic — no certificate to manage</li>
                      </ol>
                      <p className="font-bold text-purple-800 dark:text-purple-300 pt-2">If you don't own a domain:</p>
                      <p>Your free <strong>yourproject.pages.dev</strong> URL is permanent, HTTPS, and fully functional. You can add a domain later anytime.</p>
                    </div>
                  )}
                  <LinkCard href="https://www.cloudflare.com/dns/" label="Cloudflare Free DNS" badge="Recommended" />
                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="btn-secondary">← Back</button>
                    <button onClick={() => setStep(4)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                      Continue to Email <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </>)}

                {/* ── STEP 4: Email ──────────────── */}
                {s.id === 4 && (<>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    A professional email like <strong>you@yourdomain.com</strong> builds trust. This requires a custom domain. If you don't have one, skip this step.
                  </p>
                  <div className="space-y-2">
                    <TaskCheck checked={cl.email_decided} onChange={() => tog('email_decided')} timeEst="—"
                      sub="Choose a provider below, or skip if you're using personal email / don't have a custom domain.">
                      Choose email provider (or decide to skip)
                    </TaskCheck>
                    <TaskCheck checked={cl.email_configured} onChange={() => tog('email_configured')} timeEst="10 min"
                      sub="Follow your chosen provider's setup guide to add MX records to your DNS in Cloudflare, then verify your domain.">
                      Email configured & working (or skipping)
                    </TaskCheck>
                  </div>

                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300 pt-2">Recommended providers:</p>
                  <div className="space-y-3">
                    <a href="https://go.zoho.com/x7Vq" target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between p-5 rounded-2xl border-2 border-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all group">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">Zoho Mail</span>
                          <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">⭐ Our Pick</span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">~$2/month · Professional email on your domain · Great for solo users & small teams</div>
                      </div>
                      <ExternalLink className="w-5 h-5 text-blue-500 group-hover:text-blue-700 ml-4 flex-shrink-0" />
                    </a>
                    <a href="https://workspace.google.com" target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between p-5 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group">
                      <div>
                        <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">Google Workspace</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">~$6–12/user/month · Gmail interface · Best for teams needing Meet, Drive & Docs</div>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-gray-600 ml-4 flex-shrink-0" />
                    </a>
                  </div>
                  <Tip>Both services use MX records in your DNS. In Cloudflare → DNS → Add Record → type: MX. Your email provider's setup guide will give you the exact values.</Tip>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(3)} className="btn-secondary">← Back</button>
                    <button onClick={() => setStep(5)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                      Continue to Payments <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </>)}

                {/* ── STEP 5: MoonPay Payments ───── */}
                {s.id === 5 && (<>
                  {/* How it works */}
                  <div className="bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 border border-violet-200 dark:border-violet-800 rounded-2xl p-5 space-y-4">
                    <h3 className="font-bold text-violet-900 dark:text-violet-200 flex items-center gap-2">
                      <Zap className="w-5 h-5" /> How MoonPay Payments Work
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="text-center space-y-2">
                        <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto shadow-sm"><CreditCard className="w-5 h-5 text-violet-600" /></div>
                        <div className="font-semibold text-gray-800 dark:text-gray-200">1. Client clicks "Pay"</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">Pay Invoice button on every quote</div>
                      </div>
                      <div className="text-center space-y-2">
                        <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto shadow-sm"><Shield className="w-5 h-5 text-blue-600" /></div>
                        <div className="font-semibold text-gray-800 dark:text-gray-200">2. MoonPay widget opens</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">Client pays with card, bank, or Apple Pay</div>
                      </div>
                      <div className="text-center space-y-2">
                        <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto shadow-sm"><Wallet className="w-5 h-5 text-green-600" /></div>
                        <div className="font-semibold text-gray-800 dark:text-gray-200">3. You receive funds</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">Crypto deposited to your wallet</div>
                      </div>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-2">
                    <TaskCheck checked={cl.pay_account} onChange={() => tog('pay_account')} timeEst="3 min"
                      sub="Visit dashboard.moonpay.com → Sign up for a free account. You'll need to verify your identity for production mode.">
                      Create a MoonPay account
                    </TaskCheck>
                    <TaskCheck checked={cl.pay_keys} onChange={() => tog('pay_keys')} timeEst="1 min"
                      sub={<>In your MoonPay dashboard: <strong>Developers → API Keys</strong>. Copy the <strong>Publishable Key</strong> (starts with <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-xs">pk_test_</code> or <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-xs">pk_live_</code>).</>}>
                      Get your publishable API key
                    </TaskCheck>
                    <TaskCheck checked={cl.pay_wallet} onChange={() => tog('pay_wallet')} timeEst="2 min"
                      sub="Use Coinbase, MetaMask, Trezor, Ledger, or any wallet. For USDC (Polygon), make sure your wallet supports the Polygon network.">
                      Have a wallet address ready
                    </TaskCheck>
                    <TaskCheck checked={cl.pay_enabled} onChange={() => tog('pay_enabled')} timeEst="1 min"
                      sub="Fill in the configuration below and toggle 'Enable Payments'. The Pay button will then appear on all quotes.">
                      Configure & enable payments below
                    </TaskCheck>
                  </div>

                  <LinkCard href="https://dashboard.moonpay.com" label="Go to MoonPay Dashboard" badge="Free account" />

                  {/* Configuration */}
                  <div className="space-y-4 border-t border-gray-100 dark:border-gray-700 pt-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">Configuration</h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={paymentSettings.enabled} onChange={(e) => setPaymentSettings({ enabled: e.target.checked })} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:after:border-gray-600 peer-checked:bg-blue-600" />
                        <span className="ml-2 text-sm font-semibold text-gray-700 dark:text-gray-300">{paymentSettings.enabled ? 'Enabled' : 'Disabled'}</span>
                      </label>
                    </div>

                    {/* Environment */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Environment</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setPaymentSettings({ environment: 'sandbox' })}
                          className={`py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all ${paymentSettings.environment === 'sandbox' ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'}`}>
                          🧪 Sandbox (Test)
                        </button>
                        <button onClick={() => setPaymentSettings({ environment: 'production' })}
                          className={`py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all ${paymentSettings.environment === 'production' ? 'border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'}`}>
                          🟢 Production (Live)
                        </button>
                      </div>
                    </div>

                    {/* API Key */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">MoonPay Publishable API Key</label>
                      <div className="relative">
                        <input type={showKey ? 'text' : 'password'} className="input-field pr-20 font-mono text-sm w-full"
                          placeholder={paymentSettings.environment === 'sandbox' ? 'pk_test_...' : 'pk_live_...'}
                          value={paymentSettings.moonpayApiKey}
                          onChange={(e) => setPaymentSettings({ moonpayApiKey: e.target.value.trim() })} />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <button onClick={() => setShowKey(!showKey)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title={showKey ? 'Hide' : 'Show'}>
                            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          {paymentSettings.moonpayApiKey && (
                            <button onClick={() => copyText(paymentSettings.moonpayApiKey, 'key')} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title="Copy">
                              {copied === 'key' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Your <strong>publishable</strong> key is safe client-side. Never enter your secret key.</p>
                    </div>

                    {/* Wallet Address */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Wallet Address (receives payments)</label>
                      <div className="relative">
                        <input type="text" className="input-field font-mono text-sm w-full pr-10"
                          placeholder="0x... or bc1... or your exchange deposit address"
                          value={paymentSettings.walletAddress}
                          onChange={(e) => setPaymentSettings({ walletAddress: e.target.value.trim() })} />
                        {paymentSettings.walletAddress && (
                          <button onClick={() => copyText(paymentSettings.walletAddress, 'wallet')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title="Copy">
                            {copied === 'wallet' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Default Currency */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Default Payment Currency</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {CURRENCIES.map((c) => (
                          <button key={c.id} onClick={() => setPaymentSettings({ defaultCurrency: c.id })}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${paymentSettings.defaultCurrency === c.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{c.label}</span>
                                {c.badge && <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">{c.badge}</span>}
                              </div>
                              <div className="text-xs text-gray-400 dark:text-gray-500">{c.desc}</div>
                            </div>
                            {paymentSettings.defaultCurrency === c.id && <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Validation status */}
                    {paymentSettings.enabled && (
                      <div className={`rounded-xl p-4 text-sm flex items-start gap-3 ${paymentSettings.moonpayApiKey && paymentSettings.walletAddress ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'}`}>
                        {paymentSettings.moonpayApiKey && paymentSettings.walletAddress ? (
                          <><CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-green-800 dark:text-green-300">Ready to accept payments!</p>
                              <p className="text-green-700 dark:text-green-400 mt-0.5">
                                "Pay Invoice" button will appear on all quotes. Clients pay in {CURRENCIES.find((c) => c.id === paymentSettings.defaultCurrency)?.label || paymentSettings.defaultCurrency}.
                                {paymentSettings.environment === 'sandbox' && ' (Sandbox — no real money charged)'}
                              </p>
                            </div></>
                        ) : (
                          <><AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-amber-800 dark:text-amber-300">Missing required fields</p>
                              <ul className="text-amber-700 dark:text-amber-400 mt-0.5 space-y-0.5">
                                {!paymentSettings.moonpayApiKey && <li>• MoonPay API key is required</li>}
                                {!paymentSettings.walletAddress && <li>• Wallet address is required</li>}
                              </ul>
                            </div></>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Info box */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed space-y-2">
                    <p><strong className="text-gray-700 dark:text-gray-300">Why MoonPay?</strong> Licensed, regulated provider used by 20M+ customers. Handles KYC/AML so you don't have to. Visa, Mastercard, Apple Pay, Google Pay, bank transfer supported.</p>
                    <p><strong className="text-gray-700 dark:text-gray-300">Why stablecoins?</strong> USDC is pegged 1:1 to USD — no volatility. $1,500 invoice = $1,500 USDC. Convert to fiat on any exchange anytime.</p>
                    <p><strong className="text-gray-700 dark:text-gray-300">Fees:</strong> MoonPay charges the buyer ~1–4.5% depending on method. You receive the exact amount with no seller fees.</p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(4)} className="btn-secondary">← Back</button>
                  </div>
                </>)}
              </div>
            )}
          </div>
        )
      })}

      {/* ── Reset button ────────────────────────────────── */}
      <div className="text-center pt-2">
        <button onClick={() => { if (window.confirm('Reset all Go Live progress? This cannot be undone.')) resetChecklist() }}
          className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-red-500 transition-colors font-medium">
          <RotateCcw className="w-3.5 h-3.5" /> Reset All Progress
        </button>
      </div>
    </div>
  )
}
