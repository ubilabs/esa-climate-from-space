import {
  FETCH_STORY_SUCCESS,
  FetchStoryActions
} from '../../actions/fetch-story';

import {Story} from '../../types/story';

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

export default selectedStoryReducer;
