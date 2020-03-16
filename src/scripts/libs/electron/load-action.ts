import {Action} from 'redux';

// Tries to load an action from the filesystem
export function loadAction(
  actionType: string,
  filePath?: string
): Action | null {
  if (!window.cfs) {
    console.error('Calling electron function from a non-electron environment');
    return null;
  }

  return window.cfs.loadAction(actionType, filePath);
}
