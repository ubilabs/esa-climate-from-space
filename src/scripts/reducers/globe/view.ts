import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CameraView } from "@ubilabs/esa-webgl-globe";

import config from "../../config/main";

// get initial state from  state in config
// We don't parse the state from the URL because we want to initially make sure that the globe view is in the correct state
const initialState: CameraView = config.globe.view;

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
