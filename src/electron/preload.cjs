const path = require("path");
const { contextBridge, ipcRenderer } = require("electron");

// retrieve and save the downloads path for later
let downloadsPath = "";
ipcRenderer.invoke("downloadsPath").then((p) => {
  downloadsPath = p;
});

// Returns the currently set "Downloads" folder joined with the given path parts
function getDownloadsPath(...parts) {
  return path.join(downloadsPath, ...parts);
}

// Downloads the content at the given URL
// the download will be handled by the electron 'will-download' handler)
function downloadUrl(url) {
  ipcRenderer.send("downloadUrl", url);
}

// Delete the offline folder of the given layer or story id
function deleteId(id) {
  ipcRenderer.send("downloadDelete", id);
}

// Saves a redux action in a local file for offline usage
function saveAction(action) {
  ipcRenderer.send("saveAction", action);
}

// Loads a redux action in a local file for offline usage
function loadAction(actionType, pathToFile) {
  return ipcRenderer.invoke("loadAction", { actionType, pathToFile });
}

// The context of the preload script and the browser windows context are both
// isolated for security reasons (contextIsolation: true).
// That's why we have to expose values and functions via the context bridge.
// see https://www.electronjs.org/docs/tutorial/security#3-enable-context-isolation-for-remote-content
contextBridge.exposeInMainWorld("cfs", {
  isElectron: true,
  getDownloadsPath,
  downloadUrl,
  deleteId,
  saveAction,
  loadAction,
  addIpcListener: (channel, callback) => ipcRenderer.on(channel, callback),
});
