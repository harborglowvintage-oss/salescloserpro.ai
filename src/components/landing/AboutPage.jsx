/**
 * SalesCloserPro - About & User Guide
 * Copyright (c) 2026 Brent Girolimon / llmadvisor.ai
 * Powered by highsignal™
 * Licensed under Apache-2.0
 */

import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  FileText,
  Users,
  TrendingUp,
  ShoppingCart,
  Settings,
  Download,
  HardDrive,
  Shield,
  Github,
  CheckCircle,
  ChevronDown,
  BookOpen
} from 'lucide-react'
import { useState } from 'react'

/* ── collapsible section ── */
function Section({ icon: Icon, color, title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="flex-1 text-white font-semibold">{title}</span>
        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-6 pt-2 text-sm text-slate-400 leading-relaxed space-y-4 border-t border-white/[0.04]">{children}</div>}
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 antialiased">

      {/* ── nav ── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logos/salescloserprologo.png" alt="SalesCloserPro" className="h-8 w-auto" />
            <span className="text-lg font-bold text-white tracking-tight">SalesCloserPro</span>
          </Link>
          <Link to="/dashboard" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors">
            Launch App
          </Link>
        </div>
      </header>

      {/* ── hero ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="flex items-start gap-4 mb-2">
          <BookOpen className="w-10 h-10 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">About &amp; User Guide</h1>
            <p className="text-slate-400 leading-relaxed max-w-2xl">
              Everything you need to get up and running with SalesCloserPro — from your first quote to
              advanced settings. No technical background required.
            </p>
          </div>
        </div>
      </div>

      {/* ── content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-4">

        {/* ── what is it ── */}
        <Section icon={Shield} color="text-blue-400 bg-blue-500/10" title="What is SalesCloserPro?" defaultOpen={true}>
          <p>
            SalesCloserPro is a <strong className="text-white">free, open-source</strong> sales tool that lets you:
          </p>
          <ul className="space-y-2 ml-1">
            {[
              'Build professional quotes with line items, taxes, and your company logo',
              'Track every deal on a visual pipeline board',
              'Manage client contact details and deal history',
              'Generate purchase orders for your vendors',
              'Export everything as polished PDF files'
            ].map(t => (
              <li key={t} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <p>
            There are <strong className="text-white">no accounts, no subscriptions, and no data collection</strong>.
            Your information stays on your computer — period.
          </p>
        </Section>

        {/* ── getting started ── */}
        <Section icon={Download} color="text-emerald-400 bg-emerald-500/10" title="Getting started (2 minutes)">
          <p><strong className="text-white">Option A — Use in your browser</strong></p>
          <ol className="list-decimal ml-5 space-y-1">
            <li>Visit <Link to="/dashboard" className="text-blue-400 hover:underline">salescloserpro.ai → Launch App</Link></li>
            <li>You'll land on the Dashboard. That's it — you're ready to go.</li>
          </ol>
          <p><strong className="text-white">Option B — Download the desktop app</strong></p>
          <ol className="list-decimal ml-5 space-y-1">
            <li>Go to the <a href="https://github.com/harborglowvintage-oss/salescloserpro.ai/releases" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">GitHub releases page</a></li>
            <li>Download the installer for your OS (Windows, macOS, or Linux)</li>
            <li>Run the installer — no admin rights needed on most systems</li>
            <li>Open SalesCloserPro from your applications</li>
          </ol>
          <p className="text-slate-500">Both the web and desktop versions are identical. Your data is stored locally using your browser's built-in database (IndexedDB).</p>
        </Section>

        {/* ── company settings ── */}
        <Section icon={Settings} color="text-amber-400 bg-amber-500/10" title="Step 1 — Set up your company details">
          <p>Before you create your first quote, personalize SalesCloserPro:</p>
          <ol className="list-decimal ml-5 space-y-2">
            <li>Click <strong className="text-white">Settings</strong> in the left sidebar (gear icon).</li>
            <li><strong className="text-white">Company name</strong> — Enter your business name. This appears at the top of every quote and PO.</li>
            <li><strong className="text-white">Address &amp; contact</strong> — Add your business address, phone, and email.</li>
            <li><strong className="text-white">Logo</strong> — Click "Upload Logo" and pick an image file (PNG or JPG recommended, under 1 MB). Your logo will appear on exported PDFs.</li>
            <li><strong className="text-white">Tax settings</strong> — Choose your default tax rate or enable multi-tax support if needed.</li>
            <li>Click <strong className="text-white">Save</strong> — your settings are stored locally and apply to all future quotes.</li>
          </ol>
          <p className="text-slate-500">Tip: You can update these at any time. Changes only affect new quotes — existing PDFs won't change.</p>
        </Section>

        {/* ── creating a quote ── */}
        <Section icon={FileText} color="text-blue-400 bg-blue-500/10" title="Step 2 — Create your first quote">
          <ol className="list-decimal ml-5 space-y-2">
            <li>Click <strong className="text-white">Quotes</strong> in the sidebar.</li>
            <li>Click <strong className="text-white">+ New Quote</strong>.</li>
            <li>Select a client from the dropdown (or create a new one inline by typing a name).</li>
            <li>Add line items:
              <ul className="list-disc ml-5 mt-1 space-y-1">
                <li><strong className="text-white">Description</strong> — what you're selling (e.g., "Web Design Package")</li>
                <li><strong className="text-white">Quantity</strong> — how many</li>
                <li><strong className="text-white">Unit price</strong> — price per item</li>
              </ul>
            </li>
            <li>The total updates automatically including tax.</li>
            <li>Add optional notes at the bottom (payment terms, scope details, etc.).</li>
            <li>Click <strong className="text-white">Save Quote</strong> to store it, or <strong className="text-white">Export PDF</strong> to download a ready-to-send file.</li>
          </ol>
          <p className="text-slate-500">Pro tip: Use the "Duplicate" button to reuse a previous quote as a template — saves a ton of time for repeat services.</p>
        </Section>

        {/* ── clients ── */}
        <Section icon={Users} color="text-emerald-400 bg-emerald-500/10" title="Step 3 — Manage your clients">
          <ol className="list-decimal ml-5 space-y-2">
            <li>Click <strong className="text-white">Clients</strong> in the sidebar.</li>
            <li>Click <strong className="text-white">+ Add Client</strong>.</li>
            <li>Fill in their name, company, email, phone, and address.</li>
            <li>Click <strong className="text-white">Save</strong>.</li>
          </ol>
          <p>Once saved, the client appears in your dropdown when creating quotes. Every quote and PO linked to them will show in their profile, giving you a full history at a glance.</p>
        </Section>

        {/* ── pipeline ── */}
        <Section icon={TrendingUp} color="text-violet-400 bg-violet-500/10" title="Step 4 — Track deals in the pipeline">
          <ol className="list-decimal ml-5 space-y-2">
            <li>Click <strong className="text-white">Pipeline</strong> in the sidebar.</li>
            <li>You'll see a kanban board with columns like <em>Lead</em>, <em>Proposal Sent</em>, <em>Negotiation</em>, and <em>Won</em>.</li>
            <li><strong className="text-white">Add a deal</strong> — Click "+ Add Deal" at the top of any column, enter a name and value.</li>
            <li><strong className="text-white">Move deals</strong> — Drag and drop cards between columns as the deal progresses.</li>
            <li>The dashboard shows a summary of your pipeline's total value.</li>
          </ol>
          <p className="text-slate-500">The pipeline is a visual tool — it doesn't send emails or notifications. It's your personal bird's-eye view of where every deal stands.</p>
        </Section>

        {/* ── purchase orders ── */}
        <Section icon={ShoppingCart} color="text-amber-400 bg-amber-500/10" title="Step 5 — Create purchase orders">
          <ol className="list-decimal ml-5 space-y-2">
            <li>Click <strong className="text-white">Purchase Orders</strong> in the sidebar.</li>
            <li>Click <strong className="text-white">+ New PO</strong>.</li>
            <li>Enter the vendor's name, address, and any reference number.</li>
            <li>Add line items for what you're ordering.</li>
            <li>Save or export as PDF — just like quotes.</li>
          </ol>
          <p className="text-slate-500">POs are useful for documenting what you buy from suppliers. They pair well with your quotes when you need to track both revenue and cost.</p>
        </Section>

        {/* ── PDF export ── */}
        <Section icon={FileText} color="text-pink-400 bg-pink-500/10" title="Exporting PDFs">
          <p>Every quote and purchase order can be exported as a clean PDF:</p>
          <ol className="list-decimal ml-5 space-y-1">
            <li>Open any quote or PO.</li>
            <li>Click <strong className="text-white">Export PDF</strong>.</li>
            <li>A file downloads to your computer instantly.</li>
          </ol>
          <p>The PDF includes your company logo, address, all line items, tax breakdown, and any notes — ready to email directly to your client.</p>
        </Section>

        {/* ── backup & restore ── */}
        <Section icon={HardDrive} color="text-cyan-400 bg-cyan-500/10" title="Backup & restore your data">
          <p>Since everything is stored locally, regular backups keep your data safe:</p>
          <ol className="list-decimal ml-5 space-y-2">
            <li>Click <strong className="text-white">Backup</strong> in the sidebar.</li>
            <li>Click <strong className="text-white">Export Backup</strong> — this downloads a JSON file with all your data.</li>
            <li>To restore: click <strong className="text-white">Import Backup</strong> and select a previously exported JSON file.</li>
          </ol>
          <p className="text-slate-500">
            We recommend backing up weekly, or before clearing browser data. Store the file on a USB drive,
            cloud storage, or email it to yourself.
          </p>
        </Section>

        {/* ── FAQ ── */}
        <Section icon={BookOpen} color="text-slate-300 bg-white/5" title="Frequently asked questions">
          <div className="space-y-4">
            <div>
              <p className="text-white font-medium">Is it really free?</p>
              <p>Yes, completely. There's no premium tier, no feature gating, and no ads. The project is Apache-2.0 licensed open-source software.</p>
            </div>
            <div>
              <p className="text-white font-medium">Where is my data stored?</p>
              <p>In your browser's local database (IndexedDB). Nothing is sent to any server. If you clear your browser data, your SalesCloserPro data will be erased — so keep backups.</p>
            </div>
            <div>
              <p className="text-white font-medium">Can I use this on my phone?</p>
              <p>The web app works on mobile browsers, but it's designed for desktop screens. A tablet or laptop will give you the best experience.</p>
            </div>
            <div>
              <p className="text-white font-medium">How do I move my data to a new computer?</p>
              <p>Export a backup on your old machine, transfer the JSON file, and import it on the new one. Takes about 30 seconds.</p>
            </div>
            <div>
              <p className="text-white font-medium">Can multiple people use it?</p>
              <p>Each person gets their own local copy. There's no cloud sync or shared team features — it's designed as a personal sales tool.</p>
            </div>
            <div>
              <p className="text-white font-medium">I found a bug. How do I report it?</p>
              <p>Open an issue on <a href="https://github.com/harborglowvintage-oss/salescloserpro.ai/issues" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">GitHub</a> with a description of what happened and steps to reproduce it. Screenshots help!</p>
            </div>
          </div>
        </Section>
      </div>

      {/* ── footer ── */}
      <footer className="border-t border-white/[0.06] mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-center text-xs text-slate-500">
          © 2026 SalesCloserPro · Built by{' '}
          <a href="https://llmadvisor.ai" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">llmadvisor.ai</a>
          {' '}· Powered by highsignal™ · Apache-2.0 License
        </div>
      </footer>
    </div>
  )
}
