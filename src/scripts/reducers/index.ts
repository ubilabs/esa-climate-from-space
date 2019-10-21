import {combineReducers} from 'redux';

import languageReducer from './language';
import layersReducer from './layers/index';
import storiesReducer from './stories';
import globeReducer from './globe';

const rootReducer = combineReducers({
  language: languageReducer,
  layers: layersReducer,
  stories: storiesReducer,
  globe: globeReducer
});

export default rootReducer;
export type State = ReturnType<typeof rootReducer>;
