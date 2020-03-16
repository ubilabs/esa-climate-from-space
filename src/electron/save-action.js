const fs = require('fs');
const path = require('path');
const {app} = require('electron');

/**
 * Saves an action for offline usage
 */
module.exports = function saveAction(action) {
  const type = action.type.toLowerCase();
  const downloadsPath = app.getPath('downloads');
  const actionsPath = path.join(downloadsPath, 'actions');
  const filePath = path.join(actionsPath, type);
  const content = JSON.stringify(action, null, 2);

  fs.mkdirSync(actionsPath, {recursive: true});

  fs.writeFile(filePath, content, 'utf8', err => {
    if (err) {
      console.log(err);
    }
    console.log('Saved action to', filePath);
  });
};
