/**
 * salescloserpro.ai - Export: contacts, deals and quotes as CSV for HubSpot, Salesforce or anything else
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 */

import { useMemo, useState } from 'react'
import { Download, FileSpreadsheet, FileText, Lock, Check } from 'lucide-react'
import clsx from 'clsx'
import useStore from '../../store'
import { EXPORT_FORMATS, buildRecords, buildExportFile } from '../../utils/crmExport'
import { downloadFile } from '../../utils/download'
import { generateReportPDF, summarize } from '../../utils/reportPdf'
import { formatMoney } from '../../utils/quoteMath'

export default function CrmExport() {
  const clients = useStore((s) => s.clients)
  const quotes = useStore((s) => s.quotes)
  const pipeline = useStore((s) => s.pipeline)
  const company = useStore((s) => s.company)
  const records = useMemo(() => buildRecords({ clients, quotes, pipeline }), [clients, quotes, pipeline])

  const summary = useMemo(() => summarize(records), [records])

  const [formatId, setFormatId] = useState(EXPORT_FORMATS[0].id)
  const [done, setDone] = useState({}) // filename → true, for the tick
  const format = EXPORT_FORMATS.find((f) => f.id === formatId)

  const download = (file) => {
    const { filename, csv } = buildExportFile(format, file, records)
    downloadFile(csv, filename, 'text/csv;charset=utf-8')
    setDone((d) => ({ ...d, [`${format.id}/${file.key}`]: true }))
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Export</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Download a readable summary, or take your contacts, deals and quotes to HubSpot, Salesforce, or any tool that reads a spreadsheet.</p>
      </div>

      {/* summary report — the easy-to-read option */}
      <div className="card flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-copper-100 dark:bg-copper-500/15 text-copper-700 dark:text-copper-300 flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-gray-900 dark:text-gray-100">Business Summary (PDF)</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            A clean, easy-to-read report — {formatMoney(summary.openValue)} open, {formatMoney(summary.wonValue)} won, then your deals, quotes and contacts in plain tables. Good for printing or sharing with a partner or accountant.
          </p>
        </div>
        <button onClick={() => generateReportPDF({ records, company })} className="btn-primary flex items-center justify-center gap-2 text-sm !py-3 whitespace-nowrap">
          <Download className="w-4 h-4" /> Download PDF
        </button>
      </div>

      <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 !mt-8">Spreadsheet files for other software</h2>

      {/* format picker */}
      <div className="grid sm:grid-cols-3 gap-3" role="tablist" aria-label="Export format">
        {EXPORT_FORMATS.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={f.id === formatId}
            onClick={() => setFormatId(f.id)}
            className={clsx(
              'rounded-2xl border-2 p-4 text-left transition-all',
              f.id === formatId
                ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/40 shadow-md'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-brand-300'
            )}
          >
            <span className="block font-bold text-gray-900 dark:text-gray-100">{f.name}</span>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">{f.files.length} file{f.files.length !== 1 ? 's' : ''}</span>
          </button>
        ))}
      </div>

      <div className="card space-y-5" role="tabpanel">
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{format.blurb}</p>

        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {format.files.map((file) => {
            const count = records[file.from].length
            const wasDone = done[`${format.id}/${file.key}`]
            return (
              <li key={file.key} className="flex items-center gap-3 py-3">
                <FileSpreadsheet className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{file.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{count} row{count !== 1 ? 's' : ''} · {file.columns.length} columns</p>
                </div>
                <button
                  onClick={() => download(file)}
                  disabled={!count}
                  className="btn-secondary !py-2 !px-4 text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {wasDone ? <Check className="w-4 h-4 text-green-600" /> : <Download className="w-4 h-4" />} CSV
                </button>
              </li>
            )
          })}
        </ul>

        {format.steps && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">How to import into {format.name}</h2>
            <ol className="list-decimal list-inside space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
              {format.steps.map((s) => <li key={s}>{s}</li>)}
            </ol>
          </div>
        )}

        <p className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Lock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          Files are created on this device — salescloserpro.ai does not connect to {format.id === 'universal' ? 'any service' : format.name} or send your data anywhere. You upload them yourself.
        </p>
      </div>
    </div>
  )
}
