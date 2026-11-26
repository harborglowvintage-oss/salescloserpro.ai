/**
 * salescloserpro.ai - Build-time renderer
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 *
 * Used only by scripts/site/build.mjs (never shipped to the browser): draws each public page
 * to HTML so visitors, search engines and AI assistants get the full page without running
 * any JavaScript. The browser then attaches to that markup (main.jsx).
 */

import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'

export { PUBLIC_PAGES, NOT_FOUND_PAGE, APP_TITLE } from './publicPages'

/** HTML for one page component, drawn as if the browser were at `location`. */
export function render(Component, location) {
  return renderToString(
    <StaticRouter location={location}>
      <Component />
    </StaticRouter>
  )
}
