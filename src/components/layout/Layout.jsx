import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Users, GitBranch,
  Plus, Menu, X, Sun, Moon, HelpCircle, Building2, HardDrive, ShoppingCart, Share2
} from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import useStore, { useHydrated } from '../../store'
import { safeLogo } from '../../utils/fileSafety'
import { ProductLogo, Wordmark, StudioCredit, COPYRIGHT_LINE } from '../brand/Brand'

const nav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/quotes',    icon: FileText,         label: 'Quotes' },
  { to: '/contacts',  icon: Users,            label: 'Contacts' },
  { to: '/pipeline',  icon: GitBranch,        label: 'Pipeline' },
  { to: '/purchase-orders', icon: ShoppingCart, label: 'Purchase Orders' },
  { to: '/settings',  icon: Building2,        label: 'Company Info' },
  { to: '/backup',    icon: HardDrive,        label: 'Backup' },
  { to: '/export',    icon: Share2,           label: 'Export' },
  { to: '/help',      icon: HelpCircle,       label: 'Help & Guide' },
]

export default function Layout() {
  const hydrated = useHydrated()
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
    e.target.value = ''
    try { setCompany({ logo: await safeLogo(file) }) } catch (err) { alert(`That logo can't be used: ${err.message}.`) }
  }, [setCompany])

  const handleLogoContext = useCallback((e) => {
    if (!company.logo) return
    e.preventDefault()
    if (window.confirm('Remove company logo?')) setCompany({ logo: '' })
  }, [company.logo, setCompany])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    // Mirror to localStorage so the pre-paint script in index.html can apply the
    // theme before React loads (IndexedDB is async, so it can't be read there).
    try { localStorage.setItem('scp-theme', theme) } catch { /* private mode etc. */ }
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
          <input ref={logoInputRef} type="file" accept=".jpg,.jpeg,.png,.gif,.webp" className="hidden" onChange={handleLogoUpload} />
          <button
            onClick={() => logoInputRef.current?.click()}
            onContextMenu={handleLogoContext}
            className="group relative w-9 h-9 rounded-xl flex-shrink-0 overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1"
            title={company.logo ? 'Click to change · Right-click to remove' : 'Upload your logo'}
          >
            {company.logo ? (
              <img src={company.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <ProductLogo className="w-full h-full rounded-none" />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
              <span className="text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {company.logo ? '✎' : '+'}
              </span>
            </div>
          </button>
          <button onClick={() => navigate('/')} className="flex-1 min-w-0 text-left hover:opacity-70 transition-opacity">
            <Wordmark adaptive className="block text-gray-900 dark:text-gray-100 text-sm leading-tight" />
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
                   ? 'bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300'
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
          <StudioCredit
            className="w-full justify-center text-[11px] text-gray-500 dark:text-gray-400 hover:text-brand-700 dark:hover:text-brand-300"
            markClassName="w-6 h-6"
          />
          <div className="text-[9px] text-gray-400 dark:text-gray-500 text-center">{COPYRIGHT_LINE}</div>
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
              <ProductLogo className="w-7 h-7" />
            )}
            <Wordmark adaptive className="text-sm text-gray-900 dark:text-gray-100" />
          </div>
          <button
            onClick={toggleTheme}
            className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {hydrated && <Outlet />}
        </main>
        
        {/* Footer */}
        <footer className="border-t border-gray-100 dark:border-gray-800 py-3 px-4 text-center text-xs text-gray-500">
          {COPYRIGHT_LINE}
        </footer>
      </div>
    </div>
  )
}
