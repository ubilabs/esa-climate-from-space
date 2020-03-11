import {combineReducers} from 'redux';

import downloadedDataReducer from './downloaded-data';
import downloadPrgressReducer from './download-progress';

const offlineReducer = combineReducers({
  downloaded: downloadedDataReducer,
  progress: downloadPrgressReducer
});

export default offlineReducer;

export type OfflineState = ReturnType<typeof offlineReducer>;
