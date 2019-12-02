import {SET_STORY_LAYER, SetStoryLayerAction} from '../actions/set-story-layer';

import {StoryLayer} from '../types/story-layer';

function storyLayerReducer(
  state: StoryLayer | null = null,
  action: SetStoryLayerAction
): StoryLayer | null {
  switch (action.type) {
    case SET_STORY_LAYER:
      return action.storyLayer;
    default:
      return state;
  }
}

export default storyLayerReducer;
