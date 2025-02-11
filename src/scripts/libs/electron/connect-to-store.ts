import { Dispatch } from "redux";
import { setDownloadedData } from "../../reducers/downloaded-data";
import { setDownloadProgress } from "../../reducers/offline/download-progress";
let isStoreConnected = false;
/**
 * Connects this module to the store so that incoming ipc messages can be
 * dispatched
 */
export function connectToStore(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: Dispatch<any>,
): void {
  if (!window.cfs) {
    console.error("Calling electron function from a non-electron enviroment");
    return;
  }

  if (isStoreConnected) {
    console.warn("Electron Helpers: Store already connected! Doing nothing...");
    return;
  }

  isStoreConnected = true;

  window.cfs.addIpcListener("offline-update", (event, message) => {
    const data = JSON.parse(message);
    dispatch(setDownloadedData(data));
  });

  window.cfs.addIpcListener("progress-update", (event, message) => {
    const data = JSON.parse(message);
    dispatch(setDownloadProgress(data));
  });
}
