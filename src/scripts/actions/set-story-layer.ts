import {StoryLayer} from '../types/story-layer';

export const SET_STORY_LAYER = 'SET_STORY_LAYER';

export interface SetStoryLayerAction {
  type: typeof SET_STORY_LAYER;
  storyLayer: StoryLayer | null;
}

const setStoryLayerAction = (
  storyLayer: StoryLayer | null
): SetStoryLayerAction => ({
  type: SET_STORY_LAYER,
  storyLayer
});

export default setStoryLayerAction;
