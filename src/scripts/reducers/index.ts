import {combineReducers} from 'redux';

import languageReducer from './language';
import layersReducer from './layers/index';
import storiesReducer from './story/index';
import globeReducer from './globe';
import flyToReducer from './fly-to';
import storyLayerReducer from './story-layer';

const rootReducer = combineReducers({
  language: languageReducer,
  layers: layersReducer,
  stories: storiesReducer,
  globe: globeReducer,
  flyTo: flyToReducer,
  storyLayer: storyLayerReducer
});

export default rootReducer;
export type State = ReturnType<typeof rootReducer>;
