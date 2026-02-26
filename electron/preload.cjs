// Preload script — runs in the renderer before web content loads.
// Exposes a minimal bridge to the renderer if needed in the future.
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,    // 'darwin', 'win32', 'linux'
  isElectron: true,
})
