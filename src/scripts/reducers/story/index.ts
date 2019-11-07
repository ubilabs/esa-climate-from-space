import {combineReducers} from 'redux';

import listReducer from './list';
import selectedReducer from './selected';

import {State} from '../index';

const storiesReducer = combineReducers({
  list: listReducer,
  selected: selectedReducer
});

export default storiesReducer;

export type StoriesState = ReturnType<typeof storiesReducer>;

export const layersStateSelector = (state: State): StoriesState =>
  state.stories;
