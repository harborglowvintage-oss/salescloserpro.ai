import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/layout/Layout'
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
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
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
