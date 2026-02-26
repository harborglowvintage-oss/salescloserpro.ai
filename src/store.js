import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { indexedDBStorage } from './db'

const useStore = create(
  persist(
    (set, get) => ({
      // ── Theme ──────────────────────────────────────────
      theme: 'dark',
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),

      // ── Company Settings ──────────────────────────────
      company: {
        name: 'llmadvisor.ai',
        logo: '/gptlogo.png',
        address: '',
        phone: '',
        email: '',
        website: 'https://llmadvisor.ai',
        homeState: 'MA',
      },
      setCompany: (data) => set((s) => ({ company: { ...s.company, ...data } })),

      // ── Clients ───────────────────────────────────────
      clients: [],
      addClient: (client) =>
        set((s) => ({
          clients: [
            ...s.clients,
            { ...client, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
          ],
        })),
      updateClient: (id, data) =>
        set((s) => ({
          clients: s.clients.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),
      deleteClient: (id) =>
        set((s) => ({ clients: s.clients.filter((c) => c.id !== id) })),

      // ── Quotes ────────────────────────────────────────
      quotes: [],
      addQuote: (quote) =>
        set((s) => ({
          quotes: [
            ...s.quotes,
            {
              ...quote,
              id: crypto.randomUUID(),
              quoteNumber: `Q-${String(s.quotes.length + 1).padStart(4, '0')}`,
              createdAt: new Date().toISOString(),
              status: 'draft',
            },
          ],
        })),
      updateQuote: (id, data) =>
        set((s) => ({
          quotes: s.quotes.map((q) => (q.id === id ? { ...q, ...data } : q)),
        })),
      deleteQuote: (id) =>
        set((s) => ({ quotes: s.quotes.filter((q) => q.id !== id) })),

      // ── Pipeline Stages ───────────────────────────────
      pipeline: [
        { id: 'lead',      label: 'Lead',           color: 'bg-gray-100',   deals: [] },
        { id: 'quoted',    label: 'Quoted',          color: 'bg-blue-100',   deals: [] },
        { id: 'sent',      label: 'Proposal Sent',   color: 'bg-yellow-100', deals: [] },
        { id: 'negotiate', label: 'Negotiating',     color: 'bg-orange-100', deals: [] },
        { id: 'won',       label: 'Closed Won',      color: 'bg-green-100',  deals: [] },
        { id: 'lost',      label: 'Closed Lost',     color: 'bg-red-100',    deals: [] },
      ],
      addDeal: (stageId, deal) =>
        set((s) => ({
          pipeline: s.pipeline.map((stage) =>
            stage.id === stageId
              ? {
                  ...stage,
                  deals: [
                    ...stage.deals,
                    { ...deal, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
                  ],
                }
              : stage
          ),
        })),
      moveDeal: (dealId, fromStageId, toStageId) =>
        set((s) => {
          const fromStage = s.pipeline.find((st) => st.id === fromStageId)
          const deal = fromStage?.deals.find((d) => d.id === dealId)
          if (!deal) return s
          return {
            pipeline: s.pipeline.map((stage) => {
              if (stage.id === fromStageId)
                return { ...stage, deals: stage.deals.filter((d) => d.id !== dealId) }
              if (stage.id === toStageId)
                return { ...stage, deals: [...stage.deals, { ...deal, movedAt: new Date().toISOString() }] }
              return stage
            }),
          }
        }),
      deleteDeal: (dealId, stageId) =>
        set((s) => ({
          pipeline: s.pipeline.map((stage) =>
            stage.id === stageId
              ? { ...stage, deals: stage.deals.filter((d) => d.id !== dealId) }
              : stage
          ),
        })),

      // Map quote status → pipeline stage
      _quoteStatusToStage: (status) => {
        const map = { draft: 'quoted', sent: 'sent', won: 'won', lost: 'lost' }
        return map[status] || 'quoted'
      },

      // Sync a quote into the pipeline — creates or moves the linked deal
      syncQuoteToPipeline: (quoteId) =>
        set((s) => {
          const quote = s.quotes.find((q) => q.id === quoteId)
          if (!quote) return s

          const targetStageId = s._quoteStatusToStage(quote.status)

          // Find existing deal linked to this quote
          let existingDeal = null
          let currentStageId = null
          for (const stage of s.pipeline) {
            const found = stage.deals.find((d) => d.quoteId === quoteId)
            if (found) {
              existingDeal = found
              currentStageId = stage.id
              break
            }
          }

          if (existingDeal) {
            // Update deal data from quote
            const updatedDeal = {
              ...existingDeal,
              name: quote.clientName || existingDeal.name,
              company: quote.clientName,
              value: quote.total || existingDeal.value,
              quoteNumber: quote.quoteNumber,
            }

            if (currentStageId === targetStageId) {
              // Same stage — just update the deal data
              return {
                pipeline: s.pipeline.map((stage) =>
                  stage.id === currentStageId
                    ? { ...stage, deals: stage.deals.map((d) => d.id === existingDeal.id ? updatedDeal : d) }
                    : stage
                ),
              }
            } else {
              // Move to new stage
              return {
                pipeline: s.pipeline.map((stage) => {
                  if (stage.id === currentStageId)
                    return { ...stage, deals: stage.deals.filter((d) => d.id !== existingDeal.id) }
                  if (stage.id === targetStageId)
                    return { ...stage, deals: [...stage.deals, { ...updatedDeal, movedAt: new Date().toISOString() }] }
                  return stage
                }),
              }
            }
          } else {
            // Create new deal linked to this quote
            const newDeal = {
              id: crypto.randomUUID(),
              name: quote.clientName || quote.quoteNumber,
              company: quote.clientName,
              value: quote.total || 0,
              note: `Linked to ${quote.quoteNumber}`,
              quoteId: quoteId,
              quoteNumber: quote.quoteNumber,
              createdAt: new Date().toISOString(),
            }
            return {
              pipeline: s.pipeline.map((stage) =>
                stage.id === targetStageId
                  ? { ...stage, deals: [...stage.deals, newDeal] }
                  : stage
              ),
            }
          }
        }),

      // Bulk-sync all quotes into pipeline on startup (catches pre-existing quotes)
      syncAllQuotesToPipeline: () => {
        const state = get()
        // Find quote IDs that already have a linked deal
        const linkedQuoteIds = new Set()
        for (const stage of state.pipeline) {
          for (const deal of stage.deals) {
            if (deal.quoteId) linkedQuoteIds.add(deal.quoteId)
          }
        }
        // Sync any quotes not yet in the pipeline
        for (const quote of state.quotes) {
          if (!linkedQuoteIds.has(quote.id)) {
            state.syncQuoteToPipeline(quote.id)
          } else {
            // Also re-sync existing linked deals so stage + data stay current
            state.syncQuoteToPipeline(quote.id)
          }
        }
      },

      // ── Purchase Orders ───────────────────────────────
      purchaseOrders: [],
      addPO: (po) =>
        set((s) => ({
          purchaseOrders: [
            ...s.purchaseOrders,
            {
              ...po,
              id: crypto.randomUUID(),
              poNumber: `PO-${String(s.purchaseOrders.length + 1).padStart(4, '0')}`,
              createdAt: new Date().toISOString(),
              status: po.status || 'draft',
            },
          ],
        })),
      updatePO: (id, data) =>
        set((s) => ({
          purchaseOrders: s.purchaseOrders.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),
      deletePO: (id) =>
        set((s) => ({ purchaseOrders: s.purchaseOrders.filter((p) => p.id !== id) })),

      // ── Payment Settings (MoonPay) ──────────────────────
      paymentSettings: {
        enabled: false,
        moonpayApiKey: '',                // publishable key (pk_live_… or pk_test_…)
        walletAddress: '',                // crypto wallet to receive payments
        defaultCurrency: 'usdc_polygon',  // stablecoin — best for invoices
        acceptedCurrencies: ['usdc_polygon', 'usdc', 'eth', 'btc'],
        environment: 'sandbox',           // 'sandbox' or 'production'
      },
      setPaymentSettings: (data) =>
        set((s) => ({ paymentSettings: { ...s.paymentSettings, ...data } })),

      // ── Go Live Progress ──────────────────────────────
      goLiveChecklist: {
        github_account: false,
        github_forked: false,
        github_cloned: false,
        cf_account: false,
        cf_project: false,
        cf_build: false,
        cf_deployed: false,
        domain_decided: false,
        domain_configured: false,
        email_decided: false,
        email_configured: false,
        pay_account: false,
        pay_keys: false,
        pay_wallet: false,
        pay_enabled: false,
        desktop_workflow: false,
        desktop_trigger: false,
        desktop_download: false,
      },
      setGoLiveCheck: (key, val) =>
        set((s) => ({ goLiveChecklist: { ...s.goLiveChecklist, [key]: val } })),
      resetGoLiveChecklist: () =>
        set(() => ({
          goLiveChecklist: {
            github_account: false, github_forked: false, github_cloned: false,
            cf_account: false, cf_project: false, cf_build: false, cf_deployed: false,
            domain_decided: false, domain_configured: false,
            email_decided: false, email_configured: false,
            pay_account: false, pay_keys: false, pay_wallet: false, pay_enabled: false,
            desktop_workflow: false, desktop_trigger: false, desktop_download: false,
          },
        })),

      // ── Backup Settings ───────────────────────────────
      backupSettings: {
        autoBackupEnabled: false,
        intervalHours: 24,
        lastBackupAt: null,
        backupHistory: [],      // [{ at, size, method }]
        locationLabel: '',      // e.g. "USB Drive (E:)" or "Network Share"
      },
      setBackupSettings: (data) =>
        set((s) => ({ backupSettings: { ...s.backupSettings, ...data } })),
      addBackupRecord: (record) =>
        set((s) => ({
          backupSettings: {
            ...s.backupSettings,
            lastBackupAt: record.at,
            backupHistory: [record, ...s.backupSettings.backupHistory].slice(0, 50),
          },
        })),
    }),
    { name: 'salescloserpro-data', storage: indexedDBStorage }
  )
)

export default useStore
