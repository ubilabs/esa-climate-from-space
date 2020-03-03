import {combineReducers} from 'redux';

import listReducer from './list';
import detailsReducer from './details';
import selectedLayerIdsReducer from './selected-ids';

const layersReducer = combineReducers({
  list: listReducer,
  details: detailsReducer,
  layerIds: selectedLayerIdsReducer
});

export default layersReducer;

export type LayersState = ReturnType<typeof layersReducer>;
