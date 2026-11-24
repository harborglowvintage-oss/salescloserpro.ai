/**
 * SalesCloserPro - serverless proposal links + acceptance records
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 *
 * How it works (no backend, no accounts):
 *   1. The seller's app packs a snapshot of the quote into the URL *fragment*:
 *        https://salescloserpro.ai/p#z<deflate+base64url>
 *      Browsers never send the fragment to the server, so the proposal is not uploaded
 *      or logged anywhere — it lives only in the link the seller sends.
 *   2. The client opens the link, picks an option, types their name and accepts. That
 *      produces an acceptance link (/accept#…) which the client emails back.
 *   3. The seller opens it in their own browser (where their data lives); the app checks
 *      the version fingerprint against the current quote and records the acceptance.
 *
 * The fingerprint (SHA-256 of the quote snapshot) proves WHICH version was accepted.
 * It is not a signature — the client's reply email is the record of WHO accepted.
 */

import { getOptions, hasTiers, chosenOptionId, modelOf } from './quoteMath'

const SNAPSHOT_VERSION = 1

// ── bytes ⇄ base64url ──
const toB64Url = (bytes) => {
  let bin = ''
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
const fromB64Url = (str) => {
  const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from(bin, (c) => c.charCodeAt(0))
}
const streamThrough = async (bytes, transform) =>
  new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(transform)).arrayBuffer())

/** JSON → compact URL-safe string ('z' = deflated, 'j' = plain fallback for old browsers). */
export async function encodePacket(obj) {
  const bytes = new TextEncoder().encode(JSON.stringify(obj))
  if (typeof CompressionStream === 'function') return 'z' + toB64Url(await streamThrough(bytes, new CompressionStream('deflate-raw')))
  return 'j' + toB64Url(bytes)
}

/** Inverse of encodePacket. Throws on a damaged or truncated link. */
export async function decodePacket(str) {
  const kind = str?.[0]
  const bytes = fromB64Url(str.slice(1))
  if (kind === 'z') return JSON.parse(new TextDecoder().decode(await streamThrough(bytes, new DecompressionStream('deflate-raw'))))
  if (kind === 'j') return JSON.parse(new TextDecoder().decode(bytes))
  throw new Error('Unrecognised link format')
}

const compact = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ''))

/** What the client is shown — only what's needed to render, price and accept the proposal. */
export function proposalSnapshot(quote, company) {
  return {
    v: SNAPSHOT_VERSION,
    co: compact({ n: company.name, e: company.email, p: company.phone, a: company.address, w: company.website }),
    q: compact({
      id: quote.id,
      no: quote.quoteNumber,
      c: quote.clientName,
      d: quote.createdAt,
      vu: quote.validUntil,
      st: quote.state,
      nt: quote.notes,
      rec: hasTiers(quote) ? chosenOptionId({ ...quote, acceptance: null }) : undefined,
      o: getOptions(quote).map((o) => ({ i: o.id, n: o.name, l: o.lines.map((l) => [l.type, l.description, l.qty, l.unit, l.price, ...(modelOf(l) ? [modelOf(l)] : [])]) })),
    }),
  }
}

/** Snapshot → a quote object the shared pricing / PDF code understands. */
export function snapshotToQuote({ q }) {
  const options = q.o.map((o) => ({
    id: o.i,
    name: o.n || '',
    lines: o.l.map(([type, description, qty, unit, price, model = ''], k) => ({ id: `${o.i}-${k}`, type, description, model, qty, unit, price })),
  }))
  const tiered = options.length > 1
  return {
    id: q.id, quoteNumber: q.no, clientName: q.c, createdAt: q.d, validUntil: q.vu, state: q.st, notes: q.nt, status: 'sent',
    ...(tiered ? { options, recommendedOptionId: q.rec } : { lines: options[0].lines }),
  }
}

export const snapshotToCompany = ({ co }) => ({ name: co.n, email: co.e, phone: co.p, address: co.a, website: co.w, logo: '' })

/** Version fingerprint of the quote part of a snapshot, e.g. "3F9A-1C22-7B0E". */
export async function fingerprint(snapshot) {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(snapshot.q))))
  const hex = Array.from(digest.slice(0, 6), (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase()
  return hex.match(/.{4}/g).join('-')
}

export async function buildProposalUrl(quote, company, origin = window.location.origin) {
  return `${origin}/p#${await encodePacket(proposalSnapshot(quote, company))}`
}

/** Created on the client's device when they accept. */
export async function buildAcceptanceUrl(snapshot, { name, optionId }, origin = window.location.origin) {
  const record = compact({
    v: SNAPSHOT_VERSION,
    qid: snapshot.q.id,
    no: snapshot.q.no,
    opt: snapshot.q.o.length > 1 ? optionId : undefined,
    name: name.trim(),
    at: new Date().toISOString(),
    fp: await fingerprint(snapshot),
  })
  return { url: `${origin}/accept#${await encodePacket(record)}`, record }
}

/** Payload of the current page's fragment (without '#'), or null. */
export const currentFragment = () => decodeURIComponent(window.location.hash.slice(1)) || null
