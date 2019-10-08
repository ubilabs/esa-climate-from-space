import {combineReducers} from 'redux';

import localeReducer from './locale';
import layersReducer from './layers';
import selectedLayersReducer from './selected-layers';
import projectionReducer from './projection';

const rootReducer = combineReducers({
  locale: localeReducer,
  layers: layersReducer,
  selectedLayers: selectedLayersReducer,
  projection: projectionReducer
});

export default rootReducer;
export type State = ReturnType<typeof rootReducer>;
