import * as fs from 'fs';
import * as path from 'path';
import {app} from 'electron';

/**
 * Get downloaded Ids from the downloads folder content
 */
module.exports.getDownloadedIds = function () {
  const downloadsPath = path.join(app.getPath('downloads'), 'downloads');

  try {
    const dirContent = fs
      .readdirSync(downloadsPath, {
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
  } catch (error) {
    console.log('Could not read downloads folder at', downloadsPath, error);
  }

  return {
    layers: [],
    stories: []
  };
};
