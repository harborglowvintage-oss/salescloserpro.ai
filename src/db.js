import Dexie from 'dexie'

// ── IndexedDB via Dexie ─────────────────────────────────
const db = new Dexie('salescloserpro')

db.version(1).stores({
  // Single-row key-value store for Zustand state
  keyval: 'key',
})

// ── Zustand-compatible storage adapter ──────────────────
// Drop-in replacement for localStorage in zustand/persist
export const indexedDBStorage = {
  getItem: async (name) => {
    const row = await db.keyval.get(name)
    return row?.value ?? null
  },
  setItem: async (name, value) => {
    await db.keyval.put({ key: name, value })
  },
  removeItem: async (name) => {
    await db.keyval.delete(name)
  },
}

// ── One-time migration from localStorage → IndexedDB ────
export async function migrateFromLocalStorage(storeName) {
  const existing = await db.keyval.get(storeName)
  if (existing) return false // already migrated

  const raw = localStorage.getItem(storeName)
  if (!raw) return false // nothing to migrate

  await db.keyval.put({ key: storeName, value: raw })
  localStorage.removeItem(storeName)
  console.log(`[SalesCloserPro] Migrated "${storeName}" from localStorage → IndexedDB`)
  return true
}

export default db
