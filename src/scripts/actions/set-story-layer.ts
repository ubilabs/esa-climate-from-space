export const SET_STORY_LAYER = "SET_STORY_LAYER";

export interface SetStoryLayerAction {
  type: typeof SET_STORY_LAYER;
  storyLayerId: string | null;
}

const setStoryLayerAction = (
  storyLayerId: string | null,
): SetStoryLayerAction => ({
  type: SET_STORY_LAYER,
  storyLayerId,
});

export default setStoryLayerAction;
