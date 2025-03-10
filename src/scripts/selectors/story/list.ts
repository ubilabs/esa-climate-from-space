import { storiesApi } from "../../services/api";
import { createSelector } from "@reduxjs/toolkit";
import { Language } from "../../types/language";

// Get stories list
const selectStories = storiesApi.endpoints.getStories.select(Language.ES);

export const storyListSelector = createSelector(
  [selectStories],
  (storiesResult) => storiesResult.data ?? []
);
