import {combineReducers} from 'redux';

import languageReducer from './language';
import layersReducer from './layers';
import storiesReducer from './stories';
import selectedLayersReducer from './selected-layers';
import globeReducer from './globe';

const rootReducer = combineReducers({
  language: languageReducer,
  layers: layersReducer,
  stories: storiesReducer,
  selectedLayers: selectedLayersReducer,
  globe: globeReducer
});

export default rootReducer;
export type State = ReturnType<typeof rootReducer>;
