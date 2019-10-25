import {combineReducers} from 'redux';

import languageReducer from './language';
import layersReducer from './layers/index';
import storiesReducer from './stories';
import storyReducer from './story';
import globeReducer from './globe';
import flyToReducer from './fly-to';

const rootReducer = combineReducers({
  language: languageReducer,
  layers: layersReducer,
  stories: storiesReducer,
  story: storyReducer,
  globe: globeReducer,
  flyTo: flyToReducer
});

export default rootReducer;
export type State = ReturnType<typeof rootReducer>;
