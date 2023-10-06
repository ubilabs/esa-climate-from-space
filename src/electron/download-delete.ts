import * as fs from 'fs';
import * as path from 'path';
import {BrowserWindow, app} from 'electron';

const {getDownloadedIds} = require('./get-downloaded-ids');

/**
 * Removes the folder matching the given id from the offline directoy
 */
module.exports = function deleteId(browserWindow: BrowserWindow, id: string) {
  // check if id contains '/', '\', '..' or ':'
  if (id.match(/:|\/|\\|\.\./)) {
    throw new Error('deleteId: Invalid id');
  }

  const downloadsPath = app.getPath('downloads');
  const pathToDelete = path.join(downloadsPath, 'downloads', id);

  if (!fs.statSync(pathToDelete).isDirectory() || id.length < 5) {
    throw new Error(`deleteId: Path to delete does not exist: ${pathToDelete}`);
  }

  console.log('Deleting', pathToDelete);

  fs.rm(pathToDelete, {recursive: true}, (err: Error | null) => {
    if (!err) {
      browserWindow.webContents.send(
        'offline-update',
        JSON.stringify(getDownloadedIds())
      );
    }
  });
};
