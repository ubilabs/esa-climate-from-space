import {
  FETCH_STORIES_SUCCESS,
  FetchStoriesActions
} from '../actions/fetch-stories';

import {StoryList} from '../types/story-list';
import {State} from './index';

const initialState: StoryList = [];

function storiesReducer(
  storiesState: StoryList = initialState,
  action: FetchStoriesActions
): StoryList {
  switch (action.type) {
    case FETCH_STORIES_SUCCESS:
      return action.stories;
    default:
      return storiesState;
  }
}

export function storiesSelector(state: State) {
  return state.stories;
}

export default storiesReducer;
