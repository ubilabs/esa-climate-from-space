import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import config from "../../config/main";

export type GlobeRenderOptions = {
  atmosphereEnabled: boolean;
  atmosphereColor: number[];
  atmosphereStrength: number;
  shadingEnabled: boolean;
};

// use default state from config (not URL-derived)
const initialState = config.globe.renderOptions as GlobeRenderOptions;

const renderOptionsSlice = createSlice({
  name: "renderOptions",
  initialState,
  reducers: {
    setGlobeRenderOptions(
      state,
      action: PayloadAction<Partial<GlobeRenderOptions>>,
    ) {
      Object.assign(state, action.payload);
    },
  },
});

export const { setGlobeRenderOptions } = renderOptionsSlice.actions;
export default renderOptionsSlice.reducer;
