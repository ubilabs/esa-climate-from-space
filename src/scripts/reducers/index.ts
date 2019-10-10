import {combineReducers} from 'redux';

import languageReducer from './language';
import layersReducer from './layers';
import storiesReducer from './stories';
import selectedLayersReducer from './selected-layers';
import projectionReducer from './projection';

const rootReducer = combineReducers({
  language: languageReducer,
  layers: layersReducer,
  stories: storiesReducer,
  selectedLayers: selectedLayersReducer,
  projection: projectionReducer
});

export default rootReducer;
export type State = ReturnType<typeof rootReducer>;
