import {
  FETCH_STORIES_SUCCESS,
  FetchStoriesActions
} from '../../actions/fetch-stories';

import {StoryList} from '../../types/story-list';

const initialState: StoryList = [];

function storyListReducer(
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

export default storyListReducer;
