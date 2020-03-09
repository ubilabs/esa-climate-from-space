import {State} from '../../reducers/index';
import {DownloadProgress} from '../../types/download-progress';

export function downloadProgressSelector(state: State): DownloadProgress {
  return state.offline.progress;
}
