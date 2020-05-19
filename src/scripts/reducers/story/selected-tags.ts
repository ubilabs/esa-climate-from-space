import {
  SET_SELECTED_STORY_TAGS,
  SetSelectedStoryTagsAction
} from '../../actions/set-selected-story-tags';
import {parseUrl} from '../../libs/tags-url-parameter';

function selectedStoryTagsReducer(
  tagsState: string[] = parseUrl(),
  action: SetSelectedStoryTagsAction
): string[] {
  switch (action.type) {
    case SET_SELECTED_STORY_TAGS:
      return action.tags;
    default:
      return tagsState;
  }
}

export default selectedStoryTagsReducer;
