import * as fs from "fs";
import * as path from "path";
// @ts-expect-error no types available for cross-zip
import { unzipSync } from "cross-zip";
import { app, BrowserWindow } from "electron";

import { getDownloadedIds } from "./get-downloaded-ids.js";

// keep track of all active downloads and their progress
const activeDownloads: { [url: string]: number } = {};

/**
 * Removes a nested folder from the offline path if it exists.
 * @param offlinePath The path to the offline directory.
 * @param datasetName The name of the dataset.
 */
function removeNestedFolder(offlinePath: string, datasetName: string) {
  // Check if the extracted folder contains a nested folder with the same name
  const extractedPath = path.join(offlinePath, datasetName ?? "");
  const nestedPath = path.join(extractedPath, datasetName ?? "");

  if (
    datasetName &&
    fs.existsSync(nestedPath) &&
    fs.lstatSync(nestedPath).isDirectory()
  ) {
    // Move all files from nestedPath to extractedPath
    for (const file of fs.readdirSync(nestedPath)) {
      const src = path.join(nestedPath, file);
      const dest = path.join(extractedPath, file);
      fs.renameSync(src, dest);
    }
    // Remove the now-empty nested directory
    fs.rmdirSync(nestedPath);
  }
}

/**
 * Intercepts all browser downloads in the given window
 */
export function addDownloadHandler(browserWindow: BrowserWindow) {
  // update the downloaded data state once on load
  browserWindow.webContents.on("did-finish-load", () => {
    browserWindow.webContents.send(
      "offline-update",
      JSON.stringify(getDownloadedIds()),
    );
  });

  console.log("Adding download handler");

  browserWindow.webContents.session.on("will-download", (_, item) => {
    console.log("will-download", item.getFilename());
    if (!item.getFilename().toLowerCase().endsWith(".zip")) {
      return;
    }
    const downloadsPath = app.getPath("downloads");
    const offlinePath = path.join(downloadsPath, "downloads");
    const tmpFilePath = path.join(offlinePath, `${Date.now()}.zip`);
    item.setSavePath(tmpFilePath);

    activeDownloads[item.getFilename()] = 0;

    console.log(`Downloading file ${item.getFilename()} to ${item.savePath}`);

    item.on("updated", (event, state) => {
      if (state === "interrupted") {
        console.log("Download is interrupted but can be resumed");
      } else if (state === "progressing") {
        if (item.isPaused()) {
          console.log("Download is paused");
        } else {
          const progress = item.getReceivedBytes() / item.getTotalBytes();
          activeDownloads[item.getFilename()] = progress;
          browserWindow.webContents.send(
            "progress-update",
            JSON.stringify(activeDownloads),
          );
          console.log(`Download progress: ${progress}`);
        }
      }
    });

    item.once("done", (event, state) => {
      if (state === "completed") {
        const match = item.getURL().match(/\/([^/]+)\/package\.zip$/);
        const datasetName = match ? match[1] : null;

        if (datasetName) {
          unzipSync(item.savePath, `${offlinePath}/${datasetName}`);

          // package.zip files are not consistent, some contain a nested folder with dataset's name, some do not.
          // This was caused by moving dataset creation from cloud build to new Airflow Pipeline. To support all
          // legacy datasets we need to remove the nested folder, if it exists.
          removeNestedFolder(offlinePath, datasetName);

          fs.unlinkSync(item.savePath);
          browserWindow.webContents.send(
            "offline-update",
            JSON.stringify(getDownloadedIds()),
          );

          delete activeDownloads[item.getURL()];
          browserWindow.webContents.send(
            "progress-update",
            JSON.stringify(activeDownloads),
          );

          console.log("Download successfully", item.savePath);

          return;
        }

        console.log(`Download failed: ${state}`, item.savePath);
      }
    });
  });
}
