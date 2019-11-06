import {combineReducers} from 'redux';

import listReducer from './list';
import itemReducer from './item';

import {State} from '../index';

const storiesReducer = combineReducers({
  list: listReducer,
  item: itemReducer
});

export default storiesReducer;

export type StoriesState = ReturnType<typeof storiesReducer>;

export const layersStateSelector = (state: State): StoriesState =>
  state.stories;
