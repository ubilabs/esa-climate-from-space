import {
  FETCH_STORIES_SUCCESS,
  FetchStoriesActions
} from '../actions/fetch-stories';

import {StoriesItem} from '../types/stories-item';
import {State} from './index';

export type StoriesState = StoriesItem[];
const initialState: StoriesState = [];

function storiesReducer(
  storiesState: StoriesState = initialState,
  action: FetchStoriesActions
): StoriesState {
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
