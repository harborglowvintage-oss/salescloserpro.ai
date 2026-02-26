import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Plus, Trash2, Edit3, Search, Filter, ChevronDown,
  Package, FileText, Wrench, Truck, DollarSign, TrendingUp,
  BarChart3, PieChart, ArrowRight, ExternalLink, X, Check, AlertCircle,
  Printer, Send,
} from 'lucide-react'
import useStore from '../../store'
import clsx from 'clsx'
import { format } from 'date-fns'
import { generatePO_PDF } from '../../utils/pdfExport'

/* ── helpers ─────────────────────────────────────────────── */
const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const pct = (n) => `${n.toFixed(1)}%`

const LINE_TYPE_META = {
  product: { label: 'Product',  icon: Package,  color: 'text-blue-600',    bg: 'bg-blue-50',    accent: 'bg-blue-500'    },
  service: { label: 'Service',  icon: FileText,  color: 'text-purple-600',  bg: 'bg-purple-50',  accent: 'bg-purple-500'  },
  labor:   { label: 'Labor',    icon: Wrench,    color: 'text-emerald-600', bg: 'bg-emerald-50', accent: 'bg-emerald-500' },
  freight: { label: 'Freight',  icon: Truck,     color: 'text-orange-600',  bg: 'bg-orange-50',  accent: 'bg-orange-500'  },
}

