/**
 * SalesCloserPro - Main Entry Point
 * Copyright (c) 2026 Brent Girolimon / llmadvisor.ai
 * Powered by highsignal™
 * Licensed under Apache-2.0
 * https://github.com/harborglowvintage-oss/salescloserpro.ai
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { migrateFromLocalStorage } from './db'

// Migrate legacy localStorage data to IndexedDB before rendering
migrateFromLocalStorage('salescloserpro-data').then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})
