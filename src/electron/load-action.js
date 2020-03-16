const fs = require('fs');
const path = require('path');
const {app} = require('electron');

/**
 * Loads a persisted action from the filesystem
 */
module.exports = function loadAction(actionType) {
  const type = actionType.toLowerCase();
  const downloadsPath = app.getPath('downloads');
  const actionsPath = path.join(downloadsPath, 'actions');
  const filePath = path.join(actionsPath, type);

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
