/**
 * Webpack will only include this module when building for web
 */

// State if evironment is electron
export function isElectron() {
  return false;
}
