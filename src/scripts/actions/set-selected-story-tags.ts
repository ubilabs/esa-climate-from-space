export const SET_SELECTED_STORY_TAGS = "SET_SELECTED_STORY_TAGS";

export interface SetSelectedStoryTagsAction {
  type: typeof SET_SELECTED_STORY_TAGS;
  tags: string[];
}

const setSelectedStoryTagsAction = (
  tags: string[],
): SetSelectedStoryTagsAction => ({
  type: SET_SELECTED_STORY_TAGS,
  tags,
});

export default setSelectedStoryTagsAction;
