import {combineReducers} from 'redux';

import listReducer from './list';
import selectedReducer from './selected';

const storiesReducer = combineReducers({
  list: listReducer,
  selected: selectedReducer
});

export default storiesReducer;

export type StoriesState = ReturnType<typeof storiesReducer>;
