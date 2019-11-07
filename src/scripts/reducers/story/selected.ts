import {
  FETCH_STORY_SUCCESS,
  FetchStoryActions
} from '../../actions/fetch-story';

import {Story} from '../../types/story';
import {State} from '../index';

function selectedStoryReducer(
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

export function selectedStorySelector(
  state: State,
  storyId?: string
): Story | null {
  if (!state.stories.selected || !storyId) {
    return null;
  }

  return state.stories.selected.id === storyId ? state.stories.selected : null;
}

export default selectedStoryReducer;
