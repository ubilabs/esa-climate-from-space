import { State } from "../../reducers/index";
import { storiesApi } from "../../services/api";

// Get stories list
export const selectStories = storiesApi.endpoints.getStories.select("en");

// Create memoized selector for transformed data
export const storyListSelector = (state: State) =>
  selectStories(state).data ?? [];
