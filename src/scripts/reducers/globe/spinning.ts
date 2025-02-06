import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import config from "../../config/main";
console.log("🚀 ~ config:", config);
import { parseUrl } from "../../libs/globe-url-parameter";

// get initial state from url or fallback to default state in config
const globeState = parseUrl()?.globeState || config.globe;
const initialState = globeState.spinning;

const spinningSlice = createSlice({
  name: "spinning",
  initialState,
  reducers: {
    setGlobeSpinning(state, action: PayloadAction<boolean>) {
      return action.payload;
    },
    setGlobeProjection() {
      return false;
    },
    setFlyTo() {
      return false;
    },
  },
});

export const { setGlobeSpinning, setGlobeProjection, setFlyTo } =
  spinningSlice.actions;
export default spinningSlice.reducer;
