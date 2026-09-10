import { useState } from 'react'
import {
  HelpCircle, FileText, Users, GitBranch, Rocket, ShoppingCart,
  Paperclip, Sun, Upload, Printer, Send, HardDrive,
  ChevronDown, ChevronRight, Search, BookOpen, Zap, Shield,
  BarChart3, Settings, PlusCircle, Eye
} from 'lucide-react'

const sections = [
  {
    id: 'getting-started',
    icon: Zap,
    title: 'Getting Started',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    content: [
      {
        q: 'What is SalesCloserPro?',
        a: 'SalesCloserPro is a free, open-source sales quoting tool. It runs entirely in your browser — no server, no sign-up, no subscription. Build professional quotes, keep a client list, track deals on a pipeline board, issue purchase orders to vendors, and export polished PDFs in seconds.'
      },
      {
        q: 'Do I need an account?',
        a: 'No. Click "Launch App" and you are in. There is no email, password, or verification step. Everything you create is saved on this device automatically.'
      },
      {
        q: 'Where is my data stored?',
        a: 'All data is stored locally in your browser\'s built-in database (IndexedDB) under the name "salescloserpro". Nothing is sent to any server. Because the data lives in this browser on this device, clearing site data will erase it — use the Backup page to keep a copy.'
      },
      {
        q: 'How do I set up my company info?',
        a: 'Go to Company Info in the sidebar. Enter your company name, address, phone, email, website, and home state, then click Save. This information auto-fills the header on every PDF quote and purchase order. You can upload a logo on the same page, and a profile-completeness bar shows what is still missing.'
      },
      {
        q: 'Is it really free?',
        a: 'Yes — 100% free and open source under the Apache 2.0 license. No hidden fees, no feature gates, no time limits.'
      }
    ]
  },
  {
    id: 'quotes',
    icon: FileText,
    title: 'Creating & Managing Quotes',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    content: [
      {
        q: 'How do I create a new quote?',
        a: 'Click "New Quote" in the sidebar (or Quotes → New Quote). Enter the client\'s name, email, phone, and state, then add line items using the four big buttons — Product, Service, Install / Labor, or Freight. Fill in a description, quantity, unit, and unit price for each line. The subtotal, tax, and grand total update as you type. Click Save Quote when you are done.'
      },
      {
        q: 'How does tax work?',
        a: 'Tax is calculated per line from the client\'s state. Rates for all 50 states and DC are built in, including whether that state taxes freight and installation labor. Each line shows its tax amount, or "TAX EXEMPT" when that line type is not taxable in the selected state. A note under the state picker summarizes that state\'s rules. Always confirm rates with your accountant before invoicing.'
      },
      {
        q: 'How does auto-numbering work?',
        a: 'Quotes are numbered sequentially starting from Q-0001. Numbers are never reused, so deleting a quote does not renumber the others.'
      },
      {
        q: 'What statuses can a quote have?',
        a: 'Draft, Sent, Won, or Lost. Change it from the dropdown in the quote header. The status also sets the deal\'s column on the Pipeline, and quotes marked Won count toward Revenue Won on the Dashboard.'
      },
      {
        q: 'How do I export a quote as a PDF?',
        a: 'Open the quote and click PDF in the header or Export PDF at the bottom. The quote is saved first, then a branded PDF downloads with your logo and company info, the client details, every line item with tax, the totals, your notes, the standard terms, and any attached images.'
      },
      {
        q: 'How do I edit or delete a quote?',
        a: 'Go to Quotes and click any quote to open it in the builder; make your changes and click Save. To delete, hover over the quote in the list and click the trash icon. You will be asked to confirm.'
      }
    ]
  },
  {
    id: 'attachments',
    icon: Paperclip,
    title: 'File Attachments',
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
    content: [
      {
        q: 'How do I attach files to a quote?',
        a: 'In the Quote Builder, scroll to the Attachments section. Drag and drop files onto the upload area, or click to browse. Images (JPG, PNG, GIF, WebP) and PDFs are supported.'
      },
      {
        q: 'What are the file size limits?',
        a: 'Up to 5 files per quote, each up to 2 MB. Images are automatically resized to a maximum of 1200 px so they stay small in storage.'
      },
      {
        q: 'Do attachments appear in the PDF?',
        a: 'Yes. Image attachments are embedded as thumbnails in the Attachments section of the generated PDF. PDF attachments are listed by file name.'
      },
      {
        q: 'How do I remove an attachment?',
        a: 'Hover over any thumbnail in the attachments grid and click the ✕ button.'
      }
    ]
  },
  {
    id: 'clients',
    icon: Users,
    title: 'Client Management',
    color: 'text-cyan-500',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    content: [
      {
        q: 'How do I add a client?',
        a: 'Go to Clients and click "Add Client". Enter their name, company, email, phone, address, state, and any private notes, then click Add Client.'
      },
      {
        q: 'Can I edit or delete clients?',
        a: 'Yes. Each client card has Edit and delete (trash) buttons. Editing opens the form with the existing details pre-filled.'
      },
      {
        q: 'Are clients linked to quotes?',
        a: 'Not yet. Clients is a standalone address book with click-to-email and click-to-call. Quotes carry their own client fields, so you can quote someone before adding them to Clients. A client picker for the Quote Builder is on the roadmap.'
      }
    ]
  },
  {
    id: 'pipeline',
    icon: GitBranch,
    title: 'Sales Pipeline',
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    content: [
      {
        q: 'What is the Pipeline view?',
        a: 'A kanban-style board with six columns: Lead, Quoted, Proposal Sent, Negotiating, Closed Won, and Closed Lost. Each column shows its deal count and total value, and the header shows total pipeline value.'
      },
      {
        q: 'How do quotes get onto the pipeline?',
        a: 'Automatically. Every saved quote creates a deal card linked to its quote number, with the deal value set to the quote\'s grand total. The quote status picks the column — Draft → Quoted, Sent → Proposal Sent, Won → Closed Won, Lost → Closed Lost. Click the quote badge on a card to open the quote.'
      },
      {
        q: 'How do I move a deal?',
        a: 'Use the Move and Back buttons at the bottom of each card. Deals that came from a quote will jump back to the column matching the quote\'s status the next time that quote is saved.'
      },
      {
        q: 'Can I add a deal that has no quote?',
        a: 'Yes. Click "Add Deal" at the bottom of any column and enter a name, company, value, and note.'
      },
      {
        q: 'What do the card border colors mean?',
        a: 'Cards get an amber border after 7 days and a red border after 14 days, so stale deals stand out. Cards also show a PO badge when purchase orders are linked to the deal\'s quote.'
      }
    ]
  },
  {
    id: 'purchase-orders',
    icon: ShoppingCart,
    title: 'Purchase Orders & Margins',
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    content: [
      {
        q: 'What are purchase orders for?',
        a: 'POs document what you buy from vendors to fulfil a job. Each PO records the vendor, contact, ship-to address, a description, quantity, and unit cost. Optionally link it to a quote line item to track margin.'
      },
      {
        q: 'How do I issue a PO?',
        a: 'Go to Purchase Orders and click "New PO". Fill in the form, then either "Save PO" (keeps it as a draft) or "Issue PO & Download PDF" (marks it Issued with today\'s date and downloads a vendor-ready PDF). Draft POs in the list have a send icon that does the same.'
      },
      {
        q: 'What statuses can a PO have?',
        a: 'Draft, Issued, Ordered, Received, and Paid. Filter the list by status, or search by PO number, vendor, description, quote, or client.'
      },
      {
        q: 'How does margin tracking work?',
        a: 'When a PO is linked to a quote line item, the app compares that line\'s sell price against the PO cost. The Margin Table tab lists sell, cost, margin, and margin % per PO with totals, and the Charts tab shows cost by line type, margin % by quote, and sell vs. cost per quote. Margin data is internal only — it is never printed on the PO PDF.'
      },
      {
        q: 'What is the Ship To address?',
        a: 'The delivery address printed on the PO PDF. Leave it blank to use your company address from Company Info.'
      }
    ]
  },
  {
    id: 'dashboard',
    icon: BarChart3,
    title: 'Dashboard',
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    content: [
      {
        q: 'What does the Dashboard show?',
        a: 'Four cards — Open Quotes (drafts + sent), Total Clients, Deals Won, and Revenue Won (the total of quotes marked Won) — plus your five most recent quotes and a count of deals in each pipeline stage. It updates instantly as you work.'
      }
    ]
  },
  {
    id: 'branding',
    icon: Upload,
    title: 'Logo, Branding & Theme',
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    content: [
      {
        q: 'How do I upload my company logo?',
        a: 'Either click the logo square at the top of the sidebar, or use the Company Logo card on the Company Info page. Pick an image file (JPG or PNG) up to 2 MB. It is resized to 256 px and shown in the sidebar and on every PDF export.'
      },
      {
        q: 'How do I remove my logo?',
        a: 'Right-click the logo in the sidebar and confirm, or click "Remove Logo" on the Company Info page.'
      },
      {
        q: 'Does my logo appear on PDFs?',
        a: 'Yes. It appears in the top-left corner of every quote and purchase order PDF, next to your company name and contact details.'
      },
      {
        q: 'How do I switch between dark and light mode?',
        a: 'Click the sun/moon icon in the sidebar header (desktop) or the top bar (mobile). The app opens in dark mode by default; your choice is saved and applied before the page paints on the next visit.'
      }
    ]
  },
  {
    id: 'go-live',
    icon: Rocket,
    title: 'Go Live Wizard',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    content: [
      {
        q: 'What is the Go Live wizard?',
        a: 'An optional four-step checklist for hosting your own copy of SalesCloserPro: fork the code on GitHub, deploy it for free on Cloudflare Pages, optionally connect a custom domain, and optionally set up business email. Progress is saved as you tick items off.'
      },
      {
        q: 'Do I need to complete Go Live to use the app?',
        a: 'No. Go Live is only for people who want their own branded, self-hosted copy. Everything else works right here without it.'
      }
    ]
  },
  {
    id: 'backup',
    icon: Shield,
    title: 'Backup & Restore',
    color: 'text-teal-500',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    content: [
      {
        q: 'How do I back up my data?',
        a: 'Go to Backup in the sidebar. Three options: (1) Download Backup — saves a .json file to your Downloads folder and works in every browser, (2) Save to Folder — pick any local drive, USB stick, or network share and write the file there directly (Chrome and Edge), (3) Automatic Backup — choose an interval from 1 hour to weekly and a target folder, and backups happen on their own while the app is open.'
      },
      {
        q: 'Can I back up to a USB drive or network share?',
        a: 'Yes. The folder picker in Chrome or Edge lets you choose any mounted drive, including USB sticks, external drives, and mapped network shares.'
      },
      {
        q: 'How does auto-backup work?',
        a: 'Turn on the toggle, choose an interval, and pick a folder. While the Backup page is open the app checks every minute whether a backup is due and writes a timestamped file when it is. Each backup is recorded in the history table.'
      },
      {
        q: 'How do I restore from a backup?',
        a: 'Click "Restore from Backup" and choose a .json file. You will see a preview of what it contains (quotes, clients, purchase orders, company). Confirm to replace all current data — the app reloads automatically.'
      },
      {
        q: 'What is included in a backup?',
        a: 'Everything: quotes and line items, clients, pipeline deals, purchase orders, company settings and logo, theme preference, and backup settings. Attachments are included as embedded data. Each backup is a complete snapshot.'
      }
    ]
  },
  {
    id: 'tips',
    icon: Settings,
    title: 'Tips & Troubleshooting',
    color: 'text-gray-500',
    bg: 'bg-gray-50 dark:bg-gray-800/40',
    content: [
      {
        q: 'Where can I see my raw data?',
        a: 'In your browser\'s DevTools go to Application → Storage → IndexedDB → salescloserpro → keyval. The single row holds everything as JSON. Prefer the Backup page for a readable copy.'
      },
      {
        q: 'Which browsers are supported?',
        a: 'Current versions of Chrome, Edge, Firefox, and Safari. Folder-based and automatic backups need Chrome or Edge; download and restore work everywhere.'
      },
      {
        q: 'How much data can I store?',
        a: 'IndexedDB allows hundreds of megabytes or more in modern browsers, so thousands of quotes with attachments fit comfortably. Images are resized on upload to keep things lean.'
      },
      {
        q: 'Can I use this on my phone?',
        a: 'Yes. The layout is responsive and the sidebar collapses into a menu. Quotes, attachments, and PDF export all work on mobile, though a laptop or tablet is more comfortable for building longer quotes.'
      },
      {
        q: 'I found a bug — where do I report it?',
        a: 'Open an issue at github.com/harborglowvintage-oss/salescloserpro.ai/issues with what you expected, what happened, and your browser. Screenshots help.'
      }
    ]
  }
]

