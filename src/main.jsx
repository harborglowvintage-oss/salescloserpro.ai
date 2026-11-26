/**
 * salescloserpro.ai - Main Entry Point
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 * https://github.com/harborglowvintage-oss/salescloserpro.ai
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { migrateFromLocalStorage } from './db'

const container = document.getElementById('root')
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Migrate legacy localStorage data to IndexedDB before rendering
// .catch() ensures the app always renders even if IndexedDB is blocked
migrateFromLocalStorage('salescloserpro-data')
  .catch(() => {})
  .then(() => {
    // A public page arrives already drawn by the build (scripts/site/build.mjs), marked with the
    // address it was drawn for: React attaches to that markup instead of drawing it again.
    // Anything else (the app shell, the 404 page, the dev server) starts from an empty draw.
    if (container.dataset.route === window.location.pathname) {
      ReactDOM.hydrateRoot(container, app)
    } else {
      ReactDOM.createRoot(container).render(app)
    }
  })
