import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CameraView } from "@ubilabs/esa-webgl-globe";

import config from "../../config/main";

import { parseUrl } from "../../libs/globe-url-parameter";

// get initial state from url or fallback to default state in config
const globeState = parseUrl()?.globeState || config.globe;
const initialState: CameraView = globeState.view;

const globeViewSlice = createSlice({
  name: "globeView",
  initialState,
  reducers: {
    setGlobeView(state, action: PayloadAction<CameraView>) {
      Object.assign(state, action.payload);
    },
  },
});

export const { setGlobeView } = globeViewSlice.actions;
export default globeViewSlice.reducer;
