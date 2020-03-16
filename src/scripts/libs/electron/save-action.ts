import {Action} from 'redux';

// Saves an action for offline usage
export function saveAction(action: Action): void {
  if (!window.cfs) {
    console.error('Calling electron function from a non-electron enviroment');
    return;
  }

  window.cfs.saveAction(action);
}
