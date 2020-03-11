const fs = require('fs');
const {app} = require('electron');

/**
 * Get downloaded Ids from the downloads folder content
 */
module.exports.getDownloadedIds = function() {
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
};
