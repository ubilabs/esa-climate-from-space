import {combineReducers} from 'redux';

import listReducer from './list';
import detailsReducer from './details';

const layersReducer = combineReducers({
  list: listReducer,
  details: detailsReducer
});

export default layersReducer;

export type LayersState = ReturnType<typeof layersReducer>;
