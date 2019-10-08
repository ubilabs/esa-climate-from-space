import {combineReducers} from 'redux';

import localeReducer from './locale';
import layersReducer from './layers';
import selectedLayerReducer from './selected-layer-id';
import projectionReducer from './projection';

const rootReducer = combineReducers({
  locale: localeReducer,
  layers: layersReducer,
  selectedLayer: selectedLayerReducer,
  projection: projectionReducer
});

export default rootReducer;
export type State = ReturnType<typeof rootReducer>;
