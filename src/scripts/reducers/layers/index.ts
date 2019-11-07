import {combineReducers} from 'redux';

import listReducer from './list';
import detailsReducer from './details';
import selectedIdsReducer from './selected-ids';
import selectedLayersReducer from './selected';

import {State} from '../index';

const layersReducer = combineReducers({
  list: listReducer,
  details: detailsReducer,
  selectedIds: selectedIdsReducer,
  selected: selectedLayersReducer
});

export default layersReducer;

export type LayersState = ReturnType<typeof layersReducer>;

export const layersStateSelector = (state: State): LayersState => state.layers;
