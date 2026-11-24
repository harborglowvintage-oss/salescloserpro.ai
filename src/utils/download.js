/**
 * salescloserpro.ai - save a generated file to the user's device
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 */

export function downloadFile(payload, filename, type = 'application/json') {
  const blob = new Blob([payload], { type })
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
