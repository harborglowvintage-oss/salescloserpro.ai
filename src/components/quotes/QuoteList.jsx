import { useNavigate } from 'react-router-dom'
import { Plus, FileText, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import useStore from '../../store'
import { format } from 'date-fns'

const statusColor = {
  draft: 'bg-gray-100 text-gray-600',
  sent:  'bg-blue-100 text-blue-700',
  won:   'bg-green-100 text-green-700',
  lost:  'bg-red-100 text-red-600',
}

export default function QuoteList() {
  const navigate = useNavigate()
  const quotes = useStore((s) => s.quotes)
  const deleteQuote = useStore((s) => s.deleteQuote)
  const [search, setSearch] = useState('')

  const filtered = quotes
    .filter(
      (q) =>
        q.quoteNumber?.toLowerCase().includes(search.toLowerCase()) ||
        q.clientName?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Quotes</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{quotes.length} total quotes</p>
        </div>
        <button
          onClick={() => navigate('/quotes/new')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Quote
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          className="input-field pl-11"
          placeholder="Search by quote number or client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">
          <FileText className="w-14 h-14 mx-auto mb-3 opacity-25" />
          <p className="font-semibold text-lg">No quotes found</p>
          <p className="text-sm mb-6">Start by creating your first quote</p>
          <button onClick={() => navigate('/quotes/new')} className="btn-primary mx-auto">
            <Plus className="w-4 h-4 inline mr-2" /> Create Quote
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => (
            <div
              key={q.id}
              className="card flex items-center justify-between hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => navigate(`/quotes/${q.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-gray-100">{q.quoteNumber}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {q.clientName || 'No client'} · {q.state || '—'}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {format(new Date(q.createdAt), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor[q.status] || 'bg-gray-100 text-gray-600'}`}>
                  {(q.status || 'draft').toUpperCase()}
                </span>
                <div className="text-right">
                  <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                    ${(q.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (window.confirm('Delete this quote?')) deleteQuote(q.id)
                  }}
                  className="text-gray-300 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
