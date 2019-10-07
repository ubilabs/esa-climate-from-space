const path = require('path');
const {app, BrowserWindow} = require('electron');

let windows = [];

function createWindow() {
  // Create the browser window.
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: path.resolve(__dirname, 'preload.js')
    }
  });

  windows.push(window);

  // and load the index.html of the app.
  const indexPath = path.resolve(__dirname, '../../dist/index.html');
  window.loadFile(indexPath);

  // window.webContents.openDevTools();

  window.on('closed', () => {
    windows = windows.filter(w => w !== window);
  });
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
