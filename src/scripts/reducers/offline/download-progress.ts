import {
  SET_DOWNLOAD_PROGRESS,
  SetDownloadProgressAction
} from '../../actions/set-download-progress';

import {DownloadProgress} from '../../types/download-progress';

const initialState: DownloadProgress = {};

function downloadProgressReducer(
  state: DownloadProgress = initialState,
  action: SetDownloadProgressAction
): DownloadProgress {
  switch (action.type) {
    case SET_DOWNLOAD_PROGRESS:
      return action.progress;
    default:
      return state;
  }
}

export default downloadProgressReducer;
