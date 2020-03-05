const path = require('path');
const {app, BrowserWindow} = require('electron');
const {addDownloadHandler} = require('./download-handler.js');

// future proof for electron 9 and prevent annoying deprecation warning message
app.allowRendererProcessReuse = true;

let windows = [];

function createWindow() {
  // cerate a new browser window
  const window = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {nodeIntegration: true}
  });

  // save window's reference
  windows.push(window);

  // load the index page in the window
  const indexPath = `file://${__dirname}/../../dist/index.html`;
  window.loadURL(indexPath);

  window.webContents.openDevTools();

  // free window reference when closed
  window.on('closed', () => {
    windows = windows.filter(w => w !== window);
  });

  // add download handler
  const downloadsPath = path.join(app.getPath('home'), '.esa-cfs', 'offline');
  app.setPath('downloads', downloadsPath);
  addDownloadHandler(window);
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (windows.length === 0) {
    createWindow();
  }
});
