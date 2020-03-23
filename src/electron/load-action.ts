import * as fs from 'fs';
import * as path from 'path';
import {app} from 'electron';

/**
 * Loads a persisted action from the filesystem
 */
module.exports = function loadAction(actionType: string, pathToFile: string) {
  const type = actionType.toLowerCase();
  const downloadsPath = app.getPath('downloads');
  const filePath = pathToFile
    ? path.join(downloadsPath, pathToFile)
    : path.join(downloadsPath, 'actions', type);

  let action = null;

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    action = JSON.parse(content);
    console.log(`Loaded action ${actionType} from ${filePath}`);
  } catch (error) {
    console.log(
      `Error: Could not load action ${actionType} from ${filePath}`,
      error
    );
  }

  return action;
};
