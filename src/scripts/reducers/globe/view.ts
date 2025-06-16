import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { parseUrl } from "../../libs/globe-url-parameter";
import config from "../../config/main";
import { CameraView } from "@ubilabs/esa-webgl-globe";

// get initial state from url or fallback to default state in config
const globeState = parseUrl()?.globeState || config.globe;
const initialState: CameraView = globeState.view;

const globeViewSlice = createSlice({
  name: "globeView",
  initialState,
  reducers: {
    setGlobeView(state, action: PayloadAction<CameraView>) {
      return {
       ...state,
       ...action.payload
      };
    },
  },
});

export const { setGlobeView } = globeViewSlice.actions;
export default globeViewSlice.reducer;
