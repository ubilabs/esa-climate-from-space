const fs = require('fs');
const path = require('path');
const zip = require('cross-zip');
const {app} = require('electron');

const {getDownloadedIds} = require('./get-downloaded-ids');

// keep track of all active downloads
const activeDownloads = {};

/**
 * Intercepts all browser downloads in the given window
 */
module.exports.addDownloadHandler = function(browserWindow) {
  // update the downloaded data state once on load
  browserWindow.webContents.on('did-finish-load', () => {
    browserWindow.webContents.send(
      'offline-update',
      JSON.stringify(getDownloadedIds())
    );
  });

  browserWindow.webContents.session.on('will-download', (_, item) => {
    const downloadsPath = app.getPath('downloads');
    const tmpFilePath = path.join(downloadsPath, `${Date.now()}.zip`);
    item.setSavePath(tmpFilePath);

    activeDownloads[item.getURL()] = 0;

    console.log(`Downloading file ${item.getURL()} to ${item.savePath}`);

    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed');
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused');
        } else {
          const progress = item.getReceivedBytes() / item.getTotalBytes();
          activeDownloads[item.getURL()] = progress;
          browserWindow.webContents.send(
            'progress-update',
            JSON.stringify(activeDownloads)
          );
          console.log(`Download progress: ${progress}`);
        }
      }
    });

    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully', item.savePath);
        zip.unzipSync(item.savePath, downloadsPath);
        fs.unlinkSync(item.savePath);
        browserWindow.webContents.send(
          'offline-update',
          JSON.stringify(getDownloadedIds())
        );

        delete activeDownloads[item.getURL()];
        browserWindow.webContents.send(
          'progress-update',
          JSON.stringify(activeDownloads)
        );
      } else {
        console.log(`Download failed: ${state}`, item.savePath);
      }
    });
  });
};
