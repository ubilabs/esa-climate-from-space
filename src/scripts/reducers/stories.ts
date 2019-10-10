import {State} from './index';
import {
  FETCH_STORIES_SUCCESS,
  Story,
  FetchStoriesActions
} from '../actions/fetch-stories';

export type StoriesState = Story[];
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
