import {combineReducers} from 'redux';

import layersReducer from './layers';
import selectedLayerReducer from './selected-layer-id';
import projectionReducer from './projection';

const rootReducer = combineReducers({
  layers: layersReducer,
  selectedLayer: selectedLayerReducer,
  projection: projectionReducer
});

export default rootReducer;
export type State = ReturnType<typeof rootReducer>;
