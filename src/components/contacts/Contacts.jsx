/**
 * SalesCloserPro - Contacts: people you quote and sell to, with their quotes and deals
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 */

import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, Search, Users, Phone, Mail, MapPin, Trash2, X, FilePlus2, GitBranch } from 'lucide-react'
import useStore from '../../store'
import { stateList } from '../../data/taxDatabase'
import { contactActivity, searchContacts } from '../../utils/contacts'
import { formatMoney } from '../../utils/quoteMath'
import { StatusBadge } from '../quotes/QuoteBadges'

function ClientModal({ client, onSave, onClose }) {
  const [form, setForm] = useState(client || {
    name: '', company: '', email: '', phone: '', address: '', state: 'TX', notes: ''
  })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100">{client ? 'Edit Contact' : 'New Contact'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Name *</label>
              <input className="input-field" placeholder="John Smith" value={form.name}
                onChange={(e) => set('name', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Company</label>
              <input className="input-field" placeholder="Acme Corp" value={form.company}
                onChange={(e) => set('company', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Email</label>
              <input className="input-field" type="email" placeholder="john@acme.com" value={form.email}
                onChange={(e) => set('email', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Phone</label>
              <input className="input-field" placeholder="(555) 000-0000" value={form.phone}
                onChange={(e) => set('phone', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Address</label>
            <input className="input-field" placeholder="123 Main St" value={form.address}
              onChange={(e) => set('address', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">State</label>
            <select className="input-field cursor-pointer" value={form.state}
              onChange={(e) => set('state', e.target.value)}>
              {stateList.map(({ code, name }) => (
                <option key={code} value={code}>{name} ({code})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Notes</label>
            <textarea className="input-field resize-none" rows={3} placeholder="Internal notes about this contact…"
              value={form.notes} onChange={(e) => set('notes', e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3 p-6 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => { if (form.name.trim()) { onSave(form); onClose() } }}
            className="btn-primary flex-1"
          >
            {client ? 'Save Changes' : 'Add Contact'}
          </button>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  )
}

/** A contact's linked quotes and deals — the two-way view of the same links the quote and deal screens set. */
function ContactActivity({ contact }) {
  const quotes = useStore((s) => s.quotes)
  const pipeline = useStore((s) => s.pipeline)
  const a = contactActivity(contact.id, quotes, pipeline)
  const manualDeals = a.deals.filter((d) => !d.quoteId) // quote-linked deals are already shown as quotes
  if (!a.quotes.length && !a.deals.length) {
    return <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">No quotes or deals yet.</p>
  }
  return (
    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
      <div className="flex gap-4 text-xs">
        <span className="text-gray-500 dark:text-gray-400">Open <strong className="text-gray-900 dark:text-gray-100 tabular-nums">{formatMoney(a.openValue)}</strong></span>
        <span className="text-gray-500 dark:text-gray-400">Won <strong className="text-green-700 dark:text-green-400 tabular-nums">{formatMoney(a.wonValue)}</strong></span>
      </div>
      <ul className="space-y-1">
        {a.quotes.slice(0, 4).map((q) => (
          <li key={q.id}>
            <Link to={`/quotes/${q.id}`} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 -mx-2 hover:bg-gray-50 dark:hover:bg-gray-700/60">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{q.quoteNumber}</span>
              <span className="flex items-center gap-2">
                <StatusBadge status={q.status} />
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums">{formatMoney(q.total)}</span>
              </span>
            </Link>
          </li>
        ))}
        {manualDeals.slice(0, 3).map((d) => (
          <li key={d.id}>
            <Link to="/pipeline" className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 -mx-2 hover:bg-gray-50 dark:hover:bg-gray-700/60">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-gray-200"><GitBranch className="w-3.5 h-3.5 text-gray-400" /> Deal · {d.stageLabel}</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums">{formatMoney(d.value)}</span>
            </Link>
          </li>
        ))}
      </ul>
      {a.quotes.length > 4 && <p className="text-xs text-gray-400">+ {a.quotes.length - 4} more quotes</p>}
    </div>
  )
}

export default function Contacts() {
  const navigate = useNavigate()
  const clients = useStore((s) => s.clients)
  const addClient = useStore((s) => s.addClient)
  const updateClient = useStore((s) => s.updateClient)
  const deleteClient = useStore((s) => s.deleteClient)

  const [params] = useSearchParams()
  const [search, setSearch]   = useState(params.get('q') || '')
  const [modal, setModal]     = useState(null)  // null | 'new' | client object

  const filtered = searchContacts(clients, search)

  const handleSave = (form) => {
    if (modal === 'new') {
      addClient(form)
    } else {
      updateClient(modal.id, form)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Contacts</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{clients.length} contact{clients.length !== 1 ? 's' : ''} · linked to their quotes and deals</p>
        </div>
        <button onClick={() => setModal('new')} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input className="input-field pl-11" placeholder="Search contacts…"
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">
          <Users className="w-14 h-14 mx-auto mb-3 opacity-25" />
          <p className="font-semibold text-lg">{clients.length ? 'No contacts match' : 'No contacts yet'}</p>
          <p className="text-sm mb-6">Contacts are added here, or automatically when you save a quote for someone new</p>
          <button onClick={() => setModal('new')} className="btn-primary mx-auto">
            <Plus className="w-4 h-4 inline mr-2" /> Add Contact
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <div key={c.id} className="card hover:border-brand-200 dark:hover:border-brand-700 hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-brand-100 rounded-2xl flex items-center justify-center font-bold text-brand-700 text-lg flex-shrink-0">
                    {(c.name || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-gray-100">{c.name}</div>
                    {c.company && <div className="text-sm text-gray-500 dark:text-gray-400">{c.company}</div>}
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <button onClick={() => navigate(`/quotes/new?contact=${c.id}`)} title="New quote for this contact"
                    className="inline-flex items-center gap-1 text-sm text-copper-700 dark:text-copper-300 hover:underline font-semibold px-2 py-1">
                    <FilePlus2 className="w-4 h-4" /> Quote
                  </button>
                  <button onClick={() => setModal(c)}
                    className="text-sm text-brand-500 hover:text-brand-700 font-semibold px-2 py-1">
                    Edit
                  </button>
                  <button onClick={() => { if (window.confirm('Delete this contact? Their quotes and deals are kept.')) deleteClient(c.id) }}
                    title="Delete contact" aria-label={`Delete ${c.name}`}
                    className="text-gray-300 hover:text-red-500 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                {c.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    <a href={`mailto:${c.email}`} className="hover:text-brand-600 transition-colors">{c.email}</a>
                  </div>
                )}
                {c.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    <a href={`tel:${c.phone}`} className="hover:text-brand-600 transition-colors">{c.phone}</a>
                  </div>
                )}
                {(c.address || c.state) && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    <span>{[c.address, c.state].filter(Boolean).join(', ')}</span>
                  </div>
                )}
              </div>
              {c.notes && (
                <div className="mt-3 text-xs text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2 leading-relaxed">
                  {c.notes}
                </div>
              )}
              <ContactActivity contact={c} />
            </div>
          ))}
        </div>
      )}

      {modal && (
        <ClientModal
          client={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
