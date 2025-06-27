import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { parseUrl } from "../../libs/globe-url-parameter";
import config from "../../config/main";

// get initial state from url or fallback to default state in config
const globeState = parseUrl()?.globeState || config.globe;
const initialState = globeState.time;

const timeReducer = createSlice({
  name: "time",
  initialState,
  reducers: {
    setGlobeTime(_state, action: PayloadAction<number>) {
      return action.payload;
    },
  },
});

export const { setGlobeTime } = timeReducer.actions;
export default timeReducer.reducer;
