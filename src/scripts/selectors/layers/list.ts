import { State } from "../../reducers/index";
import { layersApi } from "../../services/api";
import { createSelector } from "@reduxjs/toolkit";

// Get current language from the state
const selectCurrentLanguage = (state: State) => state.language;

// Get layers list
export const selectLayers = createSelector(
  [selectCurrentLanguage, (state) => state],
  (language, state) => {
    const layersResult =
      layersApi.endpoints.getLayerList.select(language)(state);
    return layersResult;
  },
);

// Create memoized selector for transformed data
export const layersSelector = (state: State) => {
  const data = selectLayers(state).data;
  return data ?? [];
};
