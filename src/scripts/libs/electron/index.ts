import {Action} from 'redux';

// Extend global window type with our cfs namespace
declare global {
  interface Window {
    cfs?: {
      isElectron: boolean;
      getDownloadsPath: (...parts: string[]) => string;
      downloadUrl: (url: string) => void;
      deleteId: (id: string) => void;
      saveAction: (action: Action) => void;
      loadAction: (actionType: string, filePath?: string) => Action | null;
      addIpcListener: (
        channel: string,
        callback: (event: Record<string, unknown>, message: string) => void
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
export {getOfflineStoryMediaUrl} from './get-offline-story-media-url';
export {offlineSaveMiddleware} from './offline-middleware';
export {offlineLoadMiddleware} from './offline-middleware';
