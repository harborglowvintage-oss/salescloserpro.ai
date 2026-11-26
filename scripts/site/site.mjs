/**
 * salescloserpro.ai - site build settings shared by the scripts in this folder.
 */
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

/** The one public address. Canonical links, the sitemap and the markdown copies use it. */
export const SITE_URL = 'https://salescloserpro.ai'

export const ROOT = fileURLToPath(new URL('../../', import.meta.url))
export const PUBLIC_DIR = join(ROOT, 'public')
export const DIST_DIR = join(ROOT, 'dist')
export const MIDDLEWARE_FILE = join(ROOT, 'functions/_middleware.js')
