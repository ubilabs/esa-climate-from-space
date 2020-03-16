import {Action} from 'redux';

// Tries to load an action from the filesystem
export function loadAction(action: Action): Action {
  if (!window.cfs) {
    console.error('Calling electron function from a non-electron enviroment');
    return;
  }

  return window.cfs.loadAction(action);
}
