import {State} from '../reducers/index';
import {DownloadedData} from '../types/downloaded-data';

export function downloadedDataSelector(state: State): DownloadedData {
  return state.downloadedData;
}
