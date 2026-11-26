/**
 * salescloserpro.ai - Application Root
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 * https://github.com/harborglowvintage-oss/salescloserpro.ai
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/layout/Layout'
import Dashboard from './components/dashboard/Dashboard'
import QuoteBuilder from './components/quotes/QuoteBuilder'
import QuoteList from './components/quotes/QuoteList'
import Contacts from './components/contacts/Contacts'
import Pipeline from './components/pipeline/Pipeline'
import HelpGuide from './components/help/HelpGuide'
import CompanySettings from './components/settings/CompanySettings'
import BackupRestore from './components/backup/BackupRestore'
import PurchaseOrders from './components/po/PurchaseOrders'
import ProposalView from './components/proposal/ProposalView'
import AcceptanceReceiver from './components/proposal/AcceptanceReceiver'
import CrmExport from './components/export/CrmExport'
import useStore from './store'
import { PUBLIC_PAGES, NOT_FOUND_PAGE, PublicPage } from './publicPages'

export default function App() {
  const syncAllQuotesToPipeline = useStore((s) => s.syncAllQuotesToPipeline)
  const quotes = useStore((s) => s.quotes)

  // Sync quotes into pipeline after store has hydrated from IndexedDB.
  // Running on quotes.length change ensures we catch the first real load.
  useEffect(() => {
    syncAllQuotesToPipeline()
  }, [quotes.length]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages (home, about, services, legal) — prerendered at build, see publicPages.jsx */}
        {PUBLIC_PAGES.map((page) => (
          <Route key={page.path} path={page.path} element={<PublicPage page={page} />} />
        ))}
        {/* Client-facing proposal — rendered from the link's #fragment, no store access */}
        <Route path="/p" element={<ProposalView />} />
        
        {/* App routes — instant access, no email/login. Each one needs a rewrite to /app in
            public/_redirects; the build stops if one is missing. */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="quotes" element={<QuoteList />} />
          <Route path="quotes/new" element={<QuoteBuilder />} />
          <Route path="quotes/:id" element={<QuoteBuilder />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="clients" element={<Navigate to="/contacts" replace />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
          <Route path="go-live" element={<Navigate to="/dashboard" replace />} />
          <Route path="settings" element={<CompanySettings />} />
          <Route path="backup" element={<BackupRestore />} />
          <Route path="export" element={<CrmExport />} />
          <Route path="help" element={<HelpGuide />} />
          <Route path="accept" element={<AcceptanceReceiver />} />
        </Route>

        <Route path="*" element={<PublicPage page={NOT_FOUND_PAGE} />} />
      </Routes>
    </BrowserRouter>
  )
}
