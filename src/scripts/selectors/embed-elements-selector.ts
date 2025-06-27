import { createSelector } from "@reduxjs/toolkit";
import { State } from "../reducers";
import { EmbedElementsState } from "../types/embed-elements";

export const embedElementsSelector = createSelector(
  (state: State) => state.embedElements,
  (embedElements: EmbedElementsState) => embedElements
);
