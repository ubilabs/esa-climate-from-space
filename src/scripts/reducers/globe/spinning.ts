import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import config from "../../config/main";
import { parseUrl } from "../../libs/globe-url-parameter";

// get initial state from url or fallback to default state in config
const globeState = parseUrl()?.globeState || config.globe;
const initialState = globeState.spinning;

const spinningSlice = createSlice({
  name: "spinning",
  initialState,
  reducers: {
    setGlobeSpinning(_state, action: PayloadAction<boolean>) {
      return action.payload;
    },
  },
});

export const { setGlobeSpinning } =
  spinningSlice.actions;
export default spinningSlice.reducer;
