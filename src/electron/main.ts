import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { app, BrowserWindow, ipcMain } from "electron";
import { Action } from "@reduxjs/toolkit";
import isDev from "electron-is-dev";
import { addDownloadHandler } from "./download-handler.js";
import loadAction from "./load-action.js";
import saveAction from "./save-action.js";
import downloadDelete from "./download-delete.js";

let windows: BrowserWindow[] = [];

function createWindow() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  console.log(path.join(__dirname, "preload.cjs"));
  // create a new browser window
  const window = new BrowserWindow({
    width: 1400,
    height: 800,
    title: "ESA – Climate from Space",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.cjs"),
      sandbox: false,
    },
  });

  // save window's reference
  windows.push(window);

  // add download handler
  const downloadsPath = path.join(app.getPath("home"), ".esa-cfs", "offline");
  app.setPath("downloads", downloadsPath);
  addDownloadHandler(window);

  // load the index page in the window
  const indexPath = `file://${__dirname}/../dist/index.html`;
  window.loadURL(indexPath);

  if (isDev) {
    window.webContents.openDevTools();
  }

  const saveActionListener = (_: Electron.IpcMainEvent, action: Action) =>
    saveAction(action);
  const downloadUrlListener = (_: Electron.IpcMainEvent, url: string) =>
    window.webContents.downloadURL(url);
  const downloadDeleteListener = (_: Electron.IpcMainEvent, id: string) =>
    downloadDelete(window, id);

  // free window reference when closed
  window.on("closed", () => {
    ipcMain.off("saveAction", saveActionListener);
    ipcMain.off("downloadUrl", downloadUrlListener);
    ipcMain.off("downloadDelete", downloadDeleteListener);

    windows = windows.filter((w) => w !== window);
  });

  ipcMain.on("saveAction", saveActionListener);
  ipcMain.on("downloadUrl", downloadUrlListener);
  ipcMain.on("downloadDelete", downloadDeleteListener);
}

app.on("ready", () => {
  // ipc handler
  ipcMain.handle("loadAction", (_, { actionType, pathToFile }) =>
    loadAction(actionType, pathToFile),
  );
  ipcMain.handle("downloadsPath", () => app.getPath("downloads"));

  createWindow();
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    ipcMain.removeHandler("loadAction");
    ipcMain.removeHandler("downloadsPath");

    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (windows.length === 0) {
    createWindow();
  }
});
