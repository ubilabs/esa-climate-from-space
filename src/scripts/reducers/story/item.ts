import {
  FETCH_STORY_SUCCESS,
  FetchStoryActions
} from '../../actions/fetch-story';

import {Story} from '../../types/story';
import {State} from '../index';

function storyItemReducer(
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

export function storyItemSelector(
  state: State,
  storyId?: string
): Story | null {
  if (!state.stories.item || !storyId) {
    return null;
  }

  return state.stories.item.id === storyId ? state.stories.item : null;
}

export default storyItemReducer;
