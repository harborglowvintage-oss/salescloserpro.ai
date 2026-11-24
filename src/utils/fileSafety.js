/**
 * SalesCloserPro - upload safety: the single gate every user-supplied file passes through
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 *
 * Threats handled
 *   • Disguised files — type is decided by the file's first bytes, never by its name or the
 *     browser-reported MIME type, and the extension must agree.
 *   • Hostile images — never stored as uploaded: pixels are redrawn onto a canvas and
 *     re-encoded, which discards metadata, appended payloads and polyglot tricks. SVG (which
 *     can carry scripts) is not accepted. Pixel count is capped before decoding so a
 *     "decompression bomb" cannot exhaust memory.
 *   • Hostile PDFs — must start with a real PDF header and are rejected if they contain
 *     active content (JavaScript, launch commands, embedded files, actions that send data
 *     or open other documents, scripted forms) or are encrypted (cannot be inspected). Compressed object streams
 *     are inflated and scanned too.
 *   • Poisoned backups / tampered storage — sanitizeState() drops any logo or attachment
 *     that is not one of our own data: URLs (e.g. a remote tracking image or a script URL).
 *   • Deceptive file names — control and direction-override characters removed, length capped.
 *
 * This is a strict allow-list screen, not antivirus: it rejects what it cannot vouch for.
 */

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024
export const MAX_IMAGE_PIXELS = 40_000_000 // 40 MP decoded ≈ 160 MB RGBA — above any phone photo
export const MAX_BACKUP_BYTES = 60 * 1024 * 1024

const IMAGE_TYPES = {
  'image/png': ['png'],
  'image/jpeg': ['jpg', 'jpeg', 'jfif'],
  'image/gif': ['gif'],
  'image/webp': ['webp'],
}
const PDF_TYPE = 'application/pdf'

const ascii = (bytes, start, len) => String.fromCharCode(...bytes.subarray(start, start + len))
const startsWith = (bytes, sig, at = 0) => sig.every((b, i) => bytes[at + i] === b)

/** Real type from magic bytes, or null. */
export function sniffType(bytes) {
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'image/png'
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return 'image/jpeg'
  if (ascii(bytes, 0, 6) === 'GIF87a' || ascii(bytes, 0, 6) === 'GIF89a') return 'image/gif'
  if (ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 4) === 'WEBP') return 'image/webp'
  if (ascii(bytes, 0, 5) === '%PDF-') return PDF_TYPE
  return null
}

/** Pixel dimensions read from the header (no decoding). null if they cannot be found. */
export function imageDimensions(bytes, type) {
  const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  try {
    if (type === 'image/png') return { width: v.getUint32(16), height: v.getUint32(20) }
    if (type === 'image/gif') return { width: v.getUint16(6, true), height: v.getUint16(8, true) }
    if (type === 'image/webp') {
      const chunk = ascii(bytes, 12, 4)
      if (chunk === 'VP8X') return { width: 1 + (v.getUint32(24, true) & 0xffffff), height: 1 + (v.getUint32(27, true) & 0xffffff) }
      if (chunk === 'VP8 ') return { width: v.getUint16(26, true) & 0x3fff, height: v.getUint16(28, true) & 0x3fff }
      if (chunk === 'VP8L') { const b = v.getUint32(21, true); return { width: 1 + (b & 0x3fff), height: 1 + ((b >> 14) & 0x3fff) } }
    }
    if (type === 'image/jpeg') {
      let i = 2
      while (i + 9 < bytes.length) {
        if (bytes[i] !== 0xff) { i++; continue }
        const marker = bytes[i + 1]
        // SOF0–SOF15 except DHT (C4), JPG (C8), DAC (CC)
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) return { height: v.getUint16(i + 5), width: v.getUint16(i + 7) }
        if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01 || marker === 0xff) { i += marker === 0xff ? 1 : 2; continue }
        i += 2 + v.getUint16(i + 2)
      }
    }
  } catch { /* truncated header */ }
  return null
}

