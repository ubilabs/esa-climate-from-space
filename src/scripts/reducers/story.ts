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

export function storySelector(state: State, storyId?: string): Story | null {
  if (!state.story || !storyId) {
    return null;
  }

  return state.story.id === storyId ? state.story : null;
}

export default storyReducer;
