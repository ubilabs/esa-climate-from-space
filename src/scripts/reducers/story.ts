import {FETCH_STORY_SUCCESS, FetchStoryActions} from '../actions/fetch-story';

import {Story} from '../types/story';
import {State} from './index';

function storyReducer(
  storyState: Story | null = null,
  action: FetchStoryActions
): Story | null {
  switch (action.type) {
    case FETCH_STORY_SUCCESS:
      return action.story;
    default:
      return storyState;
  }
}

export function storySelector(state: State): Story | null {
  return state.story;
}

export default storyReducer;
