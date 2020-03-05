/**
 * Webpack will only include this module when building for electron
 */

import {remote} from 'electron';

const webContents = remote.getCurrentWebContents();

export function isElectron() {
  return true;
}

export function downloadUrl(url: string) {
  webContents.downloadURL(url);
}
