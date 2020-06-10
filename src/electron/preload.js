const path = require('path');
const {contextBridge, remote, ipcRenderer} = require('electron');
const app = remote.app;

// Returns the currently set "Downloads" folder joined with the given path parts
function getDownloadsPath(...parts) {
  return path.join(app.getPath('downloads'), ...parts);
}

// Downloads the content at the given URL
// the download will be handled by the electron 'will-download' handler)
function downloadUrl(url) {
  remote.getCurrentWebContents().downloadURL(url);
}

// Delete the offline folder of the given layer or story id
function deleteId(id) {
  const deleteRemoteFn = remote.require('./download-delete');
  const browserWindow = remote.BrowserWindow.getFocusedWindow();
  deleteRemoteFn(browserWindow, id);
}

// Saves a redux action in a local file for offline usage
function saveAction(action) {
  const saveActionRemoteFn = remote.require('./save-action');
  saveActionRemoteFn(action);
}

// Loads a redux action in a local file for offline usage
function loadAction(actionType, pathToFile) {
  const loadActionRemoteFn = remote.require('./load-action');
  return loadActionRemoteFn(actionType, pathToFile);
}

// The context of the preload script and the browser windows context are both
// isolated for security reasons (contextIsolation: true).
// That's why we have to expose values and functions via the context bridge.
// see https://www.electronjs.org/docs/tutorial/security#3-enable-context-isolation-for-remote-content
contextBridge.exposeInMainWorld('cfs', {
  isElectron: true,
  getDownloadsPath,
  downloadUrl,
  deleteId,
  saveAction,
  loadAction,
  addIpcListener: (channel, callback) => ipcRenderer.on(channel, callback)
});
