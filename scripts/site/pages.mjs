/**
 * salescloserpro.ai - what each finished page carries: the <head> block, the markdown copy for
 * AI assistants, and the sitemap. Used by build.mjs.
 */
import TurndownService from 'turndown'
import { SITE_URL } from './site.mjs'

const REPO_URL = 'https://github.com/harborglowvintage-oss/salescloserpro.ai'
const PUBLISHER = { '@type': 'Organization', name: 'LLMadvisor ai LLC', url: 'https://llmadvisor.ai' }
const SOCIAL_IMAGE = {
  url: `${SITE_URL}/og-cover-v3.png`,
  width: 1200,
  height: 630,
  alt: 'salescloserpro.ai — free CRM, quoting, POs, and pipeline tool',
}

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
const escapeHtml = (text) => String(text).replace(/[&<>"']/g, (c) => ENTITIES[c])
const meta = (attr, key, content) => `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`

/**
 * The page-specific part of <head>. Indexable pages get a canonical address, the markdown
 * alternate, social cards and (home only) structured data; the app shell and the 404 page
 * get only a title, a description and noindex.
 */
export function pageHead({ title, description, url, markdown, indexable, structuredData }) {
  const tags = [`<title>${escapeHtml(title)}</title>`, meta('name', 'description', description)]
  if (!indexable) return [...tags, meta('name', 'robots', 'noindex')]
  tags.push(
    meta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'),
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="en-us" href="${url}" />`,
    `<link rel="alternate" hreflang="x-default" href="${url}" />`,
    `<link rel="alternate" type="text/markdown" href="${markdown}" />`,
    meta('property', 'og:type', 'website'),
    meta('property', 'og:url', url),
    meta('property', 'og:site_name', 'salescloserpro.ai'),
    meta('property', 'og:locale', 'en_US'),
    meta('property', 'og:title', title),
    meta('property', 'og:description', description),
    meta('property', 'og:image', SOCIAL_IMAGE.url),
    meta('property', 'og:image:type', 'image/png'),
    meta('property', 'og:image:width', SOCIAL_IMAGE.width),
    meta('property', 'og:image:height', SOCIAL_IMAGE.height),
    meta('property', 'og:image:alt', SOCIAL_IMAGE.alt),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:site', '@llmadvisor'),
    meta('name', 'twitter:title', title),
    meta('name', 'twitter:description', description),
    meta('name', 'twitter:image', SOCIAL_IMAGE.url),
    meta('name', 'twitter:image:alt', SOCIAL_IMAGE.alt),
  )
  if (structuredData) {
    // JSON inside <script>: "<" is escaped so no value can close the tag early.
    const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': structuredData }, null, 2).replace(/</g, '\\u003c')
    tags.push(`<script type="application/ld+json">\n${json}\n</script>`)
  }
  return tags
}

/** schema.org description of the product, for the home page. */
export function homeStructuredData({ version, description }) {
  return [
    {
      '@type': 'SoftwareApplication',
      name: 'salescloserpro.ai',
      url: `${SITE_URL}/`,
      description,
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: 'CRM Software',
      operatingSystem: 'Web Browser',
      softwareVersion: version,
      releaseNotes: `${REPO_URL}/blob/main/CHANGELOG.md`,
      featureList: 'Quote Builder, Good / Better / Best Options, Online Proposal Acceptance, Follow-up Reminders, Contacts, Sales Pipeline, Purchase Orders, Margin Analytics, PDF Export, HubSpot / Salesforce / CSV Export, 50-State Tax Database, Backup & Restore, Dark Mode',
      screenshot: SOCIAL_IMAGE.url,
      image: SOCIAL_IMAGE.url,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free forever. Open source under Apache 2.0.' },
      author: PUBLISHER,
      publisher: PUBLISHER,
      license: 'https://www.apache.org/licenses/LICENSE-2.0',
      isAccessibleForFree: true,
      inLanguage: 'en-US',
    },
    { '@type': 'WebSite', name: 'salescloserpro.ai', url: `${SITE_URL}/`, inLanguage: 'en-US', publisher: PUBLISHER },
    {
      '@type': 'Organization',
      name: 'salescloserpro.ai',
      url: `${SITE_URL}/`,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.png`, width: 512, height: 512 },
    },
  ]
}

// Page furniture an assistant does not need: navigation, the footer, icons, pictures and
// anything marked aria-hidden (decorative mock-ups).
const DROPPED = new Set(['header', 'nav', 'footer', 'script', 'style', 'svg', 'img', 'picture'])
const insideHeading = (node) => {
  for (let n = node.parentNode; n; n = n.parentNode) if (/^H[1-6]$/.test(n.nodeName)) return true
  return false
}

/** An HTML-to-markdown converter that writes links as absolute addresses from `pageUrl`. */
function markdownConverter(pageUrl) {
  // Rules added later are tried first, and all of them before turndown's own.
  return new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced', emDelimiter: '_' })
    .addRule('collapsible', { filter: 'details', replacement: (content) => `\n\n${content}\n\n` })
    .addRule('collapsibleTitle', { filter: 'summary', replacement: (content) => `\n\n## ${content.trim()}\n\n` })
    .addRule('headingBreak', { filter: (node) => node.nodeName === 'BR' && insideHeading(node), replacement: () => ' ' })
    .addRule('listItem', {
      // "- item" and "1. item" (turndown pads markers to four columns), continuation lines
      // indented to match, and no trailing spaces on blank lines.
      filter: 'li',
      replacement: (content, node) => {
        const list = node.parentNode
        const marker = list.nodeName === 'OL' ? `${Number(list.getAttribute('start') ?? 1) + Array.prototype.indexOf.call(list.children, node)}. ` : '- '
        const body = content.replace(/^\n+/, '').replace(/\n+$/, '\n').replace(/\n(?=.)/g, `\n${' '.repeat(marker.length)}`)
        return marker + body + (node.nextSibling && !body.endsWith('\n') ? '\n' : '')
      },
    })
    .addRule('absoluteLink', {
      filter: (node) => node.nodeName === 'A' && node.getAttribute('href'),
      replacement: (content, node) => {
        const text = content.trim()
        if (!text) return ''
        // Buttons sit side by side with no space between them in the markup.
        const next = node.nextSibling
        const gap = next?.nodeName === 'A' && !/^\s/.test(next.textContent) ? ' ' : ''
        return `[${text}](${new URL(node.getAttribute('href'), pageUrl).href})${gap}`
      },
    })
    .addRule('dropped', {
      filter: (node) => DROPPED.has(node.nodeName.toLowerCase()) || node.getAttribute('aria-hidden') === 'true',
      replacement: () => '',
    })
}

/** The markdown copy of a rendered page, with a short front matter describing it. */
export function toMarkdown(html, { url, title, description, contentSignal }) {
  const body = markdownConverter(url).turndown(html).replace(/\n{3,}/g, '\n\n').trim()
  const frontMatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `url: ${url}`,
    'publisher: LLMadvisor ai LLC',
    `content-signal: ${contentSignal}`,
    `source-code: ${REPO_URL}`,
    '---',
  ]
  return `${frontMatter.join('\n')}\n\n${body}\n`
}

/** sitemap.xml for the indexable pages. */
export function sitemapXml(urls) {
  const entries = urls.map((url) => `  <url><loc>${escapeHtml(url)}</loc></url>`)
  return ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...entries, '</urlset>', ''].join('\n')
}
