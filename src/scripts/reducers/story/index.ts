import {combineReducers} from 'redux';

import listReducer from './list';
import selectedReducer from './selected';
import selectedTagsReducer from './selected-tags';

const storiesReducer = combineReducers({
  list: listReducer,
  selected: selectedReducer,
  selectedTags: selectedTagsReducer
});

export default storiesReducer;

export type StoriesState = ReturnType<typeof storiesReducer>;
