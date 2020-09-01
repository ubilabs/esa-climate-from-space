import {combineReducers} from 'redux';

import projectionReducer from './projection';
import viewReducer from './view';
import timeReducer from './time';
import spinningReducer from './spinning';

const globeReducer = combineReducers({
  view: viewReducer,
  projectionState: projectionReducer,
  time: timeReducer,
  spinning: spinningReducer
});

export default globeReducer;

export type GlobeState = ReturnType<typeof globeReducer>;
