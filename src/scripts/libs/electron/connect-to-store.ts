import {Dispatch} from 'redux';
import setDownloadedDataAction, {
  SetDownloadedDataAction
} from '../../actions/set-downloaded-data';
import setDownloadProgressAction, {
  SetDownloadProgressAction
} from '../../actions/set-download-progress';

let isStoreConnected = false;
/**
 * Connects this module to the store so that incoming ipc messages can be
 * dispatched
 */
export function connectToStore(
  dispatch: Dispatch<SetDownloadedDataAction | SetDownloadProgressAction>
): void {
  if (!window.cfs) {
    console.error('Calling electron function from a non-electron enviroment');
    return;
  }

  if (isStoreConnected) {
    console.warn('Electron Helpers: Store already connected! Doing nothing...');
    return;
  }

  isStoreConnected = true;

  window.cfs.addIpcListener('offline-update', (event, message) => {
    const data = JSON.parse(message);
    dispatch(setDownloadedDataAction(data));
  });

  window.cfs.addIpcListener('progress-update', (event, message) => {
    const data = JSON.parse(message);
    dispatch(setDownloadProgressAction(data));
  });
}
