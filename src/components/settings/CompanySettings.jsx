import { useState, useRef, useCallback } from 'react'
import {
  Building2, Phone, Mail, Globe, MapPin, Save, CheckCircle,
  Upload, Trash2, Camera, Shield, FileText
} from 'lucide-react'
import useStore from '../../store'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
]

function resizeLogo(file, maxDim = 256) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new window.Image()
      img.onload = () => {
        let { width, height } = img
        if (width > maxDim || height > maxDim) {
          const scale = Math.min(maxDim / width, maxDim / height)
          width = Math.round(width * scale)
          height = Math.round(height * scale)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/png', 0.9))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

export default function CompanySettings() {
  const company = useStore((s) => s.company)
  const setCompany = useStore((s) => s.setCompany)
  const logoRef = useRef(null)

  const [form, setForm] = useState({
    name: company.name || '',
    address: company.address || '',
    phone: company.phone || '',
    email: company.email || '',
    website: company.website || '',
    homeState: company.homeState || 'TX',
  })

  const [saved, setSaved] = useState(false)

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSave = () => {
    setCompany(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleLogoUpload = useCallback(async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { alert('Please select an image file'); return }
    if (file.size > 2 * 1024 * 1024) { alert('Logo must be under 2 MB'); return }
    const dataUrl = await resizeLogo(file)
    setCompany({ logo: dataUrl })
    e.target.value = ''
  }, [setCompany])

  const handleRemoveLogo = () => {
    if (window.confirm('Remove company logo?')) setCompany({ logo: '' })
  }

  const completionItems = [
    { label: 'Company name', done: !!company.name },
    { label: 'Logo uploaded', done: !!company.logo },
    { label: 'Address', done: !!company.address },
    { label: 'Phone number', done: !!company.phone },
    { label: 'Email address', done: !!company.email },
    { label: 'Website', done: !!company.website },
  ]
  const completionPct = Math.round((completionItems.filter((i) => i.done).length / completionItems.length) * 100)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Company Settings</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your info auto-fills quotes, PDFs, and invoices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile completeness */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-500" />
            Profile Completeness
          </h3>
          <span className={`text-sm font-bold ${completionPct === 100 ? 'text-green-600' : 'text-indigo-600 dark:text-indigo-400'}`}>
            {completionPct}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${completionPct === 100 ? 'bg-green-500' : 'bg-indigo-500'}`}
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {completionItems.map((item) => (
            <span
              key={item.label}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                item.done
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
              }`}
            >
              {item.done ? <CheckCircle className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-current" />}
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logo card */}
        <div className="card p-5 flex flex-col items-center text-center space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 self-start flex items-center gap-2">
            <Camera className="w-4 h-4 text-indigo-500" />
            Company Logo
          </h3>
          <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          <button
            onClick={() => logoRef.current?.click()}
            className="group relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {company.logo ? (
              <img src={company.logo} alt="Company logo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <Upload className="w-8 h-8 mb-1" />
                <span className="text-[10px] font-medium">Upload Logo</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
              <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {company.logo ? 'Change' : 'Upload'}
              </span>
            </div>
          </button>
          <p className="text-[11px] text-gray-400 dark:text-gray-500">JPG, PNG · Max 2 MB · Auto-resized to 256px</p>
          {company.logo && (
            <button
              onClick={handleRemoveLogo}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove Logo
            </button>
          )}
        </div>

        {/* Info form */}
        <div className="lg:col-span-2 card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            Company Details
          </h3>

          {/* Company Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              <Building2 className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
              Company Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Acme Corp"
              className="input-field w-full"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              <MapPin className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
              Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              placeholder="123 Main St, Suite 100, Austin, TX 78701"
              className="input-field w-full"
            />
          </div>

          {/* Phone + Email row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                <Phone className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="(512) 555-0100"
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                <Mail className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="hello@acmecorp.com"
                className="input-field w-full"
              />
            </div>
          </div>

          {/* Website + Home State row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                <Globe className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                Website
              </label>
              <input
                type="url"
                value={form.website}
                onChange={(e) => set('website', e.target.value)}
                placeholder="https://acmecorp.com"
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                <MapPin className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                Home State (Default Tax)
              </label>
              <select
                value={form.homeState}
                onChange={(e) => set('homeState', e.target.value)}
                className="input-field w-full"
              >
                {US_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Info note */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-3 text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
            <strong>This info becomes your default</strong> — it auto-fills the header on every PDF quote and invoice you generate. You can change it any time.
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            className={`btn-primary w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 transition-all ${
              saved ? 'bg-green-600 hover:bg-green-700' : ''
            }`}
          >
            {saved ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Company Info
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview card */}
      <div className="card p-5 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-500" />
          PDF Header Preview
        </h3>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
          <div className="flex items-start gap-4">
            {company.logo ? (
              <img src={company.logo} alt="Logo" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Building2 className="text-white w-7 h-7" />
              </div>
            )}
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {company.name || 'Your Company Name'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-0.5 mt-1">
                {company.address && <div>{company.address}</div>}
                {company.phone && <div>{company.phone}</div>}
                {company.email && <div>{company.email}</div>}
                {company.website && <div>{company.website}</div>}
                {!company.address && !company.phone && !company.email && (
                  <div className="italic text-gray-300 dark:text-gray-600">Fill in your details above to see them here</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-gray-400 dark:text-gray-500">This is how your company info appears at the top of every PDF export.</p>
      </div>
    </div>
  )
}
