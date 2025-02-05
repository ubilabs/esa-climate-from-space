import {
  SET_STORY_LAYER,
  SetStoryLayerAction,
} from "../actions/set-story-layer";

function storyLayerReducer(
  state: string | null = null,
  action: SetStoryLayerAction,
): string | null {
  switch (action.type) {
    case SET_STORY_LAYER:
      return action.storyLayerId;
    default:
      return state;
  }
}

export default storyLayerReducer;
