import {combineReducers} from 'redux';

import layersReducer from './layers';
import selectedLayerReducer from './selected-layer-id';

const rootReducer = combineReducers({
  layers: layersReducer,
  selectedLayer: selectedLayerReducer
});

export default rootReducer;
export type State = ReturnType<typeof rootReducer>;