export default function HelpGuide() {
  const [expanded, setExpanded] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [activeSection, setActiveSection] = useState(null)

  const toggle = (sectionId, index) => {
    const key = `${sectionId}-${index}`
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const filteredSections = searchTerm.trim()
    ? sections.map((section) => ({
        ...section,
        content: section.content.filter(
          (item) =>
            item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.a.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter((s) => s.content.length > 0)
    : activeSection
      ? sections.filter((s) => s.id === activeSection)
      : sections

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Help & User Guide</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Everything you need to know about SalesCloserPro</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search help articles…"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setActiveSection(null) }}
          className="input-field pl-10 w-full"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick-nav pills */}
      {!searchTerm && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSection(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !activeSection
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All Topics
          </button>
          {sections.map((s) => {
            const Icon = s.icon
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(activeSection === s.id ? null : s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeSection === s.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {s.title}
              </button>
            )
          })}
        </div>
      )}

      {/* Sections */}
      {filteredSections.length === 0 ? (
        <div className="card text-center py-12">
          <HelpCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No results found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSections.map((section) => {
            const Icon = section.icon
            return (
              <div key={section.id} className="card overflow-hidden">
                {/* Section header */}
                <div className={`flex items-center gap-3 px-5 py-4 ${section.bg} border-b border-gray-100 dark:border-gray-700`}>
                  <Icon className={`w-5 h-5 ${section.color} flex-shrink-0`} />
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{section.title}</h2>
                  <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">{section.content.length} articles</span>
                </div>

                {/* FAQ items */}
                <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {section.content.map((item, i) => {
                    const key = `${section.id}-${i}`
                    const isOpen = expanded[key]
                    return (
                      <div key={i}>
                        <button
                          onClick={() => toggle(section.id, i)}
                          className="w-full flex items-start gap-3 px-5 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                        >
                          {isOpen
                            ? <ChevronDown className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            : <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 mt-0.5 flex-shrink-0" />
                          }
                          <span className={`text-sm font-medium ${isOpen ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {item.q}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-4 pl-12">
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.a}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Quick reference card */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          Quick Reference
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { icon: PlusCircle, label: 'New Quote', desc: 'Sidebar → New Quote button', color: 'text-blue-500' },
            { icon: Printer, label: 'Export PDF', desc: 'Open a quote → PDF / Export PDF', color: 'text-green-500' },
            { icon: Send, label: 'Issue a PO', desc: 'Purchase Orders → New PO → Issue PO & Download PDF', color: 'text-violet-500' },
            { icon: Upload, label: 'Upload Logo', desc: 'Click the logo in the sidebar, or Company Info', color: 'text-orange-500' },
            { icon: Sun, label: 'Toggle Theme', desc: 'Sun/Moon icon in the sidebar header', color: 'text-amber-500' },
            { icon: Users, label: 'Add Client', desc: 'Clients → Add Client', color: 'text-cyan-500' },
            { icon: Eye, label: 'Move a Deal', desc: 'Pipeline → Move / Back buttons on a card', color: 'text-indigo-500' },
            { icon: Paperclip, label: 'Attach Files', desc: 'Quote → Attachments → drag or click', color: 'text-green-500' },
            { icon: HardDrive, label: 'Back Up Data', desc: 'Backup → Download Backup or Save to Folder', color: 'text-teal-500' },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                <Icon className={`w-4 h-4 mt-0.5 ${item.color} flex-shrink-0`} />
                <div>
                  <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">{item.label}</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">{item.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Version + support footer */}
      <div className="card p-5 text-center space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">SalesCloserPro v{__APP_VERSION__}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Free & Open Source · Powered by{' '}
          <a href="https://llmadvisor.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 font-medium">
            llmadvisor.ai
          </a>
        </p>
      </div>
    </div>
  )
}
