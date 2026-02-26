import { useState } from 'react'
import { Plus, Search, Users, Phone, Mail, MapPin, Trash2, X } from 'lucide-react'
import useStore from '../../store'
import { stateList } from '../../data/taxDatabase'

function ClientModal({ client, onSave, onClose }) {
  const [form, setForm] = useState(client || {
    name: '', company: '', email: '', phone: '', address: '', state: 'TX', notes: ''
  })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100">{client ? 'Edit Client' : 'New Client'}</h2>
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
            <textarea className="input-field resize-none" rows={3} placeholder="Internal notes about this client…"
              value={form.notes} onChange={(e) => set('notes', e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3 p-6 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => { if (form.name.trim()) { onSave(form); onClose() } }}
            className="btn-primary flex-1"
          >
            {client ? 'Save Changes' : 'Add Client'}
          </button>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default function Clients() {
  const clients = useStore((s) => s.clients)
  const addClient = useStore((s) => s.addClient)
  const updateClient = useStore((s) => s.updateClient)
  const deleteClient = useStore((s) => s.deleteClient)

  const [search, setSearch]   = useState('')
  const [modal, setModal]     = useState(null)  // null | 'new' | client object

  const filtered = clients.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  )

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Clients</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{clients.length} clients</p>
        </div>
        <button onClick={() => setModal('new')} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input className="input-field pl-11" placeholder="Search clients…"
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">
          <Users className="w-14 h-14 mx-auto mb-3 opacity-25" />
          <p className="font-semibold text-lg">No clients yet</p>
          <p className="text-sm mb-6">Add your first client to get started</p>
          <button onClick={() => setModal('new')} className="btn-primary mx-auto">
            <Plus className="w-4 h-4 inline mr-2" /> Add Client
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <div key={c.id} className="card hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-blue-100 rounded-2xl flex items-center justify-center font-bold text-blue-700 text-lg flex-shrink-0">
                    {(c.name || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-gray-100">{c.name}</div>
                    {c.company && <div className="text-sm text-gray-500 dark:text-gray-400">{c.company}</div>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setModal(c)}
                    className="text-sm text-blue-500 hover:text-blue-700 font-semibold px-2 py-1">
                    Edit
                  </button>
                  <button onClick={() => { if (window.confirm('Delete this client?')) deleteClient(c.id) }}
                    className="text-gray-300 hover:text-red-500 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                {c.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    <a href={`mailto:${c.email}`} className="hover:text-blue-600 transition-colors">{c.email}</a>
                  </div>
                )}
                {c.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    <a href={`tel:${c.phone}`} className="hover:text-blue-600 transition-colors">{c.phone}</a>
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
