import {
  SET_DOWNLOADED_DATA,
  SetDownloadedDataAction
} from '../../actions/set-downloaded-data';

import {DownloadedData} from '../../types/downloaded-data';

const initialState: DownloadedData = {
  layers: [],
  stories: []
};

function downloadedDataReducer(
  state: DownloadedData = initialState,
  action: SetDownloadedDataAction
): DownloadedData {
  switch (action.type) {
    case SET_DOWNLOADED_DATA:
      return action.data;
    default:
      return state;
  }
}

export default downloadedDataReducer;
