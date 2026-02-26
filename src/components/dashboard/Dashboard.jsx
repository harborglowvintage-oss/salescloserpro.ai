import { useNavigate } from 'react-router-dom'
import { FileText, Users, DollarSign, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import useStore from '../../store'
import { format } from 'date-fns'

function KpiCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="card flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</div>
        {sub && <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const quotes = useStore((s) => s.quotes)
  const clients = useStore((s) => s.clients)
  const pipeline = useStore((s) => s.pipeline)
  const company = useStore((s) => s.company)

  const totalRevenue = quotes
    .filter((q) => q.status === 'won')
    .reduce((sum, q) => sum + (q.total || 0), 0)

  const openQuotes = quotes.filter((q) => q.status === 'draft' || q.status === 'sent').length
  const wonDeals = pipeline.find((s) => s.id === 'won')?.deals.length || 0

  const recentQuotes = [...quotes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const statusColor = {
    draft: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
    sent: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
    won: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300',
    lost: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400',
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {company.name ? `Welcome back, ${company.name}` : 'Welcome to SalesCloserPro'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {format(new Date(), 'EEEE, MMMM d, yyyy')} — Here's your snapshot
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={FileText}    label="Open Quotes"   value={openQuotes}   color="bg-blue-500"   sub="drafts + sent" />
        <KpiCard icon={Users}       label="Total Clients" value={clients.length} color="bg-purple-500" />
        <KpiCard icon={TrendingUp}  label="Deals Won"     value={wonDeals}     color="bg-green-500" />
        <KpiCard icon={DollarSign}  label="Revenue Won"
          value={`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}`}
          color="bg-emerald-500" sub="closed won quotes" />
      </div>

      {/* Recent Quotes */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg">Recent Quotes</h2>
          <button
            onClick={() => navigate('/quotes/new')}
            className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Quote
          </button>
        </div>

        {recentQuotes.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No quotes yet</p>
            <p className="text-sm">Click "New Quote" to create your first one</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentQuotes.map((q) => (
              <button
                key={q.id}
                onClick={() => navigate(`/quotes/${q.id}`)}
                className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{q.quoteNumber}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{q.clientName || 'No client'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[q.status] || statusColor.draft}`}>
                    {q.status?.toUpperCase()}
                  </span>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                      ${(q.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                </div>
              </button>
            ))}
          </div>
        )}

        {quotes.length > 5 && (
          <button
            onClick={() => navigate('/quotes')}
            className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2"
          >
            View all {quotes.length} quotes →
          </button>
        )}
      </div>

      {/* Pipeline Summary */}
      <div className="card">
        <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-4">Pipeline Overview</h2>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {pipeline.map((stage) => (
            <div key={stage.id} className={`${stage.color} dark:bg-opacity-30 rounded-xl p-3 text-center`}>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stage.deals.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-0.5">{stage.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand footer */}
      <div className="text-center pt-4 pb-2 space-y-2">
        <p className="text-xs text-gray-400">
          Powered by{' '}
          <a href="https://llmadvisor.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 font-medium">
            llmadvisor.ai
          </a>
        </p>
        <a
          href="https://buymeacoffee.com/llmadvisor.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:text-amber-700"
        >
          ☕ Buy Me a Coffee
        </a>
      </div>
    </div>
  )
}
