const fs = require('fs');
const path = require('path');
const zip = require('cross-zip');
const {app} = require('electron');

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

    console.log(`Downloading file ${item.getURL()} to ${item.savePath}`);

    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed');
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused');
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`);
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
      } else {
        console.log(`Download failed: ${state}`, item.savePath);
      }
    });
  });
};

/**
 * Get downloaded Ids from the downloads folder content
 */
function getDownloadedIds() {
  const dirContent = fs
    .readdirSync(app.getPath('downloads'), {
      withFileTypes: true
    })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  const layers = dirContent.filter(name => !name.startsWith('story'));
  const stories = dirContent.filter(name => name.startsWith('story'));

  return {
    layers,
    stories
  };
}
