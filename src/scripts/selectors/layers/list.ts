import { State } from "../../reducers/index";
import { layersApi } from "../../services/api";
import { createSelector } from "@reduxjs/toolkit";

// Get layers list
export const selectLayers = layersApi.endpoints.getLayerList.select("en");

// Create memoized selector for transformed data
export const layersSelector = createSelector(
  (state: State) => selectLayers(state).data,
  (data) => data ?? [],
);
