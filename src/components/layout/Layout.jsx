import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Users, GitBranch,
  Rocket, Plus, Menu, X, DollarSign, Coffee, Sun, Moon, HelpCircle, Building2, HardDrive, ShoppingCart,
  MessageSquare, ExternalLink, LogOut
} from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import useStore from '../../store'
import { getGatedEmail, clearGatedEmail } from '../auth/EmailGate'

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

const nav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/quotes',    icon: FileText,         label: 'Quotes' },
  { to: '/clients',   icon: Users,            label: 'Clients' },
  { to: '/pipeline',  icon: GitBranch,        label: 'Pipeline' },
  { to: '/purchase-orders', icon: ShoppingCart, label: 'Purchase Orders' },
  { to: '/go-live',   icon: Rocket,           label: 'Go Live' },
  { to: '/settings',  icon: Building2,        label: 'Company Info' },
  { to: '/backup',    icon: HardDrive,        label: 'Backup' },
  { to: '/help',      icon: HelpCircle,       label: 'Help & Guide' },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const company = useStore((s) => s.company)
  const setCompany = useStore((s) => s.setCompany)
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)
  const logoInputRef = useRef(null)

  const handleLogoUpload = useCallback(async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    if (file.size > 2 * 1024 * 1024) { alert('Logo must be under 2 MB'); return }
    const dataUrl = await resizeLogo(file)
    setCompany({ logo: dataUrl })
    e.target.value = ''
  }, [setCompany])

  const handleLogoContext = useCallback((e) => {
    if (!company.logo) return
    e.preventDefault()
    if (window.confirm('Remove company logo?')) setCompany({ logo: '' })
  }, [company.logo, setCompany])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 shadow-lg flex flex-col transform transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:shadow-none`}
      >
        {/* Logo + Theme Toggle */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          {/* Clickable logo area */}
          <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          <button
            onClick={() => logoInputRef.current?.click()}
            onContextMenu={handleLogoContext}
            className="group relative w-9 h-9 rounded-xl flex-shrink-0 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            title={company.logo ? 'Click to change · Right-click to remove' : 'Upload your logo'}
          >
            {company.logo ? (
              <img src={company.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <img src="./salescloserpro-logo.svg" alt="SalesCloserPro" className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
              <span className="text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {company.logo ? '✎' : '+'}
              </span>
            </div>
          </button>
          <button onClick={() => navigate('/')} className="flex-1 min-w-0 text-left hover:opacity-70 transition-opacity">
            <div className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-tight">salescloserpro.ai</div>
            <div className="text-xs text-gray-400 dark:text-gray-500 leading-tight truncate">
              {company.name || 'Your Company'}
            </div>
          </button>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
          <button
            className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Quote CTA */}
        <div className="px-4 pt-4">
          <button
            onClick={() => { navigate('/quotes/new'); setSidebarOpen(false) }}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm"
          >
            <Plus className="w-4 h-4" />
            New Quote
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150
                 ${isActive
                   ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                   : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'}`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2.5">
          {/* GPT AI Assistant — Hero CTA */}
          <a
            href="https://chatgpt.com/g/g-69930ae1d2748191a9c47556b8ceae82-salescloserpro-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-700 dark:via-gray-750 dark:to-gray-800 border border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
          >
            {/* Logo area — generous padding */}
            <div className="flex items-center justify-center pt-5 pb-3">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-700 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-600 shadow-sm group-hover:ring-gray-300 dark:group-hover:ring-gray-500 transition-all duration-200 overflow-hidden">
                <img src="/gptlogo.png" alt="salescloserpro.ai" className="w-14 h-14 object-cover rounded-xl drop-shadow-sm" />
              </div>
            </div>
            {/* Text area — centered */}
            <div className="text-center pb-4 px-4">
              <div className="text-[15px] font-extrabold text-gray-800 dark:text-gray-100 leading-tight tracking-tight">salescloserpro.ai</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold mt-0.5 flex items-center justify-center gap-1">
                GPT Assistant
                <ExternalLink className="w-3 h-3 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              </div>
            </div>
          </a>

          {/* Sub-links row */}
          <div className="flex items-center justify-between px-1">
            <a
              href="https://llmadvisor.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 font-medium transition-colors"
            >
              Powered by llmadvisor.ai
            </a>
            <a
              href="https://buymeacoffee.com/llmadvisor.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] font-semibold text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
              title="Buy Me a Coffee"
            >
              <Coffee className="w-3 h-3" />
              Tip
            </a>
          </div>

          <div className="text-[9px] text-gray-300 dark:text-gray-600 text-center">
            © {new Date().getFullYear()} SalesCloserPro · Apache 2.0
          </div>

          {/* Gated email + sign out */}
          {getGatedEmail() && (
            <div className="mt-2 flex items-center justify-between gap-1 px-1">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 truncate" title={getGatedEmail()}>
                {getGatedEmail()}
              </span>
              <button
                onClick={() => { clearGatedEmail(); window.location.href = '/' }}
                className="flex items-center gap-0.5 text-[10px] text-gray-400 dark:text-gray-500 hover:text-red-400 dark:hover:text-red-400 transition-colors flex-shrink-0"
                title="Sign out"
              >
                <LogOut className="w-3 h-3" /> Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            {company.logo ? (
              <img src={company.logo} alt="Logo" className="w-7 h-7 rounded-lg object-cover" />
            ) : (
              <img src="./salescloserpro-logo.svg" alt="SalesCloserPro" className="w-7 h-7 rounded-full" />
            )}
            <span className="font-bold text-sm text-gray-900 dark:text-gray-100">salescloserpro.ai</span>
          </div>
          <button
            onClick={toggleTheme}
            className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
        
        {/* Affiliate Offers — full categorized grid */}
        <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-6">
          <div className="max-w-6xl mx-auto rounded-2xl bg-slate-950 border border-white/[0.08] p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
              <span className="text-xs font-bold text-white uppercase tracking-widest">Affiliate Offers</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-white/[0.05] rounded-full px-3 py-1 border border-white/[0.08] ring-1 ring-blue-400/30 shadow-[0_0_12px_rgba(59,130,246,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block flex-shrink-0" />
                We earn a commission when you shop through the links below &middot; <Link to="/legal#affiliate" className="ml-1 text-blue-400 hover:text-blue-300 transition-colors">Full disclosure &rarr;</Link>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {/* EDUCATION & FINANCE TOOLS */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-amber-500 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-amber-400 mb-2">🎓 Education &amp; Finance Tools</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.jdoqocy.com/click-101696721-17262416" target="_blank" rel="sponsored nofollow noopener" title="EWA" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Ewa-23803634.png" alt="EWA" className="max-h-6 w-auto" /></a>
                  <a href="https://www.jdoqocy.com/click-101696721-17250447" target="_blank" rel="sponsored nofollow noopener" title="QuickBooks" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Intuit-Quickbooks-15647418.png" alt="QuickBooks" className="max-h-6 w-auto" /></a>
                  <a href="https://www.awin1.com/cread.php?awinmid=91823&awinaffid=2848879&ued=https%3A%2F%2Fwww.acobs.org%2Fcpbs-certification-course%2F" target="_blank" rel="sponsored nofollow noopener" title="ACoBS" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/acobs-91823.webp" alt="ACoBS" className="max-h-5 w-auto" /></a>
                </div>
              </div>

              {/* FOOD & HEALTH */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-emerald-500 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-emerald-400 mb-2">🌿 Food &amp; Health</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.dpbolvw.net/click-101696721-13443788" target="_blank" rel="sponsored nofollow noopener" title="Peet's Coffee" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Peets-Coffee-13426123.jpeg" alt="Peet's Coffee" className="max-h-6 w-auto" /></a>
                  <a href="https://www.tkqlhce.com/click-101696721-15712042" target="_blank" rel="sponsored nofollow noopener" title="M&M's" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/M&Ms-15075557.jpeg" alt="M&M's" className="max-h-6 w-auto" /></a>
                  <a href="https://www.tkqlhce.com/click-101696721-17254505" target="_blank" rel="sponsored nofollow noopener" title="VitalHeal" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Vital-Health-23801187.png" alt="VitalHeal" className="max-h-6 w-auto" /></a>
                  <a href="https://www.dpbolvw.net/click-101696721-17110018" target="_blank" rel="sponsored nofollow noopener" title="Blackout Coffee" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/blackoutcoffee.png" alt="Blackout Coffee" className="max-h-6 w-auto" /></a>
                  <a href="https://www.awin1.com/cread.php?awinmid=124484&awinaffid=2848879&ued=https%3A%2F%2Fsurvive-x.com%2F" target="_blank" rel="sponsored nofollow noopener" title="Survive X" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/surviveXlogo.webp" alt="Survive X" className="max-h-5 w-auto" /></a>
                </div>
              </div>

              {/* GAMING */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-pink-500 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-pink-400 mb-2">🎮 Gaming</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.kqzyfj.com/click-101696721-10448329" target="_blank" rel="sponsored nofollow noopener" title="GameFly" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Gamefly-logo-10495782.png" alt="GameFly" className="max-h-6 w-auto" /></a>
                  <a href="https://www.tkqlhce.com/click-101696721-17235980" target="_blank" rel="sponsored nofollow noopener" title="GearUP" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Gearup-23735360.png" alt="GearUP" className="max-h-6 w-auto" /></a>
                </div>
              </div>

              {/* HOME FURNISHINGS & AUDIO */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-orange-500 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-orange-400 mb-2">🏠 Home Furnishings &amp; Audio</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.awin1.com/cread.php?awinmid=119863&awinaffid=2848879&ued=https%3A%2F%2Fjoydeco.com%2F" target="_blank" rel="sponsored nofollow noopener" title="Joydeco" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/joydecologo.webp" alt="Joydeco" className="max-h-5 w-auto" /></a>
                  <a href="https://www.jdoqocy.com/click-101696721-15826779" target="_blank" rel="sponsored nofollow noopener" title="Skutchi Designs" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Skutchi-Designs-20918025.jpeg" alt="Skutchi Designs" className="max-h-6 w-auto" /></a>
                  <a href="https://www.awin1.com/cread.php?awinmid=83073&awinaffid=2848879&ued=https%3A%2F%2Fsleepez.com%2F" target="_blank" rel="sponsored nofollow noopener" title="SleepEZ" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/sleepezUSAlogo-83073.png" alt="SleepEZ" className="max-h-6 w-auto" /></a>
                  <a href="https://www.jdoqocy.com/click-101696721-15919841" target="_blank" rel="sponsored nofollow noopener" title="TEAC" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Teac--21087655.png" alt="TEAC" className="max-h-6 w-auto" /></a>
                  <a href="https://www.awin1.com/cread.php?awinmid=45477&awinaffid=2848879&ued=https%3A%2F%2Fgrandpatio.com%2Fcollections%2Fnapoli-patio-umbrella%2Fproducts%2Fnapoli-10x13-ft-rectangular-offset-umbrella-with-base" target="_blank" rel="sponsored nofollow noopener" title="Grand Patio" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/grand-patio-45477.webp" alt="Grand Patio" className="max-h-6 w-auto" /></a>
                  <a href="https://www.awin1.com/cread.php?awinmid=113200&awinaffid=2848879&ued=https%3A%2F%2Fwww.valerion.com%2Fproduct%2Fvisionmaster-max-free-ceiling-bracket%3Ftitle%3DDefault%2BTitle%26image%3D0" target="_blank" rel="sponsored nofollow noopener" title="Valerion" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/valerion-us-113200.webp" alt="Valerion" className="max-h-6 w-auto" /></a>
                </div>
              </div>

              {/* OFFICE & WORKSPACE */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-amber-600 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-amber-500 mb-2">💼 Office &amp; Workspace</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.dpbolvw.net/click-101696721-15600474" target="_blank" rel="sponsored nofollow noopener" title="Arka" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/arkalogo.png" alt="Arka" className="max-h-6 w-auto" /></a>
                  <a href="https://www.awin1.com/cread.php?awinmid=91359&awinaffid=2848879&ued=https%3A%2F%2Fwww.giftcards.ca%2F" target="_blank" rel="sponsored nofollow noopener" title="Giftcards.ca" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/giftcardscalogo.webp" alt="Giftcards.ca" className="max-h-8 w-auto" /></a>
                  <a href="https://www.awin1.com/cread.php?awinmid=121870&awinaffid=2848879&ued=https%3A%2F%2Fpostermasterstudio.com%2Fproducts%2Fted-teddy-bear" target="_blank" rel="sponsored nofollow noopener" title="Poster Master" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/poster-master-121870.webp" alt="Poster Master" className="max-h-6 w-auto" /></a>
                </div>
              </div>

              {/* PERSONAL ACCESSORIES */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-cyan-500 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-cyan-400 mb-2">✦ Personal Accessories</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.dpbolvw.net/click-101696721-15153860" target="_blank" rel="sponsored nofollow noopener" title="Oakley" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Oakley-10375170.jpeg" alt="Oakley" className="max-h-6 w-auto" /></a>
                  <a href="https://www.awin1.com/cread.php?awinmid=109230&awinaffid=2848879&ued=https%3A%2F%2Ftsarbomba.com%2Fcollections%2Fpre-sale-collection" target="_blank" rel="sponsored nofollow noopener" title="Tsar Bomba" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Tsarbomba-109230.png" alt="Tsar Bomba" className="max-h-6 w-auto" /></a>
                  <a href="https://www.awin1.com/cread.php?awinmid=120898&awinaffid=2848879&ued=https%3A%2F%2Fvsgotech.com%2Fproducts%2Fvb058" target="_blank" rel="sponsored nofollow noopener" title="VSGO" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/VSGO-120898.webp" alt="VSGO" className="max-h-6 w-auto" /></a>
                </div>
              </div>

              {/* PETS */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-yellow-500 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-yellow-400 mb-2">🐾 Pets</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.jdoqocy.com/click-101696721-17234935" target="_blank" rel="sponsored nofollow noopener" title="Raw Paws Pet Food" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Raw-Paws-Petfoods-15878721.jpeg" alt="Raw Paws Pet Food" className="max-h-6 w-auto" /></a>
                  <a href="https://www.awin1.com/cread.php?awinmid=79708&awinaffid=2848879&ued=https%3A%2F%2Fjugbow.com%2F" target="_blank" rel="sponsored nofollow noopener" title="Jugbow" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Jugbow-79708.png" alt="Jugbow" className="max-h-6 w-auto" /></a>
                  <a href="https://www.awin1.com/cread.php?awinmid=33889&awinaffid=2848879&ued=https%3A%2F%2Fpetcube.com%2Fstore%2Fproduct%2Ffountain%2F%3Fproduct%3Dfountain" target="_blank" rel="sponsored nofollow noopener" title="Petcube" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/petcube-33889.webp" alt="Petcube" className="max-h-6 w-auto" /></a>
                </div>
              </div>

              {/* SECURITY & PRIVACY */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-green-500 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-green-400 mb-2">🔒 Security &amp; Privacy</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.jdoqocy.com/click-101696721-15740556" target="_blank" rel="sponsored nofollow noopener" title="Surfshark" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Surfshark-20148897.jpeg" alt="Surfshark" className="max-h-6 w-auto" /></a>
                  <a href="https://www.anrdoezrs.net/click-101696721-17124588" target="_blank" rel="sponsored nofollow noopener" title="AdBlocker Ultimate" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Adblocker-17124591.jpeg" alt="AdBlocker Ultimate" className="max-h-6 w-auto" /></a>
                  <a href="https://www.jdoqocy.com/click-101696721-15178612" target="_blank" rel="sponsored nofollow noopener" title="Carbonite" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Carbonite-logo-15554902.png" alt="Carbonite" className="max-h-6 w-auto" /></a>
                </div>
              </div>

              {/* SOFTWARE & AI */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-blue-500 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-blue-400 mb-2">💻 Software &amp; AI</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.dpbolvw.net/click-101696721-17222070" target="_blank" rel="sponsored nofollow noopener" title="DomoAI" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/DomoAi-17163300.png" alt="DomoAI" className="max-h-6 w-auto" /></a>
                  <a href="https://www.jdoqocy.com/click-101696721-17258377" target="_blank" rel="sponsored nofollow noopener" title="FM Software" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/FMSoftwarelogo.png" alt="FM Software" className="max-h-6 w-auto" /></a>
                  <a href="https://www.tkqlhce.com/click-101696721-17163276" target="_blank" rel="sponsored nofollow noopener" title="Epidemic Sound" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/epidemic-sound-20089917.png" alt="Epidemic Sound" className="max-h-6 w-auto" /></a>
                  <a href="https://www.awin1.com/cread.php?awinmid=123978&awinaffid=2848879&ued=https%3A%2F%2Fretouch4.me%2Fsubscription" target="_blank" rel="sponsored nofollow noopener" title="Retouch4me" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/retouch4me-123978.webp" alt="Retouch4me" className="max-h-5 w-auto" /></a>
                  <a href="https://www.awin1.com/cread.php?awinmid=127177&awinaffid=2848879&ued=https%3A%2F%2Fauthoritylayer.app%2Fpricing" target="_blank" rel="sponsored nofollow noopener" title="Authoritylayer" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/authoritylayer-127177.webp" alt="Authoritylayer" className="max-h-6 w-auto" /></a>
                </div>
              </div>

              {/* TELECOM & HARDWARE */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-slate-400 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-slate-400 mb-2">📡 Telecom, Hardware &amp; Cloud</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.tkqlhce.com/click-101696721-11371807" target="_blank" rel="sponsored nofollow noopener" title="Verizon" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Verizon-10416412.png" alt="Verizon" className="max-h-4 w-auto" /></a>
                  <a href="https://www.runpod.io/?ref=li2hee5u" target="_blank" rel="sponsored nofollow noopener" title="RunPod" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/runpod-685b36c74aa59531d0f1a347_runpod-logo-black.svg" alt="RunPod" className="max-h-4 w-auto" /></a>
                  <a href="https://www.anrdoezrs.net/click-101696721-15600687" target="_blank" rel="sponsored nofollow noopener" title="TP-Link Tapo" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/TP-Link-15600687.jpeg" alt="TP-Link Tapo" className="max-h-6 w-auto" /></a>
                  <a href="https://www.anrdoezrs.net/click-101696721-17272885" target="_blank" rel="sponsored nofollow noopener" title="AMBIR" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Ambir-17262056.jpeg" alt="AMBIR" className="max-h-6 w-auto" /></a>
                  <a href="https://www.awin1.com/cread.php?awinmid=45751&awinaffid=2848879&ued=https%3A%2F%2Fwww.gmktec.com%2Fproducts%2Famd-ryzen%25E2%2584%25A2-ai-max-395-evo-x2-ai-mini-pc" target="_blank" rel="sponsored nofollow noopener" title="GMKtec" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/gmktec-45751.webp" alt="GMKtec" className="max-h-4 w-auto" /></a>
                  <a href="https://www.awin1.com/cread.php?awinmid=123996&awinaffid=2848879&ued=https%3A%2F%2Fwww.digitalocean.com%2F" target="_blank" rel="sponsored nofollow noopener" title="DigitalOcean" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/digitaloceanlogo.png" alt="DigitalOcean" className="max-h-5 w-auto" /></a>
                </div>
              </div>

              {/* TOOLS, EQUIPMENT & PROFESSIONAL SERVICES */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-teal-500 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-teal-400 mb-2">🔧 Tools, Equipment &amp; Professional Services</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.anrdoezrs.net/click-101696721-17080749" target="_blank" rel="sponsored nofollow noopener" title="Angi" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/angi-23444170.png" alt="Angi" className="max-h-6 w-auto" /></a>
                  <a href="https://www.tkqlhce.com/click-101696721-15483785" target="_blank" rel="sponsored nofollow noopener" title="Northern Tool" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/NorthernTool-Logo-10356274.gif" alt="Northern Tool" className="max-h-6 w-auto" /></a>
                  <a href="https://www.jdoqocy.com/click-101696721-15786075" target="_blank" rel="sponsored nofollow noopener" title="OBI" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/OBI-15786075.png" alt="OBI" className="max-h-6 w-auto" /></a>
                  <a href="https://www.awin1.com/cread.php?awinmid=126513&awinaffid=2848879&ued=https%3A%2F%2Fwww.argendon.com%2Fproducts%2Fargendon-wholesale-pack-xstorm-max-180-pint-industrial-commercial-dehumidifier-with-pump" target="_blank" rel="sponsored nofollow noopener" title="Argendon" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/argendon-126513.webp" alt="Argendon" className="max-h-6 w-auto" /></a>
                </div>
              </div>

              {/* TRAVEL */}
              <div className="rounded-xl border border-white/[0.08] border-t-2 border-t-rose-500 bg-white/[0.03] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-rose-400 mb-2">✈️ Travel</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <a href="https://www.kqzyfj.com/click-101696721-10433860" target="_blank" rel="sponsored nofollow noopener" title="Hotels.com" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/hotels-com-10418404.png" alt="Hotels.com" className="max-h-8 w-auto" /></a>
                  <a href="https://www.anrdoezrs.net/click-101696721-17133005" target="_blank" rel="sponsored nofollow noopener" title="EF Adventures" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/ef-adventures-23557584.jpeg" alt="EF Adventures" className="max-h-6 w-auto" /></a>
                  <a href="https://www.anrdoezrs.net/click-101696721-12843042" target="_blank" rel="sponsored nofollow noopener" title="CheapTickets" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Cheaptickets-Logo-12843040.jpeg" alt="CheapTickets" className="max-h-6 w-auto" /></a>
                  <a href="https://www.anrdoezrs.net/click-101696721-15751514" target="_blank" rel="sponsored nofollow noopener" title="Pelican" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/Pelican-20815910.png" alt="Pelican" className="max-h-6 w-auto" /></a>
                  <a href="https://www.dpbolvw.net/click-101696721-17207704" target="_blank" rel="sponsored nofollow noopener" title="Fresh Adventures" className="w-full h-[44px] bg-white rounded-md flex items-center justify-center px-2 hover:opacity-90 transition-all duration-200 ring-1 ring-blue-400/70 shadow-[0_0_14px_rgba(59,130,246,0.55)] hover:shadow-[0_0_24px_rgba(59,130,246,0.90)]"><img src="/logos/FreshAdventures-23650288.png" alt="Fresh Adventures" className="max-h-6 w-auto" /></a>
                </div>
              </div>

            </div>
          </div>
          {/* CJ impression pixels — preserved from prior sponsor strip for tracking parity */}
          <img src="https://www.lduhtrp.net/image-101696721-15600687" width="1" height="1" border="0" alt="" aria-hidden="true" />
          <img src="https://www.lduhtrp.net/image-101696721-11371807" width="1" height="1" border="0" alt="" aria-hidden="true" />
          <img src="https://www.ftjcfx.com/image-101696721-10433860" width="1" height="1" border="0" alt="" aria-hidden="true" />
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-100 dark:border-gray-800 py-3 px-4 text-center text-xs text-gray-500">
          Powered by <span className="font-semibold">highsignal™</span> © 2026 llmadvisor.ai · Licensed under Apache-2.0
        </footer>
      </div>
    </div>
  )
}
