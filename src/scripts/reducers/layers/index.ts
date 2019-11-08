import {combineReducers} from 'redux';

import listReducer from './list';
import detailsReducer from './details';
import selectedIdsReducer from './selected-ids';

const layersReducer = combineReducers({
  list: listReducer,
  details: detailsReducer,
  selectedIds: selectedIdsReducer
});

export default layersReducer;

export type LayersState = ReturnType<typeof layersReducer>;
