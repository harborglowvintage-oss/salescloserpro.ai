import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Users, GitBranch,
  Rocket, Plus, Menu, X, DollarSign, Coffee, Sun, Moon, HelpCircle, Building2, HardDrive, ShoppingCart,
  MessageSquare, ExternalLink
} from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import useStore from '../../store'

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
          <div className="flex-1 min-w-0">
            <div className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-tight">salescloserpro.ai</div>
            <div className="text-xs text-gray-400 dark:text-gray-500 leading-tight truncate">
              {company.name || 'Your Company'}
            </div>
          </div>
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
                <img src="./gptlogo.png" alt="salescloserpro.ai" className="w-14 h-14 object-cover rounded-xl drop-shadow-sm" />
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
        
        {/* Footer */}
        <footer className="border-t border-gray-800 py-3 px-4 text-center text-xs text-gray-500">
          Powered by <span className="font-semibold">highsignal™</span> © 2026 llmadvisor.ai · Licensed under Apache-2.0
        </footer>
      </div>
    </div>
  )
}
