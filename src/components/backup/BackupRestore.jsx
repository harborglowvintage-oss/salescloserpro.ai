import { useState, useRef, useEffect, useCallback } from 'react'
import {
  HardDrive, Download, Upload, Clock, Shield, CheckCircle,
  AlertTriangle, Trash2, FolderOpen, RefreshCw, Wifi, Usb,
  MonitorSmartphone, ToggleLeft, ToggleRight, FileJson,
  History, Info, ChevronDown, ChevronRight, X
} from 'lucide-react'
import useStore from '../../store'
import { exportRawState, importRawState } from '../../db'
import { format, formatDistanceToNow } from 'date-fns'

// ── Helpers ─────────────────────────────────────────────
// Backups read the persisted Zustand JSON straight from IndexedDB (see db.js).
// NOTE: the store has NOT lived in localStorage since v1.0.1 — reading it there
// silently produced empty backups.
const getBackupPayload = () => exportRawState()

function getBackupSize(payload) {
  const bytes = new Blob([payload]).size
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function downloadFile(payload, filename) {
  const blob = new Blob([payload], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  // Delay cleanup — Firefox processes the click asynchronously
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 150)
}

function makeFilename() {
  const d = new Date()
  const stamp = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}_${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}`
  return `salescloserpro-backup-${stamp}.json`
}

// Support check for File System Access API (needed for folder-picker saves)
const hasFileSystemAccess = typeof window !== 'undefined' && 'showDirectoryPicker' in window

// ── STATUS BADGE ────────────────────────────────────────
function StatusBadge({ ok, children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
      ok ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
    }`}>
      {ok ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
      {children}
    </span>
  )
}

