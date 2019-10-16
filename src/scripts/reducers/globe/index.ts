import {combineReducers} from 'redux';
import projectionReducer from './projection';
import viewReducer from './view';
import {State} from '../index';

const globeReducer = combineReducers({
  view: viewReducer,
  projection: projectionReducer
});

export default globeReducer;

export type GlobeState = ReturnType<typeof globeReducer>;

export const globeStateSelector = (state: State): GlobeState => state.globe;
