const fs = require('fs');
const path = require('path');
const {app} = require('electron');

// const {getDownloadedIds} = require('./get-downloaded-ids');

console.log('Node', process.version);
// const fsp = require('fsPromises');

/**
 * Removes the folder matching the given id from the offline directoy
 */
module.exports.deleteId = function deleteId(browserWindow, id) {
  const downloadsPath = app.getPath('downloads');
  const pathToDelete = path.join(downloadsPath, id);

  console.log('Deleting', pathToDelete);

  if (
    !fs.existsSync(path) ||
    !fs.statSync(pathToDelete).isDirectory() ||
    id.length < 5
  ) {
    throw new Error('Path to delete does not exist', pathToDelete);
  }

  // fsp.rmdir(pathToDelete, {recursive: true}).then(() => {
  //   browserWindow.webContents.send(
  //     'offline-update',
  //     JSON.stringify(getDownloadedIds())
  //   );
  // });
};
