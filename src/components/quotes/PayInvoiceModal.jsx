import { useState, useEffect, useRef } from 'react'
import {
  X, CreditCard, ExternalLink, Shield, Copy, Check, Wallet,
  AlertCircle, ArrowRight, Zap, Loader2,
} from 'lucide-react'
import useStore from '../../store'
import clsx from 'clsx'

const CURRENCY_LABELS = {
  usdc_polygon: 'USDC (Polygon)',
  usdc: 'USDC (Ethereum)',
  usdt: 'USDT (Tether)',
  eth: 'ETH',
  btc: 'BTC',
  matic_polygon: 'MATIC (Polygon)',
}

/**
 * Build a MoonPay widget URL.
 * @see https://dev.moonpay.com/docs/on-ramp-configure-widget
 */
function buildMoonPayUrl({ apiKey, walletAddress, currencyCode, amount, environment, quoteNumber, clientEmail }) {
  const base = environment === 'production'
    ? 'https://buy.moonpay.com'
    : 'https://buy-sandbox.moonpay.com'

  const params = new URLSearchParams({
    apiKey,
    walletAddress,
    currencyCode: currencyCode.replace('_', ''), // moonpay uses e.g. "usdcpolygon"
    baseCurrencyAmount: String(amount),
    baseCurrencyCode: 'usd',
    theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    colorCode: '#2563EB',
    language: 'en',
  })

  // Optional pre-fill
  if (clientEmail) params.set('email', clientEmail)
  if (quoteNumber) params.set('externalTransactionId', quoteNumber)

  return `${base}?${params.toString()}`
}

export default function PayInvoiceModal({ open, onClose, quote, grandTotal }) {
  const paymentSettings = useStore((s) => s.paymentSettings)
  const [copied, setCopied] = useState('')
  const [launching, setLaunching] = useState(false)
  const backdropRef = useRef(null)

  // Lock body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const isConfigured = paymentSettings.enabled && paymentSettings.moonpayApiKey && paymentSettings.walletAddress
  const amount = grandTotal || 0
  const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const currencyLabel = CURRENCY_LABELS[paymentSettings.defaultCurrency] || paymentSettings.defaultCurrency

  const copyText = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label)
      setTimeout(() => setCopied(''), 1500)
    })
  }

  const handleLaunchMoonPay = () => {
    setLaunching(true)
    const url = buildMoonPayUrl({
      apiKey: paymentSettings.moonpayApiKey,
      walletAddress: paymentSettings.walletAddress,
      currencyCode: paymentSettings.defaultCurrency,
      amount,
      environment: paymentSettings.environment,
      quoteNumber: quote?.quoteNumber,
      clientEmail: quote?.clientEmail,
    })
    window.open(url, '_blank', 'noopener,noreferrer')
    setTimeout(() => setLaunching(false), 2000)
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === backdropRef.current) onClose() }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-5 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Pay Invoice</h2>
              <p className="text-white/70 text-xs">{quote?.quoteNumber || 'Quote'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Amount due */}
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Amount Due</div>
            <div className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">${fmt(amount)}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {quote?.clientName && <span>For: {quote.clientName}</span>}
            </div>
          </div>

          {!isConfigured ? (
            /* Not configured state */
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-amber-800 dark:text-amber-300">Payments not configured</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                    To accept payments, set up MoonPay in <strong>Go Live → Step 5 (Payments)</strong>.
                    You'll need a MoonPay account and a wallet address.
                  </p>
                </div>
              </div>
              <a
                href="#/go-live"
                onClick={onClose}
                className="inline-flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200"
              >
                Go to Payment Setup <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            /* Configured — show payment options */
            <>
              {/* MoonPay checkout button */}
              <button
                onClick={handleLaunchMoonPay}
                disabled={launching || amount <= 0}
                className={clsx(
                  'w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] select-none',
                  launching
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-wait'
                    : 'bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700'
                )}
              >
                {launching ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Opening MoonPay…</>
                ) : (
                  <><Zap className="w-5 h-5" /> Pay ${fmt(amount)} with MoonPay</>
                )}
              </button>

              <div className="text-center text-xs text-gray-400 dark:text-gray-500 -mt-3">
                Powered by MoonPay · Card, Bank, Apple Pay, Google Pay
              </div>

              {/* Payment details */}
              <div className="space-y-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Payment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Currency</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{currencyLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Environment</span>
                    <span className={clsx('font-semibold', paymentSettings.environment === 'sandbox' ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400')}>
                      {paymentSettings.environment === 'sandbox' ? '🧪 Sandbox' : '🟢 Live'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Receiving Wallet</span>
                    <div className="flex items-center gap-1.5">
                      <code className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded px-2 py-0.5 font-mono text-gray-700 dark:text-gray-300 max-w-[180px] truncate">
                        {paymentSettings.walletAddress}
                      </code>
                      <button
                        onClick={() => copyText(paymentSettings.walletAddress, 'wallet')}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                        title="Copy wallet"
                      >
                        {copied === 'wallet' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security note */}
              <div className="flex items-start gap-3 text-xs text-gray-400 dark:text-gray-500">
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>
                  Payments are processed securely by MoonPay. Your card details are never shared with this app.
                  MoonPay is regulated and licensed in the US, EU, and UK.
                </p>
              </div>

              {paymentSettings.environment === 'sandbox' && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span><strong>Sandbox Mode</strong> — This is a test transaction. No real money will be charged. Switch to Production in Go Live → Payments when ready.</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes animate-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-in { animation: animate-in 0.2s ease-out; }
      `}</style>
    </div>
  )
}