// ══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════
export default function BackupRestore() {
  const backupSettings = useStore((s) => s.backupSettings)
  const setBackupSettings = useStore((s) => s.setBackupSettings)
  const addBackupRecord = useStore((s) => s.addBackupRecord)
  const company = useStore((s) => s.company)

  const [restoreFile, setRestoreFile] = useState(null)
  const [restorePreview, setRestorePreview] = useState(null)
  const [feedback, setFeedback] = useState(null) // { type: 'success'|'error', msg }
  const [showHistory, setShowHistory] = useState(false)
  const [dirHandle, setDirHandle] = useState(null)
  const [currentSize, setCurrentSize] = useState('…')
  const fileInputRef = useRef(null)

  // Live size of the persisted data — re-read after each backup / restore / feedback change
  useEffect(() => {
    let cancelled = false
    getBackupPayload().then((p) => { if (!cancelled) setCurrentSize(getBackupSize(p)) }).catch(() => {})
    return () => { cancelled = true }
  }, [feedback, backupSettings.lastBackupAt])

  // ── Folder directory handle (persisted via IndexedDB for auto-backup) ──
  useEffect(() => {
    if (!hasFileSystemAccess) return
    // Try to restore saved handle from IndexedDB
    const dbReq = indexedDB.open('scp-backup-handles', 1)
    dbReq.onupgradeneeded = (e) => {
      e.target.result.createObjectStore('handles')
    }
    dbReq.onsuccess = (e) => {
      const db = e.target.result
      const tx = db.transaction('handles', 'readonly')
      const store = tx.objectStore('handles')
      const req = store.get('backupDir')
      req.onsuccess = () => {
        if (req.result) setDirHandle(req.result)
      }
    }
  }, [])

  const saveDirHandle = useCallback((handle) => {
    setDirHandle(handle)
    const dbReq = indexedDB.open('scp-backup-handles', 1)
    dbReq.onupgradeneeded = (e) => {
      e.target.result.createObjectStore('handles')
    }
    dbReq.onsuccess = (e) => {
      const db = e.target.result
      const tx = db.transaction('handles', 'readwrite')
      tx.objectStore('handles').put(handle, 'backupDir')
    }
  }, [])

  const clearDirHandle = useCallback(() => {
    setDirHandle(null)
    const dbReq = indexedDB.open('scp-backup-handles', 1)
    dbReq.onsuccess = (e) => {
      const db = e.target.result
      const tx = db.transaction('handles', 'readwrite')
      tx.objectStore('handles').delete('backupDir')
    }
    setBackupSettings({ locationLabel: '' })
  }, [setBackupSettings])

  // ── Choose backup folder ──────────────────────────────
  const chooseFolder = async () => {
    if (!hasFileSystemAccess) {
      setFeedback({ type: 'error', msg: 'Your browser does not support the File System Access API. Use Chrome or Edge for folder-based backups, or use the Download button below.' })
      return false
    }
    try {
      const handle = await window.showDirectoryPicker({ mode: 'readwrite' })
      saveDirHandle(handle)
      setBackupSettings({ locationLabel: handle.name })
      setFeedback({ type: 'success', msg: `Backup location set to: ${handle.name}` })
      return true
    } catch (err) {
      if (err.name !== 'AbortError') {
        setFeedback({ type: 'error', msg: 'Could not access that folder. Please try again.' })
      }
      return false
    }
  }

  // ── Write backup to chosen folder ─────────────────────
  const backupToFolder = useCallback(async (handle, isAuto = false) => {
    if (!handle) return false
    try {
      // Verify permission
      const perm = await handle.queryPermission({ mode: 'readwrite' })
      if (perm !== 'granted') {
        const req = await handle.requestPermission({ mode: 'readwrite' })
        if (req !== 'granted') return false
      }
      const payload = await getBackupPayload()
      const filename = makeFilename()
      const fileHandle = await handle.getFileHandle(filename, { create: true })
      const writable = await fileHandle.createWritable()
      await writable.write(payload)
      await writable.close()

      const record = { at: new Date().toISOString(), size: getBackupSize(payload), method: isAuto ? 'auto' : 'manual', location: handle.name, filename }
      addBackupRecord(record)
      if (!isAuto) setFeedback({ type: 'success', msg: `Backup saved to ${handle.name}/${filename}` })
      return true
    } catch (err) {
      if (!isAuto) setFeedback({ type: 'error', msg: `Backup failed: ${err.message}` })
      return false
    }
  }, [addBackupRecord])

  // ── Download backup (fallback) ────────────────────────
  const handleDownloadBackup = async () => {
    const payload = await getBackupPayload()
    const filename = makeFilename()
    downloadFile(payload, filename)
    const record = { at: new Date().toISOString(), size: getBackupSize(payload), method: 'download', location: 'Downloads', filename }
    addBackupRecord(record)
    setFeedback({ type: 'success', msg: `Backup downloaded as ${filename}` })
  }

  // ── Backup to folder now ──────────────────────────────
  const handleFolderBackup = () => {
    if (!dirHandle) {
      chooseFolder()
      return
    }
    backupToFolder(dirHandle, false)
  }

  // ── Restore from file ─────────────────────────────────
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setRestoreFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        const state = data.state || data
        setRestorePreview({
          raw: ev.target.result,
          quotes: state.quotes?.length || 0,
          clients: state.clients?.length || 0,
          purchaseOrders: state.purchaseOrders?.length || 0,
          company: state.company?.name || 'Unknown',
          size: getBackupSize(ev.target.result),
        })
      } catch {
        setFeedback({ type: 'error', msg: 'Invalid backup file. Must be a SalesCloserPro JSON export.' })
        setRestoreFile(null)
        setRestorePreview(null)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const confirmRestore = async () => {
    if (!restorePreview?.raw) return
    if (!window.confirm('This will REPLACE all current data with the backup. This action cannot be undone. Continue?')) return
    try {
      // Accept both the native persist envelope ({ state, version }) and a bare state object
      const parsed = JSON.parse(restorePreview.raw)
      const envelope = parsed && typeof parsed === 'object' && 'state' in parsed ? parsed : { state: parsed, version: 0 }
      await importRawState(JSON.stringify(envelope))
      setFeedback({ type: 'success', msg: 'Data restored successfully! Reloading app…' })
      setRestoreFile(null)
      setRestorePreview(null)
      setTimeout(() => window.location.reload(), 1500)
    } catch (err) {
      setFeedback({ type: 'error', msg: `Restore failed: ${err.message}` })
    }
  }

  const cancelRestore = () => {
    setRestoreFile(null)
    setRestorePreview(null)
  }

  // ── Auto-backup toggle ────────────────────────────────
  const toggleAutoBackup = () => {
    const next = !backupSettings.autoBackupEnabled
    if (next && !dirHandle && hasFileSystemAccess) {
      chooseFolder().then((ok) => { if (ok) setBackupSettings({ autoBackupEnabled: true }) })
    } else {
      setBackupSettings({ autoBackupEnabled: next })
    }
  }

  // ── Auto-backup interval runner (in Layout via global, but also here for UX) ──
  useEffect(() => {
    if (!backupSettings.autoBackupEnabled || !dirHandle) return
    const intervalMs = (backupSettings.intervalHours || 24) * 60 * 60 * 1000
    const checkAndBackup = async () => {
      const last = backupSettings.lastBackupAt ? new Date(backupSettings.lastBackupAt).getTime() : 0
      if (Date.now() - last >= intervalMs) {
        await backupToFolder(dirHandle, true)
      }
    }
    checkAndBackup() // check immediately
    const timer = setInterval(checkAndBackup, 60 * 1000) // check every minute
    return () => clearInterval(timer)
  }, [backupSettings.autoBackupEnabled, backupSettings.intervalHours, dirHandle, backupToFolder, backupSettings.lastBackupAt])

  // clear feedback after 6s
  useEffect(() => {
    if (!feedback) return
    const t = setTimeout(() => setFeedback(null), 6000)
    return () => clearTimeout(t)
  }, [feedback])

  const { backupHistory } = backupSettings
  const lastBackup = backupSettings.lastBackupAt
    ? formatDistanceToNow(new Date(backupSettings.lastBackupAt), { addSuffix: true })
    : 'Never'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <HardDrive className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Backup & Restore</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Protect your data — local drive, USB, or network</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <StatusBadge ok={!!backupSettings.lastBackupAt}>
            Last backup: {lastBackup}
          </StatusBadge>
          <span className="text-xs text-gray-400 dark:text-gray-500">Data size: {currentSize}</span>
        </div>
      </div>

      {/* Feedback toast */}
      {feedback && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
          feedback.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
        }`}>
          {feedback.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
          <span className="flex-1">{feedback.msg}</span>
          <button onClick={() => setFeedback(null)} className="opacity-60 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* ── AUTO-BACKUP CARD ─────────────────────────── */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-500" />
            Automatic Backup
          </h2>
          <button onClick={toggleAutoBackup} className="flex items-center gap-2 group">
            {backupSettings.autoBackupEnabled ? (
              <ToggleRight className="w-8 h-8 text-teal-500 group-hover:text-teal-600 transition-colors" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 transition-colors" />
            )}
            <span className={`text-xs font-bold ${backupSettings.autoBackupEnabled ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400 dark:text-gray-500'}`}>
              {backupSettings.autoBackupEnabled ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        {backupSettings.autoBackupEnabled && (
          <div className="space-y-3">
            {/* Interval selector */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Backup every:</label>
              <select
                value={backupSettings.intervalHours}
                onChange={(e) => setBackupSettings({ intervalHours: Number(e.target.value) })}
                className="input-field py-1.5 px-3 text-sm w-auto"
              >
                <option value={1}>1 hour</option>
                <option value={4}>4 hours</option>
                <option value={8}>8 hours</option>
                <option value={12}>12 hours</option>
                <option value={24}>24 hours</option>
                <option value={48}>48 hours</option>
                <option value={168}>Weekly</option>
              </select>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Backup to:</label>
              {dirHandle ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-semibold">
                    <FolderOpen className="w-3.5 h-3.5" />
                    {backupSettings.locationLabel || dirHandle.name}
                  </span>
                  <button onClick={chooseFolder} className="text-xs text-blue-500 hover:text-blue-600 font-medium">Change</button>
                  <button onClick={clearDirHandle} className="text-xs text-red-400 hover:text-red-500 font-medium">Remove</button>
                </div>
              ) : (
                <button onClick={chooseFolder} className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5" /> Choose Folder
                </button>
              )}
            </div>

            {!dirHandle && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-300">
                <strong>Choose a folder</strong> to enable auto-backup. Pick any location — local drive, USB drive, or network share.
              </div>
            )}
          </div>
        )}

        {!backupSettings.autoBackupEnabled && (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Enable auto-backup to automatically save your data at regular intervals to a local drive, USB stick, or network share.
          </p>
        )}
      </div>

      {/* ── MANUAL BACKUP CARDS ──────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Save to Folder */}
        <button onClick={handleFolderBackup}
          className="card p-5 text-left hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-md transition-all group">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <FolderOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Save to Folder</h3>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">
            {hasFileSystemAccess
              ? 'Pick any folder — local drive, USB, or mapped network share'
              : 'Requires Chrome or Edge browser'}
          </p>
          <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-teal-600 dark:text-teal-400">
            <HardDrive className="w-3.5 h-3.5" /> Local · USB · Network
          </div>
        </button>

        {/* Download as File */}
        <button onClick={handleDownloadBackup}
          className="card p-5 text-left hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all group">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Download Backup</h3>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">
            Download a .json file to your Downloads folder — works in all browsers
          </p>
          <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <FileJson className="w-3.5 h-3.5" /> Universal · Any browser
          </div>
        </button>

        {/* Restore */}
        <button onClick={() => fileInputRef.current?.click()}
          className="card p-5 text-left hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-md transition-all group">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Restore from Backup</h3>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">
            Load a previously saved .json backup file to restore all your data
          </p>
          <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <RefreshCw className="w-3.5 h-3.5" /> Full data restore
          </div>
        </button>
      </div>

      <input ref={fileInputRef} type="file" accept=".json,application/json" className="hidden" onChange={handleFileSelect} />

      {/* ── RESTORE PREVIEW ──────────────────────────── */}
      {restorePreview && (
        <div className="card p-5 space-y-4 border-2 border-amber-300 dark:border-amber-600">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Backup Preview — {restoreFile?.name}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Quotes', value: restorePreview.quotes },
              { label: 'Clients', value: restorePreview.clients },
              { label: 'Purchase Orders', value: restorePreview.purchaseOrders },
              { label: 'File Size', value: restorePreview.size },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{item.value}</div>
                <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{item.label}</div>
              </div>
            ))}
          </div>
          {restorePreview.company && (
            <p className="text-xs text-gray-500 dark:text-gray-400">Company: <strong>{restorePreview.company}</strong></p>
          )}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-xs text-red-700 dark:text-red-300">
            <strong>Warning:</strong> Restoring will replace ALL current data. This cannot be undone. Consider downloading a backup of your current data first.
          </div>
          <div className="flex gap-3">
            <button onClick={confirmRestore} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-colors">
              <Upload className="w-4 h-4" /> Restore This Backup
            </button>
            <button onClick={cancelRestore} className="btn-secondary py-2.5 px-5 text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* ── BACKUP LOCATION GUIDE ────────────────────── */}
      <div className="card p-5 space-y-3">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-2">
          <Info className="w-4 h-4 text-teal-500" />
          Where Can I Back Up?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              icon: HardDrive, label: 'Local Drive', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20',
              desc: 'Any folder on your computer — Desktop, Documents, or a dedicated backup directory.'
            },
            {
              icon: Usb, label: 'USB / External Drive', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20',
              desc: 'Plug in a USB stick or external hard drive and choose it from the folder picker.'
            },
            {
              icon: Wifi, label: 'Network Share', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20',
              desc: 'Map a network drive or pick a shared folder on another computer (SMB, NFS, etc).'
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className={`${item.bg} rounded-xl p-4 space-y-2`}>
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.label}</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
        {!hasFileSystemAccess && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-300">
            <strong>Note:</strong> Your browser doesn't support the File System Access API. For folder-based and USB/network backups, use <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>. The Download/Upload method works in all browsers.
          </div>
        )}
      </div>

      {/* ── BACKUP HISTORY ───────────────────────────── */}
      <div className="card overflow-hidden">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-2">
            <History className="w-4 h-4 text-teal-500" />
            Backup History
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {backupHistory.length}
            </span>
          </h3>
          {showHistory ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
        </button>

        {showHistory && (
          <div className="border-t border-gray-100 dark:border-gray-700">
            {backupHistory.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 dark:text-gray-500">
                <History className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No backups yet</p>
                <p className="text-xs">Create your first backup above</p>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                    <tr>
                      <th className="text-left px-5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wide">Date</th>
                      <th className="text-left px-5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wide">Method</th>
                      <th className="text-left px-5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wide">Location</th>
                      <th className="text-right px-5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wide">Size</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                    {backupHistory.map((rec, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                        <td className="px-5 py-2.5 text-xs text-gray-700 dark:text-gray-300">
                          {format(new Date(rec.at), 'MMM d, yyyy h:mm a')}
                        </td>
                        <td className="px-5 py-2.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rec.method === 'auto' ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400'
                            : rec.method === 'download' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                          }`}>
                            {rec.method === 'auto' ? <Clock className="w-2.5 h-2.5" /> : rec.method === 'download' ? <Download className="w-2.5 h-2.5" /> : <FolderOpen className="w-2.5 h-2.5" />}
                            {rec.method === 'auto' ? 'Auto' : rec.method === 'download' ? 'Download' : 'Manual'}
                          </span>
                        </td>
                        <td className="px-5 py-2.5 text-xs text-gray-500 dark:text-gray-400">{rec.location || '—'}</td>
                        <td className="px-5 py-2.5 text-xs text-gray-500 dark:text-gray-400 text-right">{rec.size}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── WHAT'S BACKED UP ─────────────────────────── */}
      <div className="card p-5 space-y-3">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-2">
          <Shield className="w-4 h-4 text-teal-500" />
          What's Included in a Backup?
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: 'Quotes & Line Items', icon: '📋' },
            { label: 'Client Database', icon: '👥' },
            { label: 'Sales Pipeline', icon: '📊' },
            { label: 'Purchase Orders', icon: '🛒' },
            { label: 'Company Settings', icon: '🏢' },
            { label: 'Logo & Branding', icon: '🎨' },
            { label: 'Theme Preference', icon: '🌓' },
            { label: 'Backup Settings', icon: '💾' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 text-xs">
              <span>{item.icon}</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed">
          All data is exported as a single JSON file. File attachments (images in quotes) are included as base64 data.
          Backups are complete snapshots — restoring one fully replaces all current data.
        </p>
      </div>
    </div>
  )
}
