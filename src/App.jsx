/**
 * SalesCloserPro - Application Root
 * Copyright (c) 2026 Brent Girolimon / llmadvisor.ai
 * Powered by highsignal™
 * Licensed under Apache-2.0
 * https://github.com/harborglowvintage-oss/salescloserpro.ai
 */

import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/layout/Layout'
import LandingPage from './components/landing/LandingPage'
import AboutPage from './components/landing/AboutPage'
import Dashboard from './components/dashboard/Dashboard'
import QuoteBuilder from './components/quotes/QuoteBuilder'
import QuoteList from './components/quotes/QuoteList'
import Clients from './components/clients/Clients'
import Pipeline from './components/pipeline/Pipeline'
import GoLiveWizard from './components/wizard/GoLiveWizard'
import HelpGuide from './components/help/HelpGuide'
import CompanySettings from './components/settings/CompanySettings'
import BackupRestore from './components/backup/BackupRestore'
import PurchaseOrders from './components/po/PurchaseOrders'
import LegalPage from './components/landing/LegalPage'
import ServicesPage from './components/landing/ServicesPage'
import useStore from './store'

export default function App() {
  const syncAllQuotesToPipeline = useStore((s) => s.syncAllQuotesToPipeline)

  // On app load, sync all existing quotes into the pipeline
  useEffect(() => {
    syncAllQuotesToPipeline()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/services" element={<ServicesPage />} />
        
        {/* App Routes */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="quotes" element={<QuoteList />} />
          <Route path="quotes/new" element={<QuoteBuilder />} />
          <Route path="quotes/:id" element={<QuoteBuilder />} />
          <Route path="clients" element={<Clients />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
          <Route path="go-live" element={<GoLiveWizard />} />
          <Route path="settings" element={<CompanySettings />} />
          <Route path="backup" element={<BackupRestore />} />
          <Route path="help" element={<HelpGuide />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