const PO_STATUSES = [
  { id: 'draft',    label: 'Draft',    dot: 'bg-gray-400',   badge: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'   },
  { id: 'issued',   label: 'Issued',   dot: 'bg-indigo-500', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' },
  { id: 'ordered',  label: 'Ordered',  dot: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'   },
  { id: 'received', label: 'Received', dot: 'bg-amber-500',  badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'  },
  { id: 'paid',     label: 'Paid',     dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'  },
]
const statusMeta = (s) => PO_STATUSES.find((p) => p.id === s) || PO_STATUSES[0]

/* SVG donut colors */
const DONUT_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#ef4444', '#06b6d4']

/* ── Tab Button ──────────────────────────────────────────── */
function TabBtn({ active, icon: Icon, label, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all select-none',
        active
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
      {count !== undefined && (
        <span className={clsx('text-xs font-bold px-2 py-0.5 rounded-full', active ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400')}>
          {count}
        </span>
      )}
    </button>
  )
}

/* ── Status Badge ────────────────────────────────────────── */
function StatusBadge({ status }) {
  const m = statusMeta(status)
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold', m.badge)}>
      <span className={clsx('w-2 h-2 rounded-full', m.dot)} />
      {m.label}
    </span>
  )
}

/* ── SVG Donut Chart ─────────────────────────────────────── */
function DonutChart({ data, size = 180 }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  if (total === 0) return <div className="text-gray-400 text-sm text-center py-8">No data</div>
  const radius = 60, cx = 90, cy = 90, strokeWidth = 28
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} viewBox="0 0 180 180">
        {data.map((d, i) => {
          const pctVal = d.value / total
          const dash = pctVal * circumference
          const gap = circumference - dash
          const currentOffset = offset
          offset += dash
          return (
            <circle
              key={i}
              cx={cx} cy={cy} r={radius}
              fill="none"
              stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-currentOffset}
              transform={`rotate(-90 ${cx} ${cy})`}
              className="transition-all duration-500"
            />
          )
        })}
        <text x={cx} y={cy - 6} textAnchor="middle" className="fill-gray-900 dark:fill-gray-100 text-xl font-bold" style={{ fontSize: '18px', fontWeight: 700 }}>
          ${fmt(total)}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" style={{ fontSize: '11px' }}>
          Total Cost
        </text>
      </svg>
      <div className="flex flex-wrap justify-center gap-3">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
            <span className="text-gray-700 dark:text-gray-300 font-medium">{d.label}</span>
            <span className="text-gray-400 font-semibold">${fmt(d.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Horizontal Bar Chart ────────────────────────────────── */
function HBarChart({ data, label = 'Margin %' }) {
  const maxVal = Math.max(...data.map((d) => Math.abs(d.value)), 1)
  if (data.length === 0) return <div className="text-gray-400 text-sm text-center py-8">No data</div>

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-widest">
        <span>Quote</span>
        <span>{label}</span>
      </div>
      {data.map((d, i) => {
        const width = Math.min((Math.abs(d.value) / maxVal) * 100, 100)
        const isNeg = d.value < 0
        return (
          <div key={i} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[60%]">{d.label}</span>
              <span className={clsx('font-bold', isNeg ? 'text-red-500' : 'text-green-600 dark:text-green-400')}>
                {pct(d.value)}
              </span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={clsx('h-full rounded-full transition-all duration-500', isNeg ? 'bg-red-400' : 'bg-green-500')}
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */
export default function PurchaseOrders() {
  const navigate = useNavigate()
  const quotes = useStore((s) => s.quotes)
  const purchaseOrders = useStore((s) => s.purchaseOrders)
  const addPO = useStore((s) => s.addPO)
  const updatePO = useStore((s) => s.updatePO)
  const deletePO = useStore((s) => s.deletePO)

  const [tab, setTab] = useState('list')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)

  /* form state */
  const [form, setForm] = useState({
    quoteId: '', lineId: '', vendor: '', vendorContact: '', shipToAddress: '',
    description: '', qty: 1, unitCost: 0, status: 'draft', notes: '',
  })
  const resetForm = () => {
    setForm({ quoteId: '', lineId: '', vendor: '', vendorContact: '', shipToAddress: '', description: '', qty: 1, unitCost: 0, status: 'draft', notes: '' })
    setEditId(null)
    setShowForm(false)
  }

  /* ── derived data ────────────────────────────────────── */
  /* quote line lookup */
  const quoteLinesMap = useMemo(() => {
    const map = {}
    quotes.forEach((q) => {
      (q.lines || []).forEach((l) => {
        map[`${q.id}|${l.id}`] = { quote: q, line: l }
      })
    })
    return map
  }, [quotes])

  /* enriched POs with margin */
  const enrichedPOs = useMemo(() => {
    return purchaseOrders.map((po) => {
      const match = quoteLinesMap[`${po.quoteId}|${po.lineId}`]
      const sellPrice = match ? match.line.qty * match.line.price : 0
      const cost = po.qty * po.unitCost
      const margin = sellPrice - cost
      const marginPct = sellPrice > 0 ? (margin / sellPrice) * 100 : 0
      return {
        ...po,
        sellPrice,
        cost,
        margin,
        marginPct,
        quoteNumber: match?.quote?.quoteNumber || '—',
        clientName: match?.quote?.clientName || '—',
        lineType: match?.line?.type || 'product',
        lineDescription: match?.line?.description || po.description,
      }
    })
  }, [purchaseOrders, quoteLinesMap])

  /* filtered list */
  const filteredPOs = useMemo(() => {
    return enrichedPOs.filter((po) => {
      if (filterStatus !== 'all' && po.status !== filterStatus) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          po.poNumber?.toLowerCase().includes(q) ||
          po.vendor?.toLowerCase().includes(q) ||
          po.description?.toLowerCase().includes(q) ||
          po.quoteNumber?.toLowerCase().includes(q) ||
          po.clientName?.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [enrichedPOs, filterStatus, search])

  /* margin by quote */
  const marginByQuote = useMemo(() => {
    const map = {}
    enrichedPOs.forEach((po) => {
      const key = po.quoteId || 'unlinked'
      if (!map[key]) map[key] = { label: po.quoteNumber, sell: 0, cost: 0 }
      map[key].sell += po.sellPrice
      map[key].cost += po.cost
    })
    return Object.values(map)
      .map((d) => ({ ...d, margin: d.sell - d.cost, marginPct: d.sell > 0 ? ((d.sell - d.cost) / d.sell) * 100 : 0 }))
      .sort((a, b) => b.marginPct - a.marginPct)
  }, [enrichedPOs])

  /* cost by line type */
  const costByType = useMemo(() => {
    const map = {}
    enrichedPOs.forEach((po) => {
      const t = po.lineType || 'product'
      map[t] = (map[t] || 0) + po.cost
    })
    return Object.entries(map).map(([type, value]) => ({
      label: LINE_TYPE_META[type]?.label || type,
      value,
    }))
  }, [enrichedPOs])

  /* KPIs */
  const kpis = useMemo(() => {
    const totalSell = enrichedPOs.reduce((s, p) => s + p.sellPrice, 0)
    const totalCost = enrichedPOs.reduce((s, p) => s + p.cost, 0)
    const totalMargin = totalSell - totalCost
    const avgMargin = enrichedPOs.length > 0 ? enrichedPOs.reduce((s, p) => s + p.marginPct, 0) / enrichedPOs.length : 0
    return { totalSell, totalCost, totalMargin, avgMargin, count: enrichedPOs.length }
  }, [enrichedPOs])

  /* available quotes with lines for the form */
  const quotesWithLines = useMemo(() => quotes.filter((q) => q.lines && q.lines.length > 0), [quotes])

  const selectedQuote = quotesWithLines.find((q) => q.id === form.quoteId)

  /* ── handlers ────────────────────────────────────────── */
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.vendor.trim()) return
    if (editId) {
      updatePO(editId, { ...form })
    } else {
      addPO({ ...form })
    }
    resetForm()
  }

  const handleEdit = (po) => {
    setForm({
      quoteId: po.quoteId || '', lineId: po.lineId || '',
      vendor: po.vendor || '', vendorContact: po.vendorContact || '',
      shipToAddress: po.shipToAddress || '',
      description: po.description || '', qty: po.qty || 1,
      unitCost: po.unitCost || 0, status: po.status || 'draft', notes: po.notes || '',
    })
    setEditId(po.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this purchase order?')) deletePO(id)
  }

  /* ── Issue PO: mark as issued + generate PDF ─────── */
  const handleIssuePO = (po) => {
    const enriched = enrichedPOs.find((p) => p.id === po.id) || po
    const company = useStore.getState().company
    // Update status to issued with timestamp
    if (po.status === 'draft') {
      updatePO(po.id, { status: 'issued', issuedAt: new Date().toISOString() })
    }
    // Generate and download PO PDF
    generatePO_PDF({ po: enriched, company })
  }

  /* ── Print PO: generate PDF without changing status ─ */
  const handlePrintPO = (po) => {
    const enriched = enrichedPOs.find((p) => p.id === po.id) || po
    const company = useStore.getState().company
    generatePO_PDF({ po: enriched, company })
  }

  /* ══════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════ */
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            Purchase Orders
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-[52px]">
            Track vendor costs, manage POs and analyze margins per quote line item.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="btn-primary flex items-center gap-2 py-3 px-5 text-sm"
        >
          <Plus className="w-4 h-4" />
          New PO
        </button>
      </div>

      {/* ── KPI Strip ───────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total POs',    value: kpis.count,                      color: 'bg-indigo-500' },
          { label: 'Total Sold',   value: `$${fmt(kpis.totalSell)}`,      color: 'bg-blue-500'   },
          { label: 'Total Cost',   value: `$${fmt(kpis.totalCost)}`,      color: 'bg-orange-500' },
          { label: 'Total Margin', value: `$${fmt(kpis.totalMargin)}`,    color: 'bg-green-500'  },
          { label: 'Avg Margin',   value: pct(kpis.avgMargin),            color: 'bg-emerald-500'},
        ].map((k) => (
          <div key={k.label} className="card flex items-center gap-3 py-3 px-4">
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', k.color)}>
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{k.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ─────────────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap">
        <TabBtn active={tab === 'list'}    icon={ShoppingCart} label="PO List"         count={purchaseOrders.length} onClick={() => setTab('list')} />
        <TabBtn active={tab === 'margin'}  icon={TrendingUp}   label="Margin Table"    onClick={() => setTab('margin')} />
        <TabBtn active={tab === 'charts'}  icon={BarChart3}    label="Charts"          onClick={() => setTab('charts')} />
      </div>

      {/* ════════════════════════════════════════════════════
         TAB 1: PO LIST + FORM
         ════════════════════════════════════════════════════ */}
      {tab === 'list' && (
        <div className="space-y-4">
          {/* form */}
          {showForm && (
            <div className="card border-2 border-blue-200 dark:border-blue-800 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                  {editId ? 'Edit Purchase Order' : 'Issue New Purchase Order'}
                </h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Link to quote */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Link to Quote</label>
                    <div className="relative">
                      <select
                        className="input-field cursor-pointer font-semibold w-full"
                        value={form.quoteId}
                        onChange={(e) => setForm((f) => ({ ...f, quoteId: e.target.value, lineId: '' }))}
                      >
                        <option value="">— No quote —</option>
                        {quotesWithLines.map((q) => (
                          <option key={q.id} value={q.id}>
                            {q.quoteNumber} — {q.clientName || 'No client'} (${fmt(q.total || 0)})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Quote Line Item</label>
                    <select
                      className="input-field cursor-pointer font-semibold w-full"
                      value={form.lineId}
                      onChange={(e) => setForm((f) => ({ ...f, lineId: e.target.value }))}
                      disabled={!selectedQuote}
                    >
                      <option value="">— Select line —</option>
                      {selectedQuote?.lines?.map((l) => {
                        const meta = LINE_TYPE_META[l.type] || LINE_TYPE_META.product
                        return (
                          <option key={l.id} value={l.id}>
                            [{meta.label}] {l.description || 'Untitled'} — {l.qty} × ${fmt(l.price)}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </div>

                {/* Vendor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Vendor / Supplier *</label>
                    <input
                      className="input-field font-semibold w-full"
                      placeholder="ABC Distribution"
                      value={form.vendor}
                      onChange={(e) => setForm((f) => ({ ...f, vendor: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Vendor Contact</label>
                    <input
                      className="input-field w-full"
                      placeholder="John Doe · (555) 123-4567"
                      value={form.vendorContact}
                      onChange={(e) => setForm((f) => ({ ...f, vendorContact: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Ship To Address */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Ship To Address</label>
                  <input
                    className="input-field w-full"
                    placeholder="123 Main St, Suite 200, Dallas, TX 75201"
                    value={form.shipToAddress}
                    onChange={(e) => setForm((f) => ({ ...f, shipToAddress: e.target.value }))}
                  />
                </div>

                {/* Description + Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Description</label>
                    <input
                      className="input-field w-full"
                      placeholder="What are you purchasing?"
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Status</label>
                    <select
                      className="input-field cursor-pointer font-semibold w-full"
                      value={form.status}
                      onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    >
                      {PO_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Qty + Unit Cost */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Qty</label>
                    <input
                      type="number" min="0.25" step="0.25"
                      className="input-field font-bold text-lg w-full"
                      value={form.qty}
                      onChange={(e) => setForm((f) => ({ ...f, qty: parseFloat(e.target.value) || 1 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Unit Cost ($)</label>
                    <input
                      type="number" min="0" step="0.01"
                      className="input-field font-bold text-lg w-full"
                      placeholder="0.00"
                      value={form.unitCost || ''}
                      onChange={(e) => setForm((f) => ({ ...f, unitCost: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="col-span-2 flex items-end">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-5 py-3 w-full">
                      <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Line Total</div>
                      <div className="text-xl font-extrabold text-gray-900 dark:text-gray-100">${fmt(form.qty * form.unitCost)}</div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Notes</label>
                  <textarea
                    className="input-field w-full resize-none text-sm"
                    rows={2}
                    placeholder="Lead time, tracking number, special instructions…"
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 flex-wrap">
                  <button type="submit" className="btn-primary flex items-center gap-2 py-3 px-6 text-sm">
                    <Check className="w-4 h-4" />
                    {editId ? 'Update PO' : 'Save PO'}
                  </button>
                  {!editId && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        if (!form.vendor.trim()) return
                        addPO({ ...form, status: 'issued', issuedAt: new Date().toISOString() })
                        // Generate PDF for the newly created PO
                        const allPOs = useStore.getState().purchaseOrders
                        const newest = allPOs[allPOs.length - 1]
                        if (newest) {
                          const match = quoteLinesMap[`${newest.quoteId}|${newest.lineId}`]
                          const sellPrice = match ? match.line.qty * match.line.price : 0
                          const cost = newest.qty * newest.unitCost
                          generatePO_PDF({
                            po: {
                              ...newest,
                              sellPrice,
                              cost,
                              margin: sellPrice - cost,
                              marginPct: sellPrice > 0 ? ((sellPrice - cost) / sellPrice) * 100 : 0,
                              quoteNumber: match?.quote?.quoteNumber || '—',
                              lineType: match?.line?.type || 'product',
                              lineDescription: match?.line?.description || newest.description,
                            },
                            company: useStore.getState().company,
                          })
                        }
                        resetForm()
                      }}
                      className="flex items-center gap-2 py-3 px-6 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
                    >
                      <Send className="w-4 h-4" />
                      Issue PO & Download PDF
                    </button>
                  )}
                  {editId && (
                    <button
                      type="button"
                      onClick={() => {
                        const po = enrichedPOs.find(p => p.id === editId)
                        if (po) handlePrintPO(po)
                      }}
                      className="flex items-center gap-2 py-3 px-6 text-sm font-semibold rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
                    >
                      <Printer className="w-4 h-4" />
                      Download PO PDF
                    </button>
                  )}
                  <button type="button" onClick={resetForm} className="px-5 py-3 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search / Filter bar */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="input-field pl-10 w-full"
                placeholder="Search POs…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                className="input-field pr-8 cursor-pointer font-semibold"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                {PO_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* PO Table */}
          {filteredPOs.length === 0 ? (
            <div className="card text-center py-16">
              <ShoppingCart className="w-14 h-14 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="font-bold text-gray-700 dark:text-gray-300 text-lg mb-1">
                {purchaseOrders.length === 0 ? 'No purchase orders yet' : 'No matching POs'}
              </h3>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">
                {purchaseOrders.length === 0
                  ? 'Issue your first PO to start tracking vendor costs against your quotes.'
                  : 'Try adjusting your search or filter.'}
              </p>
              {purchaseOrders.length === 0 && (
                <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary py-2 px-5 text-sm inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Issue First PO
                </button>
              )}
            </div>
          ) : (
            <div className="card overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      {['PO #', 'Vendor', 'Description', 'Quote', 'Qty × Cost', 'Total', 'Sell Price', 'Margin', 'Status', ''].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredPOs.map((po) => {
                      const typeMeta = LINE_TYPE_META[po.lineType] || LINE_TYPE_META.product
                      const TypeIcon = typeMeta.icon
                      return (
                        <tr key={po.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="px-4 py-3 font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">{po.poNumber}</td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-gray-800 dark:text-gray-200">{po.vendor}</div>
                            {po.vendorContact && <div className="text-xs text-gray-400 dark:text-gray-500">{po.vendorContact}</div>}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <TypeIcon className={clsx('w-4 h-4 flex-shrink-0', typeMeta.color)} />
                              <span className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{po.lineDescription || po.description || '—'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {po.quoteId ? (
                              <button
                                onClick={() => navigate(`/quotes/${po.quoteId}`)}
                                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-xs inline-flex items-center gap-1"
                              >
                                {po.quoteNumber} <ExternalLink className="w-3 h-3" />
                              </button>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">
                            {po.qty} × ${fmt(po.unitCost)}
                          </td>
                          <td className="px-4 py-3 font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">${fmt(po.cost)}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">${fmt(po.sellPrice)}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={clsx('font-bold', po.margin >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500')}>
                              {po.margin >= 0 ? '+' : ''}{pct(po.marginPct)}
                            </span>
                          </td>
                          <td className="px-4 py-3"><StatusBadge status={po.status} /></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              {po.status === 'draft' ? (
                                <button onClick={() => handleIssuePO(po)} className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors" title="Issue PO & Download PDF">
                                  <Send className="w-4 h-4" />
                                </button>
                              ) : (
                                <button onClick={() => handlePrintPO(po)} className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors" title="Print / Download PO PDF">
                                  <Printer className="w-4 h-4" />
                                </button>
                              )}
                              <button onClick={() => handleEdit(po)} className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors" title="Edit">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(po.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors" title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════
         TAB 2: MARGIN TABLE
         ════════════════════════════════════════════════════ */}
      {tab === 'margin' && (
        <div className="space-y-4">
          {enrichedPOs.length === 0 ? (
            <div className="card text-center py-16">
              <TrendingUp className="w-14 h-14 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="font-bold text-gray-700 dark:text-gray-300 text-lg mb-1">No margin data yet</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500">Issue POs linked to quote line items to see sell vs. cost margins.</p>
            </div>
          ) : (
            <div className="card overflow-hidden p-0">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Line-by-Line Margin Analysis
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Sell price from quote line vs. PO cost</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      {['PO #', 'Quote', 'Type', 'Description', 'Sell Price', 'PO Cost', 'Margin ($)', 'Margin (%)', 'Status'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {enrichedPOs.map((po) => {
                      const typeMeta = LINE_TYPE_META[po.lineType] || LINE_TYPE_META.product
                      return (
                        <tr key={po.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="px-4 py-3 font-bold text-gray-900 dark:text-gray-100">{po.poNumber}</td>
                          <td className="px-4 py-3 text-xs font-semibold text-blue-600 dark:text-blue-400">{po.quoteNumber}</td>
                          <td className="px-4 py-3">
                            <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold', typeMeta.bg, typeMeta.color)}>
                              {typeMeta.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{po.lineDescription || '—'}</td>
                          <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">${fmt(po.sellPrice)}</td>
                          <td className="px-4 py-3 font-semibold text-orange-600 dark:text-orange-400">${fmt(po.cost)}</td>
                          <td className={clsx('px-4 py-3 font-bold', po.margin >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500')}>
                            {po.margin >= 0 ? '+' : ''}${fmt(po.margin)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className={clsx('h-full rounded-full', po.marginPct >= 0 ? 'bg-green-500' : 'bg-red-400')}
                                  style={{ width: `${Math.min(Math.abs(po.marginPct), 100)}%` }}
                                />
                              </div>
                              <span className={clsx('font-bold text-xs', po.marginPct >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500')}>
                                {pct(po.marginPct)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3"><StatusBadge status={po.status} /></td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-600 font-bold">
                      <td colSpan={4} className="px-4 py-3 text-gray-700 dark:text-gray-300 uppercase text-xs tracking-widest">Totals</td>
                      <td className="px-4 py-3 text-gray-900 dark:text-gray-100">${fmt(kpis.totalSell)}</td>
                      <td className="px-4 py-3 text-orange-600 dark:text-orange-400">${fmt(kpis.totalCost)}</td>
                      <td className={clsx('px-4 py-3', kpis.totalMargin >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500')}>
                        {kpis.totalMargin >= 0 ? '+' : ''}${fmt(kpis.totalMargin)}
                      </td>
                      <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400">{pct(kpis.avgMargin)} avg</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════
         TAB 3: CHARTS & ANALYTICS
         ════════════════════════════════════════════════════ */}
      {tab === 'charts' && (
        <div className="space-y-6">
          {enrichedPOs.length === 0 ? (
            <div className="card text-center py-16">
              <PieChart className="w-14 h-14 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="font-bold text-gray-700 dark:text-gray-300 text-lg mb-1">No chart data yet</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500">Issue POs to see cost breakdowns and margin analytics.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cost by Line Type (Donut) */}
              <div className="card">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6">
                  <PieChart className="w-5 h-5 text-blue-600" />
                  Cost by Line Type
                </h3>
                <DonutChart data={costByType} />
              </div>

              {/* Margin by Quote (Bar) */}
              <div className="card">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Margin % by Quote
                </h3>
                <HBarChart data={marginByQuote.map((d) => ({ label: d.label !== '—' ? d.label : 'Unlinked', value: d.marginPct }))} />
              </div>

              {/* Margin Distribution per Quote */}
              <div className="card lg:col-span-2">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  Sell vs. Cost by Quote
                </h3>
                {marginByQuote.length === 0 ? (
                  <div className="text-gray-400 text-sm text-center py-8">No data</div>
                ) : (
                  <div className="space-y-4">
                    {marginByQuote.map((d, i) => {
                      const maxBar = Math.max(...marginByQuote.map((m) => Math.max(m.sell, m.cost)), 1)
                      const sellWidth = (d.sell / maxBar) * 100
                      const costWidth = (d.cost / maxBar) * 100
                      return (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">{d.label}</span>
                            <span className={clsx('text-xs font-bold', d.margin >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500')}>
                              Margin: ${fmt(d.margin)} ({pct(d.marginPct)})
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] w-10 text-gray-400 font-semibold">Sell</span>
                              <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${sellWidth}%` }} />
                              </div>
                              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 w-24 text-right">${fmt(d.sell)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] w-10 text-gray-400 font-semibold">Cost</span>
                              <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${costWidth}%` }} />
                              </div>
                              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 w-24 text-right">${fmt(d.cost)}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div className="flex items-center gap-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-gray-500 dark:text-gray-400 font-medium">Sell Price</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="w-3 h-3 rounded-full bg-orange-500" />
                        <span className="text-gray-500 dark:text-gray-400 font-medium">PO Cost</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