// ── PDF screening ───────────────────────────────────────────────
// PDF names can hide behind #xx hex escapes (/J#61vaScript); decode before matching.
const decodeNames = (text) => text.replace(/#([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
// Rules match only names of 4+ characters: a 2 MB PDF is mostly compressed binary, and a
// short pattern such as "/JS" would turn up by chance in roughly one file in eight. Nothing is
// lost — a script action must also declare /S /JavaScript, and an auto-run action
// (/OpenAction, /AA) is only dangerous when its type is one of the ones listed here;
// /OpenAction alone is how ordinary PDFs set their opening zoom.
const PDF_RISKS = [
  [/\/JavaScript(?![A-Za-z])/, 'it contains JavaScript'],
  [/\/Launch(?![A-Za-z])/, 'it can launch other programs'],
  [/\/EmbeddedFiles?(?![A-Za-z])/, 'it has other files embedded inside it'],
  [/\/(SubmitForm|ImportData|GoToR|GoToE)(?![A-Za-z])/, 'it can send data or open other documents'],
  [/\/(RichMedia|XFA)(?![A-Za-z])/, 'it contains interactive media or scripted forms'],
  [/\/Encrypt(?![A-Za-z])/, 'it is password-protected, so it cannot be checked'],
]
const latin1 = (bytes) => { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000)); return s }
const riskIn = (text) => { const t = decodeNames(text); return PDF_RISKS.find(([re]) => re.test(t))?.[1] || null }

async function inflate(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

/** null if the PDF looks passive, else a plain-language reason it was refused. */
export async function pdfRisk(bytes) {
  const text = latin1(bytes)
  if (!/%%EOF\s*$/.test(text.slice(-1024))) return 'it is incomplete or has extra data after the end of the document'
  const direct = riskIn(text)
  if (direct) return direct
  // Object streams keep dictionaries compressed, out of sight of the scan above — inflate them.
  const objStm = /\/Type\s*\/ObjStm[\s\S]{0,400}?stream\r?\n/g
  for (let m; (m = objStm.exec(text));) {
    const start = m.index + m[0].length
    const marker = text.indexOf('endstream', start)
    if (marker < 0) return 'it is malformed'
    // the data ends where /Length says; without a usable /Length, at the line break before "endstream"
    const declared = Number(/\/Length\s+(\d+)(?!\s+\d+\s+R)/.exec(m[0])?.[1])
    const end = declared > 0 && start + declared <= marker ? start + declared : marker - (text[marker - 2] === '\r' ? 2 : text[marker - 1] === '\n' || text[marker - 1] === '\r' ? 1 : 0)
    if (!m[0].includes('FlateDecode')) continue // stored uncompressed → already scanned above
    if (typeof DecompressionStream !== 'function') return 'this browser cannot inspect compressed PDFs'
    try {
      const hidden = riskIn(latin1(await inflate(bytes.subarray(start, end))))
      if (hidden) return hidden
    } catch { return 'part of it could not be inspected' }
  }
  return null
}

// ── names ───────────────────────────────────────────────────────
/** Display-safe file name: no control or direction-override characters, no path, ≤ 80 chars. */
export function cleanFileName(name = '') {
  const flat = String(name).normalize('NFC')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f-\u009f​-‏‪-‮⁦-⁩﻿]/g, '')
    .replace(/[\\/:*?"<>|]/g, '_')
    .trim()
  if (flat.length <= 80) return flat || 'file'
  const dot = flat.lastIndexOf('.')
  const ext = dot > 0 && flat.length - dot <= 6 ? flat.slice(dot) : ''
  return flat.slice(0, 80 - ext.length) + ext
}
const extensionOf = (name) => (/\.([A-Za-z0-9]{1,5})$/.exec(name || '')?.[1] || '').toLowerCase()

// ── the gate ────────────────────────────────────────────────────
/**
 * Decide whether a File may be used. Resolves { ok: true, type, bytes } or { ok: false, reason }.
 * `reason` is written for end users.
 */
export async function inspectFile(file, { allowPdf = false } = {}) {
  const what = allowPdf ? 'JPG, PNG, GIF, WebP or PDF' : 'JPG, PNG, GIF or WebP'
  if (!file || !file.size) return { ok: false, reason: 'the file is empty' }
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, reason: `it is larger than ${MAX_UPLOAD_BYTES / 1024 / 1024} MB` }
  const bytes = new Uint8Array(await file.arrayBuffer())
  const type = sniffType(bytes)
  if (!type || (type === PDF_TYPE && !allowPdf)) return { ok: false, reason: `it is not a real ${what} file` }
  const allowedExts = type === PDF_TYPE ? ['pdf'] : IMAGE_TYPES[type]
  if (!allowedExts.includes(extensionOf(file.name))) return { ok: false, reason: `its name does not match its contents (it is really a ${allowedExts[0].toUpperCase()} file)` }

  if (type === PDF_TYPE) {
    const risk = await pdfRisk(bytes)
    return risk ? { ok: false, reason: risk } : { ok: true, type, bytes }
  }
  const dims = imageDimensions(bytes, type)
  if (!dims || !dims.width || !dims.height) return { ok: false, reason: 'the image is damaged' }
  if (dims.width * dims.height > MAX_IMAGE_PIXELS) return { ok: false, reason: 'the image is too large (over 40 megapixels)' }
  return { ok: true, type, bytes }
}

