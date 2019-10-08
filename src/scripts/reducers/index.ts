import {combineReducers} from 'redux';

import localeReducer from './locale';
import layersReducer from './layers';
import selectedLayerReducer from './selected-layer-id';

const rootReducer = combineReducers({
  locale: localeReducer,
  layers: layersReducer,
  selectedLayer: selectedLayerReducer
});

export default rootReducer;
export type State = ReturnType<typeof rootReducer>;
