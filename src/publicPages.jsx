/**
 * salescloserpro.ai - Public pages
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 *
 * The pages that search engines and AI assistants read. This one list feeds the router
 * (App.jsx), the browser tab title, and the build step (scripts/site/build.mjs), which turns
 * each page into finished HTML with its own title, description and canonical address, plus a
 * markdown copy. To add a page: add it here, then give it a rule in public/_headers (with a
 * markdown Link) and a line in public/llms.txt; the build names anything that is missing.
 */

import { useEffect } from 'react'
import LandingPage from './components/landing/LandingPage'
import AboutPage from './components/landing/AboutPage'
import ServicesPage from './components/landing/ServicesPage'
import LegalPage from './components/landing/LegalPage'
import NotFoundPage from './components/landing/NotFoundPage'

/** Tab title for the app itself (dashboard, quotes, settings…), which search engines skip. */
export const APP_TITLE = 'salescloserpro.ai'

export const PUBLIC_PAGES = [
  {
    path: '/',
    Component: LandingPage,
    title: 'salescloserpro.ai | The Free CRM. Designed for simplicity.',
    description: 'Build professional quotes, track deals, issue POs, and export polished PDFs — 100% free and open source. No login required. Built for freelancers, contractors, and small businesses.',
  },
  {
    path: '/about',
    Component: AboutPage,
    title: 'About & User Guide | salescloserpro.ai',
    description: 'How to use salescloserpro.ai, the free CRM that runs in your browser: set up your company, build quotes, manage contacts, track deals, create purchase orders, export PDFs and back up your data.',
  },
  {
    path: '/services',
    Component: ServicesPage,
    title: 'Custom & Enterprise Services | salescloserpro.ai',
    description: 'Custom builds, white-label setups, onboarding and ongoing support for businesses that need more than the free, open-source salescloserpro.ai — from LLMadvisor ai LLC.',
  },
  {
    path: '/legal',
    Component: LegalPage,
    title: 'Legal & Compliance | salescloserpro.ai',
    description: 'Terms of use, privacy policy, AI disclosure and open-source license for salescloserpro.ai. Your quotes and contacts stay in your browser; nothing is collected.',
  },
]

/** Served with a 404 status for any address the site does not have (dist/404.html). */
export const NOT_FOUND_PAGE = {
  Component: NotFoundPage,
  title: 'Page not found | salescloserpro.ai',
  description: 'This address is not part of salescloserpro.ai.',
}

/** A page as the router shows it: the component, with the matching tab title. */
export function PublicPage({ page }) {
  useEffect(() => {
    document.title = page.title
    return () => { document.title = APP_TITLE }
  }, [page.title])
  return <page.Component />
}