/**
 * Redraw an inspected image onto a canvas and re-encode it. The result contains only
 * pixels — nothing else from the original file survives. PNG stays PNG; everything else
 * becomes JPEG unless `forcePng`.
 */
export function reencodeImage({ bytes, type }, { maxDim, forcePng = false, quality = 0.85 }) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(new Blob([bytes], { type }))
    const img = new window.Image()
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('the image is damaged')) }
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxDim / img.width, maxDim / img.height)
      const width = Math.max(1, Math.round(img.width * scale))
      const height = Math.max(1, Math.round(img.height * scale))
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      const outType = forcePng || type === 'image/png' ? 'image/png' : 'image/jpeg'
      resolve({ dataUrl: canvas.toDataURL(outType, quality), type: outType, width, height })
    }
    img.src = url
  })
}

/** Image file → safe, resized PNG data URL for a logo. Throws Error(reason) if refused. */
export async function safeLogo(file, maxDim = 256) {
  const checked = await inspectFile(file)
  if (!checked.ok) throw new Error(checked.reason)
  return (await reencodeImage(checked, { maxDim, forcePng: true })).dataUrl
}

const bytesToDataUrl = (bytes, type) => `data:${type};base64,${btoa(latin1(bytes))}`

/** File → attachment record ({ dataUrl, name, type, size, … }). Throws Error(reason) if refused. */
export async function safeAttachment(file) {
  const checked = await inspectFile(file, { allowPdf: true })
  if (!checked.ok) throw new Error(checked.reason)
  const name = cleanFileName(file.name)
  if (checked.type === PDF_TYPE) return { dataUrl: bytesToDataUrl(checked.bytes, PDF_TYPE), name, type: PDF_TYPE, size: checked.bytes.length }
  const out = await reencodeImage(checked, { maxDim: 1200 })
  return { ...out, name, size: Math.round((out.dataUrl.length * 3) / 4) }
}

// ── stored data (backups, IndexedDB) ────────────────────────────
const SAFE_IMAGE_URL = /^data:image\/(png|jpeg|gif|webp);base64,[A-Za-z0-9+/]+=*$/
const SAFE_PDF_URL = /^data:application\/pdf;base64,[A-Za-z0-9+/]+=*$/

export const isSafeImageUrl = (url) => typeof url === 'string' && SAFE_IMAGE_URL.test(url)

function cleanAttachment(a) {
  if (!a || typeof a !== 'object') return null
  const image = isSafeImageUrl(a.dataUrl)
  const pdf = typeof a.dataUrl === 'string' && SAFE_PDF_URL.test(a.dataUrl)
  if (!image && !pdf) return null
  return { ...a, name: cleanFileName(a.name), type: image ? a.dataUrl.slice(5, a.dataUrl.indexOf(';')) : PDF_TYPE }
}

/**
 * Make persisted state safe to render: every logo / attachment must be one of our own
 * data: URLs. Anything else (http:, javascript:, SVG, HTML…) is dropped. Returns the same
 * object when nothing needed changing.
 */
export function sanitizeState(state) {
  if (!state || typeof state !== 'object') return state
  let changed = false
  let { company, quotes } = state
  if (company?.logo && !isSafeImageUrl(company.logo)) { company = { ...company, logo: '' }; changed = true }
  if (Array.isArray(quotes)) {
    quotes = quotes.map((q) => {
      if (!Array.isArray(q?.attachments) || !q.attachments.length) return q
      const kept = q.attachments.map(cleanAttachment).filter(Boolean)
      const same = kept.length === q.attachments.length && kept.every((k, i) => k.name === q.attachments[i].name && k.type === q.attachments[i].type)
      if (same) return q
      changed = true
      return { ...q, attachments: kept }
    })
  }
  return changed ? { ...state, company, quotes } : state
}
