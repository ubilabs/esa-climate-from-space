import {combineReducers} from 'redux';

import listReducer from './list';
import detailsReducer from './details';
import selectedReducer from './selected';

import {State} from '../index';

const layersReducer = combineReducers({
  list: listReducer,
  details: detailsReducer,
  selected: selectedReducer
});

export default layersReducer;

export type LayersState = ReturnType<typeof layersReducer>;

export const layersStateSelector = (state: State): LayersState => state.layers;
