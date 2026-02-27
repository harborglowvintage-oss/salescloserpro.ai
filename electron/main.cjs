const { app, BrowserWindow, Menu, shell } = require('electron')
const path = require('path')

// Disable GPU acceleration issues on some Linux distros
app.commandLine.appendSwitch('disable-gpu-sandbox')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 900,
    minHeight: 600,
    icon: path.join(__dirname, '..', 'build', 'icons', 'icon.png'),
    title: 'SalesCloserPro',
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    show: false,            // show after ready-to-show for a smooth launch
    autoHideMenuBar: false,
  })

  // ── Load the app ──────────────────────────────────────────
  // In production, load the built index.html from dist/
  // In dev, connect to the Vite dev server
  const isDev = !app.isPackaged
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }

  // Show window when ready (no white flash)
  mainWindow.once('ready-to-show', () => mainWindow.show())

  // Open external links in the default browser, not in Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.on('closed', () => { mainWindow = null })
}

// ── Application menu ──────────────────────────────────────
function buildMenu() {
  const isMac = process.platform === 'darwin'
  const template = [
    ...(isMac ? [{
      label: 'SalesCloserPro',
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ]
    }] : []),
    {
      label: 'File',
      submenu: [
        isMac ? { role: 'close' } : { role: 'quit' },
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
        ] : [
          { role: 'close' },
        ]),
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'SalesCloserPro on GitHub',
          click: () => shell.openExternal('https://github.com/harborglowvintage-oss/salescloserpro.ai'),
        },
        {
          label: 'Powered by llmadvisor.ai',
          click: () => shell.openExternal('https://llmadvisor.ai'),
        },
      ]
    },
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

// ── App lifecycle ────────────────────────────────────────
app.whenReady().then(() => {
  buildMenu()
  createWindow()

  app.on('activate', () => {
    // macOS: re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
