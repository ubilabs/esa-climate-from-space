import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { parseUrl } from "../../libs/globe-url-parameter";
import config from "../../config/main";
import { GlobeProjectionState } from "../../types/globe-projection-state";
import { GlobeProjection } from "../../types/globe-projection";

// get initial state from url or fallback to default state in config
const globeState = parseUrl()?.globeState || config.globe;
const initialState: GlobeProjectionState = {
  projection: globeState.projectionState.projection,
  morphTime: 2,
};

const projectionSlice = createSlice({
  name: "projection",
  initialState,
  reducers: {
    setGlobeProjection(
      state,
      action: PayloadAction<{ projection: GlobeProjection; morphTime: number }>,
    ) {
      state.projection = action.payload.projection;
      state.morphTime = action.payload.morphTime;
    },
  },
});

export const { setGlobeProjection } = projectionSlice.actions;
export default projectionSlice.reducer;
