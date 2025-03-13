import { State } from "../../reducers/index";
import { storiesApi } from "../../services/api";

import { Story } from "../../types/story";

export const selectStory = (id: string) => (state: State) =>
  storiesApi.endpoints.getStory.select({ id, language: state.language })(state);

export function selectedStorySelector(
  state: State,
  storyId: string | null,
): Story | null {
  if (!storyId) {
    return null;
  }
  const story = selectStory(storyId)(state).data;

  return story ?? null;
}
