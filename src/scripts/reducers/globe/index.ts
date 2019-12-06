import {combineReducers} from 'redux';

import projectionReducer from './projection';
import viewReducer from './view';
import timeReducer from './time';

const globeReducer = combineReducers({
  view: viewReducer,
  projection: projectionReducer,
  time: timeReducer
});

export default globeReducer;

export type GlobeState = ReturnType<typeof globeReducer>;
