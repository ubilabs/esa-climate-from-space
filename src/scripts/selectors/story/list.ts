import { storiesApi } from "../../services/api";
import { createSelector } from "@reduxjs/toolkit";
import { State } from "../../reducers";

// Get current language from the state
const selectCurrentLanguage = (state: State) => state.language;
// Get stories list

export const storyListSelector = createSelector(
  [selectCurrentLanguage, (state) => state],
  (language, state) => {
    const storiesResult = storiesApi.endpoints.getStories.select(language)(state);
    return storiesResult.data ?? [];
  }
);
