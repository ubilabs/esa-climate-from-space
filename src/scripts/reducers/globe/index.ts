import {combineReducers} from 'redux';

import projectionReducer from './projection';
import viewReducer from './view';
import timeReducer from './time';

import {State} from '../index';

const globeReducer = combineReducers({
  view: viewReducer,
  projection: projectionReducer,
  time: timeReducer
});

export default globeReducer;

export type GlobeState = ReturnType<typeof globeReducer>;

export const globeStateSelector = (state: State): GlobeState => state.globe;
