// Extend global window type with our cfs namespace
declare global {
  interface Window {
    cfs?: {
      isElectron: boolean;
      getDownloadsPath: (...parts: string[]) => string;
      downloadUrl: (url: string) => void;
      deleteId: (id: string) => void;
      addIpcListener: (
        channel: string,
        callback: (event: {}, message: string) => void
      ) => void;
    };
  }
}

export {isElectron} from './is-electron';
export {isOffline} from './is-offline';
export {deleteId} from './delete-id';
export {downloadUrl} from './download-url';
export {connectToStore} from './connect-to-store';
export {getOfflineTilesUrl} from './get-offline-tiles-url';
