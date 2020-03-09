/**
 * Webpack will only include this module when building for electron
 */
import path from 'path';
import {remote, ipcRenderer} from 'electron';
import {Dispatch} from 'redux';
import setDownloadedDataAction, {
  SetDownloadedDataAction
} from '../actions/set-downloaded-data';
import setDownloadProgressAction, {
  SetDownloadProgressAction
} from '../actions/set-download-progress';

console.log('Offline Helpers loaded');

const app = remote.app;
const webContents = remote.getCurrentWebContents();
let isConnected = false;

// Returns if environment is electron
export function isElectron() {
  return true;
}

// Returns if the machine is offline
export function isOffline() {
  return !navigator.onLine;
}

/**
 * Connects this module to the store so that incoming ipc messages can be
 * dispatched
 */
export function connectToStore(
  dispatch: Dispatch<SetDownloadedDataAction | SetDownloadProgressAction>
) {
  if (isConnected) {
    console.warn('Electron Helpers: Store already connected! Doing nothing...');
    return;
  }

  isConnected = true;
  ipcRenderer.on('offline-update', (event, message) => {
    const data = JSON.parse(message);
    dispatch(setDownloadedDataAction(data));
  });

  ipcRenderer.on('progress-update', (event, message) => {
    const data = JSON.parse(message);
    dispatch(setDownloadProgressAction(data));
  });
}

// Returns the url template for offline usage
export function getOfflineTilesUrl() {
  return path.join(
    app.getPath('downloads'),
    '{id}',
    'tiles',
    '{timeIndex}',
    '{z}',
    '{x}',
    '{reverseY}.png'
  );
}

// Downloads the content at the given URL
// the download will be handled by the electron 'will-download' handler)
export function downloadUrl(url: string) {
  webContents.downloadURL(url);
}
