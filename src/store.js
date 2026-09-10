/**
 * SalesCloserPro - Global State Management
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 * https://github.com/harborglowvintage-oss/salescloserpro.ai
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { indexedDBStorage } from './db'

const useStore = create(
  persist(
    (set, get) => ({
      // ── Theme ──────────────────────────────────────────
      theme: 'dark',
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),

      // ── Company Settings ──────────────────────────────
      company: {
        name: '',
        logo: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        homeState: 'TX',
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
      quoteCounter: 0, // monotonic — numbers are never reused after a delete
      addQuote: (quote) =>
        set((s) => {
          const highest = s.quotes.reduce((m, q) => Math.max(m, parseInt((q.quoteNumber || '').replace(/\D/g, ''), 10) || 0), 0)
          const n = Math.max(s.quoteCounter || 0, highest) + 1
          return {
            quoteCounter: n,
            quotes: [
              ...s.quotes,
              {
                ...quote,
                id: crypto.randomUUID(),
                quoteNumber: `Q-${String(n).padStart(4, '0')}`,
                createdAt: new Date().toISOString(),
                status: 'draft',
              },
            ],
          }
        }),
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
      poCounter: 0, // monotonic — numbers are never reused after a delete
      addPO: (po) =>
        set((s) => {
          const highest = s.purchaseOrders.reduce((m, p) => Math.max(m, parseInt((p.poNumber || '').replace(/\D/g, ''), 10) || 0), 0)
          const n = Math.max(s.poCounter || 0, highest) + 1
          return {
            poCounter: n,
            purchaseOrders: [
              ...s.purchaseOrders,
              {
                ...po,
                id: crypto.randomUUID(),
                poNumber: `PO-${String(n).padStart(4, '0')}`,
                createdAt: new Date().toISOString(),
                status: po.status || 'draft',
              },
            ],
          }
        }),
      updatePO: (id, data) =>
        set((s) => ({
          purchaseOrders: s.purchaseOrders.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),
      deletePO: (id) =>
        set((s) => ({ purchaseOrders: s.purchaseOrders.filter((p) => p.id !== id) })),

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
    {
      name: 'salescloserpro-data',
      // createJSONStorage is REQUIRED for a string-based adapter: without it persist hands
      // the raw state object (including action functions) to IndexedDB, which throws
      // DataCloneError on every write — nothing was ever persisted before this fix.
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
)

export default useStore
