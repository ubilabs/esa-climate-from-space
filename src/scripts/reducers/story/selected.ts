import {
  FETCH_STORY_SUCCESS,
  FetchStoryActions,
} from "../../actions/fetch-story";

import { convertLegacyStory } from "../../libs/convert-legacy-story";
import { isLegacyStory } from "../../libs/is-legacy-story";
import { LegacyStory } from "../../types/legacy-story";

import { Story } from "../../types/story";

function selectedStoryReducer(
  storyState: Story | null = null,
  action: FetchStoryActions,
): Story | null {
  switch (action.type) {
    case FETCH_STORY_SUCCESS: {
      return isLegacyStory(action.story)
        ? convertLegacyStory(action.story as LegacyStory)
        : (action.story as Story);
    }
    default:
      return storyState;
  }
}

export default selectedStoryReducer;
