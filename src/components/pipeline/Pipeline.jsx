import { useState } from 'react'
import { Plus, X, DollarSign, ChevronRight, ChevronLeft, FileText, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useStore from '../../store'
import { format } from 'date-fns'

function DealCard({ deal, stageId, stages }) {
  const navigate = useNavigate()
  const moveDeal = useStore((s) => s.moveDeal)
  const deleteDeal = useStore((s) => s.deleteDeal)
  const purchaseOrders = useStore((s) => s.purchaseOrders)
  const stageIndex = stages.findIndex((s) => s.id === stageId)

  // Count POs linked to this deal's quote
  const linkedPOs = deal.quoteId
    ? purchaseOrders.filter((po) => po.quoteId === deal.quoteId)
    : []

  const daysSince = Math.floor(
    (Date.now() - new Date(deal.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  )
  const urgency = daysSince > 14 ? 'border-red-300 dark:border-red-600' : daysSince > 7 ? 'border-yellow-300 dark:border-yellow-600' : 'border-gray-200 dark:border-gray-600'

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-3 shadow-md border ${urgency} space-y-2`}>
      <div className="flex items-start justify-between">
        <div
          className={`font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight ${deal.quoteId ? 'cursor-pointer hover:text-blue-600 dark:hover:text-blue-400' : ''}`}
          onClick={() => deal.quoteId && navigate(`/quotes/${deal.quoteId}`)}
          title={deal.quoteId ? 'Open linked quote' : ''}
        >
          {deal.name}
        </div>
        <button
          onClick={() => { if (window.confirm('Delete this deal?')) deleteDeal(deal.id, stageId) }}
          className="text-gray-300 hover:text-red-500 ml-1 flex-shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      {deal.company && !deal.quoteId && <div className="text-xs text-gray-500 dark:text-gray-400">{deal.company}</div>}

      {/* Linked quote badge */}
      {deal.quoteNumber && (
        <button
          onClick={() => deal.quoteId && navigate(`/quotes/${deal.quoteId}`)}
          className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
        >
          <FileText className="w-3 h-3" />
          {deal.quoteNumber}
        </button>
      )}

      {deal.value > 0 && (
        <div className="flex items-center gap-1 text-green-700 dark:text-green-400 font-semibold text-sm">
          <DollarSign className="w-3.5 h-3.5" />
          {deal.value.toLocaleString('en-US', { minimumFractionDigits: 0 })}
        </div>
      )}

      {/* Linked POs indicator */}
      {linkedPOs.length > 0 && (
        <button
          onClick={() => navigate('/purchase-orders')}
          className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
        >
          <ShoppingCart className="w-3 h-3" />
          {linkedPOs.length} PO{linkedPOs.length > 1 ? 's' : ''}
        </button>
      )}

      {deal.note && !deal.quoteId && (
        <div className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 rounded-lg px-2 py-1.5 leading-relaxed">
          {deal.note}
        </div>
      )}
      <div className="text-xs text-gray-300 dark:text-gray-500">{format(new Date(deal.createdAt), 'MMM d')}{daysSince > 1 ? ` · ${daysSince}d` : ''}</div>
      {/* Move buttons */}
      <div className="flex gap-1 pt-1">
        {stageIndex > 0 && (
          <button
            onClick={() => moveDeal(deal.id, stageId, stages[stageIndex - 1].id)}
            className="flex items-center gap-0.5 text-xs text-gray-400 hover:text-blue-600 font-medium"
          >
            <ChevronLeft className="w-3 h-3" /> Back
          </button>
        )}
        <div className="flex-1" />
        {stageIndex < stages.length - 1 && (
          <button
            onClick={() => moveDeal(deal.id, stageId, stages[stageIndex + 1].id)}
            className="flex items-center gap-0.5 text-xs text-blue-500 hover:text-blue-700 font-semibold"
          >
            Move <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  )
}

function AddDealForm({ stageId, onDone }) {
  const addDeal = useStore((s) => s.addDeal)
  const [form, setForm] = useState({ name: '', company: '', value: '', note: '' })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = () => {
    if (!form.name.trim()) return
    addDeal(stageId, { ...form, value: parseFloat(form.value) || 0 })
    onDone()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border-2 border-blue-300 dark:border-blue-600 space-y-2">
      <input className="input-field text-sm py-2" placeholder="Deal / Client name *"
        value={form.name} onChange={(e) => set('name', e.target.value)} autoFocus />
      <input className="input-field text-sm py-2" placeholder="Company (optional)"
        value={form.company} onChange={(e) => set('company', e.target.value)} />
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
        <input className="input-field text-sm py-2 pl-7" type="number" placeholder="Deal value"
          value={form.value} onChange={(e) => set('value', e.target.value)} />
      </div>
      <textarea className="input-field text-sm py-2 resize-none" rows={2} placeholder="Note (optional)"
        value={form.note} onChange={(e) => set('note', e.target.value)} />
      <div className="flex gap-2">
        <button onClick={submit} className="btn-primary py-1.5 px-3 text-sm flex-1">Add</button>
        <button onClick={onDone} className="btn-secondary py-1.5 px-3 text-sm">Cancel</button>
      </div>
    </div>
  )
}

/* Stage color mapping — dark-mode aware, ignores store's light-only bg class */
const STAGE_COLORS = {
  lead:      { bg: 'bg-gray-100 dark:bg-gray-800',       text: 'text-gray-700 dark:text-gray-200',     accent: 'bg-gray-400',    badge: 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200',           add: 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-700/50' },
  quoted:    { bg: 'bg-blue-100/80 dark:bg-blue-950/40',  text: 'text-blue-800 dark:text-blue-200',     accent: 'bg-blue-500',    badge: 'bg-blue-200 dark:bg-blue-800/50 text-blue-700 dark:text-blue-200',         add: 'text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/30' },
  sent:      { bg: 'bg-amber-100/70 dark:bg-amber-950/30', text: 'text-amber-800 dark:text-amber-200',  accent: 'bg-amber-500',   badge: 'bg-amber-200 dark:bg-amber-800/50 text-amber-700 dark:text-amber-200',    add: 'text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/30' },
  negotiate: { bg: 'bg-orange-100/70 dark:bg-orange-950/30', text: 'text-orange-800 dark:text-orange-200', accent: 'bg-orange-500', badge: 'bg-orange-200 dark:bg-orange-800/50 text-orange-700 dark:text-orange-200', add: 'text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/30' },
  won:       { bg: 'bg-green-100/80 dark:bg-green-950/30', text: 'text-green-800 dark:text-green-200',  accent: 'bg-green-500',   badge: 'bg-green-200 dark:bg-green-800/50 text-green-700 dark:text-green-200',    add: 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 hover:bg-green-50 dark:hover:bg-green-900/30' },
  lost:      { bg: 'bg-red-100/70 dark:bg-red-950/30',    text: 'text-red-800 dark:text-red-200',      accent: 'bg-red-500',     badge: 'bg-red-200 dark:bg-red-800/50 text-red-700 dark:text-red-200',            add: 'text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/30' },
}
const getStageColors = (id) => STAGE_COLORS[id] || STAGE_COLORS.lead

export default function Pipeline() {
  const pipeline = useStore((s) => s.pipeline)
  const [adding, setAdding] = useState(null) // stageId

  const totalValue = pipeline.flatMap((s) => s.deals).reduce((sum, d) => sum + (d.value || 0), 0)

  return (
    <div className="space-y-4 max-w-full">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sales Pipeline</h1>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full">
            Pipeline value: ${totalValue.toLocaleString()}
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Drag deals across stages or use the Move buttons</p>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {pipeline.map((stage) => {
            const stageValue = stage.deals.reduce((s, d) => s + (d.value || 0), 0)
            const colors = getStageColors(stage.id)
            return (
              <div key={stage.id} className="w-60 flex-shrink-0">
                <div className={`${colors.bg} rounded-2xl p-3 border border-gray-200/60 dark:border-gray-700/50 shadow-sm`}>
                  {/* Stage header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${colors.accent} flex-shrink-0`} />
                      <div>
                        <div className={`font-bold text-sm ${colors.text}`}>{stage.label}</div>
                        {stageValue > 0 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            ${stageValue.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                      {stage.deals.length}
                    </span>
                  </div>

                  {/* Deals */}
                  <div className="space-y-2">
                    {stage.deals.map((deal) => (
                      <DealCard key={deal.id} deal={deal} stageId={stage.id} stages={pipeline} />
                    ))}
                    {adding === stage.id && (
                      <AddDealForm stageId={stage.id} onDone={() => setAdding(null)} />
                    )}
                  </div>

                  {/* Add button */}
                  {adding !== stage.id && (
                    <button
                      onClick={() => setAdding(stage.id)}
                      className={`mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl transition-colors ${colors.add}`}
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Deal
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
