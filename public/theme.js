// Applies the saved light/dark choice before the page paints, so the app never flashes the
// wrong theme. Layout.jsx writes 'scp-theme' to localStorage; dark is the default. This is a
// file, not inline code, because the Content-Security-Policy in _headers allows only scripts
// served from this site.
try {
  if (localStorage.getItem('scp-theme') !== 'light') document.documentElement.classList.add('dark')
} catch { /* storage blocked (private mode): keep the default */ }
