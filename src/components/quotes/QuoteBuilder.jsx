import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Package, Wrench, Truck, Plus, Trash2, ChevronDown,
  Save, Printer, ArrowLeft, CheckCircle, FileText, Send,
  DollarSign, Info, User, Building2, Phone, Mail, MapPin, CalendarClock
} from 'lucide-react'
import useStore from '../../store'
import { stateTaxData, stateList } from '../../data/taxDatabase'
import { generatePDF } from '../../utils/pdfExport'
import { computeLines, formatMoney, newLine, optionLabel, OPTION_NAMES, MAX_OPTIONS } from '../../utils/quoteMath'
import FileUploader from './FileUploader'
import OptionTabs from './OptionTabs'
import SharePanel from './SharePanel'
import { buildProposalUrl } from '../../utils/proposalLink'
import { addDays, isoDay } from '../../utils/dates'
import { DEFAULT_VALID_DAYS } from '../../utils/followUps'
import { QuoteFollowUps } from '../followups/FollowUps'
import ContactCombobox from '../contacts/ContactCombobox'
import clsx from 'clsx'

const LINE_TYPES = [
  { id: 'product', label: 'Product',        icon: Package,  color: 'text-brand-600',    bg: 'bg-brand-50',    border: 'border-brand-200',    accent: 'bg-brand-500'    },
  { id: 'service', label: 'Service',        icon: FileText, color: 'text-purple-600',  bg: 'bg-purple-50',  border: 'border-purple-200',  accent: 'bg-purple-500'  },
  { id: 'labor',   label: 'Install / Labor',icon: Wrench,   color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', accent: 'bg-emerald-500' },
  { id: 'freight', label: 'Freight',        icon: Truck,    color: 'text-orange-600',  bg: 'bg-orange-50',  border: 'border-orange-200',  accent: 'bg-orange-500'  },
]

const UNITS = [
  { value: 'ea',   label: 'Each (ea)' },
  { value: 'hr',   label: 'Hour (hr)' },
  { value: 'ft',   label: 'Foot (ft)' },
  { value: 'sqft', label: 'Sq Ft' },
  { value: 'lb',   label: 'Pound (lb)' },
  { value: 'ton',  label: 'Ton' },
  { value: 'day',  label: 'Day' },
  { value: 'job',  label: 'Per Job' },
  { value: 'lot',  label: 'Lot' },
  { value: 'mo',   label: 'Month (mo)' },
]

const STATUS_STYLES = {
  draft: { bg: 'bg-gray-100',  text: 'text-gray-700',  dot: 'bg-gray-400'  },
  sent:  { bg: 'bg-brand-100',  text: 'text-brand-700',  dot: 'bg-brand-500'  },
  won:   { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  lost:  { bg: 'bg-red-100',   text: 'text-red-600',   dot: 'bg-red-500'   },
}

// ── Line Item Card ────────────────────────────────────────
function LineItem({ line, onUpdate, onRemove }) {
  const typeInfo = LINE_TYPES.find((t) => t.id === line.type) || LINE_TYPES[0]
  const Icon = typeInfo.icon
  const { taxAmount, taxRate, taxable, total: lineTotal } = line // priced by computeLines()

  return (
    <div className={clsx('group relative bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all duration-200 hover:shadow-md overflow-hidden', typeInfo.border)}>
      {/* Color bar */}
      <div className={clsx('h-1.5 w-full', typeInfo.accent)} />

      <div className="p-5 space-y-4">
        {/* Top: badge + description + delete */}
        <div className="flex items-start gap-3">
          <span className={clsx('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 select-none', typeInfo.bg, typeInfo.color)}>
            <Icon className="w-3.5 h-3.5" />
            {typeInfo.label}
          </span>
          <input
            className="flex-1 text-base font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600 border-0 border-b-2 border-transparent focus:border-brand-400 outline-none bg-transparent px-1 py-0.5 transition-colors"
            placeholder={`Describe this ${typeInfo.label.toLowerCase()}…`}
            value={line.description}
            onChange={(e) => onUpdate(line.id, 'description', e.target.value)}
          />
          <button
            onClick={() => onRemove(line.id)}
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-gray-300 hover:text-red-500 transition-all p-1.5 hover:bg-red-50 rounded-lg flex-shrink-0"
            title="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Controls row */}
        <div className="flex items-end gap-4 flex-wrap">
          {/* Model number — products only */}
          {line.type === 'product' && (
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Model # <span className="font-medium normal-case tracking-normal">(optional)</span></label>
              <input
                className="w-40 h-12 px-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-semibold text-gray-900 dark:text-gray-100 outline-none focus:border-brand-500 transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600 placeholder:font-normal"
                placeholder="e.g. XR-15"
                maxLength={40}
                value={line.model || ''}
                onChange={(e) => onUpdate(line.id, 'model', e.target.value)}
              />
            </div>
          )}

          {/* Qty */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Qty</label>
            <div className="flex items-center">
              <button onClick={() => onUpdate(line.id, 'qty', Math.max(0.25, line.qty - 1))}
                className="w-11 h-12 rounded-l-xl bg-gray-100 dark:bg-gray-700 hover:bg-brand-50 dark:hover:bg-brand-900/30 border-2 border-r-0 border-gray-200 dark:border-gray-600 hover:border-brand-300 text-gray-500 dark:text-gray-400 hover:text-brand-600 font-bold text-2xl flex items-center justify-center transition-all active:bg-brand-100 select-none">
                −
              </button>
              <input
                type="number" min="0.25" step="0.25"
                className="w-16 h-12 text-center text-lg font-bold border-y-2 border-gray-200 dark:border-gray-600 outline-none focus:border-brand-500 bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors"
                value={line.qty}
                onChange={(e) => onUpdate(line.id, 'qty', parseFloat(e.target.value) || 1)}
              />
              <button onClick={() => onUpdate(line.id, 'qty', line.qty + 1)}
                className="w-11 h-12 rounded-r-xl bg-gray-100 dark:bg-gray-700 hover:bg-brand-50 dark:hover:bg-brand-900/30 border-2 border-l-0 border-gray-200 dark:border-gray-600 hover:border-brand-300 text-gray-500 dark:text-gray-400 hover:text-brand-600 font-bold text-2xl flex items-center justify-center transition-all active:bg-brand-100 select-none">
                +
              </button>
            </div>
          </div>

          {/* Unit */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Unit</label>
            <div className="relative">
              <select
                className="h-12 pl-3 pr-8 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-200 outline-none focus:border-brand-500 appearance-none cursor-pointer transition-colors"
                value={line.unit}
                onChange={(e) => onUpdate(line.id, 'unit', e.target.value)}
              >
                {UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Price */}
          <div className="flex-1 min-w-[150px]">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Unit Price</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-lg font-bold select-none">$</span>
              <input
                type="number" min="0" step="0.01"
                className="w-full h-12 pl-8 pr-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-lg font-bold text-gray-900 dark:text-gray-100 outline-none focus:border-brand-500 transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600 placeholder:font-normal"
                placeholder="0.00"
                value={line.price || ''}
                onChange={(e) => onUpdate(line.id, 'price', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Line total */}
          <div className="text-right flex-shrink-0 min-w-[120px]">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Total</label>
            <div className="h-12 flex flex-col items-end justify-center">
              <span className="text-xl font-extrabold text-gray-900 dark:text-gray-100">{formatMoney(lineTotal)}</span>
              <span className={clsx('text-[10px] font-bold', taxable ? 'text-amber-600' : 'text-gray-400')}>
                {taxable ? `incl. ${(taxRate * 100).toFixed(2)}% tax ($${taxAmount.toFixed(2)})` : 'TAX EXEMPT'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════
export default function QuoteBuilder() {
  const navigate = useNavigate()
  const { id } = useParams()
  const quotes      = useStore((s) => s.quotes)
  const addQuote    = useStore((s) => s.addQuote)
  const updateQuote = useStore((s) => s.updateQuote)
  const syncQuoteToPipeline = useStore((s) => s.syncQuoteToPipeline)
  const company     = useStore((s) => s.company)

  const existing = id ? quotes.find((q) => q.id === id) : null

  // "New quote" from a contact card arrives as /quotes/new?contact=<id>
  const [params] = useSearchParams()
  const ensureContact = useStore((s) => s.ensureContact)
  const preset = useStore((s) => (existing ? null : s.clients.find((c) => c.id === params.get('contact')))) || null

  const [contactId, setContactId]     = useState(existing?.contactId || preset?.id || null)
  const [clientName, setClientName]   = useState(existing?.clientName || preset?.name || '')
  const [clientEmail, setClientEmail] = useState(existing?.clientEmail || preset?.email || '')
  const [clientPhone, setClientPhone] = useState(existing?.clientPhone || preset?.phone || '')
  const [state, setState]             = useState(existing?.state || preset?.state || company.homeState || 'TX')
  const [status, setStatus]           = useState(existing?.status || 'draft')
  const [notes, setNotes]             = useState(existing?.notes || '')
  const [attachments, setAttachments] = useState(existing?.attachments || [])
  const [validUntil, setValidUntil]   = useState(
    existing?.validUntil || addDays(isoDay(existing?.createdAt), company.defaultValidDays || DEFAULT_VALID_DAYS)
  )
  const [saved, setSaved]             = useState(false)
  const [share, setShare]             = useState(null) // Send dialog: { quote, url }

  // Options: always an array; one entry = a normal quote, 2–3 = Good / Better / Best
  const [options, setOptions] = useState(() =>
    existing?.options?.length > 1
      ? existing.options
      : [{ id: crypto.randomUUID(), name: '', lines: existing?.lines?.length ? existing.lines : [newLine()] }]
  )
  const [activeId, setActiveId]           = useState(() => existing?.recommendedOptionId || options[0].id)
  const [recommendedId, setRecommendedId] = useState(existing?.recommendedOptionId || null)
  const tiered = options.length > 1
  const active = options.find((o) => o.id === activeId) || options[0]
  const activeIndex = options.indexOf(active)

  const priced = options.map((o) => ({ ...o, ...computeLines(o.lines, state) }))
  const { lines: computed, subtotal: subtotalAll, tax: taxAll, total: grandTotal } = priced[activeIndex]

  // line edits always target the active option
  const setActiveLines = (fn) => setOptions((p) => p.map((o) => (o.id === active.id ? { ...o, lines: fn(o.lines) } : o)))
  const setLine    = (lid, k, v) => setActiveLines((ls) => ls.map((l) => (l.id === lid ? { ...l, [k]: v } : l)))
  const addLine    = (type) => setActiveLines((ls) => [...ls, newLine(type)])
  const removeLine = (lid) => setActiveLines((ls) => { const n = ls.filter((l) => l.id !== lid); return n.length ? n : [newLine()] })

  // ── Good / Better / Best ──
  const addOption = () => {
    if (options.length >= MAX_OPTIONS) return
    // start the new tier as a copy of the active one — tiers usually share most lines
    const copy = { id: crypto.randomUUID(), name: OPTION_NAMES[options.length], lines: active.lines.map((l) => ({ ...l, id: crypto.randomUUID() })) }
    setOptions((p) => [...p.map((o, i) => ({ ...o, name: o.name || OPTION_NAMES[i] })), copy])
    setActiveId(copy.id)
  }
  const removeOption = (oid) => {
    const rest = options.filter((o) => o.id !== oid)
    setOptions(rest.length === 1 ? [{ ...rest[0], name: '' }] : rest)
    if (activeId === oid) setActiveId(rest[0].id)
    if (recommendedId === oid) setRecommendedId(null)
  }
  const renameOption = (oid, name) => setOptions((p) => p.map((o) => (o.id === oid ? { ...o, name } : o)))

  const pickContact = (c) => {
    setContactId(c.id)
    setClientName(c.name)
    setClientEmail(c.email || '')
    setClientPhone(c.phone || '')
    if (c.state) setState(c.state)
  }

  const buildPayload = () => ({
    // every saved quote belongs to a contact: the linked one, a match by email/name, or a new one
    contactId: ensureContact({ contactId, name: clientName, email: clientEmail, phone: clientPhone, state }),
    clientName, clientEmail, clientPhone, state, status, notes, attachments, validUntil,
    ...(tiered
      ? { options, recommendedOptionId: recommendedId && options.some((o) => o.id === recommendedId) ? recommendedId : options[0].id }
      : { options: null, recommendedOptionId: null, lines: options[0].lines }),
  })

  /** Save (create or update) and return the stored quote. */
  const persist = () => {
    const payload = buildPayload()
    let qid = existing?.id
    if (existing) {
      updateQuote(qid, payload)
    } else {
      addQuote(payload)
      qid = useStore.getState().quotes.at(-1).id
      navigate(`/quotes/${qid}`, { replace: true }) // same component instance; prevents duplicate creates
    }
    syncQuoteToPipeline(qid)
    setContactId(payload.contactId)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    return useStore.getState().quotes.find((q) => q.id === qid)
  }

  const handleSave = () => { persist() }

  const handlePrint = async () => {
    const quote = persist()
    generatePDF({ quote, company, proposalUrl: await buildProposalUrl(quote, company) })
  }

  // ── Send: online proposal link ──
  const handleShare = async () => {
    const quote = persist()
    setShare({ quote, url: await buildProposalUrl(quote, company) })
  }
  const markSent = () => {
    if (status !== 'draft' || !share) return
    setStatus('sent')
    updateQuote(share.quote.id, { status: 'sent' }) // store stamps sentAt → follow-up schedule starts
    syncQuoteToPipeline(share.quote.id)
  }

  const stateInfo = stateTaxData[state]
  const ss = STATUS_STYLES[status] || STATUS_STYLES.draft

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">

      {/* ── HEADER BAND ─────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div className="bg-gradient-to-r from-brand-600 via-brand-600 to-brand-700 px-6 py-5 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/quotes')}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all active:scale-90">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                {existing ? existing.quoteNumber : 'New Quote'}
              </h1>
              <p className="text-brand-200 text-xs font-medium mt-0.5">
                {tiered
                  ? `${options.length} options · ${priced.map((o) => formatMoney(o.total)).join(' / ')}`
                  : `${computed.length} line item${computed.length !== 1 ? 's' : ''} · ${formatMoney(grandTotal)} total`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className={clsx('flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold', ss.bg, ss.text)}>
              <span className={clsx('w-2 h-2 rounded-full', ss.dot)} />
              <select value={status} onChange={(e) => setStatus(e.target.value)}
                className="bg-transparent outline-none cursor-pointer font-bold appearance-none pr-1">
                {['draft','sent','won','lost'].map((s) => <option key={s} value={s}>{s.toUpperCase()}</option>)}
              </select>
            </div>
            <button onClick={handleSave} className={clsx(
              'flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm active:scale-95 select-none',
              saved ? 'bg-green-500 text-white' : 'bg-white text-brand-700 hover:bg-brand-50'
            )}>
              {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Saved!' : 'Save'}
            </button>
            <button onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm bg-white/20 text-white hover:bg-white/30 transition-all active:scale-95 select-none">
              <Printer className="w-4 h-4" /> PDF
            </button>
            <button onClick={handleShare}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm bg-copper-600 text-white hover:bg-copper-500 shadow-sm transition-all active:scale-95 select-none">
              <Send className="w-4 h-4" /> Send
            </button>
          </div>
        </div>
      </div>

      {/* ── FOLLOW-UPS (once sent) ──────────────────── */}
      {existing && <QuoteFollowUps quote={existing} />}

      {/* ── CLIENT DETAILS ──────────────────────────── */}
      <div className="card space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/40 flex items-center justify-center">
            <User className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight">Client Details</h2>
            <p className="text-xs text-gray-400">Who is this quote for? Start typing to pick a saved contact.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              <Building2 className="w-3.5 h-3.5" /> Client / Company Name
            </label>
            <ContactCombobox
              className="input-field text-lg font-semibold"
              placeholder="Acme Corp"
              value={clientName}
              linkedId={contactId}
              onChange={(v) => { setClientName(v); setContactId(null) }} // retyped → re-matched on save
              onPick={pickContact}
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              <Mail className="w-3.5 h-3.5" /> Email
            </label>
            <input className="input-field" type="email" placeholder="client@email.com"
              value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              <Phone className="w-3.5 h-3.5" /> Phone
            </label>
            <input className="input-field" placeholder="(555) 000-0000"
              value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              <MapPin className="w-3.5 h-3.5" /> State
            </label>
            <select className="input-field cursor-pointer font-semibold" value={state}
              onChange={(e) => setState(e.target.value)}>
              {stateList.map(({ code, name }) => <option key={code} value={code}>{name} ({code})</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="valid-until" className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              <CalendarClock className="w-3.5 h-3.5" /> Valid until
            </label>
            <input id="valid-until" type="date" className="input-field" value={validUntil} min={isoDay(existing?.createdAt)}
              onChange={(e) => setValidUntil(e.target.value)} />
          </div>
        </div>

        {stateInfo && (
          <div className="flex items-start gap-3 bg-amber-50/80 border border-amber-200/80 rounded-xl p-4">
            <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              <span className="font-bold">{stateInfo.name}:</span> {stateInfo.notes}
            </p>
          </div>
        )}
      </div>

      {/* ── ADD LINE ITEM BUTTONS ───────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg">Line Items</h2>
          <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2.5 py-1 rounded-full">{computed.length}</span>
          {tiered && <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">in {optionLabel(active, activeIndex)}</span>}
        </div>

        <OptionTabs
          options={priced}
          activeId={active.id}
          recommendedId={recommendedId || options[0].id}
          onSelect={setActiveId}
          onAdd={addOption}
          onRemove={removeOption}
          onRename={renameOption}
          onRecommend={setRecommendedId}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {LINE_TYPES.map(({ id: tid, label, icon: Icon, color, bg }) => (
            <button key={tid} onClick={() => addLine(tid)}
              className="flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-brand-400 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-200 cursor-pointer group select-none">
              <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110', bg)}>
                <Icon className={clsx('w-6 h-6', color)} />
              </div>
              <div className="text-left min-w-0">
                <div className="font-bold text-gray-800 dark:text-gray-200 text-sm truncate">{label}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">+ Add</div>
              </div>
              <Plus className="w-5 h-5 text-gray-300 group-hover:text-brand-500 ml-auto flex-shrink-0 transition-colors" />
            </button>
          ))}
        </div>

        {/* ── LINE ITEMS LIST ───────────────────────── */}
        <div className="space-y-4">
          {computed.map((line) => (
            <LineItem key={line.id} line={line} onUpdate={setLine} onRemove={removeLine} />
          ))}
        </div>
      </div>

      {/* ── TOTALS ──────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700">
        <div className="bg-white dark:bg-gray-800 p-6">
          <div className="max-w-sm ml-auto space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">Subtotal</span>
              <span className="text-gray-900 dark:text-gray-100 font-bold text-lg">{formatMoney(subtotalAll)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                Tax <span className="text-gray-400 text-xs ml-1">({stateInfo?.name || state})</span>
              </span>
              <span className="text-amber-600 font-bold text-lg">{formatMoney(taxAll)}</span>
            </div>
            <div className="border-t-2 border-dashed border-gray-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-brand-600 via-brand-600 to-brand-700 px-6 py-6 flex items-center justify-between">
          <span className="text-white/90 font-bold text-lg">{tiered ? `${optionLabel(active, activeIndex)} Total` : 'Grand Total'}</span>
          <span className="text-white font-extrabold text-4xl tracking-tight">{formatMoney(grandTotal)}</span>
        </div>
      </div>

      {/* ── NOTES ───────────────────────────────────── */}
      <div className="card space-y-4">
        <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg">Notes & Terms</h2>
        <textarea className="input-field resize-none text-sm leading-relaxed" rows={5}
          placeholder="Payment terms, delivery timeline, warranty information, special instructions…"
          value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      {/* ── ATTACHMENTS ─────────────────────────────── */}
      <div className="card">
        <FileUploader files={attachments} onChange={setAttachments} />
      </div>

      {/* ── BOTTOM ACTIONS ──────────────────────────── */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={handleSave} className={clsx(
          'flex items-center gap-2.5 px-10 py-4 rounded-2xl font-bold text-base transition-all shadow-md hover:shadow-lg active:scale-[0.97] select-none',
          saved ? 'bg-green-600 text-white' : 'bg-brand-600 hover:bg-brand-700 text-white'
        )}>
          {saved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {saved ? 'Quote Saved!' : 'Save Quote'}
        </button>
        <button onClick={handleShare}
          className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base bg-copper-600 hover:bg-copper-500 text-white transition-all shadow-md hover:shadow-lg active:scale-[0.97] select-none">
          <Send className="w-5 h-5" /> Send to Client
        </button>
        <button onClick={handlePrint}
          className="flex items-center gap-2.5 px-10 py-4 rounded-2xl font-bold text-base bg-white border-2 border-gray-200 hover:border-brand-400 text-gray-700 hover:text-brand-700 transition-all shadow-sm hover:shadow-md active:scale-[0.97] select-none">
          <Printer className="w-5 h-5" /> Export PDF
        </button>
        <button onClick={() => navigate('/quotes')}
          className="flex items-center gap-2 px-6 py-4 rounded-2xl font-medium text-sm text-gray-400 hover:text-gray-600 transition-colors ml-auto select-none">
          Cancel
        </button>
      </div>

      {share && (
        <SharePanel quote={share.quote} company={company} url={share.url} onSent={markSent} onClose={() => setShare(null)} />
      )}
    </div>
  )
}
