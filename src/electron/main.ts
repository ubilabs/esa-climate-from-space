/* eslint-disable @typescript-eslint/no-require-imports */
import * as path from "path";
import { app, BrowserWindow, ipcMain } from "electron";
const isDev = require("electron-is-dev");
import { addDownloadHandler } from "./download-handler.js";
const loadAction = require("./load-action");
const saveAction = require("./save-action");
const downloadDelete = require("./download-delete");

let windows: BrowserWindow[] = [];

function createWindow() {
  console.log(path.join(__dirname, "preload.js"));
  // create a new browser window
  const window = new BrowserWindow({
    width: 1400,
    height: 800,
    title: "ESA – Climate from Space",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
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

  // free window reference when closed
  window.on("closed", () => {
    windows = windows.filter((w) => w !== window);
  });

  // ipc handler
  ipcMain.handle("loadAction", (event, { actionType, pathToFile }) =>
    loadAction(actionType, pathToFile),
  );

  ipcMain.on("saveAction", (event, action) => saveAction(action));

  ipcMain.on("downloadUrl", (event, url) =>
    window.webContents.downloadURL(url),
  );

  ipcMain.on("downloadDelete", (event, id) => downloadDelete(window, id));

  ipcMain.handle("downloadsPath", () => app.getPath("downloads"));
}

app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
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
